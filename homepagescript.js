
document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // 1. MOBILE NAVIGATION
    // =========================================

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

        // Close mobile navigation after selecting a link
        navigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("open");

                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Open navigation");

            });

        });

    }


    // =========================================
    // 2. CUSTOMER PROFILE DROPDOWN
    // =========================================

    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileBtn && profileDropdown) {

        // Open the dropdown
        function openProfileMenu() {

            profileDropdown.hidden = false;

            profileDropdown.classList.add("active");

            profileBtn.setAttribute("aria-expanded", "true");

        }

        // Close the dropdown
        function closeProfileMenu() {

            profileDropdown.classList.remove("active");

            profileDropdown.hidden = true;

            profileBtn.setAttribute("aria-expanded", "false");

        }

        // Toggle dropdown when profile icon is clicked
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

        // Keep dropdown open when clicking inside it
        profileDropdown.addEventListener("click", function (event) {

            event.stopPropagation();

        });

        // Close dropdown when clicking outside
        document.addEventListener("click", function (event) {

            if (
                !profileBtn.contains(event.target) &&
                !profileDropdown.contains(event.target)
            ) {

                closeProfileMenu();

            }

        });

        // Close dropdown using Escape key
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                closeProfileMenu();

                profileBtn.focus();

            }

        });

    }


    // =========================================
    // 3. FOOTER YEAR
    // =========================================

    const yearElement = document.getElementById("year");

    if (yearElement) {

        yearElement.textContent = new Date().getFullYear();

    }


    // =========================================
    // 4. ACTIVE NAVIGATION SECTION
    // =========================================

    const sections = document.querySelectorAll("main section[id]");

    const navLinks = document.querySelectorAll(
        '.navigation a[href^="#"]'
    );

    if (
        "IntersectionObserver" in window &&
        sections.length > 0 &&
        navLinks.length > 0
    ) {

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const sectionId = entry.target.getAttribute("id");

                    navLinks.forEach(function (link) {

                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${sectionId}`
                        );

                    });

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );

        sections.forEach(function (section) {

            observer.observe(section);

        });

    }

});
