
/* =====================================================
   PILEE TECH GROUP
   CUSTOMER REGISTRATION JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // GET FORM ELEMENTS
    const registrationForm = document.getElementById("registrationForm");

    const password = document.getElementById("password");

    const confirmPassword = document.getElementById("confirmPassword");

    const passwordMessage = document.getElementById("passwordMessage");


    // =========================================
    // 1. SHOW AND HIDE PASSWORD
    // =========================================

    const toggleButtons = document.querySelectorAll(".toggle-password");

    toggleButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = this.getAttribute("data-target");

            const targetInput = document.getElementById(targetId);

            if (targetInput.type === "password") {

                targetInput.type = "text";

                this.textContent = "Hide";

                this.setAttribute("aria-label", "Hide password");

            } else {

                targetInput.type = "password";

                this.textContent = "Show";

                this.setAttribute("aria-label", "Show password");

            }

        });

    });


    // =========================================
    // 2. PASSWORD REQUIREMENTS
    // =========================================

    function checkPasswordRequirements(value) {

        const hasLength = value.length >= 8;

        const hasNumber = /[0-9]/.test(value);

        const hasSpecial = /[^A-Za-z0-9]/.test(value);

        return hasLength && hasNumber && hasSpecial;

    }


    // =========================================
    // 3. PASSWORD CONFIRMATION
    // =========================================

    function validatePasswords() {

        const passwordValue = password.value;

        const confirmValue = confirmPassword.value;

        passwordMessage.textContent = "";

        passwordMessage.className = "";

        confirmPassword.setCustomValidity("");

        password.setCustomValidity("");


        // Empty fields are handled by HTML required validation.

        if (passwordValue === "" || confirmValue === "") {
            return true;
        }


        // Check password requirements.

        if (!checkPasswordRequirements(passwordValue)) {

            passwordMessage.textContent =
                "Password must contain at least 8 characters, one number and one special character.";

            passwordMessage.classList.add("error");

            password.setCustomValidity(
                "Password does not meet the requirements."
            );

            return false;

        }


        // Check if passwords match.

        if (passwordValue !== confirmValue) {

            passwordMessage.textContent =
                "Passwords do not match. Please try again.";

            passwordMessage.classList.add("error");

            confirmPassword.setCustomValidity(
                "Passwords do not match."
            );

            return false;

        }


        // Passwords are valid.

        passwordMessage.textContent =
            "Passwords match successfully.";

        passwordMessage.classList.add("success");

        return true;

    }


    // =========================================
    // 4. CHECK PASSWORD WHILE TYPING
    // =========================================

    password.addEventListener("input", function () {

        validatePasswords();

    });


    confirmPassword.addEventListener("input", function () {

        validatePasswords();

    });


    // =========================================
    // 5. FORM SUBMISSION VALIDATION
    // =========================================

    registrationForm.addEventListener("submit", function (event) {

        const passwordsValid = validatePasswords();

        if (!passwordsValid) {

            event.preventDefault();

            if (!checkPasswordRequirements(password.value)) {

                password.focus();

            } else {

                confirmPassword.focus();

            }

            return;

        }


        // HTML required, pattern and other validations
        // are also checked automatically by the browser.

    });


});
