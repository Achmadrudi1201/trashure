const mysql = require('mysql');
const dbConfig = require('../config/db.config');

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD.trim(),  // Menghilangkan spasi yang tidak diinginkan
  database: dbConfig.DB
});

connection.connect(error => {
  if (error) {
    console.error("Error connecting to the database:", error.message);
    return;
  }
  console.log("Successfully connected to the database.");
});

module.exports = connection;
