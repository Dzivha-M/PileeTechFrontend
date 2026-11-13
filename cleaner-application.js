
"use strict";

/* =========================================
   PILEE TECH GROUP
   CLEANER APPLICATION JAVASCRIPT
========================================= */


/* =========================================
   1. SELECT ELEMENTS
========================================= */

const form = document.getElementById("cleanerForm");

const documentType = document.getElementById("documentType");
const identityNumber = document.getElementById("identityNumber");
const identityLabel = document.getElementById("identityLabel");
const identityHelp = document.getElementById("identityHelp");

const photoInput = document.getElementById("photoInput");
const photoImage = document.getElementById("photoImage");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const removePhoto = document.getElementById("removePhoto");
const photoError = document.getElementById("photoError");

const cameraPanel = document.getElementById("cameraPanel");
const cameraVideo = document.getElementById("cameraVideo");
const cameraCanvas = document.getElementById("cameraCanvas");
const cameraStatus = document.getElementById("cameraStatus");

const openCameraButton = document.getElementById("openCamera");
const capturePhotoButton = document.getElementById("capturePhoto");
const closeCameraButton = document.getElementById("closeCamera");

const formMessage = document.getElementById("formMessage");

const postalCode = document.getElementById("postalCode");

const submitButton = document.getElementById("submitButton");

let cameraStream = null;
let photoSelected = false;
let photoObjectUrl = null;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_PHOTO_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const ALLOWED_DOCUMENT_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp"
];


/* =========================================
   2. MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("mainNavigation");

menuToggle.addEventListener("click", () => {

    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );

});

navigation.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

        navigation.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");

    });

});


/* =========================================
   3. FORM ERROR FUNCTIONS
========================================= */

function clearError(field) {

    if (!field) return;

    field.classList.remove("invalid");

    const group = field.closest(".form-group");

    const error = group?.querySelector(".field-error");

    if (error) {
        error.textContent = "";
    }

}


function setError(field, message) {

    if (!field) return;

    field.classList.add("invalid");

    const group = field.closest(".form-group");

    const error = group?.querySelector(".field-error");

    if (error) {
        error.textContent = message;
    }

}


function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = `form-message ${type}`;

}


/* =========================================
   4. CLEAR ERRORS WHEN TYPING
========================================= */

form.querySelectorAll("input, select, textarea").forEach(field => {

    field.addEventListener("input", () => clearError(field));

    field.addEventListener("change", () => clearError(field));

});


/* =========================================
   5. POSTAL CODE VALIDATION
========================================= */

postalCode.addEventListener("input", () => {

    postalCode.value = postalCode.value
        .replace(/\D/g, "")
        .slice(0, 4);

    clearError(postalCode);

});


/* =========================================
   6. DYNAMIC ID / PASSPORT FIELD
========================================= */

documentType.addEventListener("change", () => {

    clearError(documentType);

    identityNumber.value = "";

    clearError(identityNumber);


    if (documentType.value === "sa_id") {

        identityLabel.innerHTML =
            'Enter your South African ID Number <span>*</span>';

        identityNumber.placeholder = "Enter your 13-digit ID number";

        identityNumber.inputMode = "numeric";

        identityNumber.maxLength = 13;

        identityNumber.disabled = false;

        identityHelp.textContent =
            "Enter the 13-digit number shown on your South African ID document.";

    }

    else if (documentType.value === "passport") {

        identityLabel.innerHTML =
            'Enter your Passport Number <span>*</span>';

        identityNumber.placeholder = "Enter your passport number";

        identityNumber.removeAttribute("maxLength");

        identityNumber.inputMode = "text";

        identityNumber.disabled = false;

        identityHelp.textContent =
            "Enter your passport number as shown on your document.";

    }

    else {

        identityLabel.innerHTML =
            'Identity Document Number <span>*</span>';

        identityNumber.placeholder =
            "Select your document type first";

        identityNumber.disabled = true;

        identityNumber.removeAttribute("maxLength");

        identityHelp.textContent =
            "Select South African ID or Passport above.";

    }

});


identityNumber.addEventListener("input", () => {

    if (documentType.value === "sa_id") {

        identityNumber.value = identityNumber.value
            .replace(/\D/g, "")
            .slice(0, 13);

    }

    else if (documentType.value === "passport") {

        identityNumber.value = identityNumber.value
            .replace(/[^a-zA-Z0-9]/g, "")
            .toUpperCase();

    }

    clearError(identityNumber);

});


