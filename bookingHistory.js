
/* =========================================================
   PILEE TECH GROUP
   CUSTOMER BOOKINGS AND REVIEWS
   DATABASE CONNECTED VERSION
========================================================= */

"use strict";

/* =========================================================
   1. API ENDPOINTS
========================================================= */



const API = {
    bookings: "api/customer-bookings.php",
    cancel: "api/cancel-booking.php",
    review: "api/submit-review.php"
};


/* =========================================================
   2. APPLICATION STATE
========================================================= */

let bookings = [];

let activeTab = "upcoming";

let currentBookingId = null;

let currentCleanerRating = 0;
let currentServiceRating = 0;
let currentRecommendation = 0;

let loading = false;


/* =========================================================
   3. GET HTML ELEMENTS
========================================================= */

const list = document.getElementById("booking-list");

const modal = document.getElementById("review-modal");

const reviewForm = document.getElementById("review-form");

const commentBox = document.getElementById("review-comment");

const commentCount = document.getElementById("comment-count");

const formError = document.getElementById("form-error");


/* =========================================================
   4. API REQUEST HANDLER
========================================================= */

async function apiRequest(url, options = {}) {

    const response = await fetch(url, {
        credentials: "same-origin",

        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },

        ...options
    });

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error("The server returned an invalid response.");
    }

    if (!response.ok || data.success === false) {
        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}


/* =========================================================
   5. LOAD BOOKINGS FROM MYSQL DATABASE
========================================================= */

async function loadBookings() {

    if (loading) return;

    loading = true;

    list.innerHTML = `
        <div class="empty-state">
            <p>Loading your bookings...</p>
        </div>
    `;

    try {

        const data = await apiRequest(API.bookings, {
            method: "GET"
        });

        /*
           Expected PHP response:

           {
               "success": true,
               "bookings": [
                   {
                       "id": "PT-1101",
                       "service": "Standard home clean",
                       "category": "Home cleaning",
                       "price": 550,
                       "status": "confirmed",
                       "date": "2026-11-15",
                       "time": "09:00",
                       "location": "Midrand, Johannesburg",
                       "details": "2 bedrooms, 2 bathrooms",
                       "cleaner": "Nomsa Dlamini",
                       "review": null
                   }
               ]
           }
        */

        bookings = (data.bookings || []).map(normaliseBooking);

        renderBookings();

    } catch (error) {

        console.error("Booking loading error:", error);

        list.innerHTML = `
            <div class="empty-state">
                <h3>Unable to load bookings</h3>

                <p>
                    ${escapeHTML(error.message)}
                </p>

                <button
                    class="primary-button"
                    onclick="loadBookings()">
                    Try again
                </button>
            </div>
        `;

    } finally {

        loading = false;

    }
}


/* =========================================================
   6. NORMALISE DATABASE BOOKING DATA
========================================================= */

function normaliseBooking(booking) {

    const status = String(
        booking.status || "requested"
    ).toLowerCase().replace(/_/g, "-");

    const review = booking.review || null;

    let tab = "upcoming";

    if (status === "completed") {

        tab = "past";

    } else if (status === "cancelled") {

        tab = "cancelled";

    }

    return {

        id: booking.id ?? booking.booking_id,

        service: booking.service ?? booking.service_name ?? "",

        category: booking.category ?? booking.service_category ?? "",

        price: Number(booking.price ?? booking.total_price ?? 0),

        status,

        date: booking.date ?? booking.booking_date ?? "",

        time: booking.time ?? booking.booking_time ?? "",

        location: booking.location ?? booking.address ?? "",

        details: booking.details ?? booking.booking_details ?? "",

        cleaner: booking.cleaner ?? booking.cleaner_name ?? "Not assigned",

        review,

        tab

    };

}


/* =========================================================
   7. HELPER FUNCTIONS
========================================================= */

function escapeHTML(value = "") {

    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));

}


function money(value) {

    return new Intl.NumberFormat("en-ZA", {

        style: "currency",

        currency: "ZAR",

        maximumFractionDigits: 2

    }).format(Number(value) || 0);

}


function statusText(status) {

    const statuses = {

        requested: "Requested",

        confirmed: "Confirmed",

        "in-progress": "In progress",

        completed: "Completed",

        cancelled: "Cancelled"

    };

    return statuses[status] || status;

}


