/* ==========================================
   PILEE TECH — REPORTS & ANALYTICS
   Search, filters, tabs and Excel exports
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. GET HTML ELEMENTS
    // ==========================================

    const customerTab = document.getElementById("customerTab");
    const cleanerTab = document.getElementById("cleanerTab");

    const customerReport = document.getElementById("customerReport");
    const cleanerReport = document.getElementById("cleanerReport");

    const exportCustomersButton =
        document.getElementById("exportCustomers");

    const exportCleanersButton =
        document.getElementById("exportCleaners");

    const exportAllButton =
        document.getElementById("exportAllReports");


    // ==========================================
    // 2. SWITCH BETWEEN CUSTOMER AND CLEANER REPORTS
    // ==========================================

    function showReport(type) {

        const showCustomers = type === "customers";

        customerReport.hidden = !showCustomers;
        cleanerReport.hidden = showCustomers;

        customerTab.classList.toggle("active", showCustomers);
        cleanerTab.classList.toggle("active", !showCustomers);

        customerTab.setAttribute(
            "aria-selected",
            String(showCustomers)
        );

        cleanerTab.setAttribute(
            "aria-selected",
            String(!showCustomers)
        );
    }

    customerTab.addEventListener("click", () => {
        showReport("customers");
    });

    cleanerTab.addEventListener("click", () => {
        showReport("cleaners");
    });


    // ==========================================
    // 3. SEARCH AND FILTER REPORT TABLES
    // ==========================================

    function setupReport(
        searchId,
        filterId,
        tableBodyId,
        emptyId,
        countId,
        noun
    ) {

        const search = document.getElementById(searchId);
        const filter = document.getElementById(filterId);
        const tableBody = document.getElementById(tableBodyId);
        const empty = document.getElementById(emptyId);
        const count = document.getElementById(countId);

        const rows = Array.from(
            tableBody.querySelectorAll("tr")
        );

        function update() {

            const query = search.value.trim().toLowerCase();
            const selectedStatus = filter.value;

            let visibleCount = 0;

            rows.forEach(row => {

                const matchesSearch = row.textContent
                    .toLowerCase()
                    .includes(query);

                const matchesStatus =
                    selectedStatus === "all" ||
                    row.dataset.status === selectedStatus;

                const visible = matchesSearch && matchesStatus;

                row.hidden = !visible;

                if (visible) {
                    visibleCount++;
                }
            });

            // Show or hide the empty-results message.
            empty.hidden = visibleCount > 0;

            // Update the number of visible records.
            count.textContent =
                `${visibleCount} ${noun}${visibleCount === 1 ? "" : "s"}`;
        }

        search.addEventListener("input", update);
        filter.addEventListener("change", update);

        update();

        // Return only the rows currently displayed by the filters.
        return function getVisibleRows() {
            return rows.filter(row => !row.hidden);
        };
    }


    // Customer report
    const getVisibleCustomers = setupReport(
        "customerSearch",
        "customerFilter",
        "customerTableBody",
        "customerEmpty",
        "customerCount",
        "customer"
    );


    // Cleaner report
    const getVisibleCleaners = setupReport(
        "cleanerSearch",
        "cleanerFilter",
        "cleanerTableBody",
        "cleanerEmpty",
        "cleanerCount",
        "cleaner"
    );


    // ==========================================
    // 4. PREPARE TABLE DATA FOR EXCEL
    // ==========================================

    function getReportData(table, visibleRows) {

        if (!table) {
            return [];
        }

        // Extract the column headings.
        const headers = Array.from(
            table.querySelectorAll("thead th")
        ).map(header => header.innerText.trim());

        // Extract only the visible, filtered rows.
        const dataRows = visibleRows.map(row => {

            return Array.from(
                row.querySelectorAll("td")
            ).map(cell => {

                // Keep the cleaner/customer details readable.
                return cell.innerText
                    .replace(/\s+/g, " ")
                    .trim();
            });

        });

        return [headers, ...dataRows];
    }


    // ==========================================
    // 5. FORMAT EXCEL WORKSHEETS
    // ==========================================

    function createWorksheet(data) {

        const worksheet = XLSX.utils.aoa_to_sheet(data);

        // Set suitable widths for the columns.
        const columnCount = Math.max(
            1,
            ...data.map(row => row.length)
        );

        worksheet["!cols"] = Array.from(
            { length: columnCount },
            (_, index) => {

                const longestLength = Math.max(
                    0,
                    ...data.map(row =>
                        String(row[index] ?? "").length
                    )
                );

                return {
                    wch: Math.min(
                        Math.max(longestLength + 3, 12),
                        35
                    )
                };
            }
        );

        // Freeze the heading row.
        worksheet["!freeze"] = {
            xSplit: 0,
            ySplit: 1
        };

        return worksheet;
    }


    // ==========================================
    // 6. CHECK EXCEL LIBRARY
    // ==========================================

    function excelLibraryAvailable() {

        if (typeof XLSX === "undefined") {

            alert(
                "Excel export is unavailable because the Excel library " +
                "could not load. Check your internet connection and " +
                "refresh the page."
            );

            return false;
        }

        return true;
    }


    // ==========================================
    // 7. EXPORT CUSTOMER REPORT TO EXCEL
    // ==========================================

    function exportCustomerReport() {

        if (!excelLibraryAvailable()) {
            return;
        }

        const table = customerReport.querySelector("table");

        const data = getReportData(
            table,
            getVisibleCustomers()
        );

        if (data.length <= 1) {

            alert(
                "No customer records match your current search and filters."
            );

            return;
        }

        const workbook = XLSX.utils.book_new();

        const worksheet = createWorksheet(data);

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Customer Reports"
        );

        const today = new Date().toISOString().slice(0, 10);

        XLSX.writeFile(
            workbook,
            `PileeTech_Customer_Report_${today}.xlsx`
        );
    }


    // ==========================================
    // 8. EXPORT CLEANER REPORT TO EXCEL
    // ==========================================

    function exportCleanerReport() {

        if (!excelLibraryAvailable()) {
            return;
        }

        const table = cleanerReport.querySelector("table");

        const data = getReportData(
            table,
            getVisibleCleaners()
        );

        if (data.length <= 1) {

            alert(
                "No cleaner records match your current search and filters."
            );

            return;
        }

        const workbook = XLSX.utils.book_new();

        const worksheet = createWorksheet(data);

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Cleaner Reports"
        );

        const today = new Date().toISOString().slice(0, 10);

        XLSX.writeFile(
            workbook,
            `PileeTech_Cleaner_Report_${today}.xlsx`
        );
    }


    // ==========================================
    // 9. EXPORT BOTH REPORTS INTO ONE EXCEL FILE
    // ==========================================

    function exportAllReports() {

        if (!excelLibraryAvailable()) {
            return;
        }

        const customerTable =
            customerReport.querySelector("table");

        const cleanerTable =
            cleanerReport.querySelector("table");

        const customerData = getReportData(
            customerTable,
            getVisibleCustomers()
        );

        const cleanerData = getReportData(
            cleanerTable,
            getVisibleCleaners()
        );

        const hasCustomers = customerData.length > 1;
        const hasCleaners = cleanerData.length > 1;

        if (!hasCustomers && !hasCleaners) {

            alert(
                "There are no customer or cleaner records to export."
            );

            return;
        }

        const workbook = XLSX.utils.book_new();

        // Add customer report as the first worksheet.
        if (hasCustomers) {

            XLSX.utils.book_append_sheet(
                workbook,
                createWorksheet(customerData),
                "Customer Reports"
            );
        }

        // Add cleaner report as the second worksheet.
        if (hasCleaners) {

            XLSX.utils.book_append_sheet(
                workbook,
                createWorksheet(cleanerData),
                "Cleaner Reports"
            );
        }

        const today = new Date().toISOString().slice(0, 10);

        XLSX.writeFile(
            workbook,
            `PileeTech_All_Reports_${today}.xlsx`
        );
    }


    // ==========================================
    // 10. CONNECT EXPORT BUTTONS
    // ==========================================

    exportCustomersButton.addEventListener(
        "click",
        exportCustomerReport
    );

    exportCleanersButton.addEventListener(
        "click",
        exportCleanerReport
    );

    exportAllButton.addEventListener(
        "click",
        exportAllReports
    );

});
// ==========================================
// 11. CUSTOMER REPORT EMAIL FUNCTIONALITY
// ==========================================

const customerTableBody =
    document.getElementById("customerTableBody");

const emailFeedback =
    document.getElementById("emailFeedback");

// Create the correct email button for each customer.
function createEmailButtons() {

    const rows = customerTableBody.querySelectorAll("tr");

    rows.forEach(row => {

        // Avoid creating duplicate buttons.
        if (row.querySelector(".email-action-btn")) {
            return;
        }

        const status = row.dataset.status;
        const actionCell = document.createElement("td");

        const button = document.createElement("button");

        button.type = "button";
        button.className = "email-action-btn";

        if (status === "Completed") {

            button.innerHTML = "✉ Send Email";
            button.dataset.action = "send-email";

        } else {

            button.innerHTML = "🔒 Not Available";
            button.classList.add("email-unavailable");
            button.disabled = true;
        }

        actionCell.appendChild(button);
        row.appendChild(actionCell);
    });
}

// Display feedback to the administrator.
function showEmailFeedback(message, type) {

    emailFeedback.textContent = message;
    emailFeedback.className = `email-feedback ${type}`;
}

// Send an email when the admin clicks the button.
customerTableBody.addEventListener("click", async event => {

    const button = event.target.closest(
        '[data-action="send-email"]'
    );

    if (!button) {
        return;
    }

    const row = button.closest("tr");

    if (!row || row.dataset.status !== "Completed") {
        return;
    }

    const customerId =
        row.querySelector("td:first-child small")?.textContent.trim();

    if (!customerId) {
        showEmailFeedback(
            "Customer ID could not be found.",
            "error"
        );
        return;
    }

    const customerName =
        row.querySelector("td:first-child strong")?.textContent.trim();

    const confirmed = confirm(
        `Send a report completion email to ${customerName}?`
    );

    if (!confirmed) {
        return;
    }

    button.disabled = true;
    button.textContent = "Sending...";

    showEmailFeedback(
        `Sending email to ${customerName}...`,
        ""
    );

    try {

        const response = await fetch("send-report-email.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                customer_id: customerId
            })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to send the email."
            );
        }

        button.textContent = "✓ Email Sent";
        button.classList.add("email-sent");
        button.disabled = true;
        button.removeAttribute("data-action");

        showEmailFeedback(
            `The report completion email was sent to ${customerName}.`,
            "success"
        );

    } catch (error) {

        button.disabled = false;
        button.innerHTML = "✉ Try Again";

        showEmailFeedback(
            error.message || "An error occurred while sending the email.",
            "error"
        );
    }
});

// Add email buttons to the customer records.
createEmailButtons();