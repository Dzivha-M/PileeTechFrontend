// =================================
// PILEE TECH GROUP
// REGISTRATION JAVASCRIPT
// =================================


// =================================
// GET THE FORM
// =================================

const form =
    document.getElementById("registrationForm");


// =================================
// GET ALL INPUTS
// =================================

const nameInput =
    document.getElementById("name");

const surnameInput =
    document.getElementById("surname");

const emailInput =
    document.getElementById("email");

const contactInput =
    document.getElementById("contact");

const passwordInput =
    document.getElementById("password");

const verifyPasswordInput =
    document.getElementById("verifyPassword");

const termsInput =
    document.getElementById("terms");


// =================================
// PASSWORD STRENGTH ELEMENTS
// =================================

const strengthBar =
    document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");


// =================================
// SUCCESS MESSAGE
// =================================

const successMessage =
    document.getElementById("successMessage");


// =================================
// SHOW / HIDE PASSWORD
// =================================

function showPassword(inputId, button) {

    // Get the password input
    const input =
        document.getElementById(inputId);


    // If password is hidden
    if (input.type === "password") {

        // Show the password
        input.type = "text";

        // Change button text
        button.textContent = "Hide";

    }

    // If password is visible
    else {

        // Hide the password
        input.type = "password";

        // Change button text
        button.textContent = "Show";

    }

}


// =================================
// CONTACT: NUMBERS ONLY
// =================================

contactInput.addEventListener(
    "input",
    function () {

        // Remove anything that is NOT a number
        // This also works when pasting text
        contactInput.value =
            contactInput.value.replace(/\D/g, "");

    }
);


// =================================
// NAME & SURNAME:
// AUTO CAPITAL LETTERS
// =================================

function capitaliseFirstLetters(input) {

    // Remember the cursor position
    const position =
        input.selectionStart;


    // Capitalise the first letter of
    // each part of the name
    input.value =
        input.value.replace(
            /(^|[\s\-'])([a-z])/g,
            function (match, separator, letter) {

                return separator +
                    letter.toUpperCase();

            }
        );


    // Put the cursor back in its
    // original position
    input.setSelectionRange(
        position,
        position
    );

}


// =================================
// NAME INPUT
// =================================

nameInput.addEventListener(
    "input",
    function () {

        capitaliseFirstLetters(
            nameInput
        );

    }
);


// =================================
// SURNAME INPUT
// =================================

surnameInput.addEventListener(
    "input",
    function () {

        capitaliseFirstLetters(
            surnameInput
        );

    }
);


// =================================
// PASSWORD STRENGTH
// =================================

passwordInput.addEventListener(
    "input",
    function () {

        // Get password value
        const password =
            passwordInput.value;


        // Password score
        let score = 0;


        // Check password length
        if (password.length >= 8) {
            score++;
        }


        // Check uppercase letter
        if (/[A-Z]/.test(password)) {
            score++;
        }


        // Check lowercase letter
        if (/[a-z]/.test(password)) {
            score++;
        }


        // Check number
        if (/[0-9]/.test(password)) {
            score++;
        }


        // Check special character
        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }


        // =================================
        // NO PASSWORD
        // =================================

        if (password.length === 0) {

            strengthBar.style.width =
                "0%";

            strengthText.textContent =
                "Password strength: Not entered";

        }


        // =================================
        // WEAK PASSWORD
        // =================================

        else if (score <= 2) {

            strengthBar.style.width =
                "35%";

            strengthText.textContent =
                "Password strength: Weak";

        }


        // =================================
        // MEDIUM PASSWORD
        // =================================

        else if (score <= 4) {

            strengthBar.style.width =
                "70%";

            strengthText.textContent =
                "Password strength: Medium";

        }


        // =================================
        // STRONG PASSWORD
        // =================================

        else {

            strengthBar.style.width =
                "100%";

            strengthText.textContent =
                "Password strength: Strong";

        }

    }
);


// =================================
// FORM SUBMISSION
// =================================

form.addEventListener(
    "submit",
    function (event) {

        // Stop the form from submitting
        // until validation is complete
        event.preventDefault();


        // Assume the form is valid
        let valid = true;


        // Hide previous success message
        successMessage.classList.remove(
            "show"
        );


        // =================================
        // NAME VALIDATION
        // =================================

        if (
            nameInput.value.trim() === ""
        ) {

            document.getElementById(
                "nameError"
            ).textContent =
                "Please enter your name.";

            valid = false;

        }

        else {

            document.getElementById(
                "nameError"
            ).textContent = "";

        }


        // =================================
        // SURNAME VALIDATION
        // =================================

        if (
            surnameInput.value.trim() === ""
        ) {

            document.getElementById(
                "surnameError"
            ).textContent =
                "Please enter your surname.";

            valid = false;

        }

        else {

            document.getElementById(
                "surnameError"
            ).textContent = "";

        }


        // =================================
        // EMAIL VALIDATION
        // =================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                emailInput.value.trim()
            )
        ) {

            document.getElementById(
                "emailError"
            ).textContent =
                "Please enter a valid email.";

            valid = false;

        }

        else {

            document.getElementById(
                "emailError"
            ).textContent = "";

        }


        // =================================
        // CONTACT VALIDATION
        // =================================

        const contactPattern =
            /^[0-9]{9,15}$/;


        if (
            !contactPattern.test(
                contactInput.value.trim()
            )
        ) {

            document.getElementById(
                "contactError"
            ).textContent =
                "Please enter a valid contact number.";

            valid = false;

        }

        else {

            document.getElementById(
                "contactError"
            ).textContent = "";

        }


        // =================================
        // PASSWORD VALIDATION
        // =================================

        const password =
            passwordInput.value;


        const strongPassword =
            password.length >= 8 &&
            /[A-Za-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password);


        if (!strongPassword) {

            document.getElementById(
                "passwordError"
            ).textContent =
                "Password must contain at least 8 characters, a number and a special character.";

            valid = false;

        }

        else {

            document.getElementById(
                "passwordError"
            ).textContent = "";

        }


        // =================================
        // VERIFY PASSWORD
        // =================================

        if (
            verifyPasswordInput.value !==
            passwordInput.value
        ) {

            document.getElementById(
                "verifyPasswordError"
            ).textContent =
                "Passwords do not match.";

            valid = false;

        }

        else {

            document.getElementById(
                "verifyPasswordError"
            ).textContent = "";

        }


        // =================================
        // TERMS & CONDITIONS
        // =================================

        if (!termsInput.checked) {

            document.getElementById(
                "termsError"
            ).textContent =
                "Please accept the Terms & Conditions.";

            valid = false;

        }

        else {

            document.getElementById(
                "termsError"
            ).textContent = "";

        }


        // =================================
        // SUCCESS
        // =================================

        if (valid) {

            // Show success message
            successMessage.classList.add(
                "show"
            );


            // Show message in console
            console.log(
                "Registration form is valid."
            );
            
/* =================================
   REGISTRATION FORM
================================= */

// Get the registration form and success message
const registrationForm = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");

// Get all input fields
const fullnameInput = document.getElementById("fullname");
const surnameInput = document.getElementById("surname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const provinceInput = document.getElementById("province");
const postalCodeInput = document.getElementById("postalCode");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const contactMethodInput = document.getElementById("contactMethod");
const termsInput = document.getElementById("terms");


/* =================================
   ERROR MESSAGE FUNCTION
================================= */

// Display an error message below an input field
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = "red";
    }
}

// Clear an error message
function clearError(errorId) {
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = "";
    }
}


