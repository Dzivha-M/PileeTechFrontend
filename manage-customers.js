
const STORAGE_KEY = "pileeTechCustomers_v1";

const sampleCustomers = [
    {
        id: "CUS-10021",
        name: "Mqondisi Ndlovu",
        email: "mqondisi@example.com",
        phone: "071 234 5678",
        address: "Pretoria, Gauteng",
        status: "Active"
    },
    {
        id: "CUS-10022",
        name: "Thando Mokoena",
        email: "thando@example.com",
        phone: "072 345 6789",
        address: "Centurion, Gauteng",
        status: "Active"
    },
    {
        id: "CUS-10023",
        name: "Lerato Dlamini",
        email: "lerato@example.com",
        phone: "073 456 7890",
        address: "Midrand, Gauteng",
        status: "Inactive"
    },
    {
        id: "CUS-10024",
        name: "Sipho Khumalo",
        email: "sipho@example.com",
        phone: "074 567 8901",
        address: "Johannesburg, Gauteng",
        status: "Active"
    }
];

const tableBody = document.getElementById("customerTableBody");
const searchInput = document.getElementById("customerSearch");
const statusFilter = document.getElementById("statusFilter");
const emptyMessage = document.getElementById("emptyMessage");

const modal = document.getElementById("customerModal");
const form = document.getElementById("customerForm");

let customers = loadCustomers();

function loadCustomers() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [...sampleCustomers];
    } catch (error) {
        console.error("Could not load customers:", error);
        return [...sampleCustomers];
    }
}

function saveCustomers() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (error) {
        alert("The browser could not save customer data.");
        console.error(error);
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function updateStats() {
    document.getElementById("totalCustomers").textContent =
        customers.length;

    document.getElementById("activeCustomers").textContent =
        customers.filter(customer => customer.status === "Active").length;

    document.getElementById("inactiveCustomers").textContent =
        customers.filter(customer => customer.status === "Inactive").length;
}

function renderCustomers() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = [
            customer.id,
            customer.name,
            customer.email,
            customer.phone,
            customer.address
        ].some(value => String(value).toLowerCase().includes(searchTerm));

        const matchesStatus =
            selectedStatus === "all" ||
            customer.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    tableBody.innerHTML = filteredCustomers.map(customer => {
        const isActive = customer.status === "Active";

        return `
            <tr>
                <td>
                    <span class="mc-customer-name">
                        ${escapeHTML(customer.name)}
                    </span>
                    <span class="mc-customer-email">
                        ${escapeHTML(customer.email)}
                    </span>
                </td>

                <td>
                    <span class="mc-id">${escapeHTML(customer.id)}</span>
                </td>

                <td>
                    ${escapeHTML(customer.phone)}
                    <span class="mc-subtext">Phone number</span>
                </td>

                <td>${escapeHTML(customer.address)}</td>

                <td>
                    <span class="mc-status ${isActive ? "active" : "inactive"}">
                        ${escapeHTML(customer.status)}
                    </span>
                </td>

                <td>
                    <div class="mc-actions">
                        <button class="mc-action"
                            data-action="edit"
                            data-id="${escapeHTML(customer.id)}">
                            Edit
                        </button>

                        <button class="mc-action ${isActive ? "deactivate" : ""}"
                            data-action="toggle"
                            data-id="${escapeHTML(customer.id)}">
                            ${isActive ? "Deactivate" : "Activate"}
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");

    emptyMessage.hidden = filteredCustomers.length > 0;
    updateStats();
}

function openModal(customer = null) {
    form.reset();

    document.getElementById("customerId").value = customer?.id || "";
    document.getElementById("fullName").value = customer?.name || "";
    document.getElementById("email").value = customer?.email || "";
    document.getElementById("phone").value = customer?.phone || "";
    document.getElementById("address").value = customer?.address || "";
    document.getElementById("accountStatus").value =
        customer?.status || "Active";

    document.getElementById("modalTitle").textContent =
        customer ? "Edit Customer" : "Add Customer";

    modal.hidden = false;
    document.getElementById("fullName").focus();
}

function closeModal() {
    modal.hidden = true;
}

document.getElementById("addCustomerBtn").addEventListener("click", () => {
    openModal();
});

document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelBtn").addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
});

form.addEventListener("submit", event => {
    event.preventDefault();

    const existingId = document.getElementById("customerId").value;

    const customerData = {
        name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        status: document.getElementById("accountStatus").value
    };

    if (Object.values(customerData).some(value => !value)) {
        alert("Please complete all customer fields.");
        return;
    }

    const duplicateEmail = customers.some(customer =>
        customer.email.toLowerCase() === customerData.email.toLowerCase() &&
        customer.id !== existingId
    );

    if (duplicateEmail) {
        alert("A customer with this email address already exists.");
        return;
    }

    if (existingId) {
        const index = customers.findIndex(customer => customer.id === existingId);

        if (index !== -1) {
            customers[index] = {
                ...customers[index],
                ...customerData
            };
        }
    } else {
        const nextNumber = customers.reduce((highest, customer) => {
            const number = Number(customer.id.replace("CUS-", "")) || 10020;
            return Math.max(highest, number);
        }, 10020) + 1;

        customers.push({
            id: `CUS-${nextNumber}`,
            ...customerData
        });
    }

    saveCustomers();
    renderCustomers();
    closeModal();
});

tableBody.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const customer = customers.find(item => item.id === button.dataset.id);
    if (!customer) return;

    if (button.dataset.action === "edit") {
        openModal(customer);
        return;
    }

    if (button.dataset.action === "toggle") {
        const nextStatus = customer.status === "Active" ? "Inactive" : "Active";
        const action = nextStatus === "Inactive" ? "deactivate" : "activate";

        if (!confirm(`Are you sure you want to ${action} ${customer.name}'s account?`)) {
            return;
        }

        customer.status = nextStatus;
        saveCustomers();
        renderCustomers();
    }
});

searchInput.addEventListener("input", renderCustomers);
statusFilter.addEventListener("change", renderCustomers);

renderCustomers();
