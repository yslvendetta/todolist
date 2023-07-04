// Get the input and button elements
const taskInput = document.querySelector(" .task-input input")
const addTaskBtn = document.getElementById('add-task-btn');

taskBox = document.querySelector(" .task-list")
filters = document.querySelectorAll(" .filters span")
clearAll = document.querySelector(" .clear-btn") 

// Get the quadrants' task lists
const q1Tasks = document.getElementById('q1-tasks');
const q2Tasks = document.getElementById('q2-tasks');
const q3Tasks = document.getElementById('q3-tasks');
const q4Tasks = document.getElementById('q4-tasks');

// Add task by clicking the task button
addTaskBtn.addEventListener('click', function() {
  const taskText = taskInput.value.trim();
  if (taskText.trim() !== '') {
    const taskElement = createTaskElement(taskText);
    const quadrant = determineQuadrant(taskElement);
    if(!isEditedTask){
      if(!todos){  
          todos = []
      }
      let taskInfo = {name: taskText, status: "pending"}
      todos.push(taskInfo)
      }else{
      isEditedTask = false
      todos[editId].name = taskText
   
  }
    quadrant.appendChild(taskElement);
    taskInput.value = ""
    localStorage.setItem("todo-list", JSON.stringify(todos))
    showTodo("all");

   
  }
});

// task input by pressing the key enter kwa keyboard
taskInput.addEventListener("keyup", e =>{
  const taskText = taskInput.value.trim();
  if(e.key == "Enter" && taskText){
      const taskElement = createTaskElement(taskText);
      const quadrant = determineQuadrant(taskElement);
      if(!isEditedTask){
        if(!todos){  
            todos = []
        }
        let taskInfo = {name: taskText, status: "pending"}
        todos.push(taskInfo)
        }else{
        isEditedTask = false
        todos[editId].name = taskText
     
    }
      quadrant.appendChild(taskElement);
      taskInput.value = ""
      localStorage.setItem("todo-list", JSON.stringify(todos))
      showTodo("all");
  }
})

// Create a new task element
function createTaskElement(taskText) {
  const taskElement = document.createElement('li');
  taskElement.textContent = taskText;
  return taskElement;
}

// Determine the quadrant based on the task's priority
function determineQuadrant(taskElement) {
  const isUrgent = confirm('Is the task urgent?');
  const isImportant = confirm('Is the task important?');
  if (isUrgent && isImportant) {
    return q1Tasks;
  } else if (isImportant) {
    return q2Tasks;
  } else if (isUrgent) {
    return q3Tasks;
  } else {
    return q4Tasks;
  }
}
// -------------      -------------//


let editId
let isEditedTask = false
// filters 
let todos = JSON.parse(localStorage.getItem("todo-list"))

// activate button selection ya filters
filters.forEach(btn => {
  btn.addEventListener("click" , () => {
      const activeElement = document.querySelector("span.active");
      if (activeElement !== null) {
        activeElement.classList.remove("active");
      }
      btn.classList.add("active")
      showTodo(btn.id)
  })
})

// function ya filters ie all pending or completed na iweze ku show the todos na istore kwa local storage
function showTodo(filter){
  let li = "";
  if(todos){
      todos.forEach((todo, id) => {
          // if todo status is completed set the iscompleted value to checked
          let isCompeted = todo.status == "completed" ? "checked" : ""
          if (filter == todo.status || filter == "all"){
              li += `<li class="task">
              <label for="${id}">
                  <input onclick = "updateStatus(this)" type="checkbox" id="${id}" ${isCompeted}>
                  <p class="${isCompeted}">${todo.name}</p>
              </label>
              <div class="settings">
                  <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                  <ul class="task-menu">
                      <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-light fa-pen"></i>Edit</li>
                      <li onclick="deleteTask(${id})"><i class="fa-light fa-trash"></i>Delete</li>
                  </ul>
              </div>
              </li>`
          }
               
      });
  }
  taskBox.innerHTML = li
}
showTodo("all");


// taskmenu
function showMenu(selectedTask){
  // getting task menu div
  let taskMenu = selectedTask.parentElement.lastElementChild
  taskMenu.classList.add("show")
  document.addEventListener("click" , e =>{
      // removing show class from the task menu on the document click
      if(e.target.tagName != "I" || e.target != selectedTask){
          taskMenu.classList.remove("show")
      }
  })
}

function editTask(taskId, taskName){
  editId = taskId 
  isEditedTask = true
  taskInput.value = taskName
}

function deleteTask(deleteId){
  // removing selected task from todos
  todos.splice(deleteId, 1)
  localStorage.setItem("todo-list", JSON.stringify(todos))
  showTodo("all");
}

clearAll.addEventListener("click", () =>{
   // removing all tasks from todos
   todos.splice(0, todos.length)
   localStorage.setItem("todo-list", JSON.stringify(todos))
   showTodo("all");
})


function updateStatus(selectedTask){
  // getting paragraph that contains task name
  let taskName = selectedTask.parentElement.lastElementChild
  if(selectedTask.checked){
      taskName.classList.add("checked")
      // updating the status of selected task to completed
      todos[selectedTask.id].status = "completed"
  }else{
      taskName.classList.remove("checked")
      // updating the status of selected task to completed
      todos[selectedTask.id].status = "pending"
  }
  localStorage.setItem("todo-list", JSON.stringify(todos))

}

