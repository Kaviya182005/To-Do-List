const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  updateCounters();
});

function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

function addTask(taskContent,completed=false) {
  const task =taskContent.trim();
  if (!task) {
    alert("Please enter the task");
    console.log("no task added");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox" ${completed ? 'checked' : ''}>
      <span>${task}</span>
    </label>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
    `;

  listContainer.appendChild(li);

  // attach event listeners to the new task
  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector("span");
  const deleteBtn = li.querySelector(".delete-btn");

  // strike out the completed task
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasks(); // Save tasks after updating
  });

  editBtn.addEventListener("click", function () {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
      saveTasks(); // Save tasks after updating
    }
  });

  deleteBtn.addEventListener("click", function () {
    if (confirm("Do you want to delete this task!")) {
      li.remove();
      updateCounters();
      saveTasks(); // Save tasks after deleting
    }
  });

  updateCounters();
  saveTasks(); // Save tasks after adding
}

// Save tasks to local storage
function saveTasks() {
  const tasks = [];
  listContainer.querySelectorAll("li").forEach((taskElement) => {
    const task = {
      content: taskElement.querySelector("span").textContent,
      completed: taskElement.classList.contains("completed")
    };
    tasks.push(task);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTask(task.content, task.completed);
  });
}

// add task when pressing Enter key
inputBox.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask(inputBox.value);
    inputBox.value = ""; // Clear input box after adding task
  }
});
