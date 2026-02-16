function checkAuth() {
    if (!localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html";
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function () {

    // Apply saved theme on every page
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    const sidebarContainer = document.getElementById("sidebar-container");

    // Load sidebar ONLY if container exists
    if (sidebarContainer) {
        fetch("sidebar.html")
            .then(response => response.text())
            .then(data => {
                sidebarContainer.innerHTML = data;

                // Now sidebar is loaded → safe to access toggle button
                const themeToggle = document.getElementById("themeToggle");

                if (themeToggle) {

                    // Set correct button text on load
                    if (localStorage.getItem("theme") === "dark") {
                        themeToggle.innerText = "☀️ Light Mode";
                    } else {
                        themeToggle.innerText = "🌙 Dark Mode";
                    }

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
            })
            .catch(error => console.error("Sidebar load error:", error));
    }
});

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
}
