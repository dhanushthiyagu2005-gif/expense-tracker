function login() {
    let user = document.getElementById('username').value.trim();
    let pass = document.getElementById('password').value.trim();

    if(!user || !pass) {
        alert("Please enter both username and password.");
        return;
    }
    localStorage.setItem('loggedInUser', user);
    window.location.href= 'dashboard.html';
}

function showMsg(msg) {
    document.getElementById('authMsg').innerText= msg;
}