
/* =========================================
   PILEE TECH GROUP - SCHEDULED BOOKINGS
   ========================================= */

// Sample booking data
const initialBookings = [
    {
       
];

// Working copy of bookings
let bookings = initialBookings.map(booking => ({
    ...booking
}));

let currentFilter = "week";
let selectedBookingId = null;

// Page elements
const rows = document.getElementById("bookingRows");
const pendingCount = document.getElementById("pendingCount");
const acceptedCount = document.getElementById("acceptedCount");
const declinedCount = document.getElementById("declinedCount");
const resultsText = document.getElementById("resultsText");
const liveMessage = document.getElementById("liveMessage");

// Decline modal elements
const declineModal = document.getElementById("declineModal");
const declineForm = document.getElementById("declineForm");
const declineReason = document.getElementById("declineReason");
const declineClient = document.getElementById("declineClient");
const declineError = document.getElementById("declineError");
const characterCount = document.getElementById("reasonCharacterCount");
const closeDeclineModal = document.getElementById("closeDeclineModal");
const cancelDecline = document.getElementById("cancelDecline");

// =========================================
// SAFELY DISPLAY TEXT
// =========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// =========================================
// DISPLAY BOOKINGS
// =========================================

function renderBookings() {
    const visibleBookings = bookings.filter(booking =>
        currentFilter === "week"
            ? booking.period === "week"
            : true
    );

    rows.innerHTML = "";

    if (visibleBookings.length === 0) {
        rows.innerHTML = `
            <tr>
                <td class="empty-row" colspan="4">
                    No bookings found for this period.
                </td>
            </tr>
        `;
    } else {
        visibleBookings.forEach(booking => {
            const row = document.createElement("tr");
            let actionHTML = "";

            if (booking.status === "pending") {
                actionHTML = `
                    <div class="action-buttons">
                        <button
                            class="accept-button"
                            type="button"
                            data-action="accept"
                            data-id="${booking.id}"
                            aria-label="Accept booking for ${escapeHTML(booking.client)}">
                            Accept
                        </button>

                        <button
                            class="decline-button"
                            type="button"
                            data-action="decline"
                            data-id="${booking.id}"
                            aria-label="Decline booking for ${escapeHTML(booking.client)}">
                            Decline
                        </button>
                    </div>
                `;
            } else if (booking.status === "accepted") {
                actionHTML = `
                    <span class="status-pill status-accepted">
                        Accepted
                    </span>
                `;
            } else {
                actionHTML = `
                    <div class="declined-details">
                        <span class="status-pill status-declined">
                            Declined
                        </span>

                        <p class="decline-reason-display">
                            <strong>Reason:</strong>
                            ${escapeHTML(booking.declineReason || "No reason provided")}
                        </p>
                    </div>
                `;
            }

            row.innerHTML = `
                <td>
                    <span class="date-main">
                        ${escapeHTML(booking.day)}
                    </span>
                    <span class="date-time">
                        ${escapeHTML(booking.time)}
                    </span>
                </td>

                <td>
                    <span class="service-name">
                        ${escapeHTML(booking.service)}
                    </span>
                    <span class="service-location">
                        ${escapeHTML(booking.location)}
                    </span>
                </td>

                <td>
                    <span class="client-name">
                        ${escapeHTML(booking.client)}
                    </span>
                </td>

                <td>${actionHTML}</td>
            `;

            rows.appendChild(row);
        });
    }

    updateStatistics();
}

// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics() {
    pendingCount.textContent = bookings.filter(
        booking => booking.status === "pending"
    ).length;

    acceptedCount.textContent = bookings.filter(
        booking => booking.status === "accepted"
    ).length;

    declinedCount.textContent = bookings.filter(
        booking => booking.status === "declined"
    ).length;

    const visibleCount = bookings.filter(booking =>
        currentFilter === "week"
            ? booking.period === "week"
            : true
    ).length;

    resultsText.textContent =
        `Showing ${visibleCount} booking${visibleCount === 1 ? "" : "s"}`;
}

