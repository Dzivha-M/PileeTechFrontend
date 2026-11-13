
/* ==========================================
   PILEE TECH — REGISTERED CLEANERS
   ========================================== */

// DEMO DATA:
// Replace these sample records with data from your PHP/MySQL backend.

const demoCleaners = [
    {
        id: "CLN-001",
        firstName: "Thando",
        lastName: "Mokoena",
        email: "thando@example.com",
        phone: "071 000 0001",
        registrationDate: "2026-10-15",
        status: "Available"
    },
    {
        id: "CLN-002",
        firstName: "Lerato",
        lastName: "Nkosi",
        email: "lerato@example.com",
        phone: "072 000 0002",
        registrationDate: "2026-10-12",
        status: "On a Job"
    },
    {
        id: "CLN-003",
        firstName: "Sipho",
        lastName: "Dlamini",
        email: "sipho@example.com",
        phone: "073 000 0003",
        registrationDate: "2026-10-09",
        status: "Unavailable"
    },
    {
        id: "CLN-004",
        firstName: "Nomsa",
        lastName: "Khumalo",
        email: "nomsa@example.com",
        phone: "074 000 0004",
        registrationDate: "2026-10-06",
        status: "Available"
    },
    {
        id: "CLN-005",
        firstName: "Bongani",
        lastName: "Mthembu",
        email: "bongani@example.com",
        phone: "075 000 0005",
        registrationDate: "2026-10-02",
        status: "Available"
    }
];

const STORAGE_KEY = "pileeTechCleanerAvailability";

const tableBody = document.getElementById("cleanersTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");

const modal = document.getElementById("cleanerModal");
const detailsContainer = document.getElementById("cleanerDetails");

let cleaners = demoCleaners.map(cleaner => ({ ...cleaner }));

// Restore demo status changes for this browser, if available.
try {
    const savedStatuses = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
    );

    cleaners.forEach(cleaner => {
        const savedStatus = savedStatuses[cleaner.id];

        if (
            ["Available", "Unavailable", "On a Job"].includes(savedStatus)
        ) {
            cleaner.status = savedStatus;
        }
    });
} catch (error) {
    console.warn("Saved demo statuses could not be loaded.");
}


