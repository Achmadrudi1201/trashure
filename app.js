const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const app = express();
app.use(bodyParser.json());
app.use(fileUpload());

const authRoutes = require('./routes/auth.routes');
const imagesRoutes = require('./routes/image.routes');
app.use('/api/auth', authRoutes);
app.use("/api", imagesRoutes);

app.get('/test-db', (req, res) => {
  const db = require('./models/user.model');
  db.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
      res.status(500).send({ message: 'Error connecting to the database', error: error.message });
      return;
    }
    res.send({ message: 'Database connection successful', results });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
