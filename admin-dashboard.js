// Display the current date.
const currentDate = document.getElementById("currentDate");

currentDate.textContent = new Date().toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

// Mobile navigation.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Demo logout confirmation.
// Replace with your actual logout endpoint when authentication is connected.
document.getElementById("logoutButton").addEventListener("click", function (event) {
    const confirmLogout = confirm("Are you sure you want to log out?");

    if (!confirmLogout) {
        event.preventDefault();
    }
});