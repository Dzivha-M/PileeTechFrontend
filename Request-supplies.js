
/* =========================================================
   PILEE TECH GROUP
   CLEANER DASHBOARD - REQUEST SUPPLIES
   File: Request-supplies.js
========================================================= */


/* =========================================================
   1. AVAILABLE SUPPLIES
========================================================= */

const supplies = {

    machines: [
        { id: "vacuum", name: "Vacuum cleaner", icon: "vacuum" },
        { id: "polisher", name: "Floor polisher", icon: "polisher" },
        { id: "pressure", name: "Pressure washer", icon: "washer" },
        { id: "extractor", name: "Carpet extractor", icon: "extractor" },
        { id: "steam", name: "Steam cleaner", icon: "steam" },
        { id: "blower", name: "Leaf blower", icon: "blower" },
        { id: "wet-dry", name: "Wet & dry vacuum", icon: "vacuum" },
        { id: "scrubber", name: "Floor scrubber", icon: "polisher" }
    ],

    products: [
        { id: "all-purpose", name: "All-purpose cleaner", icon: "bottle" },
        { id: "glass", name: "Glass cleaner", icon: "spray" },
        { id: "disinfectant", name: "Disinfectant", icon: "bottle" },
        { id: "floor", name: "Floor cleaner", icon: "bottle" },
        { id: "toilet", name: "Toilet cleaner", icon: "bottle" },
        { id: "degreaser", name: "Degreaser", icon: "spray" },
        { id: "bin-liners", name: "Bin liners", icon: "bag" },
        { id: "cloths", name: "Microfibre cloths", icon: "cloth" }
    ],

    tools: [
        { id: "mop", name: "Mop & bucket", icon: "mop" },
        { id: "broom", name: "Broom", icon: "broom" },
        { id: "brush", name: "Cleaning brush", icon: "brush" },
        { id: "squeegee", name: "Window squeegee", icon: "squeegee" },
        { id: "gloves", name: "Protective gloves", icon: "gloves" },
        { id: "goggles", name: "Safety goggles", icon: "goggles" },
        { id: "trolley", name: "Cleaning trolley", icon: "trolley" },
        { id: "sign", name: "Wet floor sign", icon: "sign" }
    ]

};


/* =========================================================
   2. CATEGORY NAMES
========================================================= */

const categoryNames = {

    machines: "Machines",
    products: "Cleaning products",
    tools: "Tools & gear"

};


/* =========================================================
   3. SVG ICONS
========================================================= */

const icons = {

    vacuum: `
        <path d="M7 4h7v10a4 4 0 1 0 4 4"/>
        <path d="M14 14h5v5"/>
        <circle cx="17" cy="20" r="3"/>
        <path d="M7 4v4H4"/>
    `,

    polisher: `
        <circle cx="14" cy="16" r="6"/>
        <circle cx="14" cy="16" r="2"/>
        <path d="M14 10V4M10 4h8"/>
    `,

    washer: `
        <path d="M3 13h11l4-4h4v5h-4l-4 3H3z"/>
        <path d="M7 20v-2M12 20v-2M17 20v-2"/>
    `,

    extractor: `
        <rect x="3" y="5" width="18" height="13" rx="2"/>
        <path d="M7 10h10M7 14h7M8 21h8"/>
    `,

    steam: `
        <rect x="4" y="10" width="16" height="10" rx="2"/>
        <path d="M8 7c-2-2 2-3 0-5"/>
        <path d="M13 7c-2-2 2-3 0-5"/>
        <path d="M18 7c-2-2 2-3 0-5"/>
    `,

    blower: `
        <path d="M3 11h10l7-4v10l-7-4H3z"/>
        <path d="M20 12h2M21 9l1-1M21 15l1 1"/>
    `,

    bottle: `
        <path d="M9 3h6M10 3v4l-3 3v10h10V10l-3-3V3"/>
        <path d="M7 12h10"/>
    `,

    spray: `
        <path d="M9 7h8l2 3v10H7V10z"/>
        <path d="M11 7V4h7l3 2M18 4h3M10 13h6"/>
    `,

    bag: `
        <path d="M5 8h14l-1 13H6z"/>
        <path d="M9 8V5a3 3 0 0 1 6 0v3"/>
    `,

    cloth: `
        <path d="M4 5h16v14H4z"/>
        <path d="M4 9h16M8 5v14M15 5v14"/>
    `,

    mop: `
        <path d="M16 3 8 16"/>
        <path d="M5 15l7 4-3 3-7-4z"/>
    `,

    broom: `
        <path d="M17 3 8 16"/>
        <path d="M4 15l8 5-4 3-7-5z"/>
    `,

    brush: `
        <path d="M8 4h8v9H8z"/>
        <path d="M10 13v5M13 13v5M16 13v5M12 4V2"/>
    `,

    squeegee: `
        <path d="M4 5h16M12 5v15M8 20h8"/>
    `,

    gloves: `
        <path d="M7 12V5a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-6a1.5 1.5 0 0 1 3 0v7l1-3a1.5 1.5 0 0 1 3 1l-2 8c-.5 2-2 3-4 3h-3c-2 0-3-1-4-3l-3-4a1.5 1.5 0 0 1 3-1z"/>
    `,

    goggles: `
        <path d="M3 10h18l-2 7h-5l-2-3-2 3H5z"/>
        <path d="M3 10 2 7M21 10l1-3"/>
    `,

    trolley: `
        <path d="M4 4h3l2 13h10l2-9H8"/>
        <circle cx="11" cy="21" r="1"/>
        <circle cx="18" cy="21" r="1"/>
    `,

    sign: `
        <path d="M12 3 3 20h18z"/>
        <path d="M12 9v5M12 17h.01"/>
    `

};


