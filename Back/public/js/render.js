import { taskContainer, taskArr } from "./dom.js";
import { completeBox, editTask, deleteTask, openZommModal } from "./events.js";

export const updateTaskContainer = (tasks = taskArr) => {
  taskContainer.innerHTML = "";
  console.log(taskArr);
  tasks.forEach(
    ({ id, taskTitle, complete, category, created_at, completed_at }) => {
      let completionTimeText = "";
      if (completed_at && complete) {
        const createdDate = new Date(created_at);
        const completedDate = new Date(completed_at);
        const diffMs = completedDate - createdDate;
        const diffMinutes = Math.floor(
          (diffMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        completionTimeText = `complete ${diffMinutes}m `;
      }
      taskContainer.innerHTML += `
    <div class="task" id="${id}">
        <div class="task-container">
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
            <button class="category-task-btn ${category}">${category}</button>
             ${
               complete
                 ? `<label class="completion-time category-task-btn ${category}">${completionTimeText}</label>`
                 : ""
             }
          </div>
    </div>
    `;
    }
  );
};
