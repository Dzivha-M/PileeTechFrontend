
/* =====================================
   PILEE TECH - RATINGS JAVASCRIPT
   Demonstration data only
   ===================================== */

const reviews = [
    {
        id: "REV-001",
        customer: "Thandi Mokoena",
        cleaner: "Sarah Dlamini",
        service: "Standard Home Cleaning",
        rating: 5,
        date: "2026-10-15",
        feedback: "Excellent service. My home was spotless and the cleaner was professional."
    },
    {
        id: "REV-002",
        customer: "John Dlamini",
        cleaner: "Peter Nkosi",
        service: "Deep Cleaning",
        rating: 4,
        date: "2026-10-14",
        feedback: "Very good cleaning. A few small areas could have received more attention."
    },
    {
        id: "REV-003",
        customer: "Nomsa Khumalo",
        cleaner: "Sarah Dlamini",
        service: "Office Cleaning",
        rating: 5,
        date: "2026-10-13",
        feedback: "Professional, punctual and thorough. We are happy with the service."
    },
    {
        id: "REV-004",
        customer: "Sipho Ndlovu",
        cleaner: "Lebo Molefe",
        service: "Deep Cleaning",
        rating: 2,
        date: "2026-10-12",
        feedback: "The cleaning took longer than expected and some areas were missed."
    },
    {
        id: "REV-005",
        customer: "Ayanda Zulu",
        cleaner: "Peter Nkosi",
        service: "Standard Home Cleaning",
        rating: 5,
        date: "2026-10-11",
        feedback: "Great experience. The cleaner was friendly and did an excellent job."
    },
    {
        id: "REV-006",
        customer: "Lerato Maseko",
        cleaner: "Sarah Dlamini",
        service: "Standard Home Cleaning",
        rating: 5,
        date: "2026-10-10",
        feedback: "Outstanding work and attention to detail. I would book again."
    }
];

const searchInput = document.getElementById("searchInput");
const ratingFilter = document.getElementById("ratingFilter");
const serviceFilter = document.getElementById("serviceFilter");
const reviewsTable = document.getElementById("reviewsTable");
const cleanerTable = document.getElementById("cleanerTable");
const emptyMessage = document.getElementById("emptyMessage");

function stars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function formatDate(dateString) {
    return new Date(dateString + "T12:00:00").toLocaleDateString(
        "en-ZA",
        { day: "2-digit", month: "short", year: "numeric" }
    );
}

function updateStatistics() {
    const total = reviews.length;
    const average = total
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
        : 0;

    const positive = reviews.filter(review => review.rating >= 4).length;
    const low = reviews.filter(review => review.rating <= 2).length;

    document.getElementById("overallRating").innerHTML =
        `${average.toFixed(1)} <span>/ 5</span>`;

    document.getElementById("totalReviews").textContent = total;
    document.getElementById("positiveReviews").textContent = positive;
    document.getElementById("lowReviews").textContent = low;

    const breakdown = document.getElementById("ratingBreakdown");

    breakdown.innerHTML = [5, 4, 3, 2, 1].map(rating => {
        const count = reviews.filter(
            review => review.rating === rating
        ).length;

        const percentage = total ? (count / total) * 100 : 0;

        return `
            <div class="rating-row">
                <span class="rating-label">${rating} ★</span>
                <div class="rating-track">
                    <div class="rating-fill"
                         style="width: ${percentage}%"></div>
                </div>
                <span class="rating-count">${count}</span>
            </div>
        `;
    }).join("");
}

function renderReviews() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedRating = ratingFilter.value;
    const selectedService = serviceFilter.value;

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            review.customer.toLowerCase().includes(searchTerm) ||
            review.cleaner.toLowerCase().includes(searchTerm) ||
            review.feedback.toLowerCase().includes(searchTerm);

        const matchesRating =
            selectedRating === "all" ||
            review.rating === Number(selectedRating);

        const matchesService =
            selectedService === "all" ||
            review.service === selectedService;

        return matchesSearch && matchesRating && matchesService;
    });

    reviewsTable.innerHTML = filteredReviews.map(review => `
        <tr>
            <td>
                <span class="customer-name">${review.customer}</span>
            </td>
            <td>
                <span class="cleaner-name">${review.cleaner}</span>
            </td>
            <td>${review.service}</td>
            <td>
                <span class="review-stars"
                      aria-label="${review.rating} out of 5 stars">
                    ${stars(review.rating)}
                </span>
            </td>
            <td>${formatDate(review.date)}</td>
            <td>
                <div class="review-text">${review.feedback}</div>
            </td>
            <td>
                <button class="view-button"
                        data-review-id="${review.id}">
                    View Details
                </button>
            </td>
        </tr>
    `).join("");

    emptyMessage.hidden = filteredReviews.length > 0;
}