function starString(value) {

    const rating = Math.max(
        0,
        Math.min(5, Number(value) || 0)
    );

    return "★".repeat(rating) +
           "☆".repeat(5 - rating);

}


/* =========================================================
   8. BOOKING PROGRESS TRACKER
========================================================= */

function progressHTML(booking) {

    const steps = [
        "Requested",
        "Confirmed",
        "In progress",
        "Completed"
    ];

    const progressMap = {

        requested: 0,

        confirmed: 1,

        "in-progress": 2,

        completed: 3

    };

    const currentProgress = progressMap[booking.status] ?? 0;

    return `
        <div class="progress" aria-label="Booking progress">

            ${steps.map((step, index) => {

                let state = "";

                if (index < currentProgress) {

                    state = "done";

                } else if (index === currentProgress) {

                    state = "current";

                }

                return `
                    <div class="progress-step ${state}">

                        <span class="progress-dot"></span>

                        <span>${step}</span>

                    </div>
                `;

            }).join("")}

        </div>
    `;

}


/* =========================================================
   9. DISPLAY SAVED REVIEW
========================================================= */

function reviewHTML(review) {

    return `
        <div class="review-saved">

            <div class="review-saved-head">

                <strong>
                    <span class="saved-stars">
                        ${starString(review.cleanerRating)}
                    </span>

                    Your submitted review
                </strong>

                <span class="review-locked">
                    <i class="fa-solid fa-lock"></i>
                    Submitted
                </span>

            </div>


            <div class="saved-ratings">

                <span>
                    Cleaner:
                    <b>${Number(review.cleanerRating)}/5</b>
                </span>

                <span>
                    Service:
                    <b>${Number(review.serviceRating)}/5</b>
                </span>

            </div>


            ${
                review.comment
                    ? `
                        <p class="review-comment">
                            ${escapeHTML(review.comment)}
                        </p>
                    `
                    : ""
            }


            <p class="recommend-score">

                Recommendation:

                <strong>
                    ${Number(review.recommendation)}/10
                </strong>

            </p>


            <p class="review-note">
                Thank you for your feedback.
                Submitted reviews cannot be edited.
            </p>

        </div>
    `;

}


/* =========================================================
   10. BOOKING ACTION BUTTONS
========================================================= */

function bookingActions(booking) {

    const reviewed = Boolean(booking.review);

    /* -------------------------------------
       COMPLETED BOOKINGS
    ------------------------------------- */

    if (booking.status === "completed") {

        if (reviewed) {

            return `
                <a class="secondary-button" href="services.html">
                    Book again
                </a>
            `;

        }

        return `
            <button
                type="button"
                class="primary-button rate-review"
                data-review="${escapeHTML(booking.id)}">

                ★ Rate your cleaning

            </button>
        `;

    }


    /* -------------------------------------
       CANCELLED BOOKINGS
    ------------------------------------- */

    if (booking.status === "cancelled") {

        return `
            <a class="secondary-button" href="services.html">
                Book again
            </a>
        `;

    }


    /* -------------------------------------
       IN-PROGRESS BOOKINGS
       ACTIONS ARE DISABLED
    ------------------------------------- */

    if (booking.status === "in-progress") {

        return `

            <button
                type="button"
                class="secondary-button action-disabled"
                disabled
                aria-disabled="true">

                Reschedule

            </button>


            <button
                type="button"
                class="danger-button action-disabled"
                disabled
                aria-disabled="true">

                Cancel booking

            </button>


            <button
                type="button"
                class="secondary-button"
                data-action="support"
                data-id="${escapeHTML(booking.id)}">

                Contact support

            </button>


            <p class="booking-restriction">

                This booking is currently in progress.
                Cancellation and rescheduling are unavailable.

            </p>

        `;

    }


    /* -------------------------------------
       REQUESTED AND CONFIRMED BOOKINGS
    ------------------------------------- */

    return `

        <button
            type="button"
            class="secondary-button"
            data-action="reschedule"
            data-id="${escapeHTML(booking.id)}">

            Reschedule

        </button>


        <button
            type="button"
            class="danger-button"
            data-action="cancel"
            data-id="${escapeHTML(booking.id)}">

            Cancel booking

        </button>


        <button
            type="button"
            class="secondary-button"
            data-action="support"
            data-id="${escapeHTML(booking.id)}">

            Contact support

        </button>

    `;

}


