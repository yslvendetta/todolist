const loginsec=document.querySelector('.login-section')
const loginlink=document.querySelector('#login-link')
const registerlink=document.querySelector('#register-link')
registerlink.addEventListener('click',()=>{
    loginsec.classList.add('active')
})

loginlink.addEventListener('click',()=>{
    loginsec.classList.remove('active')
})

// retrieve form elements
const loginForm = document.querySelector('#login-form')
const signupForm = document.querySelector('#signup-form')
const errorMessage = document.querySelector('.error-message');

// event listener for login form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Get the input values
    const loginEmail = document.querySelector('#login-email').value;
    const loginPassword = document.querySelector('#login-password').value;

    // Retrieve user data from local storage
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPwd');
  
    // Perform login validation and authentication as needed
    if (loginEmail === storedEmail && loginPassword === storedPassword) {
        // Login successful, redirect to the task page
        window.location.href = 'task.html';
       } else {
         // Login failed, display an error message
         
         errorMessage.textContent = 'Invalid email or password';
     }
    

    
  });

//   event listener for signup form submission

signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
  
    // Get the input values
    const userName = document.querySelector('#username').value;
    const signupEmail = document.querySelector('#signup-email').value;
    const signupPassword = document.querySelector('#signup-password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;
  
    // Validate form inputs
    if (!username || !signupEmail || !signupPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
  
    if (signupPassword !== confirmPassword) {
        alert('Passwords do not match')
        return;
    }

    // store user data in local storage
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', signupEmail);
    localStorage.setItem('userPwd', signupPassword);
  
    alert('Registration Successful');
})