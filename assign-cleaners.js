/* =========================================
   PILEE TECH - ASSIGN CLEANERS
   Updated booking status and assignments
========================================= */

const STORAGE_KEY = "pileeTechCleaningAssignments_v1";

/* =========================================
   CLEANER DATA
========================================= */

const cleaners = [
    { id: "CLN-001", name: "Thabo Molefe" },
    { id: "CLN-002", name: "Nomsa Dlamini" },
    { id: "CLN-003", name: "Lerato Nkosi" },
    { id: "CLN-004", name: "Sipho Mthembu" }
];


/* =========================================
   SAMPLE BOOKING DATA
========================================= */

const sampleRequests = [
    {
        id: "REQ-10021",
        customer: "Mqondisi Ndlovu",
        service: "Standard House Cleaning",
        requestedDate: "2026-10-18",
        requestedCleaners: 1,
        cleanerIds: [],
        status: "pending"
    },
    {
        id: "REQ-10022",
        customer: "Thando Mokoena",
        service: "3-Bedroom Cleaning",
        requestedDate: "2026-10-19",
        requestedCleaners: 1,
        cleanerIds: ["CLN-001"],
        status: "allocated"
    },
    {
        id: "REQ-10023",
        customer: "Lerato Dlamini",
        service: "Full-Day Cleaning",
        requestedDate: "2026-10-20",
        requestedCleaners: 1,
        cleanerIds: ["CLN-002"],
        status: "in_progress"
    },
    {
        id: "REQ-10024",
        customer: "Sipho Khumalo",
        service: "Standard House Cleaning",
        requestedDate: "2026-10-21",
        requestedCleaners: 2,
        cleanerIds: [],
        status: "pending"
    },
    {
        id: "REQ-10025",
        customer: "Ayanda Mokoena",
        service: "Half-Day Cleaning",
        requestedDate: "2026-10-15",
        requestedCleaners: 1,
        cleanerIds: ["CLN-003"],
        status: "completed"
    }
];


/* =========================================
   DOM ELEMENTS
========================================= */

const tableBody = document.getElementById("requestTableBody");

const searchInput = document.getElementById("requestSearch");
const statusFilter = document.getElementById("statusFilter");
const cleanerFilter = document.getElementById("cleanerFilter");

const emptyMessage = document.getElementById("emptyMessage");

const modal = document.getElementById("assignmentModal");
const assignmentForm = document.getElementById("assignmentForm");

const cleanerSelect = document.getElementById("cleanerSelect");

const assignmentMessage =
    document.getElementById("assignmentMessage");


/* =========================================
   STATUS CONFIGURATION
========================================= */

const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    allocated: "Allocated",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
    declined: "Declined"
};


/* =========================================
   NORMALISE OLD BOOKING DATA
========================================= */

function normalizeStatus(status) {

    const value = String(status || "pending")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

    const aliases = {
        assigned: "allocated"
    };

    const normalized = aliases[value] || value;

    return statusLabels[normalized] ? normalized : "pending";
}


function normalizeRequest(request) {

    let cleanerIds = request.cleanerIds;

    // Support previously saved single-cleaner assignments.
    if (!Array.isArray(cleanerIds)) {
        cleanerIds = request.cleanerId
            ? [request.cleanerId]
            : [];
    }

    return {
        ...request,
        cleanerIds,
        requestedCleaners: Number(request.requestedCleaners) || 1,
        status: normalizeStatus(request.status)
    };
}


/* =========================================
   LOAD BOOKINGS
========================================= */

function loadRequests() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(sampleRequests)
            );

            return sampleRequests.map(normalizeRequest);
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return sampleRequests.map(normalizeRequest);
        }

        return parsed.map(normalizeRequest);

    } catch (error) {

        console.error("Could not load bookings:", error);

        return sampleRequests.map(normalizeRequest);
    }
}


let requests = loadRequests();


/* =========================================
   SAVE BOOKINGS
========================================= */

function saveRequests() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(requests)
        );

        return true;

    } catch (error) {

        console.error("Could not save bookings:", error);

        alert("Unable to save booking changes.");

        return false;
    }
}


/* =========================================
   SECURITY - ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


/* =========================================
   GET CLEANER NAMES
========================================= */

