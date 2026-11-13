// =========================================
// PILEE TECH GROUP
// STAFF DASHBOARD JAVASCRIPT
// =========================================



// =========================================
// CURRENT DATE
// =========================================

// Find the date element
const currentDate =
    document.getElementById("currentDate");


// Get today's date
const today = new Date();


// Format today's date
const formattedDate =
    today.toLocaleDateString("en-ZA", {

        weekday: "long",

        day: "numeric",

        month: "long"

    });


// Display today's date
currentDate.textContent =
    formattedDate;



// =========================================
// JOB VARIABLES
// =========================================

// Arrival time
let arrivalTime = null;


// Completion time
let completionTime = null;



// =========================================
// GET PAGE ELEMENTS
// =========================================

// Arrival slider
const arrivedSlider =
    document.getElementById(
        "arrivedSlider"
    );

const arrivedButton =
    document.getElementById(
        "arrivedButton"
    );


// Completion slider
const completedSlider =
    document.getElementById(
        "completedSlider"
    );

const completedButton =
    document.getElementById(
        "completedButton"
    );


// Job status
const jobStatus =
    document.getElementById(
        "jobStatus"
    );



// =========================================
// FORMAT TIME
// =========================================

function formatTime(date) {

    return date.toLocaleTimeString(
        "en-ZA",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}



// =========================================
// FORMAT DATE AND TIME
// =========================================

function formatDateTime(date) {

    return date.toLocaleString(
        "en-ZA",
        {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}



// =========================================
// CALCULATE TIME ON SITE
// =========================================

function calculateDuration(
    startTime,
    endTime
) {

    // Calculate difference
    const difference =
        endTime - startTime;


    // Convert milliseconds to minutes
    const totalMinutes =
        Math.floor(
            difference / 60000
        );


    // Calculate hours
    const hours =
        Math.floor(
            totalMinutes / 60
        );


    // Calculate remaining minutes
    const minutes =
        totalMinutes % 60;


    // Less than one hour
    if (hours === 0) {

        return minutes + " min";

    }


    // Exactly one or more hours
    if (minutes === 0) {

        return hours + " hr";

    }


    // Hours and minutes
    return (
        hours +
        " hr " +
        minutes +
        " min"
    );

}



// =========================================
// SWIPE FUNCTION
// =========================================

function createSwipe(
    slider,
    button,
    callback
) {


    let dragging = false;

    let startX = 0;


    // Calculate maximum movement
    function getMaxMove() {

        return (
            slider.offsetWidth -
            button.offsetWidth -
            4
        );

    }


    // -------------------------------------
    // START SWIPE
    // -------------------------------------

    button.addEventListener(
        "pointerdown",
        function(event) {

            dragging = true;

            startX =
                event.clientX;

            button.setPointerCapture(
                event.pointerId
            );

        }
    );


    // -------------------------------------
    // MOVE SWIPE
    // -------------------------------------

    button.addEventListener(
        "pointermove",
        function(event) {

            if (!dragging) {

                return;

            }


            // Calculate movement
            let distance =
                event.clientX -
                startX;


            // Don't allow movement backwards
            if (distance < 0) {

                distance = 0;

            }


            // Maximum movement
            const maxMove =
                getMaxMove();


            // Don't move outside container
            if (distance > maxMove) {

                distance = maxMove;

            }


            // Move button
            button.style.left =
                (distance + 2) + "px";

        }
    );


    // -------------------------------------
    // FINISH SWIPE
    // -------------------------------------

    button.addEventListener(
        "pointerup",
        function() {

            if (!dragging) {

                return;

            }


            dragging = false;


            const maxMove =
                getMaxMove();


            const currentPosition =
                parseInt(
                    button.style.left || "2"
                );


            // User swiped far enough
            if (
                currentPosition >=
                maxMove * 0.7
            ) {


                // Complete the swipe
                button.style.left =
                    (maxMove + 2) + "px";


                // Run function
                callback();


            }

            else {

                // Return button to start
                button.style.left =
                    "2px";

            }

        }
    );

}



// =========================================
// ARRIVED SWIPE
// =========================================

createSwipe(
    arrivedSlider,
    arrivedButton,
    function() {


        // Record arrival time
        arrivalTime =
            new Date();


        // Update heading
        document.getElementById(
            "arrivedTitle"
        ).textContent =
            "I've arrived";


        // Update arrival message
        document.getElementById(
            "arrivedTime"
        ).textContent =
            "Arrived at " +
            formatDateTime(
                arrivalTime
            );


        // Update arrival statistic
        document.getElementById(
            "arrivalStat"
        ).textContent =
            formatTime(
                arrivalTime
            );


        // Change arrival slider
        arrivedSlider.classList.add(
            "confirmed"
        );


        // Change button
        arrivedButton.textContent =
            "✓";


        // Change job status
        jobStatus.textContent =
            "In progress";


        // Change status colour
        jobStatus.classList.remove(
            "awaiting"
        );

        jobStatus.classList.add(
            "completed"
        );


        // Enable completed slider
        completedSlider.classList.remove(
            "disabled"
        );

    }
);



// =========================================
// COMPLETED SWIPE
// =========================================

createSwipe(
    completedSlider,
    completedButton,
    function() {


        // Make sure employee arrived
        if (!arrivalTime) {

            return;

        }


        // Record completion time
        completionTime =
            new Date();


        // Update heading
        document.getElementById(
            "completedTitle"
        ).textContent =
            "Job completed";


        // Update completion message
        document.getElementById(
            "completedTime"
        ).textContent =
            "Completed at " +
            formatDateTime(
                completionTime
            );


        // Update completion statistic
        document.getElementById(
            "completionStat"
        ).textContent =
            formatTime(
                completionTime
            );


        // Calculate time on site
        const duration =
            calculateDuration(
                arrivalTime,
                completionTime
            );


        // Display time on site
        document.getElementById(
            "durationStat"
        ).textContent =
            duration;


        // Change slider colour
        completedSlider.classList.add(
            "completed"
        );


        // Change button
        completedButton.textContent =
            "✓";


        // Change job status
        jobStatus.textContent =
            "Completed";


        // Change status colour
        jobStatus.classList.remove(
            "awaiting"
        );

        jobStatus.classList.add(
            "completed"
        );


        // Stop the button from being used again
        completedSlider.style.pointerEvents =
            "none";

    }
);



// =========================================
// ACCEPT JOB
// =========================================

function acceptJob() {

    const status =
        document.getElementById(
            "assignmentStatus"
        );


    status.textContent =
        "Accepted";


    status.classList.remove(
        "awaiting"
    );


    status.classList.add(
        "completed"
    );


    document.getElementById(
        "acceptButton"
    ).textContent =
        "✓ Accepted";


    document.getElementById(
        "acceptButton"
    ).disabled =
        true;


    document.getElementById(
        "declineButton"
    ).disabled =
        true;

}



// =========================================
// DECLINE JOB
// =========================================

function declineJob() {

    const confirmDecline =
        confirm(
            "Are you sure you want to decline this assignment?"
        );


    if (confirmDecline) {


        const status =
            document.getElementById(
                "assignmentStatus"
            );


        status.textContent =
            "Declined";


        status.classList.remove(
            "awaiting"
        );


        status.classList.add(
            "completed"
        );


        document.getElementById(
            "acceptButton"
        ).disabled =
            true;


        document.getElementById(
            "declineButton"
        ).disabled =
            true;

    }

}

// Get the current page filename
const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

// Find all sidebar links
const navLinks = document.querySelectorAll(".nav-link");

// Check each link
navLinks.forEach(function (link) {

    const linkPage = link.getAttribute("href");

    // Skip links that do not point to a page
    if (!linkPage || linkPage === "DashbordCleaner.html") {
        return;
    }

    // Highlight the link matching the current page
    if (linkPage.toLowerCase() === currentPage) {
        link.classList.add("active");
    } else {
        link.classList.remove("active");
    }

});