/* =========================================================
   4. PAGE ELEMENTS
========================================================= */

const grid = document.querySelector("#supply-grid");

const categoryTitle = document.querySelector("#category-title");

const requestBox = document.querySelector("#request-box");

const selectionCount = document.querySelector("#selection-count");

const mobileSelectionCount = document.querySelector(
    "#mobile-selection-count"
);

const sendButtons = [

    document.querySelector("#send-request"),

    document.querySelector("#send-request-mobile")

].filter(Boolean);

const requestForm = document.querySelector("#request-form");

const confirmationDialog = document.querySelector(
    "#confirmation-dialog"
);

const confirmationMessage = document.querySelector(
    "#confirmation-message"
);

const closeDialogButton = document.querySelector("#close-dialog");

const jobLocation = document.querySelector("#job-location");

const requestDate = document.querySelector("#request-date");

const supervisorNote = document.querySelector("#supervisor-note");

const historyTable = document.querySelector(
    "#supply-request-history"
);

const historyTotal = document.querySelector("#history-total");


/* =========================================================
   5. PAGE SETTINGS
========================================================= */

const HISTORY_KEY = "pileeCleanerSupplyRequests_v1";

const selectedItems = new Map();

let activeCategory = "machines";


/* =========================================================
   6. DISPLAY AVAILABLE SUPPLIES
========================================================= */

function renderSupplies() {

    if (!grid || !categoryTitle) return;

    categoryTitle.textContent = categoryNames[activeCategory];

    grid.innerHTML = "";

    supplies[activeCategory].forEach(item => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "supply-card";

        button.dataset.id = item.id;

        const isSelected = selectedItems.has(item.id);

        button.classList.toggle("selected", isSelected);

        button.setAttribute("aria-pressed", String(isSelected));


        // Supply icon

        const icon = document.createElement("span");

        icon.className = "supply-icon";

        icon.setAttribute("aria-hidden", "true");

        icon.innerHTML = `
            <svg viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 stroke-width="1.7"
                 stroke-linecap="round"
                 stroke-linejoin="round">

                ${icons[item.icon] || icons.bottle}

            </svg>
        `;


        // Supply name

        const name = document.createElement("span");

        name.className = "supply-name";

        name.textContent = item.name;


        button.append(icon, name);

        button.addEventListener("click", () => {

            toggleSupply(item);

        });

        grid.appendChild(button);

    });

}


/* =========================================================
   7. ADD OR REMOVE SUPPLIES
========================================================= */

function toggleSupply(item) {

    if (selectedItems.has(item.id)) {

        selectedItems.delete(item.id);

    } else {

        selectedItems.set(item.id, {

            ...item,

            category: categoryNames[activeCategory],

            quantity: 1

        });

    }

    renderSupplies();

    renderRequest();

}


/* =========================================================
   8. DISPLAY SELECTED REQUEST ITEMS
========================================================= */

