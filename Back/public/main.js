const titleInput = document.getElementById("title-input");
const btnAdd = document.getElementById("btn-add");
const taskContainer = document.getElementById("task-container");

const editModal = document.getElementById("edit-modal");
const editInput = document.getElementById("edit-input");
const confirmEditBtn = document.getElementById("confirm-edit");
const cancelEditBtn = document.getElementById("cancel-edit");

let currentEditId = null;
const taskArr = [];

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
  if (title === "") return;

  try {
    const res = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskTitle: title }),
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
  taskArr.forEach(({ id, taskTitle, complete }) => {
    taskContainer.innerHTML += `
    <div class="task" id="${id}">
        <div class="validation-conteiner">
            <input type="checkbox" ${
              complete ? "checked" : ""
            } onchange = "completeBox(${id})"/>    
            <h2 style="text-decoration: ${
              complete ? "line-through" : "none"
            }">${taskTitle}</h2>
        </div>
        <div class="btn-container">
            <button class="btn edit" data-id="${id}" onclick="editTask(this)"><i class='bxr  bx-edit'  ></i> </button>
            <button class="btn delete" data-id="${id}" onclick="deleteTask(this)"><i class='bxr  bx-trash'  ></i> </button>
        </div>
    </div>
    `;
  });
};

async function completeBox(id) {
  // 1) Buscamos la tarea actual
  const task = taskArr.find((t) => t.id === id);
  if (!task) return;

  // 2) Calculamos el nuevo estado
  const newStatus = !task.complete;

  // 3) Llamada al servidor enviando título + estado
  const res = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskTitle: task.taskTitle, // título que ya existe
      complete: newStatus, // nuevo estado
    }),
  });

  // 4) Parseamos la respuesta y garantizamos tipos
  const updated = await res.json();
  updated.id = Number(updated.id);
  updated.complete = Boolean(updated.complete);

  // 5) Reemplazamos TODO el objeto en el array
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
  editInput.value = task.taskTitle; // Llenar el input con el título actual
  editModal.classList.remove("hidden"); // Mostrar modal
  editInput.focus(); // Dar foco al input
}

confirmEditBtn.addEventListener("click", async () => {
  const newTitle = editInput.value.trim();
  if (newTitle === "") return;

  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${currentEditId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskTitle: newTitle }),
      }
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    // Actualizar solo después de confirmar que el backend respondió correctamente
    const updatedTask = await response.json();
    const taskIndex = taskArr.findIndex((t) => t.id === currentEditId);
    console.log(taskArr);
    if (taskIndex !== -1) {
      taskArr[taskIndex] = updatedTask;
      updateTaskContainer();
      console.log(taskArr);
    }
  } catch (err) {
    console.error("Error al editar tarea:", err);
  } finally {
    closeEditModal();
  }
});
cancelEditBtn.addEventListener("click", closeEditModal);

function closeEditModal() {
  editModal.classList.add("hidden");
  currentEditId = null;
}
