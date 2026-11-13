
// ==========================================
// PILEE TECH — MANAGE PAYMENTS
// 
// ==========================================

"use strict";

const STORAGE_KEY = "pileetechPayments";

const samplePayments = [
    {
        id: "PAY-1001",
        customer: "Thando Mokoena",
        email: "thando@example.com",
        service: "Home Cleaning",
        date: "2026-10-15",
        method: "Card",
        amount: 650,
        status: "Completed"
    },
    {
        id: "PAY-1002",
        customer: "Lerato Nkosi",
        email: "lerato@example.com",
        service: "Office Cleaning",
        date: "2026-10-14",
        method: "EFT",
        amount: 1200,
        status: "Pending"
    },
    {
        id: "PAY-1003",
        customer: "Sipho Dlamini",
        email: "sipho@example.com",
        service: "Deep Cleaning",
        date: "2026-10-13",
        method: "PayPal",
        amount: 950,
        status: "Completed"
    },
    {
        id: "PAY-1004",
        customer: "Ayanda Khumalo",
        email: "ayanda@example.com",
        service: "Window Cleaning",
        date: "2026-10-12",
        method: "Card",
        amount: 450,
        status: "Failed"
    },
    {
        id: "PAY-1005",
        customer: "Nomsa Zulu",
        email: "nomsa@example.com",
        service: "Home Cleaning",
        date: "2026-10-11",
        method: "EFT",
        amount: 700,
        status: "Completed"
    },
    {
        id: "PAY-1006",
        customer: "Kabelo Molefe",
        email: "kabelo@example.com",
        service: "Move-out Cleaning",
        date: "2026-10-10",
        method: "Card",
        amount: 1500,
        status: "Refunded"
    }
];

const tableBody = document.getElementById("paymentTableBody");
const searchInput = document.getElementById("paymentSearch");
const statusFilter = document.getElementById("statusFilter");
const methodFilter = document.getElementById("methodFilter");
const tableFooter = document.getElementById("tableFooter");

const detailsPanel = document.getElementById("detailsPanel");
const paymentDetails = document.getElementById("paymentDetails");

let selectedPaymentId = null;

// Load saved demo data or use the sample transactions.
function loadPayments() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.warn("Could not load saved payment data.", error);
    }

    return samplePayments.map(payment => ({ ...payment }));
}

let payments = loadPayments();

// Format amounts in South African rand.
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR"
    }).format(Number(amount) || 0);
}

// Prevent user data from being interpreted as HTML.
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Convert a date to a readable format.
function formatDate(date) {
    if (!date) return "—";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
        return escapeHTML(date);
    }

    return parsed.toLocaleDateString("en-ZA", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

// Save demo data in this browser.
function savePayments() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
    } catch (error) {
        console.warn("Could not save payment data.", error);
    }
}

// Update summary cards.
function updateStatistics() {
    const completed = payments.filter(
        payment => payment.status === "Completed"
    );

    const pending = payments.filter(
        payment => payment.status === "Pending"
    );

    const revenue = completed.reduce(
        (total, payment) => total + (Number(payment.amount) || 0),
        0
    );

    document.getElementById("totalRevenue").textContent =
        formatCurrency(revenue);

    document.getElementById("completedCount").textContent =
        completed.length;

    document.getElementById("pendingCount").textContent =
        pending.length;

    document.getElementById("transactionCount").textContent =
        payments.length;
}

// Apply search and filters.
function getFilteredPayments() {
    const query = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const method = methodFilter.value;

    return payments.filter(payment => {
        const searchable = [
            payment.id,
            payment.customer,
            payment.email,
            payment.service,
            payment.method,
            payment.status
        ].join(" ").toLowerCase();

        const matchesSearch = searchable.includes(query);
        const matchesStatus =
            status === "all" || payment.status === status;
        const matchesMethod =
            method === "all" || payment.method === method;

        return matchesSearch && matchesStatus && matchesMethod;
    });
}