/* =========================================================
   11. CREATE BOOKING CARD
========================================================= */

function bookingHTML(booking) {

    const completed = booking.status === "completed";

    const cancelled = booking.status === "cancelled";

    const review = booking.review;


    return `

        <article class="booking-card">


            <!-- BOOKING HEADER -->

            <div class="booking-top">

                <div>

                    <h2 class="booking-title">

                        ${escapeHTML(booking.service)}

                    </h2>


                    <p class="booking-subtitle">

                        ${escapeHTML(booking.category)}

                        · Ref ${escapeHTML(booking.id)}

                    </p>


                    <span class="status ${escapeHTML(booking.status)}">

                        ${escapeHTML(statusText(booking.status))}

                    </span>

                </div>


                <div class="booking-price">

                    ${money(booking.price)}

                </div>

            </div>


            <!-- BOOKING PROGRESS -->

            ${
                !cancelled
                    ? progressHTML(booking)
                    : ""
            }


            <!-- BOOKING INFORMATION -->

            <div class="booking-details">


                <div>

                    <span class="detail-label">
                        DATE &amp; TIME
                    </span>

                    <span class="detail-value">

                        ${escapeHTML(booking.date)}

                        · ${escapeHTML(booking.time)}

                    </span>

                </div>


                <div>

                    <span class="detail-label">
                        LOCATION
                    </span>

                    <span class="detail-value">

                        ${escapeHTML(booking.location)}

                    </span>

                </div>


                <div>

                    <span class="detail-label">
                        DETAILS
                    </span>

                    <span class="detail-value">

                        ${escapeHTML(booking.details)}

                    </span>

                </div>


                <div>

                    <span class="detail-label">
                        YOUR CLEANER
                    </span>

                    <span class="detail-value">

                        ${escapeHTML(booking.cleaner)}

                    </span>

                </div>


            </div>


            <!-- BOOKING ACTIONS -->

            <div class="booking-actions">

                ${bookingActions(booking)}

            </div>


            <!-- READ-ONLY REVIEW -->

            ${
                completed && review
                    ? reviewHTML(review)
                    : ""
            }


        </article>

    `;

}


/* =========================================================
   12. RENDER BOOKINGS
========================================================= */

