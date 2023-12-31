// Get the input and button elements
const taskInput = document.querySelector(".task-input input");
const prioritySelect = document.getElementById("priority-select");
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

//```javascript
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
    <input type="checkbox" id="checkbox-${todo.id}" ${todo.completed ? 'checked' : ''} onchange="updateStatus('${todo.id}')">
      <p class="${todo.completed ? 'completed' : ''}">${todo.name}</p>
    </label>
    <div class="settings">
      <i class="fas fa-ellipsis-h" onclick="showMenu(this)"></i>
      <ul class="task-menu">
          <li onclick="editTask('${todo.id}')"><i class="far fa-edit"></i>Edit</li>
          <li onclick="deleteTask('${todo.id}')"><i class="far fa-trash-alt"></i>Delete</li>
      </ul>
    </div>
  `;
  return taskElement;
}

// Add a new task
function addTask() {
  const taskText = taskInput.value.trim();
  const priority = prioritySelect.value;
  if (taskText !== '') {
    const todo = {
      id: generateUniqueId(),
      name: taskText,
      completed: false,
      quadrant: priority
    };
    todos.push(todo);
    const quadrant = document.getElementById(priority + '-tasks');
    const taskElement = createTaskElement(todo);
    quadrant.appendChild(taskElement);
    saveTodosToLocalStorage();
    taskInput.value = '';
  }
}

// Generate a unique ID for each task
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Update task status (completed/pending)
function updateStatus(todoId) {
  const todo = todos.find(todo => todo.id === todoId);
  if (todo) {
    const checkbox = document.getElementById(`checkbox-${todo.id}`);
    if (checkbox) {
      todo.completed = checkbox.checked;
      saveTodosToLocalStorage();
    } else {
      console.error('Checkbox element not found');
    }
  } else {
    console.error('Todo not found');
  }
}

// taskmenu
function showMenu(selectedTask) {
  const taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.toggle("show");
}


// Edit a task
function editTask(todoId) {
  const todo = todos.find(todo => todo.id === todoId);
  const taskInput = document.querySelector(".task-input input");
  
  // Set the task input value to the current task name
  taskInput.value = todo.name;

  // Add an event listener to the Add button to update the task
  addTaskBtn.removeEventListener('click', addTask);
  addTaskBtn.addEventListener('click', function() {
    const newTaskName = taskInput.value.trim();
    if (newTaskName !== '') {
      todo.name = newTaskName;
      saveTodosToLocalStorage();
      showTasks(getActiveFilter());
      taskInput.value = '';
      
      // Restore the original addTask event listener
      addTaskBtn.removeEventListener('click', arguments.callee);
      addTaskBtn.addEventListener('click', addTask);
    }
  });
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
     const quadrant = document.getElementById(todo.quadrant + '-tasks');
    if (filter === 'all' || (filter === 'completed' && todo.completed) || (filter === 'pending' && !todo.completed)) {
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