/* =================================
   CAPITALISE NAMES
================================= */

// Capitalise the first letter of each word
function capitaliseFirstLetters(input) {
    input.value = input.value.replace(
        /(^|[\s\-'])([a-z])/g,
        function (match, separator, letter) {
            return separator + letter.toUpperCase();
        }
    );
}

// Apply capitalisation when the user leaves the field
fullnameInput.addEventListener("blur", function () {
    capitaliseFirstLetters(fullnameInput);
});

surnameInput.addEventListener("blur", function () {
    capitaliseFirstLetters(surnameInput);
});

cityInput.addEventListener("blur", function () {
    capitaliseFirstLetters(cityInput);
});


/* =================================
   EMAIL ADDRESS
================================= */

// Convert the email address to lowercase
emailInput.addEventListener("blur", function () {
    emailInput.value = emailInput.value.trim().toLowerCase();
});


/* =================================
   MOBILE NUMBER
================================= */

// Allow numbers and common phone number symbols
phoneInput.addEventListener("input", function () {
    phoneInput.value = phoneInput.value.replace(/[^\d+()\s-]/g, "");
    clearError("contactError");
});


/* =================================
   POSTAL CODE
================================= */

// Allow numbers only
postalCodeInput.addEventListener("input", function () {
    postalCodeInput.value = postalCodeInput.value.replace(/\D/g, "");
    clearError("postalCodeError");
});


/* =================================
   SHOW OR HIDE PASSWORD
================================= */

// Show or hide the selected password field
function showPassword(inputId, button) {
    const passwordField = document.getElementById(inputId);

    if (passwordField.type === "password") {
        passwordField.type = "text";
        button.textContent = "Hide";
    } else {
        passwordField.type = "password";
        button.textContent = "Show";
    }
}


/* =================================
   PASSWORD STRENGTH
================================= */

// Check password strength as the user types
passwordInput.addEventListener("input", function () {
    const password = passwordInput.value;
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Update the strength bar and message
    if (password.length === 0) {
        strengthBar.style.width = "0%";
        strengthText.textContent = "Password strength: Not entered";
    } else if (score <= 2) {
        strengthBar.style.width = "25%";
        strengthBar.style.backgroundColor = "red";
        strengthText.textContent = "Password strength: Weak";
    } else if (score <= 3) {
        strengthBar.style.width = "50%";
        strengthBar.style.backgroundColor = "orange";
        strengthText.textContent = "Password strength: Fair";
    } else if (score === 4) {
        strengthBar.style.width = "75%";
        strengthBar.style.backgroundColor = "#e6b800";
        strengthText.textContent = "Password strength: Good";
    } else {
        strengthBar.style.width = "100%";
        strengthBar.style.backgroundColor = "green";
        strengthText.textContent = "Password strength: Strong";
    }

    clearError("passwordError");
});


/* =================================
   CONFIRM PASSWORD
================================= */

// Check whether both passwords match
confirmPasswordInput.addEventListener("input", function () {
    if (confirmPasswordInput.value !== passwordInput.value) {
        showError("confirmPasswordError", "Passwords do not match.");
    } else {
        clearError("confirmPasswordError");
    }
});

// Recheck confirmation if the original password changes
passwordInput.addEventListener("input", function () {
    if (confirmPasswordInput.value !== "") {
        if (confirmPasswordInput.value !== passwordInput.value) {
            showError("confirmPasswordError", "Passwords do not match.");
        } else {
            clearError("confirmPasswordError");
        }
    }
});


/* =================================
   REGISTRATION FORM VALIDATION
================================= */

// Validate the form when the user clicks Create Account
registrationForm.addEventListener("submit", function (event) {

    // Prevent submission until validation is complete
    event.preventDefault();

    // Hide the previous success message
    successMessage.style.display = "none";

    // Clear previous error messages
    const errorIds = [
        "fullnameError",
        "surnameError",
        "emailError",
        "contactError",
        "addressError",
        "cityError",
        "provinceError",
        "postalCodeError",
        "usernameError",
        "passwordError",
        "confirmPasswordError",
        "contactMethodError",
        "termsError"
    ];

    errorIds.forEach(function (id) {
        clearError(id);
    });

    let isValid = true;

    // Personal information validation
    if (fullnameInput.value.trim() === "") {
        showError("fullnameError", "Please enter your full name.");
        isValid = false;
    }

    if (surnameInput.value.trim() === "") {
        showError("surnameError", "Please enter your surname.");
        isValid = false;
    }

    if (emailInput.value.trim() === "") {
        showError("emailError", "Please enter your email address.");
        isValid = false;
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())
    ) {
        showError("emailError", "Please enter a valid email address.");
        isValid = false;
    }

    // Accept 10-digit local numbers or international numbers
    const phoneDigits = phoneInput.value.replace(/\D/g, "");

    if (phoneInput.value.trim() === "") {
        showError("contactError", "Please enter your mobile number.");
        isValid = false;
    } else if (
        phoneDigits.length < 10 ||
        phoneDigits.length > 15
    ) {
        showError("contactError", "Enter a valid mobile number.");
        isValid = false;
    }

    if (addressInput.value.trim() === "") {
        showError("addressError", "Please enter your physical address.");
        isValid = false;
    }

    if (cityInput.value.trim() === "") {
        showError("cityError", "Please enter your city.");
        isValid = false;
    }

    if (provinceInput.value === "") {
        showError("provinceError", "Please select your province.");
        isValid = false;
    }

    // South African postal codes contain four digits
    if (!/^\d{4}$/.test(postalCodeInput.value.trim())) {
        showError("postalCodeError", "Enter a valid 4-digit postal code.");
        isValid = false;
    }

    // Account details validation
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (password.length < 8) {
        showError(
            "passwordError",
            "Password must contain at least 8 characters."
        );
        isValid = false;
    } else if (!/[0-9]/.test(password)) {
        showError(
            "passwordError",
            "Password must contain at least one number."
        );
        isValid = false;
    } else if (!/[^A-Za-z0-9]/.test(password)) {
        showError(
            "passwordError",
            "Password must contain at least one special character."
        );
        isValid = false;
    }

    if (confirmPassword === "") {
        showError(
            "confirmPasswordError",
            "Please confirm your password."
        );
        isValid = false;
    } else if (password !== confirmPassword) {
        showError(
            "confirmPasswordError",
            "Passwords do not match."
        );
        isValid = false;
    }

    // Preferences validation
    if (contactMethodInput.value === "") {
        showError(
            "contactMethodError",
            "Please select your preferred contact method."
        );
        isValid = false;
    }

    if (!termsInput.checked) {
        showError(
            "termsError",
            "You must agree to the Terms and Conditions."
        );
        isValid = false;
    }

    // Display success only when every check passes
    if (isValid) {
        successMessage.textContent =
            "Registration details are valid!";

        successMessage.style.display = "block";
        successMessage.style.color = "green";

        // This validates the form only.
        // PHP and MySQL are needed to create and save the account.
    }
// =================================
// ACCOUNT TYPE REDIRECTION
// =================================

const accountType = document.getElementById("accountType");

accountType.addEventListener("change", function () {

    // Get the selected account type
    const selectedType = accountType.value;

    // Redirect cleaners to their own registration page
    if (selectedType === "cleaner") {
        window.location.href = "CleanersApplication.html";
    }

    // Customers remain on the current registration page
    else if (selectedType === "customer") {
        // Continue with the existing customer registration form
    }

});


    