
// =====================================
// PILEE TECH GROUP - LOGIN JAVASCRIPT
// =====================================

// SHOW / HIDE PASSWORD

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
        togglePassword.setAttribute("aria-label", "Hide password");
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
        togglePassword.setAttribute("aria-label", "Show password");
    }

});


// BASIC FORM VALIDATION

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        event.preventDefault();
        alert("Please enter your email address and password.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        event.preventDefault();
        alert("Please enter a valid email address.");
        return;
    }

});


// GOOGLE SIGN-IN

document.getElementById("googleLogin").addEventListener("click", function () {

    // Connect Google Identity Services here.
    alert("Google sign-in will be available once Google OAuth is configured.");

});
