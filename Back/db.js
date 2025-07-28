require("dotenv").config();

// backend/db.js
const mysql = require("mysql2");

// conexión
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

//conect
db.connect((err) => {
  if (err) {
    console.error("Error al conectar:", err.message);
  } else {
    console.log("Conexión exitosa MySQL");
  }
});

module.exports = db;
