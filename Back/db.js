// backend/db.js
const mysql = require("mysql2");

// conexión
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "PCsus1Bps.",
  database: "todo_app",
  port: 3306, // sql port
});

// Intentar conectarse
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
  } else {
    console.log("✅ Conexión exitosa a MySQL");
  }
});

// Exportar para usar en otros archivos
module.exports = db;
