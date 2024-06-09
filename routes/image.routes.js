const express = require("express");
const router = express.Router();
const processImageController = require("../controllers/process.image");

// Gunakan fungsi yang diekspor dari process.image.js
router.post("/image", processImageController.post_images);
router.get("/image", processImageController.get_images);

module.exports = router;
