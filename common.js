function checkAuth() {
    if(!localStorage.getItem("loggedInUser")) {
        window.location.href = 'index.html';
    }
}
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = 'index.html';
}

document.addEventListener("DOMContentLoaded", function () {

  const themeToggle = document.getElementById("themeToggle");

  // Apply saved theme to every page
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggle) {
      themeToggle.innerText = "☀️ Light Mode";
    }
  }

  // Only add click if button exists (settings page)
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");

      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.innerText = "☀️ Light Mode";
      } else {
        localStorage.setItem("theme", "light");
        themeToggle.innerText = "🌙 Dark Mode";
      }
    });
  }

});


