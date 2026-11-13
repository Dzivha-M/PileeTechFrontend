/* ==========================================
   PILEE TECH GROUP - SCHEDULED BOOKINGS
========================================== */

// Get page elements
const searchInput = document.getElementById("bookingSearch");
const statusFilter = document.getElementById("statusFilter");
const bookingCards = Array.from(
    document.querySelectorAll(".booking-card")
);
const emptyState = document.getElementById("emptyState");

// ==========================================
// SEARCH AND FILTER BOOKINGS
// ==========================================

function filterBookings() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;

    let visibleCount = 0;

    bookingCards.forEach(function (card) {
        const matchesSearch = card.textContent
            .toLowerCase()
            .includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            card.dataset.status === selectedStatus;

        const isVisible = matchesSearch && matchesStatus;

        card.hidden = !isVisible;

        if (isVisible) {
            visibleCount++;
        }
    });

    // Show a message if no bookings match
    emptyState.hidden = visibleCount > 0;
}

// ==========================================
// UPDATE SUMMARY COUNTS
// ==========================================

function updateSummary() {
    const totalCount = document.getElementById("totalCount");
    const confirmedCount = document.getElementById("confirmedCount");
    const pendingCount = document.getElementById("pendingCount");

    totalCount.textContent = bookingCards.length;

    confirmedCount.textContent = bookingCards.filter(function (card) {
        return card.dataset.status === "confirmed";
    }).length;

    pendingCount.textContent = bookingCards.filter(function (card) {
        return card.dataset.status === "pending";
    }).length;
}

// ==========================================
// PRINT AN INDIVIDUAL BOOKING
// ==========================================

document.querySelectorAll(".print-button").forEach(function (button) {
    button.addEventListener("click", function () {
        const booking = button.closest(".booking-card");
        const printWindow = window.open("", "_blank");

        if (!printWindow) {
            alert("Please allow pop-ups to print the booking.");
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Print Booking</title>

                <style>
                    body {
                        font-family: Arial, Helvetica, sans-serif;
                        padding: 25px;
                        color: #102b49;
                    }

                    h3, h4 {
                        color: #061a2d;
                    }

                    .booking-top {
                        display: flex;
                        justify-content: space-between;
                        gap: 15px;
                        padding-bottom: 15px;
                        border-bottom: 1px solid #dce6ee;
                    }

                    .booking-reference {
                        color: #0879bd;
                        font-weight: bold;
                    }

                    .status {
                        font-weight: bold;
                    }

                    .booking-content {
                        margin-top: 20px;
                    }

                    .detail-grid {
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        gap: 20px;
                    }

                    .detail-item {
                        margin-bottom: 12px;
                        overflow-wrap: anywhere;
                    }

                    label {
                        display: block;
                        margin-bottom: 5px;
                        color: #5d7084;
                        font-size: 12px;
                    }

                    p {
                        font-size: 13px;
                        line-height: 1.5;
                    }

                    .service-section,
                    .instructions {
                        margin-top: 20px;
                    }

                    .service-tag {
                        display: inline-block;
                        margin: 4px;
                        padding: 6px;
                        border: 1px solid #dce6ee;
                    }

                    .instructions {
                        padding: 12px;
                        border: 1px solid #dce6ee;
                    }

                    .booking-actions,
                    button {
                        display: none !important;
                    }

                    @media print {
                        body {
                            padding: 0;
                        }
                    }

                    @media (max-width: 600px) {
                        .detail-grid {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            </head>

            <body>
                ${booking.innerHTML}
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        // Allow the print document to load before printing
        printWindow.onload = function () {
            printWindow.print();
        };
    });
});

// ==========================================
// EVENT LISTENERS
// ==========================================

searchInput.addEventListener("input", filterBookings);
statusFilter.addEventListener("change", filterBookings);

// Initialise the page
updateSummary();
filterBookings();
```