function renderCleanerPerformance() {
    const cleanerNames = [...new Set(
        reviews.map(review => review.cleaner)
    )];

    cleanerTable.innerHTML = cleanerNames.map(cleaner => {
        const cleanerReviews = reviews.filter(
            review => review.cleaner === cleaner
        );

        const average = cleanerReviews.reduce(
            (sum, review) => sum + review.rating, 0
        ) / cleanerReviews.length;

        let performance = "Needs Improvement";
        let performanceClass = "needs-improvement";

        if (average >= 4.5) {
            performance = "Excellent";
            performanceClass = "excellent";
        } else if (average >= 3.5) {
            performance = "Good";
            performanceClass = "good";
        }

        return `
            <tr>
                <td><span class="cleaner-name">${cleaner}</span></td>
                <td>${cleanerReviews.length}</td>
                <td>
                    <span class="review-stars">${stars(Math.round(average))}</span>
                    ${average.toFixed(1)} / 5
                </td>
                <td>
                    <span class="performance ${performanceClass}">
                        ${performance}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

/* REVIEW DETAILS MODAL */

const reviewModal = document.getElementById("reviewModal");
const modalDetails = document.getElementById("modalDetails");

function openReview(reviewId) {
    const review = reviews.find(item => item.id === reviewId);

    if (!review) return;

    modalDetails.innerHTML = `
        <div class="modal-detail">
            <strong>Review Reference</strong>
            ${review.id}
        </div>
        <div class="modal-detail">
            <strong>Customer</strong>
            ${review.customer}
        </div>
        <div class="modal-detail">
            <strong>Cleaner</strong>
            ${review.cleaner}
        </div>
        <div class="modal-detail">
            <strong>Service</strong>
            ${review.service}
        </div>
        <div class="modal-detail">
            <strong>Rating</strong>
            <span class="review-stars">${stars(review.rating)}</span>
            (${review.rating}/5)
        </div>
        <div class="modal-detail">
            <strong>Date Submitted</strong>
            ${formatDate(review.date)}
        </div>
        <div class="modal-detail">
            <strong>Customer Feedback</strong>
            ${review.feedback}
        </div>
    `;

    reviewModal.classList.add("open");
    reviewModal.setAttribute("aria-hidden", "false");
    document.getElementById("closeModal").focus();
}

function closeReview() {
    reviewModal.classList.remove("open");
    reviewModal.setAttribute("aria-hidden", "true");
}

reviewsTable.addEventListener("click", event => {
    const button = event.target.closest("[data-review-id]");

    if (button) {
        openReview(button.dataset.reviewId);
    }
});

document.getElementById("closeModal").addEventListener(
    "click", closeReview
);

document.getElementById("doneButton").addEventListener(
    "click", closeReview
);

reviewModal.addEventListener("click", event => {
    if (event.target === reviewModal) {
        closeReview();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeReview();
    }
});

/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

/* FILTER EVENTS */

searchInput.addEventListener("input", renderReviews);
ratingFilter.addEventListener("change", renderReviews);
serviceFilter.addEventListener("change", renderReviews);

/* INITIAL PAGE RENDER */

updateStatistics();
renderReviews();
renderCleanerPerformance();

/* ==========================================
   PILEE TECH — VIEW RATINGS
   Ratings, Reviews & Excel Export
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. GET HTML ELEMENTS
    // ==========================================

    const overallRating = document.getElementById("overallRating");
    const totalReviews = document.getElementById("totalReviews");
    const positiveReviews = document.getElementById("positiveReviews");
    const lowReviews = document.getElementById("lowReviews");

    const ratingBreakdown = document.getElementById("ratingBreakdown");

    const reviewsTableBody =
        document.getElementById("reviewsTableBody");

    const cleanerPerformanceBody =
        document.getElementById("cleanerPerformanceBody");

    const searchReviews =
        document.getElementById("searchReviews");

    const ratingFilter =
        document.getElementById("ratingFilter");

    const emptyMessage =
        document.getElementById("emptyMessage");

    const exportButton =
        document.getElementById("exportButton");

    const reviewModal =
        document.getElementById("reviewModal");

    const modalBody =
        document.getElementById("modalBody");

    const closeModal =
        document.getElementById("closeModal");


    // ==========================================
    // 2. REVIEW DATA
    // ==========================================
    // These are sample records for frontend testing.
    // Replace this array with data from your PHP/MySQL
    // backend when it is connected.

    const reviews = [
        {
            id: 1,
            customer: "Thando Mokoena",
            customerId: "CUS-1001",
            cleaner: "Sipho Ndlovu",
            cleanerId: "CLN-2001",
            rating: 5,
            comment: "Excellent service! The cleaner arrived on time and left my home spotless.",
            date: "2026-10-12"
        },
        {
            id: 2,
            customer: "Nomsa Khumalo",
            customerId: "CUS-1002",
            cleaner: "Zanele Williams",
            cleanerId: "CLN-2002",
            rating: 4,
            comment: "Very good cleaning. A few small areas could have received more attention.",
            date: "2026-10-14"
        },
        {
            id: 3,
            customer: "Daniel Maseko",
            customerId: "CUS-1003",
            cleaner: "Sipho Ndlovu",
            cleanerId: "CLN-2001",
            rating: 5,
            comment: "Professional, friendly and thorough. I would definitely book again.",
            date: "2026-10-15"
        },
        {
            id: 4,
            customer: "Lerato Pillay",
            customerId: "CUS-1004",
            cleaner: "Pieter Molefe",
            cleanerId: "CLN-2003",
            rating: 2,
            comment: "The service was below expectations. Some rooms were not cleaned properly.",
            date: "2026-10-17"
        },
        {
            id: 5,
            customer: "Ayanda Dlamini",
            customerId: "CUS-1005",
            cleaner: "Zanele Williams",
            cleanerId: "CLN-2002",
            rating: 3,
            comment: "The overall service was satisfactory, but the job took longer than expected.",
            date: "2026-10-18"
        },
        {
            id: 6,
            customer: "Kagiso Molefe",
            customerId: "CUS-1006",
            cleaner: "Sipho Ndlovu",
            cleanerId: "CLN-2001",
            rating: 5,
            comment: "Outstanding work. Everything was organised and cleaned carefully.",
            date: "2026-10-20"
        },
        {
            id: 7,
            customer: "Zinhle Nkomo",
            customerId: "CUS-1007",
            cleaner: "Pieter Molefe",
            cleanerId: "CLN-2003",
            rating: 1,
            comment: "I was disappointed with the quality of the cleaning.",
            date: "2026-10-21"
        },
        {
            id: 8,
            customer: "Musa Khanyile",
            customerId: "CUS-1008",
            cleaner: "Zanele Williams",
            cleanerId: "CLN-2002",
            rating: 4,
            comment: "Good service and a polite cleaner. Overall, a positive experience.",
            date: "2026-10-22"
        }
    ];


    // ==========================================
    // 3. HELPER FUNCTIONS
    // ==========================================

    function escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, character => {

            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }


    function formatDate(dateString) {

        const date = new Date(dateString + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    function getStars(rating) {

        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }


    function getRatingClass(rating) {

        if (rating >= 4) {
            return "rating-high";
        }

        if (rating === 3) {
            return "rating-medium";
        }

        return "rating-low";
    }


    function getPerformanceLabel(rating) {

        if (rating >= 4.5) {
            return "Excellent";
        }

        if (rating >= 4) {
            return "Very Good";
        }

        if (rating >= 3) {
            return "Satisfactory";
        }

        if (rating >= 2) {
            return "Needs Improvement";
        }

        return "Poor";
    }


    // ==========================================
    // 4. CALCULATE SUMMARY STATISTICS
    // ==========================================

    function updateStatistics() {

        const total = reviews.length;

        const average = total
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / total
            : 0;

        const positive = reviews.filter(
            review => review.rating >= 4
        ).length;

        const low = reviews.filter(
            review => review.rating <= 2
        ).length;

        overallRating.innerHTML =
            `${average.toFixed(1)} <span>/ 5</span>`;

        totalReviews.textContent = total;

        positiveReviews.textContent = positive;

        lowReviews.textContent = low;
    }


    // ==========================================
    // 5. DISPLAY RATING BREAKDOWN
    // ==========================================

    function renderRatingBreakdown() {

        ratingBreakdown.innerHTML = "";

        const total = reviews.length;

        for (let rating = 5; rating >= 1; rating--) {

            const count = reviews.filter(
                review => review.rating === rating
            ).length;

            const percentage = total
                ? (count / total) * 100
                : 0;

            const row = document.createElement("div");

            row.className = "rating-row";

            row.innerHTML = `
                <span class="rating-label">
                    ${rating} ${rating === 1 ? "star" : "stars"}
                </span>

                <div class="rating-bar">
                    <div
                        class="rating-bar-fill"
                        style="width: ${percentage}%"
                    ></div>
                </div>

                <span class="rating-count">
                    ${count}
                </span>
            `;

            ratingBreakdown.appendChild(row);
        }
    }


    // ==========================================
    // 6. DISPLAY CUSTOMER REVIEWS
    // ==========================================

    function renderReviews() {

        const query = searchReviews.value.trim().toLowerCase();

        const selectedRating = ratingFilter.value;

        const filteredReviews = reviews.filter(review => {

            const searchableText = [
                review.customer,
                review.customerId,
                review.cleaner,
                review.cleanerId,
                review.comment,
                review.date,
                formatDate(review.date),
                String(review.rating)
            ].join(" ").toLowerCase();

            const matchesSearch =
                searchableText.includes(query);

            const matchesRating =
                selectedRating === "all" ||
                review.rating === Number(selectedRating);

            return matchesSearch && matchesRating;
        });

        reviewsTableBody.innerHTML = "";

        filteredReviews.forEach(review => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="review-person">
                        <strong>${escapeHTML(review.customer)}</strong>
                        <small>${escapeHTML(review.customerId)}</small>
                    </div>
                </td>

                <td>
                    <div class="review-person">
                        <strong>${escapeHTML(review.cleaner)}</strong>
                        <small>${escapeHTML(review.cleanerId)}</small>
                    </div>
                </td>

                <td>
                    <span class="rating-badge ${getRatingClass(review.rating)}">
                        <span class="stars">
                            ${getStars(review.rating)}
                        </span>
                        <span>${review.rating}/5</span>
                    </span>
                </td>

                <td class="review-comment">
                    ${escapeHTML(review.comment)}
                </td>

                <td>${formatDate(review.date)}</td>

                <td>
                    <button
                        type="button"
                        class="view-review-button"
                        data-review-id="${review.id}"
                    >
                        View Details
                    </button>
                </td>
            `;

            reviewsTableBody.appendChild(row);
        });

        emptyMessage.hidden = filteredReviews.length > 0;

        // Disable the export button when there are no matching reviews.
        exportButton.disabled = filteredReviews.length === 0;
    }


    // ==========================================
    // 7. CALCULATE CLEANER PERFORMANCE
    // ==========================================

    function renderCleanerPerformance() {

        cleanerPerformanceBody.innerHTML = "";

        const cleanerMap = new Map();

        reviews.forEach(review => {

            if (!cleanerMap.has(review.cleanerId)) {

                cleanerMap.set(review.cleanerId, {
                    cleaner: review.cleaner,
                    cleanerId: review.cleanerId,
                    total: 0,
                    ratingTotal: 0
                });
            }

            const cleaner = cleanerMap.get(review.cleanerId);

            cleaner.total++;

            cleaner.ratingTotal += review.rating;
        });

        const cleaners = Array.from(cleanerMap.values());

        cleaners.sort((a, b) => {

            const averageA = a.ratingTotal / a.total;
            const averageB = b.ratingTotal / b.total;

            return averageB - averageA;
        });

        cleaners.forEach(cleaner => {

            const average =
                cleaner.ratingTotal / cleaner.total;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    <div class="review-person">
                        <strong>${escapeHTML(cleaner.cleaner)}</strong>
                        <small>${escapeHTML(cleaner.cleanerId)}</small>
                    </div>
                </td>

                <td>${cleaner.total}</td>

                <td>
                    <span class="performance-rating">
                        <span class="stars">★</span>
                        ${average.toFixed(1)} / 5
                    </span>
                </td>

                <td>
                    <span class="performance-badge ${getRatingClass(Math.round(average))}">
                        ${getPerformanceLabel(average)}
                    </span>
                </td>
            `;

            cleanerPerformanceBody.appendChild(row);
        });
    }


    // ==========================================
    // 8. OPEN REVIEW DETAILS MODAL
    // ==========================================

    function openReviewModal(reviewId) {

        const review = reviews.find(
            item => item.id === Number(reviewId)
        );

        if (!review) {
            return;
        }

        modalBody.innerHTML = `
            <div class="review-detail-item">
                <span>Customer</span>
                <strong>${escapeHTML(review.customer)}</strong>
            </div>

            <div class="review-detail-item">
                <span>Customer ID</span>
                <strong>${escapeHTML(review.customerId)}</strong>
            </div>

            <div class="review-detail-item">
                <span>Cleaner</span>
                <strong>${escapeHTML(review.cleaner)}</strong>
            </div>

            <div class="review-detail-item">
                <span>Cleaner ID</span>
                <strong>${escapeHTML(review.cleanerId)}</strong>
            </div>

            <div class="review-detail-item">
                <span>Rating</span>
                <strong class="stars">
                    ${getStars(review.rating)}
                    ${review.rating}/5
                </strong>
            </div>

            <div class="review-detail-item">
                <span>Date submitted</span>
                <strong>${formatDate(review.date)}</strong>
            </div>

            <div class="review-detail-comment">
                <span>Customer comment</span>
                <p>${escapeHTML(review.comment)}</p>
            </div>
        `;

        reviewModal.classList.add("active");

        reviewModal.setAttribute("aria-hidden", "false");

        closeModal.focus();
    }


    function closeReviewModal() {

        reviewModal.classList.remove("active");

        reviewModal.setAttribute("aria-hidden", "true");
    }


    reviewsTableBody.addEventListener("click", event => {

        const button = event.target.closest("[data-review-id]");

        if (!button) {
            return;
        }

        openReviewModal(button.dataset.reviewId);
    });


    closeModal.addEventListener("click", closeReviewModal);

    reviewModal.addEventListener("click", event => {

        if (event.target === reviewModal) {
            closeReviewModal();
        }
    });


    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            reviewModal.classList.contains("active")
        ) {
            closeReviewModal();
        }
    });


    // ==========================================
    // 9. EXPORT REVIEWS TO EXCEL
    // ==========================================

    function exportReviewsToExcel() {

        if (typeof XLSX === "undefined") {

            alert(
                "Excel export could not load. " +
                "Please check your internet connection and refresh the page."
            );

            return;
        }

        const query = searchReviews.value.trim().toLowerCase();

        const selectedRating = ratingFilter.value;

        // Export the same reviews currently visible in the table.
        const filteredReviews = reviews.filter(review => {

            const searchableText = [
                review.customer,
                review.customerId,
                review.cleaner,
                review.cleanerId,
                review.comment,
                review.date,
                formatDate(review.date),
                String(review.rating)
            ].join(" ").toLowerCase();

            const matchesSearch =
                searchableText.includes(query);

            const matchesRating =
                selectedRating === "all" ||
                review.rating === Number(selectedRating);

            return matchesSearch && matchesRating;
        });

        if (filteredReviews.length === 0) {

            alert("There are no reviews to export.");

            return;
        }

        const data = [
            [
                "Review ID",
                "Customer",
                "Customer ID",
                "Cleaner",
                "Cleaner ID",
                "Rating",
                "Review",
                "Date Submitted"
            ],

            ...filteredReviews.map(review => [
                review.id,
                review.customer,
                review.customerId,
                review.cleaner,
                review.cleanerId,
                review.rating,
                review.comment,
                formatDate(review.date)
            ])
        ];

        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Make the exported spreadsheet easier to read.
        worksheet["!cols"] = [
            { wch: 12 },
            { wch: 24 },
            { wch: 16 },
            { wch: 24 },
            { wch: 16 },
            { wch: 12 },
            { wch: 65 },
            { wch: 20 }
        ];

        // Freeze the heading row.
        worksheet["!freeze"] = {
            xSplit: 0,
            ySplit: 1
        };

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Customer Reviews"
        );

        const today = new Date().toISOString().slice(0, 10);

        XLSX.writeFile(
            workbook,
            `PileeTech_Reviews_${today}.xlsx`
        );
    }


    // ==========================================
    // 10. CONNECT SEARCH, FILTER AND EXPORT
    // ==========================================

    searchReviews.addEventListener("input", renderReviews);

    ratingFilter.addEventListener("change", renderReviews);

    exportButton.addEventListener("click", exportReviewsToExcel);


    // ==========================================
    // 11. INITIALISE THE PAGE
    // ==========================================

    updateStatistics();

    renderRatingBreakdown();

    renderReviews();

    renderCleanerPerformance();

});