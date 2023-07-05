// Get the input and button elements
const taskInput = document.querySelector(".task-input input");
const addTaskBtn = document.getElementById('add-task-btn');
const clearAllBtn = document.querySelector('.clear-btn');
const filters = document.querySelectorAll('.filters span');

// Get the quadrants' task lists
const q1Tasks = document.getElementById('q1-tasks');
const q2Tasks = document.getElementById('q2-tasks');
const q3Tasks = document.getElementById('q3-tasks');
const q4Tasks = document.getElementById('q4-tasks');

// Initialize todos from localStorage or create empty array
let todos = JSON.parse(localStorage.getItem("todo-list")) || [];

// Add task event listener
addTaskBtn.addEventListener('click', addTask);

// Clear all tasks event listener
clearAllBtn.addEventListener('click', clearAllTasks);

// Filter buttons event listeners
filters.forEach(filter => {
  filter.addEventListener('click', applyFilter);
});

// Add task when Enter key is pressed
taskInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Create a new task element
function createTaskElement(todo) {
  const taskElement = document.createElement('li');
  taskElement.classList.add('task');
  taskElement.innerHTML = `
    <label for="${todo.id}">
      <input type="checkbox" id="${todo.id}" ${todo.completed ? 'checked' : ''} onchange="updateStatus('${todo.id}')">
      <p class="${todo.completed ? 'completed' : ''}">${todo.name}</p>
    </label>
    <div class="settings">
      <i class="fas fa-ellipsis-h" onclick="showMenu(this)"></i>
      <ul class="task-menu">
        <li onclick="editTask('${todo.id}', '${todo.name}')"><i class="far fa-edit"></i>Edit</li>
        <li onclick="deleteTask('${todo.id}')"><i class="far fa-trash-alt"></i>Delete</li>
      </ul>
    </div>
  `;
  return taskElement;
}

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    const todo = {
      id: generateUniqueId(),
      name: taskText,
      completed: false,
      quadrant: ''
    };
    const quadrant = determineQuadrant(todo);
    todo.quadrant = quadrant.id;
    todos.push(todo);
    const taskElement = createTaskElement(todo);
    quadrant.appendChild(taskElement);
    saveTodosToLocalStorage();
    taskInput.value = '';
  }
}

// Determine the quadrant based on the task's priority
function determineQuadrant(todo) {
  const isUrgent = confirm('Is the task urgent?');
  const isImportant = confirm('Is the task important?');
  let quadrant;
  if (isUrgent && isImportant) {
    quadrant = q1Tasks;
  } else if (isImportant) {
    quadrant = q2Tasks;
  } else if (isUrgent) {
    quadrant = q3Tasks;
  } else {
    quadrant = q4Tasks;
  }
  return quadrant;
}

// Generate a unique ID for each task
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Update task status (completed/pending)
function updateStatus(todoId) {
  const todo = todos.find(todo => todo.id === todoId);
  todo.completed = !todo.completed;
  saveTodosToLocalStorage();
}

// taskmenu
function showMenu(selectedTask) {
  const taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.toggle("show");
}

// Edit a task
function editTask(todoId, taskName) {
  const todo = todos.find(todo => todo.id === todoId);
  const newTaskName = prompt('Edit task:', taskName);
  if (newTaskName !== null) {
    todo.name = newTaskName.trim();
    saveTodosToLocalStorage();
    showTasks(getActiveFilter());
  }
}

// Delete a task
function deleteTask(todoId) {
  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    saveTodosToLocalStorage();
    showTasks(getActiveFilter());
  }
}

// Clear all tasks
function clearAllTasks() {
  todos = [];
  saveTodosToLocalStorage();
  showTasks(getActiveFilter());
}

// Apply filter to show tasks
function applyFilter() {
  const filter = this.id;
  showTasks(filter);
}

// Get the currently active filter
function getActiveFilter() {
  const activeFilter = document.querySelector('.filters span.active');
  return activeFilter ? activeFilter.id : 'all';
}

// Show tasks based on the filter
function showTasks(filter) {
  const taskLists = [q1Tasks, q2Tasks, q3Tasks, q4Tasks];
  taskLists.forEach(taskList => {
    taskList.innerHTML = '';
  });

  todos.forEach(todo => {
    if (filter === 'all' || (filter === 'completed' && todo.completed) || (filter === 'pending' && !todo.completed)) {
      const quadrant = document.getElementById(todo.quadrant);
      const taskElement = createTaskElement(todo);
      quadrant.appendChild(taskElement);
    }
  });
}

// Save todos to localStorage
function saveTodosToLocalStorage() {
  localStorage.setItem('todo-list', JSON.stringify(todos));
}

// Initialize the app
function initApp() {
  showTasks(getActiveFilter());
}

// Run the initialization
initApp();
