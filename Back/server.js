// backend/server.js
const express = require("express");
const cors = require("cors");
const taskroutes = require("./routes/tasks");

const app = express();
const path = require("path");

const PORT = 3000;

app.use(cors()); // Permitir peticiones desde otros orígenes
app.use(express.json()); // Interpretar JSON en el cuerpo de las peticiones

// task route
app.use("/api/tasks", taskroutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Init server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
