
/* ==========================================
   PILEE TECH - APPLICATION MANAGEMENT
   Front-end demonstration only.
   Connect to PHP/MySQL for real applications.
   ========================================== */

"use strict";

/*
 * DEMONSTRATION DATA
 *
 * Replace this array with applications retrieved
 * from your PHP backend when the database is connected.
 */

const applications = [
    {
        id: "APP-1001",
        userId: "USER-1001",
        firstName: "Thando",
        surname: "Mokoena",
        email: "thando@example.com",
        phone: "Not provided",
        specialization: "Residential Cleaning",
        experience: "3 years",
        area: "Johannesburg",
        appliedAt: "2026-10-20",
        status: "pending",
        notes: "Residential cleaning experience."
    },
    {
        id: "APP-1002",
        userId: "USER-1002",
        firstName: "Lerato",
        surname: "Dlamini",
        email: "lerato@example.com",
        phone: "Not provided",
        specialization: "Commercial Cleaning",
        experience: "5 years",
        area: "Pretoria",
        appliedAt: "2026-10-21",
        status: "pending",
        notes: "Experience working in office environments."
    },
    {
        id: "APP-1003",
        userId: "USER-1003",
        firstName: "Sipho",
        surname: "Nkosi",
        email: "sipho@example.com",
        phone: "Not provided",
        specialization: "Deep Cleaning",
        experience: "2 years",
        area: "Soweto",
        appliedAt: "2026-10-22",
        status: "approved",
        notes: "Interested in residential deep cleaning."
    },
    {
        id: "APP-1004",
        userId: "USER-1004",
        firstName: "Ayanda",
        surname: "Khumalo",
        email: "ayanda@example.com",
        phone: "Not provided",
        specialization: "Carpet Cleaning",
        experience: "1 year",
        area: "Sandton",
        appliedAt: "2026-10-23",
        status: "declined",
        notes: "Application requires further verification."
    }
];

/* ==========================================
   ELEMENT REFERENCES
   ========================================== */

const tableBody = document.getElementById("applicationsTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const specializationFilter = document.getElementById("specializationFilter");

const emptyState = document.getElementById("emptyState");
const recordCount = document.getElementById("recordCount");
const tableFooterText = document.getElementById("tableFooterText");

const applicationModal = document.getElementById("applicationModal");
const modalContent = document.getElementById("modalContent");
const closeModalButton = document.getElementById("closeModal");
const modalCloseButton = document.getElementById("modalCloseButton");

const modalApproveButton = document.getElementById("modalApproveButton");
const modalDeclineButton = document.getElementById("modalDeclineButton");

const confirmModal = document.getElementById("confirmModal");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const confirmIcon = document.getElementById("confirmIcon");
const confirmDecisionButton = document.getElementById("confirmDecision");
const cancelDecisionButton = document.getElementById("cancelDecision");

const toast = document.getElementById("toast");

let selectedApplicationId = null;
let pendingDecision = null;
let toastTimer = null;

/* ==========================================
   HELPER FUNCTIONS
   ========================================== */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => {
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
    if (!dateString) {
        return "Not provided";
    }

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "Not provided";
    }

    return new Intl.DateTimeFormat("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function getInitials(firstName, surname) {
    const first = firstName?.trim().charAt(0) || "";
    const last = surname?.trim().charAt(0) || "";

    return `${first}${last}`.toUpperCase();
}

function findApplication(applicationId) {
    return applications.find(application =>
        application.id === applicationId
    );
}

/* ==========================================
   STATISTICS
   ========================================== */

function updateStatistics() {
    const total = applications.length;

    const pending = applications.filter(application =>
        application.status === "pending"
    ).length;

    const approved = applications.filter(application =>
        application.status === "approved"
    ).length;

    const declined = applications.filter(application =>
        application.status === "declined"
    ).length;

    document.getElementById("totalApplications").textContent = total;
    document.getElementById("pendingApplications").textContent = pending;
    document.getElementById("approvedApplications").textContent = approved;
    document.getElementById("declinedApplications").textContent = declined;
}

/* ==========================================
   SEARCH AND FILTERS
   ========================================== */

function getFilteredApplications() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const selectedSpecialization = specializationFilter.value;

    return applications.filter(application => {
        const fullName =
            `${application.firstName} ${application.surname}`.toLowerCase();

        const searchableText = [
            application.id,
            application.userId,
            fullName,
            application.email,
            application.specialization
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            application.status === selectedStatus;

        const matchesSpecialization =
            selectedSpecialization === "all" ||
            application.specialization === selectedSpecialization;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesSpecialization
        );
    });
}

