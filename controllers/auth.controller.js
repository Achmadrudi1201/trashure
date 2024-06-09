const db = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Please provide username and password" });
  }

  // Validate email to ensure it ends with @gmail.com
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!email || !emailPattern.test(email)) {
    return res
      .status(400)
      .send({ message: "Please provide a valid @gmail.com email address" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (error, results) => {
      if (error) {
        console.log("error: ", error);
        return res.status(500).send({ message: error });
      }

      res.send({ message: "User registered successfully!" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Please provide username and password" });
  }

  // Validate email to ensure it ends with @gmail.com
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailPattern.test(email)) {
    return res
      .status(400)
      .send({ message: "Please provide a valid @gmail.com email address" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
    if (error) {
      console.log("error: ", error);
      return res.status(500).send({ message: error });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = results[0];

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, "your-secret-key", {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user.id,
      email: user.email,
      accessToken: token,
    });
  });
};
