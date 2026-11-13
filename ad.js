
/* =========================================================
   PILEE CLEANING
   CLEANING PARTNER RECRUITMENT PAGE
   JAVASCRIPT
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       1. SCROLL REVEAL ANIMATION
    ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    // Check whether the browser supports IntersectionObserver
    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        // Reveal the section when it enters the screen
                        entry.target.classList.add("in");

                        // Stop observing once the animation is complete
                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.1
            }
        );

        revealElements.forEach(function (element) {
            observer.observe(element);
        });

    } else {

        // Fallback for older browsers
        revealElements.forEach(function (element) {
            element.classList.add("in");
        });

    }


    /* =====================================================
       2. MODAL FUNCTION
    ===================================================== */

    function wireModal(modalId, openers, closerId) {

        const modal = document.getElementById(modalId);
        const closeButton = document.getElementById(closerId);

        // Stop if the required modal elements do not exist
        if (!modal || !closeButton) {
            return;
        }


        // OPEN MODAL
        openers.forEach(function (button) {

            if (!button) {
                return;
            }

            button.addEventListener("click", function () {

                modal.classList.add("on");

                // Prevent background scrolling
                document.body.style.overflow = "hidden";

            });

        });


        // CLOSE MODAL USING CLOSE BUTTON
        closeButton.addEventListener("click", function () {

            modal.classList.remove("on");

            document.body.style.overflow = "";

        });


        // CLOSE MODAL WHEN CLICKING OUTSIDE THE CONTENT
        modal.addEventListener("click", function (event) {

            if (event.target === modal) {

                modal.classList.remove("on");

                document.body.style.overflow = "";

            }

        });

    }


    /* =====================================================
       3. APPLICATION MODAL
    ===================================================== */

    const applyButtons = Array.from(
        document.querySelectorAll("[data-apply]")
    );

    wireModal(
        "modal",
        applyButtons,
        "close"
    );


    /* =====================================================
       4. CONTACT MODAL
    ===================================================== */

    const contactButton = document.getElementById("contactBtn");

    wireModal(
        "cmodal",
        [contactButton],
        "cclose"
    );


    /* =====================================================
       5. CLOSE MODALS USING ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {

            // Close application modal
            const applicationModal = document.getElementById("modal");

            if (applicationModal) {
                applicationModal.classList.remove("on");
            }


            // Close contact modal
            const contactModal = document.getElementById("cmodal");

            if (contactModal) {
                contactModal.classList.remove("on");
            }


            // Restore page scrolling
            document.body.style.overflow = "";

        }

    });


})();
