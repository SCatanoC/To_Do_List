process.loadEnvFile();

// backend/db.js
const mysql = require("mysql2");

// conexión
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306, // sql port
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
