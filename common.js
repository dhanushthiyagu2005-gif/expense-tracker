function checkAuth() {
    if(!localStorage.getItem("loggedInUser")) {
        window.location.href = 'index.html';
    }
}
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = 'index.html';
}

