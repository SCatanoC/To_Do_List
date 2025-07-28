const express = require("express");
const cors = require("cors");
const taskroutes = require("./routes/tasks");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskroutes);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Ruta raíz que carga el frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
