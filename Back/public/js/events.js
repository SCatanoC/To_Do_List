import {
  titleInput,
  btnAdd,
  taskContainer,
  editModal,
  editInput,
  confirmEditBtn,
  cancelEditBtn,
  zoomModal,
  zoomText,
  zoomCloseBtn,
  categoryButtons,
  taskArr,
  btnAll,
  btnCompleted,
  btnPending,
  filterButtons,
} from "./dom.js";
import { updateTaskContainer } from "./render.js";

let category = "Others";
let currentEditId = null;

export async function loadTasks() {
  try {
    const res = await fetch("http://localhost:3000/api/tasks");
    const data = await res.json();
    taskArr.splice(0, taskArr.length, ...data);
    updateTaskContainer();
  } catch (err) {
    console.error("Error al cargar tareas:", err);
  }
}

loadTasks();

btnAdd.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  if (title === "") {
    alert("Please enter a task before adding.");
    return;
  }
  console.log("Categoría seleccionada:", category);

  try {
    const res = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskTitle: title, category }),
    });

    const newTask = await res.json();
    taskArr.push(newTask);
    titleInput.value = "";
    updateTaskContainer();
  } catch (err) {
    console.error("Error al agregar tarea:", err);
  }
});

export async function completeBox(id) {
  const task = taskArr.find((t) => t.id === id);
  if (!task) {
    return;
  }
  const newStatus = !task.complete;
  const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskTitle: task.taskTitle /*título*/,
      complete: newStatus /*estado*/,
    }),
  });

  const updated = await res.json();
  updated.id = Number(updated.id);
  updated.complete = Boolean(updated.complete);

  /*actua arr*/
  const idx = taskArr.findIndex((t) => t.id === id);
  if (idx !== -1) {
    taskArr[idx] = updated;
    updateTaskContainer();
  }
}

export async function deleteTask(buttonEl) {
  const id = parseInt(buttonEl.dataset.id);

  try {
    await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: "DELETE",
    });

    const index = taskArr.findIndex((task) => task.id === id);
    if (index !== -1) {
      taskArr.splice(index, 1);
      updateTaskContainer();
    }
  } catch (err) {
    console.error("Error eliminando tarea:", err);
  }
}

export async function editTask(buttonEl) {
  const id = parseInt(buttonEl.dataset.id);
  const task = taskArr.find((t) => t.id === id);
  console.log(task);
  if (!task) {
    return;
  }

  currentEditId = id;
  editInput.value = task.taskTitle;
  editModal.classList.remove("hidden");
  editInput.focus();
}

confirmEditBtn.addEventListener("click", async () => {
  const newTitle = editInput.value.trim();
  if (!newTitle || currentEditId === null) return;

  const old = taskArr.find((t) => t.id === currentEditId);

  const res = await fetch(`http://localhost:3000/api/tasks/${currentEditId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskTitle: newTitle,
      complete: old.complete,
    }),
  });

  if (!res.ok) {
    throw new Error("Error en la respuesta del servidor");
  }

  const updated = await res.json();
  updated.id = Number(updated.id);
  updated.complete = Boolean(updated.complete);

  const idx = taskArr.findIndex((t) => t.id === currentEditId);
  if (idx !== -1) {
    taskArr[idx] = {
      ...taskArr[idx],
      ...updated,
    };
    updateTaskContainer();
  }

  closeEditModal();
});

cancelEditBtn.addEventListener("click", closeEditModal);

export function closeEditModal() {
  editModal.classList.add("hidden");
  currentEditId = null;
}

export function openZommModal(text) {
  zoomText.textContent = text;
  zoomModal.classList.remove("hidden");
}

zoomCloseBtn.addEventListener("click", () => {
  zoomModal.classList.add("hidden");
});

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    category = btn.getAttribute("data-category");
    categoryButtons.forEach((b) => b.classList.remove("selected"));
    console.log(categoryButtons);
    btn.classList.add("selected");
    console.log(btn);
  });
});

/*Filters*/

btnAll.addEventListener("click", () => {
  console.log(filterButtons);
  filterButtons.forEach((btn) => btn.classList.remove("selected"));
  console.log(filterButtons);
  btnAll.classList.add("selected");
  updateTaskContainer();
});

btnCompleted.addEventListener("click", () => {
  filterButtons.forEach((btn) => btn.classList.remove("selected"));
  console.log(filterButtons);
  btnCompleted.classList.add("selected");
  updateTaskContainer(taskArr.filter((t) => t.complete));
});

btnPending.addEventListener("click", () => {
  filterButtons.forEach((btn) => {
    btn.classList.remove("selected");
  });
  btnPending.classList.add("selected");
  updateTaskContainer(taskArr.filter((t) => !t.complete));
});

window.deleteTask = deleteTask;
window.editTask = editTask;
window.completeBox = completeBox;
window.openZommModal = openZommModal;