// =========================================
// OPEN DECLINE EXPLANATION
// =========================================

function openDeclineModal(booking) {
    selectedBookingId = booking.id;

    declineClient.textContent = booking.client;
    declineReason.value = "";
    declineError.hidden = true;
    characterCount.textContent = "0/500";

    declineModal.hidden = false;
    declineModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    declineReason.focus();
}

// =========================================
// CLOSE DECLINE EXPLANATION
// =========================================

function closeModal() {
    declineModal.hidden = true;
    declineModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    selectedBookingId = null;
    declineForm.reset();
    declineError.hidden = true;
    characterCount.textContent = "0/500";
}

// Close using the X button
closeDeclineModal.addEventListener("click", closeModal);

// Close using Cancel
cancelDecline.addEventListener("click", closeModal);

// Close when clicking outside the modal
declineModal.addEventListener("click", event => {
    if (event.target === declineModal) {
        closeModal();
    }
});

// Close using Escape
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !declineModal.hidden) {
        closeModal();
    }
});

// =========================================
// CHARACTER COUNTER
// =========================================

declineReason.addEventListener("input", () => {
    characterCount.textContent =
        `${declineReason.value.length}/500`;

    if (declineReason.value.trim().length >= 5) {
        declineError.hidden = true;
    }
});

// =========================================
// ACCEPT OR OPEN DECLINE MODAL
// =========================================

rows.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const bookingId = Number(button.dataset.id);

    const booking = bookings.find(
        item => item.id === bookingId
    );

    // Only pending bookings can be updated
    if (!booking || booking.status !== "pending") {
        return;
    }

    if (button.dataset.action === "accept") {
        booking.status = "accepted";
        booking.declineReason = "";

        liveMessage.textContent =
            `Booking for ${booking.client} accepted.`;

        renderBookings();
    }

    if (button.dataset.action === "decline") {
        openDeclineModal(booking);
    }
});

// =========================================
// CONFIRM DECLINE AND SAVE REASON
// =========================================

declineForm.addEventListener("submit", event => {
    event.preventDefault();

    const reason = declineReason.value.trim();

    if (reason.length < 5 || reason.length > 500) {
        declineError.textContent =
            "Please enter a reason between 5 and 500 characters.";

        declineError.hidden = false;
        declineReason.focus();
        return;
    }

    const booking = bookings.find(
        item => item.id === selectedBookingId
    );

    if (!booking || booking.status !== "pending") {
        closeModal();
        return;
    }

    // Record the decline and its explanation
    booking.status = "declined";
    booking.declineReason = reason;

    liveMessage.textContent =
        `Booking for ${booking.client} declined. Reason: ${reason}`;

    closeModal();
    renderBookings();
});

// =========================================
// FILTER BOOKINGS
// =========================================

document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll("[data-filter]").forEach(
            filterButton => {
                const active = filterButton === button;

                filterButton.classList.toggle("active", active);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(active)
                );
            }
        );

        renderBookings();
    });
});

// =========================================
// RESET DEMO BOOKINGS
// =========================================

document.getElementById("resetButton").addEventListener("click", () => {
    closeModal();

    bookings = initialBookings.map(booking => ({
        ...booking
    }));

    currentFilter = "week";

    document.querySelectorAll("[data-filter]").forEach(button => {
        const active = button.dataset.filter === "week";

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    liveMessage.textContent = "Demo bookings have been reset.";

    renderBookings();
});

// =========================================
// DISPLAY LOGGED-IN STAFF NAME
// =========================================

try {
    const firstName = sessionStorage.getItem("staffName");
    const surname = sessionStorage.getItem("staffSurname");

    if (firstName || surname) {
        document.getElementById("staffName").textContent =
            [firstName, surname].filter(Boolean).join(" ");
    }
} catch (error) {
    // The page still works if sessionStorage is unavailable.
}

// =========================================
// INITIALISE PAGE
// =========================================

renderBookings();