function renderRequest() {

    if (!requestBox) return;

    requestBox.innerHTML = "";

    if (selectedItems.size === 0) {

        const empty = document.createElement("p");

        empty.className = "empty-message";

        empty.textContent = "Tap an item above to add it.";

        requestBox.appendChild(empty);

    } else {

        selectedItems.forEach(item => {

            const row = document.createElement("div");

            row.className = "request-item";


            // Supply information

            const details = document.createElement("div");

            const name = document.createElement("span");

            name.className = "request-item-name";

            name.textContent = item.name;

            const category = document.createElement("span");

            category.className = "request-item-category";

            category.textContent = item.category;

            details.append(name, category);


            // Quantity controls

            const quantity = document.createElement("div");

            quantity.className = "quantity-control";


            // Decrease quantity

            const minus = document.createElement("button");

            minus.type = "button";

            minus.textContent = "−";

            minus.setAttribute(
                "aria-label",
                `Decrease ${item.name} quantity`
            );

            minus.addEventListener("click", () => {

                const current = selectedItems.get(item.id);

                if (current.quantity > 1) {

                    current.quantity--;

                } else {

                    selectedItems.delete(item.id);

                }

                renderSupplies();

                renderRequest();

            });


            // Quantity number

            const number = document.createElement("span");

            number.className = "quantity-number";

            number.textContent = item.quantity;


            // Increase quantity

            const plus = document.createElement("button");

            plus.type = "button";

            plus.textContent = "+";

            plus.setAttribute(
                "aria-label",
                `Increase ${item.name} quantity`
            );

            plus.addEventListener("click", () => {

                selectedItems.get(item.id).quantity++;

                renderRequest();

            });


            quantity.append(minus, number, plus);


            // Remove item

            const remove = document.createElement("button");

            remove.type = "button";

            remove.className = "remove-item";

            remove.textContent = "×";

            remove.setAttribute(
                "aria-label",
                `Remove ${item.name}`
            );

            remove.addEventListener("click", () => {

                selectedItems.delete(item.id);

                renderSupplies();

                renderRequest();

            });


            row.append(details, quantity, remove);

            requestBox.appendChild(row);

        });

    }


    // Calculate total selected quantity

    const totalQuantity = [...selectedItems.values()]

        .reduce((sum, item) => sum + item.quantity, 0);


    const countText = totalQuantity === 0

        ? "Nothing selected yet"

        : `${totalQuantity} item${totalQuantity === 1 ? "" : "s"} selected`;


    // Update desktop count

    if (selectionCount) {

        selectionCount.textContent = countText;

    }


    // Update mobile count

    if (mobileSelectionCount) {

        mobileSelectionCount.textContent = countText;

    }


    // Enable or disable submit buttons

    sendButtons.forEach(button => {

        button.disabled = selectedItems.size === 0;

    });

}


/* =========================================================
   9. SWITCH SUPPLY CATEGORIES
========================================================= */

document.querySelectorAll(".tab").forEach(tab => {

    tab.addEventListener("click", () => {

        const category = tab.dataset.category;

        if (!supplies[category]) return;

        activeCategory = category;

        document.querySelectorAll(".tab").forEach(otherTab => {

            const isActive = otherTab === tab;

            otherTab.classList.toggle("active", isActive);

            otherTab.setAttribute(
                "aria-selected",
                String(isActive)
            );

        });

        renderSupplies();

    });

});


/* =========================================================
   10. DATE FORMATTING
========================================================= */

function formatRequestDate(dateValue) {

    if (!dateValue) return "Not specified";

    const date = new Date(dateValue + "T00:00:00");

    return date.toLocaleDateString("en-ZA", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}


function formatSubmittedDate(dateValue) {

    return new Date(dateValue).toLocaleDateString("en-ZA", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });

}


/* =========================================================
   11. LOAD SAVED SUPPLY REQUESTS
========================================================= */

function getSupplyRequests() {

    try {

        const saved = localStorage.getItem(HISTORY_KEY);

        const requests = saved ? JSON.parse(saved) : [];

        return Array.isArray(requests) ? requests : [];

    } catch (error) {

        console.error("Error loading supply requests:", error);

        return [];

    }

}


/* =========================================================
   12. SAVE NEW SUPPLY REQUEST
========================================================= */

function saveSupplyRequest(site, date, note) {

    const requests = getSupplyRequests();

    const newRequest = {

        id: "SUP-" + Date.now(),

        items: [...selectedItems.values()].map(item => ({

            id: item.id,

            name: item.name,

            category: item.category,

            quantity: item.quantity

        })),

        location: site,

        requiredDate: date,

        submittedDate: new Date().toISOString(),

        note: note,

        status: "Pending Review"

    };


    // Add newest request to the beginning

    requests.unshift(newRequest);


    // Save requests

    try {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(requests)
        );

    } catch (error) {

        console.error("Could not save supply request:", error);

        alert(
            "Your request could not be saved in this browser. Please try again."
        );

        return false;

    }


    // Refresh request history

    renderSupplyHistory();

    return newRequest;

}


/* =========================================================
   13. SAFE HTML TEXT
========================================================= */

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({

        "&": "&amp;",

        "<": "&lt;",

        ">": "&gt;",

        '"': "&quot;",

        "'": "&#039;"

    })[character]);

}


