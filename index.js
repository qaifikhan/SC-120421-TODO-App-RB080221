console.log("Script Loaded!!")

//Line takes 5 secs to execute

// var todoListFromStorage = localStorage.getItem('todo-list') === null ? [] : JSON.parse(localStorage.getItem('todo-list'));
// for(var i=0; i<todoListFromStorage.length; i++) {
//     renderTodoCard(todoListFromStorage[i].message, todoListFromStorage[i].createdTime, todoListFromStorage[i].id)
// }

//Fetch data from backend!
var http = new XMLHttpRequest();
http.open("GET", "https://5ee8d2c0ca595700160294ba.mockapi.io/todo", true);
http.onreadystatechange = function() {
    if(this.readyState === 4) {
        try{
            var todoList = JSON.parse(this.responseText)
            for(var i=0; i<todoList.length; i++) {
                renderTodoCard(todoList[i].message, todoList[i].createdTime, todoList[i].todoId)
            }
        } catch(e) {
            location.assign("./somethingWrong.html")
        }
    }
}
http.send()

var userLoggedInStatus = localStorage.getItem('userLoggedInStatus');
if(userLoggedInStatus === "true") {
    var loggedInTopbar = document.getElementById('post-login-view');
    loggedInTopbar.style.display = "flex";

    var btnLogin = document.getElementById('btn-login');
    btnLogin.style.display = "none";

    var usernameElem = document.getElementById('username');
    usernameElem.innerHTML = localStorage.getItem('username');
} else {
    var todoInput = document.getElementById('todo-input');
    todoInput.placeholder = "Please login first!"
    todoInput.disabled = true;
    todoInput.readOnly = true
}

var btnLogout = document.getElementById('btn-logout');
btnLogout.onclick = function() {
    localStorage.setItem('userLoggedInStatus', false);
    location.assign('./index.html');
}

var todoForm = document.getElementById('todo-form');
todoForm.onsubmit = function(e) {
    e.preventDefault();
}

function removeTodoFromStorage(todoId) {
    var todoList = localStorage.getItem('todo-list') === null ? [] : JSON.parse(localStorage.getItem('todo-list'));

    var elementAtPos = -1;
    for(var pos=0; pos<todoList.length; pos++) {
        if(todoList[pos].todoId === todoId) {
            elementAtPos = pos;
        }
    }
    if(elementAtPos >= 0) {
        todoList.splice(elementAtPos, 1);
        localStorage.setItem("todo-list", JSON.stringify(todoList));
    }
}

function getCurrentTimein12HourFormat() {
    var date = new Date();
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    var suffix = date.getHours() >= 12 ? "PM" : "AM";

    return hours + ":" + minutes + ":" + seconds + " " + suffix;
}

function renderTodoCard(message, createdTime, todoId) {
    // <div class="todo-card">
    //     <div>
    //          <h3 class="todo-message">Todo Item One</h3>
    //          <p class="todo-created-time">08:53:21 PM</p>
    //     </div>
    //     <div>
    //          <i class="fas fa-pen"></i>
    //          <i class="fas fa-trash"></i>
    //     </div>
    // </div>

    var todoList = document.getElementById('todo-list');

    var mainCard = document.createElement('div');
    mainCard.className = "todo-card";
    mainCard.todoId = todoId;

    var messageWrapper = document.createElement('div');
    var todoMessage = document.createElement('h3');
    todoMessage.classList.add('todo-message');
    todoMessage.innerHTML = message;
    messageWrapper.appendChild(todoMessage);
    var todoCreationTime = document.createElement("p");
    todoCreationTime.classList.add("todo-created-time");
    todoCreationTime.innerText = createdTime;
    messageWrapper.appendChild(todoCreationTime);
    mainCard.appendChild(messageWrapper);

    var iconWrapper = document.createElement('div');
    var editIcon = document.createElement('i');
    editIcon.className = "fas fa-pen action-icon";
    editIcon.onclick = function() {
        alert("Edit Clicked for => " + message);
    }
    iconWrapper.appendChild(editIcon);

    var deleteIcon = document.createElement('i');
    deleteIcon.className = "fas fa-trash action-icon";
    deleteIcon.onclick = function() {
        var todoCard = document.getElementById(todoId);
        todoList.removeChild(todoCard);
        removeTodoFromStorage(todoId);
    }
    iconWrapper.appendChild(deleteIcon)
    mainCard.appendChild(iconWrapper);

    todoList.appendChild(mainCard);
}

var todoInput = document.getElementById('todo-input');

todoInput.onkeyup = function(eObj) {
    if(eObj.key === "Enter") {
        if(todoInput.value.length > 0){
            var currentTime = getCurrentTimein12HourFormat();
            var message = todoInput.value;
            var todoId = new Date().getTime();
            renderTodoCard(message, currentTime, todoId);
            todoInput.value = "";

            var obj = {
                todoId: todoId,
                message: message,
                createdTime: currentTime,
            }

            var http = new XMLHttpRequest();
            http.open("POST", "https://5ee8d2c0ca595700160294ba.mockapi.io/todo", true);
            http.onreadystatechange = function() {
                if(this.readyState === 4) {
                    alert("TODO Item Created Successfully!!")
                }
            }
            http.send(JSON.stringify(obj));

            // var todoList = localStorage.getItem('todo-list') === null ? [] : JSON.parse(localStorage.getItem('todo-list'));
            // todoList.push(obj);
            // localStorage.setItem("todo-list", JSON.stringify(todoList));

            console.log(obj)
        } else {
            alert("Please enter the message!!")
        }
    }
}