function getCleanerNames(cleanerIds) {

    return cleanerIds
        .map(id => {
            const cleaner = cleaners.find(item => item.id === id);
            return cleaner ? cleaner.name : null;
        })
        .filter(Boolean);
}


/* =========================================
   GET STATUS CLASS
========================================= */

function getStatusClass(status) {

    return normalizeStatus(status);
}


/* =========================================
   UPDATE DASHBOARD STATISTICS
========================================= */

function updateStatistics() {

    document.getElementById("totalRequests").textContent =
        requests.length;

    document.getElementById("pendingRequests").textContent =
        requests.filter(request =>
            ["pending", "confirmed"].includes(request.status)
        ).length;

    document.getElementById("assignedRequests").textContent =
        requests.filter(request =>
            ["allocated", "in_progress"].includes(request.status)
        ).length;

    document.getElementById("completedRequests").textContent =
        requests.filter(request =>
            request.status === "completed"
        ).length;
}


/* =========================================
   POPULATE CLEANER FILTER
========================================= */

function populateCleanerFilters() {

    const selectedValue = cleanerFilter.value || "All";

    cleanerFilter.innerHTML = `
        <option value="All">All Cleaners</option>
        <option value="Unassigned">Unassigned</option>
        ${cleaners.map(cleaner => `
            <option value="${escapeHTML(cleaner.id)}">
                ${escapeHTML(cleaner.name)}
            </option>
        `).join("")}
    `;

    cleanerFilter.value = selectedValue;

    if (cleanerFilter.value !== selectedValue) {
        cleanerFilter.value = "All";
    }
}


/* =========================================
   RENDER BOOKINGS TABLE
========================================= */

