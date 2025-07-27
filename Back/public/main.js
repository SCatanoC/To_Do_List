const titleInput = document.getElementById("title-input");
const btnAdd = document.getElementById("btn-add");
const taskContainer = document.getElementById("task-container");

const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const confirmEditBtn = document.getElementById("confirm-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

const zoomModal = document.getElementById("zoom-modal");
const zoomText = document.getElementById("zoom-text");
const zoomCloseBtn = document.getElementById("zoom-btn");

const categoryButtons = document.querySelectorAll(".category-btn");

let currentEditId = null;
const taskArr = [];
let category = "Work";

async function loadTasks() {
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

const updateTaskContainer = () => {
  taskContainer.innerHTML = "";
  console.log(taskArr);
  taskArr.forEach(({ id, taskTitle, complete, category }) => {
    taskContainer.innerHTML += `
    <div class="task" id="${id}">
        <div class="validation-conteiner">
            <input type="checkbox" ${
              complete ? "checked" : ""
            } onchange = "completeBox(${id})"/>    
            <h2 style="text-decoration: ${
              complete ? "line-through" : "none"
            }" onclick="openZommModal('${taskTitle.replace(
      /'/g,
      "\\'"
    )}')">${taskTitle}</h2>
        </div>
          <div class="btn-container">
              <button class="btn edit" data-id="${id}" onclick="editTask(this)"><i class='bxr  bx-edit'  ></i> </button>
              <button class="btn delete" data-id="${id}" onclick="deleteTask(this)"><i class='bxr  bx-trash'  ></i> </button>
          </div>
    </div>
    <div class="update-category">
            <button>${category}</button>
    </div>
    `;
  });
};

async function completeBox(id) {
  const task = taskArr.find((t) => t.id === id);
  if (!task) return;
  const newStatus = !task.complete;
  const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskTitle: task.taskTitle /*título*/,
      complete: newStatus /*estado*/,
    }),
  });

  // 4) Parseamos la respuesta y garantizamos tipos
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

/*Detele function*/
async function deleteTask(buttonEl) {
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

async function editTask(buttonEl) {
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

  /*actual state*/
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

  /*Parseo y normalizacion tipos*/
  const updated = await res.json();
  updated.id = Number(updated.id);
  updated.complete = Boolean(updated.complete);

  /*reemplazo de tarea*/
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

function closeEditModal() {
  editModal.classList.add("hidden");
  currentEditId = null;
}

function openZommModal(text) {
  zoomText.textContent = text;
  zoomModal.classList.remove("hidden");
}

zoomCloseBtn.addEventListener("click", () => {
  zoomModal.classList.add("hidden");
});

/*category*/

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    category = btn.getAttribute("data-category");
    categoryButtons.forEach((b) => b.classList.remove("selected"));
    console.log(categoryButtons);
    btn.classList.add("selected");
    console.log(btn);
  });
});
