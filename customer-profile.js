/* =========================================
   PILEE TECH - CUSTOMER DASHBOARD
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // SIDEBAR SECTION NAVIGATION
    // =====================================

   const sidebarLinks = document.querySelectorAll(
    ".sidebar-link[data-section]"
);
    const dashboardSections = document.querySelectorAll(".dashboard-section");

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const targetSection = link.dataset.section;

            // Hide all dashboard sections
            dashboardSections.forEach(function (section) {
                section.hidden = true;
                section.classList.remove("active");
            });

            // Remove active state from all sidebar links
            sidebarLinks.forEach(function (item) {
                item.classList.remove("active");
                item.removeAttribute("aria-current");
            });

            // Show selected section
            const selectedSection = document.getElementById(targetSection);

            if (selectedSection) {
                selectedSection.hidden = false;
                selectedSection.classList.add("active");

                link.classList.add("active");
                link.setAttribute("aria-current", "page");

                // Return to the dashboard content on mobile
                selectedSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // =====================================
    // MOBILE NAVIGATION MENU
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("show");

            menuToggle.setAttribute("aria-expanded", isOpen);

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Close mobile menu after selecting a link
        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {
                navLinks.classList.remove("show");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });

        });
    }


    // =====================================
    // REPORT ISSUE FORM
    // =====================================

    const issueForm = document.getElementById("issueForm");
    const issueMessage = document.getElementById("issueMessage");

    if (issueForm && issueMessage) {

        issueForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!issueForm.checkValidity()) {
                issueForm.reportValidity();
                return;
            }

            /*
             * FRONTEND DEMONSTRATION ONLY
             *
             * Connect this form to your PHP backend
             * to save reports in the MySQL database.
             */

            issueMessage.textContent =
                "Your report has been prepared. Connect the PHP backend to submit it to Pilee Tech.";

            issueMessage.className = "form-message";

            issueForm.reset();
        });

        issueForm.addEventListener("reset", function () {
            issueMessage.textContent = "";
        });
    }

});

// CUSTOMER DASHBOARD SIDEBAR NAVIGATION

const sidebarLinks = document.querySelectorAll(
    ".sidebar-link[data-section]"
);

const dashboardSections = document.querySelectorAll(
    ".dashboard-section"
);

sidebarLinks.forEach(link => {

    link.addEventListener("click", function () {

        const targetId = this.dataset.section;
        const targetSection = document.getElementById(targetId);

        if (!targetSection) return;

        dashboardSections.forEach(section => {
            section.hidden = true;
            section.classList.remove("active");
        });

        sidebarLinks.forEach(item => {
            item.classList.remove("active");
        });

        targetSection.hidden = false;
        targetSection.classList.add("active");

        this.classList.add("active");

    });

});


/* =========================================
   PILEE TECH - CUSTOMER DASHBOARD
========================================= */