/* ==========================================
   HELPER FUNCTIONS
   ========================================== */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function formatDate(dateString) {
    const date = new Date(dateString + "T12:00:00");

    if (Number.isNaN(date.getTime())) {
        return "Not provided";
    }

    return new Intl.DateTimeFormat("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}

function getInitials(cleaner) {
    return (
        cleaner.firstName.charAt(0) +
        cleaner.lastName.charAt(0)
    ).toUpperCase();
}

function getStatusClass(status) {
    if (status === "Available") return "status-available";
    if (status === "On a Job") return "status-on-a-job";

    return "status-unavailable";
}


/* ==========================================
   STATISTICS
   ========================================== */

function updateStatistics() {
    const total = cleaners.length;

    const available = cleaners.filter(
        cleaner => cleaner.status === "Available"
    ).length;

    const unavailable = cleaners.filter(
        cleaner => cleaner.status === "Unavailable"
    ).length;

    const busy = cleaners.filter(
        cleaner => cleaner.status === "On a Job"
    ).length;

    document.getElementById("totalCleaners").textContent = total;
    document.getElementById("availableCleaners").textContent = available;
    document.getElementById("unavailableCleaners").textContent = unavailable;
    document.getElementById("busyCleaners").textContent = busy;
}


/* ==========================================
   SEARCH, FILTER AND SORT
   ========================================== */

function getFilteredCleaners() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;
    const sortOption = sortFilter.value;

    const results = cleaners.filter(cleaner => {
        const searchableText = [
            cleaner.id,
            cleaner.firstName,
            cleaner.lastName,
            cleaner.email,
            cleaner.phone
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesStatus =
            selectedStatus === "all" ||
            cleaner.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    results.sort((a, b) => {
        if (sortOption === "oldest") {
            return a.registrationDate.localeCompare(b.registrationDate);
        }

        if (sortOption === "name") {
            return `${a.firstName} ${a.lastName}`.localeCompare(
                `${b.firstName} ${b.lastName}`
            );
        }

        return b.registrationDate.localeCompare(a.registrationDate);
    });

    return results;
}


/* ==========================================
   RENDER CLEANER TABLE
   ========================================== */

function renderCleaners() {
    const filteredCleaners = getFilteredCleaners();

    updateStatistics();

    document.getElementById("recordCount").textContent =
        `${filteredCleaners.length} cleaner${filteredCleaners.length === 1 ? "" : "s"}`;

    document.getElementById("tableSummary").textContent =
        `Showing ${filteredCleaners.length} of ${cleaners.length} cleaners`;

    if (filteredCleaners.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    No cleaners match your search or selected filter.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filteredCleaners.map(cleaner => {
        const fullName =
            `${cleaner.firstName} ${cleaner.lastName}`;

        return `
            <tr>
                <td>
                    <div class="cleaner-cell">
                        <div class="cleaner-avatar">
                            ${escapeHTML(getInitials(cleaner))}
                        </div>

                        <div>
                            <div class="cleaner-name">
                                ${escapeHTML(fullName)}
                            </div>

                            <div class="cleaner-id">
                                ${escapeHTML(cleaner.id)}
                            </div>
                        </div>
                    </div>
                </td>

                <td>
                    <div class="contact-cell">
                        <a href="mailto:${escapeHTML(cleaner.email)}">
                            ${escapeHTML(cleaner.email)}
                        </a>
                        <span>${escapeHTML(cleaner.phone)}</span>
                    </div>
                </td>

                <td class="date-cell">
                    ${escapeHTML(formatDate(cleaner.registrationDate))}
                </td>

                <td>
                    <span class="status-badge ${getStatusClass(cleaner.status)}">
                        ${escapeHTML(cleaner.status)}
                    </span>
                </td>

                <td>
                    <div class="action-group">
                        <button type="button"
                                class="action-button"
                                data-action="view"
                                data-id="${escapeHTML(cleaner.id)}">
                            View Details
                        </button>

                        <select class="action-button"
                                data-action="status"
                                data-id="${escapeHTML(cleaner.id)}"
                                aria-label="Update availability for ${escapeHTML(fullName)}">
                            <option value="Available"
                                ${cleaner.status === "Available" ? "selected" : ""}>
                                Available
                            </option>

                            <option value="Unavailable"
                                ${cleaner.status === "Unavailable" ? "selected" : ""}>
                                Unavailable
                            </option>

                            <option value="On a Job"
                                ${cleaner.status === "On a Job" ? "selected" : ""}>
                                On a Job
                            </option>
                        </select>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}


/* ==========================================
   VIEW CLEANER DETAILS
   ========================================== */

function openCleanerDetails(cleaner) {
    const fullName = `${cleaner.firstName} ${cleaner.lastName}`;

    const details = [
        ["Cleaner ID", cleaner.id],
        ["Full Name", fullName],
        ["Email Address", cleaner.email],
        ["Phone Number", cleaner.phone],
        ["Registration Date", formatDate(cleaner.registrationDate)],
        ["Availability", cleaner.status]
    ];

    document.getElementById("modalTitle").textContent = fullName;

    detailsContainer.innerHTML = details.map(([label, value]) => `
        <div class="detail-row">
            <span>${escapeHTML(label)}</span>
            <strong>${escapeHTML(value)}</strong>
        </div>
    `).join("");

    modal.hidden = false;
    document.getElementById("closeModal").focus();
}

function closeCleanerDetails() {
    modal.hidden = true;
}


/* ==========================================
   UPDATE AVAILABILITY
   ========================================== */

function updateCleanerStatus(cleanerId, newStatus) {
    const allowedStatuses = [
        "Available",
        "Unavailable",
        "On a Job"
    ];

    if (!allowedStatuses.includes(newStatus)) {
        renderCleaners();
        return;
    }

    const cleaner = cleaners.find(item => item.id === cleanerId);

    if (!cleaner) return;

    cleaner.status = newStatus;

    // Demo persistence only; this does not update MySQL.
    try {
        const savedStatuses = {};

        cleaners.forEach(item => {
            savedStatuses[item.id] = item.status;
        });

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(savedStatuses)
        );
    } catch (error) {
        console.warn("Demo status could not be saved in this browser.");
    }

    renderCleaners();
}


/* ==========================================
   EVENT LISTENERS
   ========================================== */

searchInput.addEventListener("input", renderCleaners);
statusFilter.addEventListener("change", renderCleaners);
sortFilter.addEventListener("change", renderCleaners);

document.getElementById("resetFilters").addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "all";
    sortFilter.value = "newest";

    renderCleaners();
});

tableBody.addEventListener("click", event => {
    const button = event.target.closest('[data-action="view"]');

    if (!button) return;

    const cleaner = cleaners.find(
        item => item.id === button.dataset.id
    );

    if (cleaner) openCleanerDetails(cleaner);
});

tableBody.addEventListener("change", event => {
    const select = event.target.closest('[data-action="status"]');

    if (!select) return;

    updateCleanerStatus(select.dataset.id, select.value);
});

document.getElementById("closeModal").addEventListener(
    "click",
    closeCleanerDetails
);

document.getElementById("closeModalBottom").addEventListener(
    "click",
    closeCleanerDetails
);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeCleanerDetails();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
        closeCleanerDetails();
    }
});


/* ==========================================
   MOBILE SIDEBAR
   ========================================== */

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", event => {
    if (
        window.innerWidth <= 850 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        sidebar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});


/* ==========================================
   INITIALISE PAGE
   ========================================== */

renderCleaners();