/* ==========================================
   RENDER APPLICATION TABLE
   ========================================== */

function renderApplications() {
    const filteredApplications = getFilteredApplications();

    tableBody.innerHTML = filteredApplications.map(application => {
        const fullName =
            `${application.firstName} ${application.surname}`;

        const statusClass = `status-${application.status}`;

        return `
            <tr>
                <td>
                    <div class="applicant-cell">
                        <div class="applicant-avatar">
                            ${escapeHTML(
                                getInitials(
                                    application.firstName,
                                    application.surname
                                )
                            )}
                        </div>

                        <div class="applicant-info">
                            <strong>${escapeHTML(fullName)}</strong>
                            <span>${escapeHTML(application.email)}</span>
                        </div>
                    </div>
                </td>

                <td>
                    <span class="application-id">
                        ${escapeHTML(application.id)}
                    </span>
                </td>

                <td>${escapeHTML(application.specialization)}</td>

                <td>${escapeHTML(application.experience)}</td>

                <td>${escapeHTML(formatDate(application.appliedAt))}</td>

                <td>
                    <span class="status-badge ${statusClass}">
                        ${escapeHTML(formatStatus(application.status))}
                    </span>
                </td>

                <td>
                    <div class="action-group">
                        <button
                            type="button"
                            class="action-button view-button"
                            data-action="view"
                            data-id="${escapeHTML(application.id)}">
                            View
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    emptyState.hidden = filteredApplications.length !== 0;

    const count = filteredApplications.length;

    recordCount.textContent =
        `${count} ${count === 1 ? "application" : "applications"}`;

    tableFooterText.textContent =
        `Showing ${count} of ${applications.length} applications`;

    updateStatistics();
}

/* ==========================================
   VIEW APPLICATION DETAILS
   ========================================== */

function openApplication(applicationId) {
    const application = findApplication(applicationId);

    if (!application) {
        showToast("Application could not be found.", true);
        return;
    }

    selectedApplicationId = applicationId;

    const fullName =
        `${application.firstName} ${application.surname}`;

    modalContent.innerHTML = `
        <h3 class="detail-section-title">Applicant Information</h3>

        <div class="detail-grid">
            <div class="detail-item">
                <span>Full Name</span>
                <strong>${escapeHTML(fullName)}</strong>
            </div>

            <div class="detail-item">
                <span>Applicant User ID</span>
                <strong>${escapeHTML(application.userId)}</strong>
            </div>

            <div class="detail-item">
                <span>Email Address</span>
                <strong>${escapeHTML(application.email)}</strong>
            </div>

            <div class="detail-item">
                <span>Phone Number</span>
                <strong>${escapeHTML(application.phone)}</strong>
            </div>
        </div>

        <hr class="detail-divider">

        <h3 class="detail-section-title">Application Information</h3>

        <div class="detail-grid">
            <div class="detail-item">
                <span>Application ID</span>
                <strong>${escapeHTML(application.id)}</strong>
            </div>

            <div class="detail-item">
                <span>Date Applied</span>
                <strong>${escapeHTML(formatDate(application.appliedAt))}</strong>
            </div>

            <div class="detail-item">
                <span>Specialization</span>
                <strong>${escapeHTML(application.specialization)}</strong>
            </div>

            <div class="detail-item">
                <span>Experience</span>
                <strong>${escapeHTML(application.experience)}</strong>
            </div>

            <div class="detail-item">
                <span>Preferred Work Area</span>
                <strong>${escapeHTML(application.area)}</strong>
            </div>

            <div class="detail-item">
                <span>Application Status</span>
                <strong>
                    <span class="status-badge status-${application.status}">
                        ${escapeHTML(formatStatus(application.status))}
                    </span>
                </strong>
            </div>

            <div class="detail-item full-width">
                <span>Application Notes</span>
                <strong>${escapeHTML(application.notes || "No notes provided.")}</strong>
            </div>
        </div>
    `;

    const isPending = application.status === "pending";

    modalApproveButton.hidden = !isPending;
    modalDeclineButton.hidden = !isPending;

    applicationModal.hidden = false;
    document.body.style.overflow = "hidden";

    closeModalButton.focus();
}

function closeApplicationModal() {
    applicationModal.hidden = true;
    document.body.style.overflow = "";
    selectedApplicationId = null;
}

/* ==========================================
   APPROVE OR DECLINE APPLICATION
   ========================================== */

function openDecisionConfirmation(decision) {
    const application = findApplication(selectedApplicationId);

    if (!application || application.status !== "pending") {
        showToast("Only pending applications can be reviewed.", true);
        return;
    }

    pendingDecision = decision;

    const isApprove = decision === "approved";

    confirmTitle.textContent = isApprove
        ? "Approve Application?"
        : "Decline Application?";

    confirmMessage.textContent = isApprove
        ? `Approve ${application.firstName} ${application.surname}'s application?`
        : `Decline ${application.firstName} ${application.surname}'s application?`;

    confirmIcon.textContent = isApprove ? "✓" : "!";
    confirmDecisionButton.textContent = isApprove
        ? "Confirm Approval"
        : "Confirm Decline";

    confirmDecisionButton.className = isApprove
        ? "button-primary"
        : "button-danger";

    confirmModal.hidden = false;
    confirmDecisionButton.focus();
}

function closeConfirmationModal() {
    confirmModal.hidden = true;
    pendingDecision = null;
}

function applyDecision() {
    if (!selectedApplicationId || !pendingDecision) {
        return;
    }

    const application = findApplication(selectedApplicationId);

    if (!application || application.status !== "pending") {
        closeConfirmationModal();
        showToast("This application has already been reviewed.", true);
        return;
    }

    const decision = pendingDecision;

    /*
     * DEMO ONLY:
     * This changes the in-memory record.
     * Refreshing the page resets this demonstration data.
     *
     * In the real application, send the decision to a PHP endpoint
     * and update cleaner_applications.status in MySQL.
     */

    application.status = decision;

    closeConfirmationModal();
    closeApplicationModal();
    renderApplications();

    showToast(
        decision === "approved"
            ? "Application approved in this demonstration."
            : "Application declined in this demonstration."
    );
}

/* ==========================================
   NOTIFICATIONS
   ========================================== */

function showToast(message, isError = false) {
    window.clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.toggle("error", isError);
    toast.classList.add("show");

    toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

/* ==========================================
   EVENT LISTENERS
   ========================================== */

searchInput.addEventListener("input", renderApplications);
statusFilter.addEventListener("change", renderApplications);
specializationFilter.addEventListener("change", renderApplications);

document.getElementById("resetFilters").addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "all";
    specializationFilter.value = "all";

    renderApplications();
});

tableBody.addEventListener("click", event => {
    const button = event.target.closest("[data-action='view']");

    if (!button) {
        return;
    }

    openApplication(button.dataset.id);
});

closeModalButton.addEventListener("click", closeApplicationModal);
modalCloseButton.addEventListener("click", closeApplicationModal);

applicationModal.addEventListener("click", event => {
    if (event.target === applicationModal) {
        closeApplicationModal();
    }
});

modalApproveButton.addEventListener("click", () => {
    openDecisionConfirmation("approved");
});

modalDeclineButton.addEventListener("click", () => {
    openDecisionConfirmation("declined");
});

cancelDecisionButton.addEventListener("click", closeConfirmationModal);

confirmDecisionButton.addEventListener("click", applyDecision);

confirmModal.addEventListener("click", event => {
    if (event.target === confirmModal) {
        closeConfirmationModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") {
        return;
    }

    if (!confirmModal.hidden) {
        closeConfirmationModal();
    } else if (!applicationModal.hidden) {
        closeApplicationModal();
    }
});

/* ==========================================
   INITIALIZE PAGE
   ========================================== */

renderApplications();
