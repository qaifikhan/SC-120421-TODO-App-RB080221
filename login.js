var loginForm = document.getElementById('login-form');

loginForm.onsubmit = function(e) {
    e.preventDefault();

    var usernameVal = document.getElementById('username-input');
    var passwordVal = document.getElementById("password-input");

    var loginData = {
        username: usernameVal.value,
        password: passwordVal.value
    }
    
    var http = new XMLHttpRequest();
    http.open("POST", "https://5ee8d2c0ca595700160294ba.mockapi.io/user", true);
    http.onreadystatechange = function() {
        if(this.readyState === 4 ) {
            localStorage.setItem('userLoggedInStatus', true);
            localStorage.setItem('username', usernameVal.value);
            location.assign('./index.html');
        }
    }
    http.send(JSON.stringify(loginData));
}