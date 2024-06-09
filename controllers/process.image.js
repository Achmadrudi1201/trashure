const path = require("path");
const axios = require("axios");
const { Storage } = require("@google-cloud/storage");
const authMiddleware = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken"); // Import jwt module to decode token
const db = require("../models/user.model");
// Load service account key
const pathKey = path.resolve(__dirname, "serviceaccountkey.json");
const bucketName = "trashure-image";
const storage = new Storage({
  projectId: "Trashure",
  keyFilename: pathKey,
});

async function post_images(req, res) {
  let responseSent = false; // Flag to track if response has been sent

  try {
    // Verify token before processing the request
    authMiddleware(req, res, async () => {
      // Token is verified, proceed with image upload

      const { files } = req;
      const token = req.headers["x-access-token"]; // Get token from request headers

      // Decode token to get user data
      const decoded = jwt.decode(token);
      const userId = decoded.id; // Get user ID from decoded token

      if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({ error: "No files were uploaded." });
      }

      const image = files.image;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const replacedDate = formattedDate.replace(/[\s\/,]+/g, "_");
      const dynamicUploadPath = `uploads/${replacedDate}/`;
      const destination = dynamicUploadPath + image.name;
      const gcsUploadOptions = {
        destination,
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      };

      const imageBuffer = image.data;
      const imageReadStream = require("stream").Readable.from(imageBuffer);
      const gcsFile = storage.bucket(bucketName).file(destination);
      const stream = gcsFile.createWriteStream(gcsUploadOptions);

      stream.on("error", (err) => {
        console.error("Error uploading to GCS:", err);

        if (!responseSent) {
          res.status(500).json({ error: "Internal server error" });
          responseSent = true; // Set the flag to true
        }
      });

      stream.on("finish", async () => {
        const imageUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;

        try {
          const apiUrl =
            "https://asia-southeast2-vernal-house-425717-g2.cloudfunctions.net/img_classifier_model";
          const response = await axios.post(apiUrl, { url: imageUrl });
          const apiResponse = response.data;

          // Prepare SQL query to insert image data into the database
          const insertQuery = `
            INSERT INTO image (path, userId, createdAt, updatedAt, Cardboard, Glass, Metal, Paper, Plastic)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const values = [
            imageUrl,
            userId,
            new Date(),
            new Date(),
            apiResponse.Cardboard,
            apiResponse.Glass,
            apiResponse.Metal,
            apiResponse.Paper,
            apiResponse.Plastic,
          ];

          // Execute the SQL query
          await new Promise((resolve, reject) => {
            db.query(insertQuery, values, (error, result) => {
              if (error) {
                console.error(
                  "Error inserting image data into the database:",
                  error
                );
                reject(error);
              } else {
                resolve(result);
              }
            });
          });

          if (!responseSent) {
            res.json({
              message: "Image uploaded and processed successfully",
              data: {
                path: imageUrl,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
                Cardboard: apiResponse.Cardboard,
                Glass: apiResponse.Glass,
                Metal: apiResponse.Metal,
                Paper: apiResponse.Paper,
                Plastic: apiResponse.Plastic,
              },
            });
            responseSent = true; // Set the flag to true
          }
        } catch (error) {
          console.error("Error processing image:", error);

          if (!responseSent) {
            // Send the error response only if it hasn't been sent before
            res.status(500).json({ error: "Internal server error" });
            responseSent = true; // Set the flag to true
          }
        }
      });

      // Pipe the image stream to GCS
      imageReadStream.pipe(stream);
    });
  } catch (error) {
    console.error("Error uploading image:", error);

    if (!responseSent) {
      // Send the error response only if it hasn't been sent before
      res.status(500).json({ error: "Internal server error" });
      responseSent = true; // Set the flag to true
    }
  }
}
async function get_images(req, res) {
  try {
    // Get token from request headers
    const token = req.headers["x-access-token"];

    // Decode token to get user data
    const decoded = jwt.decode(token);
    const userId = decoded.id; // Get user ID from decoded token

    // Query to fetch images based on userId
    const query = `
      SELECT id, path, userId, createdAt, updatedAt, Cardboard, Glass, Metal, Paper, Plastic
      FROM image
      WHERE userId = ? 
      ORDER BY createdAt DESC
    `;

    // Execute the SQL query
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error("Error retrieving images:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Format response
      const formattedImages = results.map((image) => ({
        id: image.id,
        path: image.path,
        userId: image.userId,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString(),
        Cardboard: image.Cardboard,
        Glass: image.Glass,
        Metal: image.Metal,
        Paper: image.Paper,
        Plastic: image.Plastic,
      }));

      // Send response with image data
      res.json({
        message: `Images for userId ${userId} retrieved successfully`,
        data: formattedImages,
      });
    });
  } catch (error) {
    console.error("Error retrieving images:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = { post_images, get_images };