function renderBookings() {

    const upcoming = bookings.filter(
        b => b.tab === "upcoming"
    );

    const past = bookings.filter(
        b => b.tab === "past"
    );

    const cancelled = bookings.filter(
        b => b.tab === "cancelled"
    );


    /* UPDATE TAB COUNTS */

    document.getElementById("upcoming-count").textContent =
        `(${upcoming.length})`;

    document.getElementById("past-count").textContent =
        `(${past.length})`;

    document.getElementById("cancelled-count").textContent =
        `(${cancelled.length})`;


    /* GET ACTIVE BOOKINGS */

    const visible = bookings.filter(
        booking => booking.tab === activeTab
    );


    /* EMPTY STATE */

    if (visible.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                <h3>No ${activeTab} bookings</h3>

                <p>
                    Your ${activeTab} cleaning bookings
                    will appear here.
                </p>

                <a class="primary-button" href="services.html">
                    + New booking
                </a>

            </div>

        `;

        return;

    }


    /* DISPLAY BOOKINGS */

    list.innerHTML = visible.map(bookingHTML).join("");

}


/* =========================================================
   13. RATING CONTROLS
========================================================= */

function makeStarControls() {

    document.querySelectorAll(".star-rating").forEach(group => {

        group.innerHTML = [1, 2, 3, 4, 5].map(value => `

            <button

                type="button"

                class="star-button"

                data-value="${value}"

                aria-label="${value} stars"

                aria-pressed="false">

                ★

            </button>

        `).join("");

    });

}


function makeRecommendationScale() {

    document.getElementById("recommend-scale").innerHTML =

        Array.from(
            { length: 10 },
            (_, index) => index + 1
        )

        .map(value => `

            <button

                type="button"

                class="recommend-button"

                data-value="${value}"

                aria-pressed="false">

                ${value}

            </button>

        `)

        .join("");

}


/* =========================================================
   14. SET STAR RATINGS
========================================================= */

function setStarRating(type, value) {

    if (type === "cleaner") {

        currentCleanerRating = value;

    } else {

        currentServiceRating = value;

    }


    const group = document.querySelector(
        `.star-rating[data-rating="${type}"]`
    );

    if (!group) return;


    group.querySelectorAll(".star-button").forEach(button => {

        const selected =
            Number(button.dataset.value) <= value;

        button.classList.toggle("selected", selected);

        button.setAttribute(
            "aria-pressed",
            String(Number(button.dataset.value) === value)
        );

    });

}


/* =========================================================
   15. SET RECOMMENDATION SCORE
========================================================= */

function setRecommendation(value) {

    currentRecommendation = value;

    document.querySelectorAll(".recommend-button").forEach(button => {

        const selected =
            Number(button.dataset.value) === value;

        button.classList.toggle("selected", selected);

        button.setAttribute(
            "aria-pressed",
            String(selected)
        );

    });

}


/* =========================================================
   16. OPEN REVIEW MODAL
========================================================= */

function openReview(bookingId) {

    const booking = bookings.find(
        item => String(item.id) === String(bookingId)
    );


    // Only completed bookings without an existing review qualify.

    if (
        !booking ||
        booking.status !== "completed" ||
        booking.review
    ) {

        showToast("This booking is not eligible for another review.");

        return;

    }


    currentBookingId = bookingId;

    currentCleanerRating = 0;

    currentServiceRating = 0;

    currentRecommendation = 0;


    /* BOOKING INFORMATION */

    document.getElementById("review-booking-id").value =
        bookingId;


    document.getElementById("review-title").textContent =
        "Rate your cleaning";


    document.getElementById("save-review").textContent =
        "Submit review";


    document.getElementById("review-booking-summary").innerHTML = `

        <strong>${escapeHTML(booking.service)}</strong>

        · Ref ${escapeHTML(booking.id)}

        <br>

        ${escapeHTML(booking.date)}

        · ${escapeHTML(booking.location)}

    `;


    document.getElementById("cleaner-name").textContent =

        booking.cleaner &&
        booking.cleaner !== "Not assigned"

            ? `(${booking.cleaner})`

            : "(your cleaner)";


    /* RESET FORM */

    reviewForm.reset();

    commentCount.textContent = "0";

    formError.textContent = "";


    /* CREATE RATING CONTROLS */

    makeStarControls();

    makeRecommendationScale();


    /* SHOW MODAL */

    modal.classList.add("open");

    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    document.getElementById("close-modal").focus();

}


/* =========================================================
   17. CLOSE REVIEW MODAL
========================================================= */

function closeReview() {

    modal.classList.remove("open");

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    currentBookingId = null;

}


/* =========================================================
   18. SUCCESS AND ERROR NOTIFICATIONS
========================================================= */

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    window.setTimeout(() => {

        toast.classList.remove("show");

    }, 2600);

}


/* =========================================================
   19. SWITCH BOOKING TABS
========================================================= */

document.querySelectorAll(".tab").forEach(tab => {

    tab.addEventListener("click", () => {

        activeTab = tab.dataset.tab;

        document.querySelectorAll(".tab").forEach(item => {

            const selected = item === tab;

            item.classList.toggle("active", selected);

            item.setAttribute(
                "aria-selected",
                String(selected)
            );

        });

        renderBookings();

    });

});


/* =========================================================
   20. HANDLE BOOKING ACTIONS
========================================================= */

list.addEventListener("click", async event => {


    /* -------------------------------------
       REVIEW BUTTON
    ------------------------------------- */

    const reviewButton = event.target.closest("[data-review]");

    if (reviewButton) {

        openReview(reviewButton.dataset.review);

        return;

    }


    /* -------------------------------------
       OTHER BOOKING ACTIONS
    ------------------------------------- */

    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    const booking = bookings.find(
        item => String(item.id) === String(actionButton.dataset.id)
    );

    if (!booking) return;


    const action = actionButton.dataset.action;


    /* -------------------------------------
       SUPPORT
    ------------------------------------- */

    if (action === "support") {

        window.location.href = "contact.html";

        return;

    }


    /* -------------------------------------
       BLOCK CANCEL AND RESCHEDULE
       WHEN BOOKING IS IN PROGRESS
    ------------------------------------- */

    if (booking.status === "in-progress") {

        showToast(
            "This booking is in progress. Changes are unavailable."
        );

        return;

    }


    /* -------------------------------------
       CANCEL BOOKING
    ------------------------------------- */

    if (action === "cancel") {

        if (
            !["requested", "confirmed"].includes(booking.status)
        ) {

            showToast("This booking can no longer be cancelled.");

            return;

        }


        const confirmed = confirm(
            `Are you sure you want to cancel booking ${booking.id}?`
        );

        if (!confirmed) return;


        actionButton.disabled = true;


        try {

            const result = await apiRequest(API.cancel, {

                method: "POST",

                body: JSON.stringify({

                    booking_id: booking.id

                })

            });


            showToast(
                result.message || "Booking cancelled successfully."
            );


            // Reload the latest status from the database.

            await loadBookings();

        } catch (error) {

            console.error(error);

            showToast(error.message);

            actionButton.disabled = false;

        }

        return;

    }


    /* -------------------------------------
       RESCHEDULE BOOKING
    ------------------------------------- */

    if (action === "reschedule") {

        if (
            !["requested", "confirmed"].includes(booking.status)
        ) {

            showToast("This booking cannot be rescheduled.");

            return;

        }


        alert(
            "Please contact Pilee Tech Group to request a reschedule."
        );

    }

});


/* =========================================================
   21. HANDLE CLEANER AND SERVICE RATINGS
========================================================= */

document.querySelectorAll(".star-rating").forEach(group => {

    group.addEventListener("click", event => {

        const button = event.target.closest(".star-button");

        if (!button) return;

        setStarRating(
            group.dataset.rating,
            Number(button.dataset.value)
        );

    });

});


/* =========================================================
   22. HANDLE RECOMMENDATION SCORE
========================================================= */

document.getElementById("recommend-scale")

    .addEventListener("click", event => {

        const button = event.target.closest(".recommend-button");

        if (!button) return;

        setRecommendation(
            Number(button.dataset.value)
        );

    });


/* =========================================================
   23. COMMENT CHARACTER COUNTER
========================================================= */

commentBox.addEventListener("input", () => {

    commentCount.textContent = commentBox.value.length;

});


/* =========================================================
   24. SUBMIT REVIEW TO MYSQL DATABASE
========================================================= */

reviewForm.addEventListener("submit", async event => {

    event.preventDefault();


    /* VALIDATE RATINGS */

    if (
        !currentCleanerRating ||
        !currentServiceRating ||
        !currentRecommendation
    ) {

        formError.textContent =
            "Please complete all ratings before submitting.";

        return;

    }


    const booking = bookings.find(
        item => String(item.id) === String(currentBookingId)
    );


    /* VERIFY COMPLETED BOOKING */

    if (!booking || booking.status !== "completed") {

        formError.textContent =
            "Only completed bookings can be reviewed.";

        return;

    }


    /* PREVENT DUPLICATE REVIEWS */

    if (booking.review) {

        formError.textContent =
            "You have already submitted a review for this booking.";

        return;

    }


    const submitButton = document.getElementById("save-review");

    submitButton.disabled = true;

    submitButton.textContent = "Submitting...";


    /* REVIEW DATA */

    const reviewData = {

        booking_id: currentBookingId,

        cleaner_rating: currentCleanerRating,

        service_rating: currentServiceRating,

        recommendation: currentRecommendation,

        comment: commentBox.value.trim()

    };


    try {

        const result = await apiRequest(API.review, {

            method: "POST",

            body: JSON.stringify(reviewData)

        });


        closeReview();


        showToast(
            result.message || "Thank you. Your review has been submitted."
        );


        // Reload bookings and reviews from MySQL.

        await loadBookings();


    } catch (error) {

        console.error("Review submission error:", error);

        formError.textContent = error.message;

    } finally {

        submitButton.disabled = false;

        submitButton.textContent = "Submit review";

    }

});


/* =========================================================
   25. MODAL CLOSE BUTTON
========================================================= */

document.getElementById("close-modal")

    .addEventListener("click", closeReview);


document.getElementById("cancel-review")

    .addEventListener("click", closeReview);


/* =========================================================
   26. CLOSE MODAL WHEN BACKGROUND IS CLICKED
========================================================= */

modal.addEventListener("click", event => {

    if (event.target === modal) {

        closeReview();

    }

});


/* =========================================================
   27. CLOSE MODAL WITH ESCAPE KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        modal.classList.contains("open")
    ) {

        closeReview();

    }

});


/* =========================================================
   28. INITIALISE PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadBookings();

});