document.addEventListener("DOMContentLoaded", function () {


    // =====================================
    // SIDEBAR SECTION NAVIGATION
    // =====================================

    const sidebarLinks = document.querySelectorAll(
        ".sidebar-link[data-section]"
    );

    const dashboardSections = document.querySelectorAll(
        ".dashboard-section"
    );

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const targetId = this.dataset.section;
            const selectedSection = document.getElementById(targetId);

            if (!selectedSection) return;

            // Hide all dashboard sections
            dashboardSections.forEach(function (section) {
                section.hidden = true;
                section.classList.remove("active");
            });

            // Remove active sidebar styling
            sidebarLinks.forEach(function (item) {
                item.classList.remove("active");
                item.removeAttribute("aria-current");
            });

            // Display selected section
            selectedSection.hidden = false;
            selectedSection.classList.add("active");

            // Highlight selected link
            this.classList.add("active");
            this.setAttribute("aria-current", "page");

            selectedSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    // =====================================
    // MOBILE NAVIGATION MENU
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("show");

            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.textContent = isOpen ? "✕" : "☰";

        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("show");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";

            });

        });

    }


    // =====================================
    // ADDRESS BOOK - OPEN FORM
    // =====================================

    const addAddressButton = document.getElementById(
        "addAddressButton"
    );

    const addressForm = document.getElementById(
        "addressForm"
    );

    const cancelAddressButton = document.getElementById(
        "cancelAddressButton"
    );

    const addressId = document.getElementById(
        "addressId"
    );

    const addressMessage = document.getElementById(
        "addressMessage"
    );


    // Open the address form
    if (addAddressButton && addressForm) {

        addAddressButton.addEventListener("click", function () {

            // Reset the form for a new address
            addressForm.reset();

            if (addressId) {
                addressId.value = "";
            }

            if (addressMessage) {
                addressMessage.textContent = "";
            }

            // Show the form
            addressForm.hidden = false;

            // Change button text
            addAddressButton.textContent = "Address Form Open";

            // Scroll to the form
            addressForm.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        });

    }


    // =====================================
    // ADDRESS BOOK - CANCEL FORM
    // =====================================

    if (cancelAddressButton && addressForm) {

        cancelAddressButton.addEventListener("click", function () {

            addressForm.reset();
            addressForm.hidden = true;

            if (addressId) {
                addressId.value = "";
            }

            if (addressMessage) {
                addressMessage.textContent = "";
            }

            if (addAddressButton) {
                addAddressButton.textContent = "+ Add Address";
            }

        });

    }


    // =====================================
    // REPORT ISSUE FORM
    // =====================================

    const issueForm = document.getElementById("issueForm");
    const issueMessage = document.getElementById("issueMessage");

    if (issueForm && issueMessage) {

        issueForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!issueForm.checkValidity()) {
                issueForm.reportValidity();
                return;
            }

            issueMessage.textContent =
                "Your report has been prepared. Connect the PHP backend to submit it to Pilee Tech.";

            issueMessage.className = "form-message";

            issueForm.reset();

        });

        issueForm.addEventListener("reset", function () {
            issueMessage.textContent = "";
        });

    }

});

// PROFILE PICTURE PREVIEW

const profilePicture = document.getElementById("profilePicture");
const profilePreview = document.getElementById("profilePreview");

if (profilePicture && profilePreview) {

    profilePicture.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            alert("Please upload a JPG, PNG or WEBP image.");
            this.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Your image must be smaller than 5MB.");
            this.value = "";
            return;
        }

        profilePreview.src = URL.createObjectURL(file);

    });

}


document.addEventListener("DOMContentLoaded", function () {

    // Mobile navigation — same as About Us
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navigation");

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

    // Profile dropdown — same as About Us
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileBtn && profileDropdown) {

        function openProfileMenu() {
            profileDropdown.hidden = false;
            profileDropdown.classList.add("active");
            profileBtn.setAttribute("aria-expanded", "true");
        }

        function closeProfileMenu() {
            profileDropdown.classList.remove("active");
            profileDropdown.hidden = true;
            profileBtn.setAttribute("aria-expanded", "false");
        }

        profileBtn.addEventListener("click", function (event) {
            event.stopPropagation();

            const isOpen =
                profileBtn.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeProfileMenu();
            } else {
                openProfileMenu();
            }
        });

        profileDropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        document.addEventListener("click", function (event) {
            if (
                !profileBtn.contains(event.target) &&
                !profileDropdown.contains(event.target)
            ) {
                closeProfileMenu();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeProfileMenu();
                profileBtn.focus();
            }
        });
    }
});

/* =========================================
   MOBILE CUSTOMER SIDEBAR
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const sidebarToggle = document.getElementById("sidebarToggle");
    const customerSidebar = document.getElementById("customerSidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    if (!sidebarToggle || !customerSidebar || !sidebarOverlay) {
        return;
    }

    function openSidebar() {
        customerSidebar.classList.add("sidebar-open");
        sidebarOverlay.classList.add("overlay-visible");

        sidebarToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        customerSidebar.classList.remove("sidebar-open");
        sidebarOverlay.classList.remove("overlay-visible");

        sidebarToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    sidebarToggle.addEventListener("click", function () {
        const isOpen = customerSidebar.classList.contains("sidebar-open");

        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Close when the user clicks outside the sidebar
    sidebarOverlay.addEventListener("click", closeSidebar);

    // Close after selecting a sidebar option
    customerSidebar.querySelectorAll(".sidebar-link").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // Close with the Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    // Reset the sidebar when returning to desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });

});

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