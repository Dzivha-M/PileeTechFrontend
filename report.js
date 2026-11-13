
// =====================================
// REPORT AN ISSUE FORM
// =====================================

// Get the form and its fields
const issueForm = document.getElementById("issueForm");

const issueType = document.getElementById("issueType");
const description = document.getElementById("issueDescription");
const picture = document.getElementById("issuePicture");

const issueTypeError = document.getElementById("issueTypeError");
const descriptionError = document.getElementById("descriptionError");
const pictureError = document.getElementById("pictureError");

const fileName = document.getElementById("fileName");
const formMessage = document.getElementById("formMessage");
const submitButton = document.getElementById("submitButton");


// =====================================
// DISPLAY VALIDATION ERRORS
// =====================================

// Validate the issue type
function validateIssueType() {

    if (issueType.value === "") {
        issueTypeError.textContent = "Select an issue type";
        return false;
    }

    issueTypeError.textContent = "";
    return true;
}


// Validate the description
function validateDescription() {

    if (description.value.trim() === "") {
        descriptionError.textContent = "Enter a description";
        return false;
    }

    descriptionError.textContent = "";
    return true;
}


// =====================================
// CLEAR ERRORS WHEN FIELDS ARE FIXED
// =====================================

issueType.addEventListener("change", function () {
    validateIssueType();
    formMessage.textContent = "";
});

description.addEventListener("input", function () {
    validateDescription();
    formMessage.textContent = "";
});


// =====================================
// OPTIONAL PICTURE UPLOAD
// =====================================

picture.addEventListener("change", function () {

    pictureError.textContent = "";
    formMessage.textContent = "";

    // No picture is allowed
    if (picture.files.length === 0) {
        fileName.textContent = "No picture selected";
        return;
    }

    const selectedFile = picture.files[0];

    // Accept image files only
    if (!selectedFile.type.startsWith("image/")) {

        pictureError.textContent = "Please select an image file.";
        picture.value = "";
        fileName.textContent = "No picture selected";
        return;
    }

    // Display the selected filename
    fileName.textContent = selectedFile.name;

});


// =====================================
// SUBMIT ISSUE REPORT
// =====================================

issueForm.addEventListener("submit", async function (event) {

    // Prevent the normal page refresh
    event.preventDefault();

    // Clear the previous submission message
    formMessage.textContent = "";

    // Validate the required fields
    const validType = validateIssueType();
    const validDescription = validateDescription();

    // Stop submission if a required field is missing
    if (!validType || !validDescription) {
        formMessage.textContent = "Please correct the errors above.";
        return;
    }

    // Check the optional picture
    if (picture.files.length > 0 &&
        !picture.files[0].type.startsWith("image/")) {

        pictureError.textContent = "Please select an image file.";
        return;
    }

    // Collect the form fields and optional image
    const formData = new FormData(issueForm);

    // Prevent duplicate submissions
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {

        // Send the report to the PHP backend
        const response = await fetch("submit_issue.php", {
            method: "POST",
            body: formData,
            credentials: "same-origin"
        });

        // Read the backend response
        const result = await response.json();

        // Check whether the backend accepted the report
        if (!response.ok || result.success !== true) {

            throw new Error(
                result.message || "Unable to submit the report."
            );
        }

        // Show success message
        formMessage.textContent = "Report submitted";

        // Clear the form only after successful submission
        issueForm.reset();

        fileName.textContent = "No picture selected";

        issueTypeError.textContent = "";
        descriptionError.textContent = "";
        pictureError.textContent = "";

    } catch (error) {

        // Keep the entered information if submission fails
        formMessage.textContent =
            error.message === "Failed to fetch"
                ? "Unable to connect to the server. Please try again."
                : error.message || "An error occurred. Please try again.";

    } finally {

        // Allow the cleaner to submit again
        submitButton.disabled = false;
        submitButton.textContent = "Submit report";

    }

});
