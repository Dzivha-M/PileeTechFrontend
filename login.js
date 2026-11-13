const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const toggleBtn = document.getElementById("togglePassword");
const rememberBox = document.getElementById("remember");

// Pre-fill saved email
const savedEmail = localStorage.getItem("cleanerEmail");
if (savedEmail) emailInput.value = savedEmail;

// Show / hide password
toggleBtn.addEventListener("click", () => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  toggleBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

function setError(input, errorEl, message) {
  errorEl.textContent = message;
  input.closest(".input-wrap").classList.toggle("invalid", Boolean(message));
}

// Clear errors while typing
emailInput.addEventListener("input", () => setError(emailInput, emailError, ""));
passwordInput.addEventListener("input", () => setError(passwordInput, passwordError, ""));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  const email = emailInput.value.trim();

  if (!email) {
    setError(emailInput, emailError, "Enter your email address");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError(emailInput, emailError, "Enter a valid email address");
    valid = false;
  }

  if (!passwordInput.value) {
    setError(passwordInput, passwordError, "Enter your password");
    valid = false;
  }

  if (!valid) return;

  if (rememberBox.checked) localStorage.setItem("cleanerEmail", email);
  else localStorage.removeItem("cleanerEmail");

  
  // For now, go straight to the cleaner dashboard.
  window.location.href = "DashbordCleaner.html";
});