function renderRequests() {

    const query = searchInput.value.trim().toLowerCase();

    const selectedStatus = statusFilter.value;
    const selectedCleaner = cleanerFilter.value;

    const filtered = requests.filter(request => {

        const cleanerNames = getCleanerNames(request.cleanerIds);

        const matchesSearch = [
            request.id,
            request.customer,
            request.service,
            ...cleanerNames
        ].some(value =>
            String(value || "").toLowerCase().includes(query)
        );

        const matchesStatus =
            selectedStatus === "All" ||
            request.status === selectedStatus;

        const matchesCleaner =
            selectedCleaner === "All" ||
            (
                selectedCleaner === "Unassigned" &&
                request.cleanerIds.length === 0
            ) ||
            request.cleanerIds.includes(selectedCleaner);

        return matchesSearch && matchesStatus && matchesCleaner;
    });


    tableBody.innerHTML = filtered.map(request => {

        const cleanerNames = getCleanerNames(request.cleanerIds);

        const cleanerDisplay = cleanerNames.length
            ? cleanerNames.map(name => `
                <span class="ac-main-text">
                    ${escapeHTML(name)}
                </span>
            `).join("")
            : `<span class="ac-subtext">Not assigned</span>`;

        const status = normalizeStatus(request.status);

        return `
    <tr>
        <td>
            <span class="ac-request-id">
                ${escapeHTML(request.id)}
            </span>
        </td>

        <td>${escapeHTML(request.customer)}</td>

        <td>${escapeHTML(request.service)}</td>

        <td>${escapeHTML(request.requestedDate || "Not specified")}</td>

        <td>${request.requestedCleaners}</td>

        <td>
            ${cleanerDisplay}
        </td>

        <td>
            <span class="ac-status ${getStatusClass(status)}">
                ${statusLabels[status]}
            </span>
        </td>

        <td>
            <button
                type="button"
                class="ac-assign-btn"
                data-action="assign"
                data-id="${escapeHTML(request.id)}">

                ${request.cleanerIds.length
                    ? "Edit Assignment"
                    : "Assign Cleaners"}

            </button>
        </td>
    </tr>
`;
        

    }).join("");


    emptyMessage.hidden = filtered.length > 0;

    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7">No bookings found.</td>
            </tr>
        `;
    }

    document.getElementById("resultsLabel").textContent =
        `Showing ${filtered.length} of ${requests.length} bookings`;

    updateStatistics();
}


/* =========================================
   OPEN ASSIGNMENT DIALOGUE
========================================= */

function openAssignment(request) {

    document.getElementById("requestId").value = request.id;

    document.getElementById("modalTitle").textContent =
        request.cleanerIds.length
            ? "Update Assignment"
            : "Assign Cleaners";

    document.getElementById("modalSubtitle").textContent =
        `Select cleaners for booking ${request.id}.`;

    document.getElementById("requestSummary").innerHTML = `
        <strong>Booking:</strong> ${escapeHTML(request.id)}<br>
        <strong>Customer:</strong> ${escapeHTML(request.customer)}<br>
        <strong>Service:</strong> ${escapeHTML(request.service)}<br>
        <strong>Cleaners Required:</strong> ${request.requestedCleaners}
    `;


    // Populate multiple cleaner selection.

    cleanerSelect.innerHTML = cleaners.map(cleaner => `
        <option value="${escapeHTML(cleaner.id)}">
            ${escapeHTML(cleaner.name)}
        </option>
    `).join("");


    // Restore previously selected cleaners.

    Array.from(cleanerSelect.options).forEach(option => {

        option.selected = request.cleanerIds.includes(option.value);

    });


    cleanerSelect.size = Math.min(cleaners.length, 5);

    assignmentMessage.textContent = "";

    modal.hidden = false;

    cleanerSelect.focus();
}


/* =========================================
   CLOSE ASSIGNMENT DIALOGUE
========================================= */

function closeAssignment() {

    modal.hidden = true;

    assignmentForm.reset();

}


/* =========================================
   OPEN MODAL FROM TABLE
========================================= */

tableBody.addEventListener("click", event => {

    const button = event.target.closest('[data-action="assign"]');

    if (!button) return;

    const request = requests.find(
        item => item.id === button.dataset.id
    );

    if (request) {
        openAssignment(request);
    }

});


/* =========================================
   SAVE CLEANER ASSIGNMENT
========================================= */

assignmentForm.addEventListener("submit", event => {

    event.preventDefault();

    const requestId = document.getElementById("requestId").value;

    const request = requests.find(
        item => item.id === requestId
    );

    if (!request) {

        assignmentMessage.textContent =
            "Booking not found. Please refresh the page.";

        return;
    }


    // Get all selected cleaners.

    const selectedCleaners = Array.from(
        cleanerSelect.selectedOptions
    ).map(option => option.value);


    // Validate cleaner selection.

    if (selectedCleaners.length === 0) {

        assignmentMessage.textContent =
            "Please select at least one cleaner.";

        return;
    }


    if (selectedCleaners.length !== request.requestedCleaners) {

        assignmentMessage.textContent =
            `Please select exactly ${request.requestedCleaners} cleaner(s) for this booking.`;

        return;
    }


    // Validate selected cleaner IDs.

    const validCleaners = selectedCleaners.every(id =>
        cleaners.some(cleaner => cleaner.id === id)
    );

    if (!validCleaners) {

        assignmentMessage.textContent =
            "Invalid cleaner selection.";

        return;
    }


    // Save assignment.

    request.cleanerIds = selectedCleaners;

    // Automatically update booking status.

    request.status = "allocated";


    if (!saveRequests()) return;


    renderRequests();

    closeAssignment();

});


/* =========================================
   MODAL BUTTONS
========================================= */

document.getElementById("closeModalBtn")
    .addEventListener("click", closeAssignment);

document.getElementById("cancelBtn")
    .addEventListener("click", closeAssignment);


modal.addEventListener("click", event => {

    if (event.target === modal) {
        closeAssignment();
    }

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape" && !modal.hidden) {
        closeAssignment();
    }

});


/* =========================================
   SEARCH AND FILTER EVENTS
========================================= */

searchInput.addEventListener("input", renderRequests);

statusFilter.addEventListener("change", renderRequests);

cleanerFilter.addEventListener("change", renderRequests);


/* =========================================
   RESET DEMO DATA
========================================= */

// The button is optional. This prevents an error
// if resetDemoBtn is not present in the HTML.

const resetButton = document.getElementById("resetDemoBtn");

if (resetButton) {

    resetButton.addEventListener("click", () => {

        if (!confirm("Reset all assignments to the original sample data?")) {
            return;
        }

        requests = sampleRequests.map(normalizeRequest);

        if (saveRequests()) {

            searchInput.value = "";
            statusFilter.value = "All";
            cleanerFilter.value = "All";

            renderRequests();
        }

    });

}


/* =========================================
   INITIALISE PAGE
========================================= */

populateCleanerFilters();

renderRequests();