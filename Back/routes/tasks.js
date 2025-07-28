// routes/tasks.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todas las t
router.get("/", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

// Agregar tarea
router.post("/", (req, res) => {
  const { taskTitle, category } = req.body;
  console.log(req.body);
  if (!taskTitle) {
    return res.status(400).json({ error: "Falta el título" });
  }

  db.query(
    "INSERT INTO tasks (taskTitle,category) VALUES (?, ?)",
    [taskTitle, category],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.json({
        id: result.insertId,
        taskTitle,
        complete: false,
        category,
      });
    }
  );
});

// Editar ttulo
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { taskTitle, complete } = req.body;
  // Validación
  if (taskTitle === undefined || complete === undefined) {
    return res.status(400).json({ error: "Faltan taskTitle o complete" });
  }

  db.query("UPDATE tasks SET completed_at = IF(?, NOW(), NULL) WHERE id = ?", [
    complete,
    id,
  ]);

  db.query(
    "UPDATE tasks SET taskTitle = ?, complete = ? WHERE id = ?",
    [taskTitle, complete, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      //  tarea completa actualizada
      db.query("SELECT * FROM tasks WHERE id = ?", [id], (err2, results) => {
        if (err2) {
          return res.status(500).json({ error: err2 });
        }
        res.json(results[0]); // { id, taskTitle, complete }
      });
    }
  );
});

// Eliminar tarea
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ id });
  });
});

module.exports = router;