/* =========================================
   7. PHOTOGRAPH PREVIEW
========================================= */

function clearPhotoPreview() {

    if (photoObjectUrl) {

        URL.revokeObjectURL(photoObjectUrl);

        photoObjectUrl = null;

    }

    photoImage.removeAttribute("src");

    photoImage.hidden = true;

    photoPlaceholder.hidden = false;

    removePhoto.hidden = true;

    photoSelected = false;

}


function showPhoto(file) {

    if (!file) return false;

    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {

        photoError.textContent =
            "Please select a JPG, PNG or WebP photograph.";

        return false;

    }

    if (file.size > MAX_FILE_SIZE || file.size === 0) {

        photoError.textContent =
            "Your photograph must be between 1 byte and 5 MB.";

        return false;

    }

    if (photoObjectUrl) {

        URL.revokeObjectURL(photoObjectUrl);

    }

    photoObjectUrl = URL.createObjectURL(file);

    photoImage.src = photoObjectUrl;

    photoImage.hidden = false;

    photoPlaceholder.hidden = true;

    removePhoto.hidden = false;

    photoError.textContent = "";

    photoSelected = true;

    return true;

}


/* =========================================
   8. UPLOAD PHOTOGRAPH
========================================= */

photoInput.addEventListener("change", () => {

    const file = photoInput.files[0];

    if (!file) return;

    if (!showPhoto(file)) {

        photoInput.value = "";

        clearPhotoPreview();

    }

});


/* =========================================
   9. REMOVE PHOTOGRAPH
========================================= */

removePhoto.addEventListener("click", () => {

    photoInput.value = "";

    clearPhotoPreview();

    photoError.textContent = "";

});


/* =========================================
   10. CAMERA FUNCTIONS
========================================= */

async function stopCamera() {

    if (cameraStream) {

        cameraStream.getTracks().forEach(track => track.stop());

        cameraStream = null;

    }

    cameraVideo.pause();

    cameraVideo.srcObject = null;

    capturePhotoButton.disabled = true;

}


openCameraButton.addEventListener("click", async () => {

    if (!navigator.mediaDevices?.getUserMedia) {

        photoError.textContent =
            "Camera access is unavailable. Please use HTTPS or localhost, or upload a photograph instead.";

        return;

    }

    cameraPanel.hidden = false;

    cameraStatus.textContent = "Requesting camera access...";

    capturePhotoButton.disabled = true;

    try {

        cameraStream = await navigator.mediaDevices.getUserMedia({

            audio: false,

            video: {

                facingMode: "user",

                width: { ideal: 1280 },

                height: { ideal: 960 }

            }

        });

        cameraVideo.srcObject = cameraStream;

        await cameraVideo.play();

        cameraStatus.textContent =
            "Camera ready. Position yourself and capture your professional photograph.";

        capturePhotoButton.disabled = false;

    }

    catch (error) {

        cameraStatus.textContent =
            "Unable to access the camera. Check your browser permissions or upload a photograph instead.";

        await stopCamera();

    }

});


/* =========================================
   11. CAPTURE PHOTOGRAPH
========================================= */

capturePhotoButton.addEventListener("click", () => {

    if (!cameraStream || !cameraVideo.videoWidth) {

        cameraStatus.textContent =
            "The camera is not ready yet.";

        return;

    }

    cameraCanvas.width = cameraVideo.videoWidth;

    cameraCanvas.height = cameraVideo.videoHeight;

    const context = cameraCanvas.getContext("2d");

    context.drawImage(
        cameraVideo,
        0,
        0,
        cameraCanvas.width,
        cameraCanvas.height
    );

    cameraCanvas.toBlob(async blob => {

        if (!blob) {

            cameraStatus.textContent =
                "The photograph could not be captured. Please try again.";

            return;

        }

        const file = new File(
            [blob],
            "cleaner-applicant-photo.jpg",
            { type: "image/jpeg" }
        );

        if (!showPhoto(file)) return;

        const transfer = new DataTransfer();

        transfer.items.add(file);

        photoInput.files = transfer.files;

        cameraStatus.textContent =
            "Professional photograph captured successfully.";

        await stopCamera();

        cameraPanel.hidden = true;

    }, "image/jpeg", 0.9);

});


