
const reportForm = document.getElementById("reportForm");
const picturesInput = document.getElementById("pictures");
const imagePreview = document.getElementById("imagePreview");
const uploadMessage = document.getElementById("uploadMessage");
const formMessage = document.getElementById("formMessage");
const description = document.getElementById("description");
const characterCount = document.getElementById("characterCount");
const submitButton = document.getElementById("submitButton");

const MAX_IMAGES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Replace with the actual endpoint from your backend teammate.
const REPORT_API_URL = "/api/customer-reports.php";

let selectedPictures = [];

function message(element, text, type = "") {
    element.textContent = text;
    element.className = `message ${type}`.trim();
}

description.addEventListener("input", () => {
    characterCount.textContent = description.value.length;
});

function renderPictures() {
    imagePreview.replaceChildren();

    selectedPictures.forEach((file, index) => {
        const item = document.createElement("div");
        item.className = "preview-item";

        const image = document.createElement("img");
        image.alt = file.name;

        const url = URL.createObjectURL(file);
        image.src = url;
        image.addEventListener("load", () => URL.revokeObjectURL(url), {
            once: true
        });

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-image";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `Remove ${file.name}`);

        remove.addEventListener("click", () => {
            selectedPictures.splice(index, 1);
            renderPictures();
            message(uploadMessage, `${selectedPictures.length} picture(s) selected.`);
        });

        item.append(image, remove);
        imagePreview.appendChild(item);
    });
}

picturesInput.addEventListener("change", () => {
    const files = Array.from(picturesInput.files);
    let rejected = 0;

    for (const file of files) {
        if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_SIZE) {
            rejected++;
            continue;
        }

        if (selectedPictures.length >= MAX_IMAGES) {
            rejected++;
            continue;
        }

        const duplicate = selectedPictures.some(existing =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );

        if (!duplicate) selectedPictures.push(file);
    }

    renderPictures();

    message(
        uploadMessage,
        rejected
            ? `${rejected} picture(s) could not be added. Use JPG, PNG or WebP, up to 5 MB each, with a maximum of 5 pictures.`
            : `${selectedPictures.length} picture(s) selected.`,
        rejected ? "error" : ""
    );

    picturesInput.value = "";
});

reportForm.addEventListener("reset", () => {
    selectedPictures = [];
    renderPictures();
    characterCount.textContent = "0";
    message(uploadMessage, "");
    message(formMessage, "");
});

reportForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!reportForm.reportValidity()) return;

    const data = new FormData(reportForm);

    // Add selected files because the user can remove pictures
    // after choosing them in the file picker.
    data.delete("pictures");

    selectedPictures.forEach(file => {
        data.append("pictures[]", file, file.name);
    });

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";
    message(formMessage, "");

    try {
        const response = await fetch(REPORT_API_URL, {
            method: "POST",
            credentials: "include",
            body: data
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        message(
            formMessage,
            "Your report has been submitted successfully.",
            "success"
        );

        reportForm.reset();
    } catch (error) {
        console.error("Report submission failed:", error);

        message(
            formMessage,
            "Your report could not be submitted. Please check the backend connection and try again.",
            "error"
        );
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = " Submit Report";
    }
});

/* =========================================
   HEADER MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Toggle navigation"
        );
    });
}

/* =========================================
   PROFILE DROPDOWN
========================================= */

const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");

if (profileBtn && profileDropdown) {

    profileBtn.addEventListener("click", () => {
        const isOpen = profileDropdown.hidden;

        profileDropdown.hidden = !isOpen;
        profileBtn.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", (event) => {
        if (
            !profileBtn.contains(event.target) &&
            !profileDropdown.contains(event.target)
        ) {
            profileDropdown.hidden = true;
            profileBtn.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            profileDropdown.hidden = true;
            profileBtn.setAttribute("aria-expanded", "false");
        }
    });
}

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