/* =========================================================
   14. DISPLAY REQUEST HISTORY TABLE
========================================================= */

function renderSupplyHistory() {

    if (!historyTable) return;

    const requests = getSupplyRequests();

    historyTable.innerHTML = "";


    // Update total requests

    if (historyTotal) {

        historyTotal.textContent = requests.length;

    }


    // Empty history

    if (requests.length === 0) {

        historyTable.innerHTML = `

            <tr class="empty-history">

                <td colspan="6">

                    No supply requests have been submitted yet.

                </td>

            </tr>

        `;

        return;

    }


    // Display each request

    requests.forEach(request => {

        const row = document.createElement("tr");


        // Supply names and quantities

        const items = Array.isArray(request.items)

            ? request.items.map(item => {

                return `${item.quantity} × ${item.name}`;

            }).join(", ")

            : "No items recorded";


        // Format dates

        const requiredDate = formatRequestDate(
            request.requiredDate
        );

        const submittedDate = formatSubmittedDate(
            request.submittedDate
        );


        // Status styling

        const statusClasses = {

            "Pending Review": "pending",

            "Approved": "approved",

            "Declined": "declined",

            "Issued": "issued"

        };

        const statusClass =
            statusClasses[request.status] || "pending";


        // Build row

        row.innerHTML = `

            <td>

                <strong>
                    ${escapeHTML(request.id)}
                </strong>

            </td>

            <td class="history-items">

                ${escapeHTML(items)}

            </td>

            <td>

                ${escapeHTML(request.location)}

            </td>

            <td>

                ${escapeHTML(requiredDate)}

            </td>

            <td>

                ${escapeHTML(submittedDate)}

            </td>

            <td>

                <span class="status-badge ${statusClass}">

                    ${escapeHTML(request.status || "Pending Review")}

                </span>

            </td>

        `;

        historyTable.appendChild(row);

    });

}


/* =========================================================
   15. SUBMIT SUPPLY REQUEST
========================================================= */

requestForm.addEventListener("submit", event => {

    event.preventDefault();


    // Check selected supplies

    if (selectedItems.size === 0) {

        return;

    }


    // Validate form fields

    if (!requestForm.reportValidity()) {

        return;

    }


    // Collect form information

    const site = jobLocation.value.trim();

    const date = requestDate.value;

    const note = supervisorNote.value.trim();


    // Prepare supply details

    const items = [...selectedItems.values()]

        .map(item => `${item.quantity} × ${item.name}`)

        .join(", ");


    // Save request before confirming

    const savedRequest = saveSupplyRequest(site, date, note);

    if (!savedRequest) return;


    // Confirmation message

    confirmationMessage.textContent =

        `Your request for ${items} has been submitted successfully. ` +

        `Job location: ${site}. ` +

        `Required date: ${formatRequestDate(date)}. ` +

        `Reference: ${savedRequest.id}.` +

        (note ? ` Supervisor note: ${note}` : "");


    // Display confirmation popup

    if (typeof confirmationDialog.showModal === "function") {

        confirmationDialog.showModal();

    } else {

        alert(
            "Request Submitted Successfully! Reference: " +
            savedRequest.id
        );

        resetRequestForm();

    }

});


/* =========================================================
   16. RESET REQUEST FORM
========================================================= */

function resetRequestForm() {

    // Clear selected supplies

    selectedItems.clear();


    // Reset all form inputs

    requestForm.reset();


    // Return to Machines category

    activeCategory = "machines";


    // Reset category tabs

    document.querySelectorAll(".tab").forEach(tab => {

        const isActive = tab.dataset.category === "machines";

        tab.classList.toggle("active", isActive);

        tab.setAttribute(
            "aria-selected",
            String(isActive)
        );

    });


    // Reset optional urgency styling

    document.querySelectorAll(".urgency-option").forEach(option => {

        option.classList.remove("selected");

    });


    // Refresh supply cards and request area

    renderSupplies();

    renderRequest();

    renderSupplyHistory();

}


/* =========================================================
   17. CLOSE CONFIRMATION POPUP
========================================================= */

closeDialogButton.addEventListener("click", () => {

    confirmationDialog.close();

    resetRequestForm();

});


/* =========================================================
   18. URGENCY BUTTON STYLING
========================================================= */

document.querySelectorAll('input[name="urgency"]').forEach(radio => {

    radio.addEventListener("change", () => {

        document.querySelectorAll(".urgency-option").forEach(option => {

            const input = option.querySelector("input");

            option.classList.toggle(
                "selected",
                input.checked
            );

        });

    });

});


/* =========================================================
   19. INITIALISE PAGE
========================================================= */

renderSupplies();

renderRequest();

renderSupplyHistory();