/* =========================================
   12. CLOSE CAMERA
========================================= */

closeCameraButton.addEventListener("click", async () => {

    await stopCamera();

    cameraPanel.hidden = true;

});


/* =========================================
   13. SUPPORTING DOCUMENTS
========================================= */

const documentRules = [

    {
        inputId: "cv",
        nameId: "cvName",
        errorId: "cvError",
        maxFiles: 1
    },

    {
        inputId: "certifiedIdentity",
        nameId: "certifiedIdentityName",
        errorId: "certifiedIdentityError",
        maxFiles: 1
    },

    {
        inputId: "proofOfAddress",
        nameId: "proofOfAddressName",
        errorId: "proofOfAddressError",
        maxFiles: 1
    },

    {
        inputId: "certificates",
        nameId: "certificatesName",
        errorId: "certificatesError",
        maxFiles: 5
    },

    {
        inputId: "otherDocuments",
        nameId: "otherDocumentsName",
        errorId: "otherDocumentsError",
        maxFiles: 5
    }

];


function validateDocument(file) {

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {

        return `${file.name}: use PDF, JPG, PNG or WebP.`;

    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {

        return `${file.name}: each file must be between 1 byte and 5 MB.`;

    }

    return "";

}


documentRules.forEach(rule => {

    const input = document.getElementById(rule.inputId);

    const nameDisplay = document.getElementById(rule.nameId);

    const errorDisplay = document.getElementById(rule.errorId);


    input.addEventListener("change", () => {

        errorDisplay.textContent = "";

        const files = Array.from(input.files || []);


        if (files.length > rule.maxFiles) {

            errorDisplay.textContent =
                `You can select up to ${rule.maxFiles} file(s).`;

            input.value = "";

            nameDisplay.textContent = "No files selected";

            return;

        }


        const problem = files.map(validateDocument).find(Boolean);


        if (problem) {

            errorDisplay.textContent = problem;

            input.value = "";

            nameDisplay.textContent = "No files selected";

            return;

        }


        if (files.length === 0) {

            nameDisplay.textContent = "No file selected";

        }

        else if (files.length === 1) {

            nameDisplay.textContent = files[0].name;

        }

        else {

            nameDisplay.textContent =
                `${files.length} files selected: ` +
                files.map(file => file.name).join(", ");

        }

    });

});


/* =========================================
   14. COMPLETE FORM VALIDATION
========================================= */

form.addEventListener("submit", event => {

    formMessage.className = "form-message";

    let valid = true;

    let firstInvalid = null;


    function markInvalid(field, message) {

        setError(field, message);

        valid = false;

        firstInvalid ??= field;

    }


    /* Standard required fields */

    const requiredFields = form.querySelectorAll(
        "input[required]:not([type=checkbox]):not(#identityNumber):not([type=file]), select[required], textarea[required]"
    );


    requiredFields.forEach(field => {

        clearError(field);

        const value = field.value.trim();


        if (!value) {

            markInvalid(field, "This field is required.");

        }

        else if (
            field.type === "email" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {

            markInvalid(field, "Enter a valid email address.");

        }

        else if (
            field.id === "phone" &&
            !/^(?:\+27|0)[1-9]\d{8}$/.test(
                value.replace(/[\s()-]/g, "")
            )
        ) {

            markInvalid(field, "Enter a valid South African phone number.");

        }

        else if (
            field.id === "postalCode" &&
            !/^\d{4}$/.test(value)
        ) {

            markInvalid(field, "Enter a valid four-digit postal code.");

        }

    });


    /* Identity validation */

    clearError(documentType);

    clearError(identityNumber);


    if (!documentType.value) {

        markInvalid(
            documentType,
            "Select your identity document type."
        );

    }

    else if (!identityNumber.value.trim()) {

        markInvalid(
            identityNumber,
            "Enter your identity document number."
        );

    }

    else if (
        documentType.value === "sa_id" &&
        !/^\d{13}$/.test(identityNumber.value)
    ) {

        markInvalid(
            identityNumber,
            "A South African ID number must contain 13 digits."
        );

    }

    else if (
        documentType.value === "passport" &&
        !/^[A-Z0-9]{5,20}$/.test(identityNumber.value)
    ) {

        markInvalid(
            identityNumber,
            "Enter a passport number containing 5–20 letters or numbers."
        );

    }


    /* Photograph validation */

    if (!photoSelected || !photoInput.files.length) {

        photoError.textContent =
            "Please upload or take your professional photograph.";

        valid = false;

        firstInvalid ??= openCameraButton;

    }

    else if (
        photoInput.files[0].size > MAX_FILE_SIZE ||
        !ALLOWED_PHOTO_TYPES.includes(photoInput.files[0].type)
    ) {

        photoError.textContent =
            "Please provide a valid JPG, PNG or WebP photograph under 5 MB.";

        valid = false;

        firstInvalid ??= openCameraButton;

    }


    /* Supporting document validation */

    documentRules.forEach(rule => {

        const input = document.getElementById(rule.inputId);

        const errorDisplay = document.getElementById(rule.errorId);

        const files = Array.from(input.files || []);

        errorDisplay.textContent = "";


        if (input.required && files.length === 0) {

            errorDisplay.textContent = "This document is required.";

            valid = false;

            firstInvalid ??= input;

            return;

        }


        if (files.length > rule.maxFiles) {

            errorDisplay.textContent =
                `You can select up to ${rule.maxFiles} file(s).`;

            valid = false;

            firstInvalid ??= input;

            return;

        }


        const problem = files.map(validateDocument).find(Boolean);

        if (problem) {

            errorDisplay.textContent = problem;

            valid = false;

            firstInvalid ??= input;

        }

    });


    /* Declaration */

    const declaration = document.getElementById("declaration");

    const declarationError =
        document.getElementById("declarationError");


    declarationError.textContent = declaration.checked
        ? ""
        : "Please confirm the declaration before submitting.";


    if (!declaration.checked) {

        valid = false;

        firstInvalid ??= declaration;

    }


    /* Stop submission if validation fails */

    if (!valid) {

        event.preventDefault();

        showMessage(
            "Please check the highlighted fields before submitting.",
            "error"
        );

        firstInvalid?.focus();

        return;

    }


    /* Allow PHP to receive the multipart form */

    submitButton.disabled = true;

    submitButton.querySelector("span").textContent = "Submitting...";

    submitButton.setAttribute("aria-busy", "true");

});


/* =========================================
   15. RESET FORM
========================================= */

form.addEventListener("reset", async () => {

    await stopCamera();

    cameraPanel.hidden = true;

    clearPhotoPreview();

    photoInput.value = "";

    photoError.textContent = "";

    formMessage.className = "form-message";


    documentType.value = "";

    identityNumber.value = "";

    identityNumber.disabled = true;

    identityNumber.removeAttribute("maxLength");

    identityLabel.innerHTML =
        'Identity Document Number <span>*</span>';

    identityNumber.placeholder =
        "Select your document type first";

    identityHelp.textContent =
        "Select South African ID or Passport above.";


    document.querySelectorAll(".invalid").forEach(field => {

        field.classList.remove("invalid");

    });


    document.querySelectorAll(".field-error").forEach(error => {

        error.textContent = "";

    });


    documentRules.forEach(rule => {

        document.getElementById(rule.nameId).textContent =
            "No file selected";

    });


    submitButton.disabled = false;

    submitButton.querySelector("span").textContent =
        "→";

    submitButton.removeAttribute("aria-busy");

});


/* =========================================
   16. RELEASE CAMERA WHEN LEAVING
========================================= */

window.addEventListener("pagehide", stopCamera);

// =========================================
// ACCOUNT VISIBILITY
// =========================================

const loginLink = document.getElementById("loginLink");
const profileContainer = document.getElementById("profileMenuContainer");

function updateAccountVisibility() {

    const loggedIn =
        localStorage.getItem("pileeTechLoggedIn") === "true";

    if (loginLink) {
        loginLink.hidden = loggedIn;
    }

    if (profileContainer) {
        profileContainer.hidden = !loggedIn;
    }
}

updateAccountVisibility();


// =========================================
// LOGOUT
// =========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function(event) {

        event.preventDefault();

        localStorage.removeItem("pileeTechLoggedIn");

        window.location.href = "index.html";

    });

}