// Display transaction rows.
function renderPayments() {
    const filtered = getFilteredPayments();

    if (filtered.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    No payment transactions found.
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = filtered.map(payment => {
            const statusClass = String(payment.status)
                .toLowerCase()
                .replace(/[^a-z]/g, "");

            return `
                <tr>
                    <td>
                        <span class="transaction-id">
                            ${escapeHTML(payment.id)}
                        </span>
                    </td>
                    <td>
                        <span class="customer-name">
                            ${escapeHTML(payment.customer)}
                        </span>
                        <span class="customer-email">
                            ${escapeHTML(payment.email)}
                        </span>
                    </td>
                    <td>${escapeHTML(payment.service)}</td>
                    <td>${formatDate(payment.date)}</td>
                    <td>${escapeHTML(payment.method)}</td>
                    <td>
                        <span class="amount">
                            ${formatCurrency(payment.amount)}
                        </span>
                    </td>
                    <td>
                        <span class="status ${statusClass}">
                            ${escapeHTML(payment.status)}
                        </span>
                    </td>
                    <td>
                        <button
                            type="button"
                            class="view-button"
                            data-payment-id="${escapeHTML(payment.id)}">
                            View
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    tableFooter.textContent =
        `Showing ${filtered.length} of ${payments.length} transactions.`;

    updateStatistics();
}

// Display information for a selected transaction.
function showPaymentDetails(paymentId) {
    const payment = payments.find(item => item.id === paymentId);

    if (!payment) return;

    selectedPaymentId = payment.id;

    const fields = [
        ["Transaction ID", payment.id],
        ["Customer", payment.customer],
        ["Email", payment.email],
        ["Service", payment.service],
        ["Payment Date", formatDate(payment.date)],
        ["Payment Method", payment.method],
        ["Amount", formatCurrency(payment.amount)],
        ["Status", payment.status]
    ];

    paymentDetails.innerHTML = fields.map(([label, value]) => `
        <div class="detail-item">
            <span>${escapeHTML(label)}</span>
            <strong>${escapeHTML(value)}</strong>
        </div>
    `).join("");

    detailsPanel.hidden = false;
    detailsPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Close the details section.
function closePaymentDetails() {
    detailsPanel.hidden = true;
    selectedPaymentId = null;
}

// Export currently filtered transactions as CSV.
function exportPayments() {
    const filtered = getFilteredPayments();

    if (filtered.length === 0) {
        alert("There are no transactions to export.");
        return;
    }

    const columns = [
        ["Transaction ID", "id"],
        ["Customer", "customer"],
        ["Email", "email"],
        ["Service", "service"],
        ["Date", "date"],
        ["Payment Method", "method"],
        ["Amount (ZAR)", "amount"],
        ["Status", "status"]
    ];

    // Escape CSV cells and protect spreadsheet users from formulas.
    function csvCell(value) {
        let text = String(value ?? "");

        if (/^[\s]*[=+\-@\t\r]/.test(text)) {
            text = "'" + text;
        }

        return `"${text.replace(/"/g, '""')}"`;
    }

    const rows = [
        columns.map(([label]) => csvCell(label)).join(","),
        ...filtered.map(payment =>
            columns.map(([, key]) => csvCell(payment[key])).join(",")
        )
    ];

    const blob = new Blob(
        ["\uFEFF" + rows.join("\r\n")],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pilee-tech-payments.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

// Event listeners.
searchInput.addEventListener("input", renderPayments);
statusFilter.addEventListener("change", renderPayments);
methodFilter.addEventListener("change", renderPayments);

tableBody.addEventListener("click", event => {
    const button = event.target.closest("[data-payment-id]");

    if (button) {
        showPaymentDetails(button.dataset.paymentId);
    }
});

document.getElementById("closeDetailsButton")
    .addEventListener("click", closePaymentDetails);

document.getElementById("exportButton")
    .addEventListener("click", exportPayments);

document.getElementById("printButton")
    .addEventListener("click", () => {
        if (selectedPaymentId) {
            window.print();
        }
    });

// Initial render.
renderPayments();

/* ==========================================
   PILEE TECH - EXPORT PAYMENTS TO EXCEL
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const exportButton = document.getElementById("exportButton");

    if (!exportButton) {
        return;
    }

    exportButton.addEventListener("click", function () {

        // Check whether the Excel library loaded.
        if (typeof XLSX === "undefined") {
            alert(
                "The Excel export library could not be loaded. " +
                "Please check your internet connection and try again."
            );
            return;
        }

        // Get the payment table.
        const table = document.querySelector(".payment-table");

        if (!table) {
            alert("The payment transactions table could not be found.");
            return;
        }

        const tableBody = document.getElementById("paymentTableBody");

        if (!tableBody || tableBody.rows.length === 0) {
            alert("There are no payment transactions to export.");
            return;
        }

        // Read the visible table headers.
        const headers = Array.from(table.querySelectorAll("thead th"))
            .map(header => header.innerText.trim());

        // Exclude the Action column from the spreadsheet.
        const actionIndex = headers.findIndex(
            header => header.toLowerCase() === "action"
        );

        const exportHeaders = headers.filter(
            (_, index) => index !== actionIndex
        );

        // Extract payment transaction rows.
        const rows = Array.from(tableBody.querySelectorAll("tr"))
            .filter(row => row.getClientRects().length > 0)
            .map(row => {
                const cells = Array.from(row.querySelectorAll("td"));

                return cells
                    .filter((_, index) => index !== actionIndex)
                    .map(cell => cell.innerText.trim());
            })
            .filter(row => row.length > 0);

        if (rows.length === 0) {
            alert("There are no visible transactions to export.");
            return;
        }

        // Build the Excel worksheet.
        const worksheet = XLSX.utils.aoa_to_sheet([
            ["PILEE TECH - PAYMENT TRANSACTIONS"],
            ["Exported on", new Date().toLocaleString("en-ZA")],
            [],
            exportHeaders,
            ...rows
        ]);

        // Style column widths for readability.
        worksheet["!cols"] = [
            { wch: 20 }, // Transaction
            { wch: 25 }, // Customer
            { wch: 25 }, // Service
            { wch: 18 }, // Date
            { wch: 22 }, // Method
            { wch: 16 }, // Amount
            { wch: 16 }  // Status
        ];

        // Create workbook and add worksheet.
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Payment Transactions"
        );

        // Generate a date-based filename.
        const today = new Date().toISOString().slice(0, 10);

        const filename = `PileeTech_Payments_${today}.xlsx`;

        // Download the Excel file.
        XLSX.writeFile(workbook, filename);

    });

});