
document.addEventListener("DOMContentLoaded", function () {

    // MOBILE NAVIGATION
    const menuToggle = document.getElementById("menuToggle");
    const mainNavigation = document.getElementById("mainNavigation");

    if (menuToggle && mainNavigation) {

        menuToggle.addEventListener("click", function () {

            const isOpen = mainNavigation.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", isOpen);

        });

    }

    // PROFILE DROPDOWN
    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileBtn && profileDropdown) {

        profileBtn.addEventListener("click", function () {

            const isOpen = profileBtn.getAttribute("aria-expanded") === "true";

            profileBtn.setAttribute("aria-expanded", !isOpen);
            profileDropdown.hidden = isOpen;

        });

        // CLOSE WHEN CLICKING OUTSIDE
        document.addEventListener("click", function (event) {

            if (
                !profileBtn.contains(event.target) &&
                !profileDropdown.contains(event.target)
            ) {

                profileDropdown.hidden = true;
                profileBtn.setAttribute("aria-expanded", "false");

            }

        });

        // CLOSE WITH ESCAPE
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                profileDropdown.hidden = true;
                profileBtn.setAttribute("aria-expanded", "false");

            }

        });

    }

});


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