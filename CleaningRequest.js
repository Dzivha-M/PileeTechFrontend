
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // MOBILE NAVIGATION
    // =========================================

    const menuButton = document.getElementById("menuToggle");
    const navigation = document.getElementById("mainNavigation");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            const isOpen = navigation.classList.toggle("open");

            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navigation.classList.remove("open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation");
            });
        });
    }

    // =========================================
    // CUSTOMER PROFILE DROPDOWN
    // =========================================

    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileBtn && profileDropdown) {

        function closeProfileMenu() {
            profileDropdown.hidden = true;
            profileBtn.setAttribute("aria-expanded", "false");
        }

        profileBtn.addEventListener("click", function (event) {
            event.stopPropagation();

            const isOpen = profileBtn.getAttribute("aria-expanded") === "true";

            profileDropdown.hidden = isOpen;
            profileBtn.setAttribute("aria-expanded", String(!isOpen));
        });

        profileDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        document.addEventListener("click", function () {
            closeProfileMenu();
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeProfileMenu();
                profileBtn.focus();
            }
        });
    }

    // =========================================
    // CLEANING REQUEST FORM
    // =========================================

    const form = document.getElementById("cleaningRequestForm");

    if (!form) return;

    const registeredAddressToggle =
        document.getElementById("useRegisteredAddress");

    const manualAddressFields =
        document.getElementById("manualAddressFields");

    const registeredAddressMessage =
        document.getElementById("registeredAddressMessage");

    const registeredAddressText =
        document.getElementById("registeredAddressText");

    const addressFields = [
        "propertyAddress",
        "propertyCity",
        "propertyProvince",
        "propertyPostalCode"
    ];

    // Set the earliest selectable date to today.
    const cleaningDate = document.getElementById("cleaningDate");

    if (cleaningDate) {
        const today = new Date();
        const localDate = new Date(
            today.getTime() - today.getTimezoneOffset() * 60000
        ).toISOString().split("T")[0];

        cleaningDate.min = localDate;
    }

    // =========================================
    // REGISTERED ADDRESS TOGGLE
    // =========================================

    if (registeredAddressToggle) {

        registeredAddressToggle.addEventListener("change", function () {

            const useRegisteredAddress = this.checked;

            manualAddressFields.hidden = useRegisteredAddress;
            registeredAddressMessage.hidden = !useRegisteredAddress;

            addressFields.forEach(function (fieldId) {
                const field = document.getElementById(fieldId);

                if (field) {
                    field.required = !useRegisteredAddress;
                    field.disabled = useRegisteredAddress;
                }
            });

            if (useRegisteredAddress) {
                registeredAddressText.textContent =
                    "Your registered address will be used once it has been retrieved from your account.";
            }
        });
    }

    // =========================================
    // PHOTO VALIDATION
    // =========================================

    const photoInput = document.getElementById("propertyPhotos");
    const photosError = document.getElementById("photosError");

    if (photoInput) {

        photoInput.addEventListener("change", function () {

            photosError.textContent = "";

            const files = Array.from(this.files);
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            const maxFileSize = 5 * 1024 * 1024;
            const maxFiles = 5;

            if (files.length > maxFiles) {
                photosError.textContent =
                    "You may upload a maximum of 5 photos.";
                this.value = "";
                return;
            }

            for (const file of files) {

                if (!allowedTypes.includes(file.type)) {
                    photosError.textContent =
                        "Only JPG, PNG and WebP images are allowed.";
                    this.value = "";
                    return;
                }

                if (file.size > maxFileSize) {
                    photosError.textContent =
                        "Each photo must be 5 MB or smaller.";
                    this.value = "";
                    return;
                }
            }
        });
    }

    // =========================================
    // FORM SUBMISSION
    // =========================================

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const successMessage =
            document.getElementById("cleaningSuccessMessage");

        // Clear previous errors.
        document.querySelectorAll(".form-error").forEach(function (error) {
            error.textContent = "";
        });

        // Check that the selected date is not in the past.
        if (cleaningDate && cleaningDate.value) {
            const selectedDate = new Date(cleaningDate.value + "T00:00:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                document.getElementById("cleaningDateError").textContent =
                    "Please select today or a future date.";
                cleaningDate.focus();
                return;
            }
        }

        // Check the South African postal code.
        const postalCode = document.getElementById("propertyPostalCode");

        if (!registeredAddressToggle.checked &&
            postalCode.value.trim() &&
            !/^\d{4}$/.test(postalCode.value.trim())) {

            document.getElementById("propertyPostalCodeError").textContent =
                "Enter a valid 4-digit postal code.";

            postalCode.focus();
            return;
        }

        // Check the browser's built-in required-field validation.
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        successMessage.hidden = false;

        successMessage.textContent =
            "Your cleaning request details have passed validation. Connect this form to your PHP backend to save the request.";

        successMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        // Front-end validation only:
        // Do not treat this message as confirmation that a booking
        // has been saved to the database.
    });

});
