
/* =====================================================
   PILEE TECH GROUP
   CLEANER SUPPORT DOCUMENTS
===================================================== */

"use strict";


/* =====================================================
   1. SOUTH AFRICAN BANKS
===================================================== */

const southAfricanBanks = {

    "ABSA Bank": "632005",
    "African Bank": "430000",
    "Al Baraka Bank": "800000",
    "Bank Zero": "888000",
    "Bidvest Bank": "462005",
    "Capitec Bank": "470010",
    "Discovery Bank": "679000",
    "First National Bank (FNB)": "250655",
    "Investec Bank": "580105",
    "Nedbank": "198765",
    "Postbank": "460005",
    "Standard Bank": "051001",
    "GoTyme Bank": "678910"

};


/* =====================================================
   2. SELECT ELEMENTS
===================================================== */

const supportForm = document.getElementById("supportForm");

const bankSelect = document.getElementById("bankName");

const branchCode = document.getElementById("branchCode");

const accountNumber = document.getElementById("accountNumber");

const bankLetter = document.getElementById("bankLetter");

const policeClearance = document.getElementById("policeClearance");

const bankPreview = document.getElementById("bankPreview");

const policePreview = document.getElementById("policePreview");

const submitButton = document.getElementById("submitButton");

const submitText = document.getElementById("submitText");

const successModal = document.getElementById("successModal");

const closeModal = document.getElementById("closeModal");


/* =====================================================
   3. POPULATE BANK DROPDOWN
===================================================== */

Object.keys(southAfricanBanks).forEach(bank => {

    const option = document.createElement("option");

    option.value = bank;
    option.textContent = bank;

    bankSelect.appendChild(option);

});


/* =====================================================
   4. AUTOMATIC BRANCH CODE
===================================================== */

bankSelect.addEventListener("change", function () {

    const selectedBank = this.value;

    branchCode.value = southAfricanBanks[selectedBank] || "";

});


/* =====================================================
   5. ACCOUNT NUMBER VALIDATION
===================================================== */

accountNumber.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

});


/* =====================================================
   6. PDF VALIDATION
===================================================== */

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function validatePDF(file) {

    if (!file) {
        return "Please select a document.";
    }

    if (
        file.type !== "application/pdf" ||
        !file.name.toLowerCase().endsWith(".pdf")
    ) {
        return "Only PDF documents are accepted.";
    }

    if (file.size > MAX_FILE_SIZE) {
        return "The document must not exceed 5MB.";
    }

    if (file.size === 0) {
        return "The selected document is empty.";
    }

    return null;

}


/* =====================================================
   7. FILE PREVIEW
===================================================== */

function displayFile(input, preview) {

    input.addEventListener("change", function () {

        preview.innerHTML = "";
        preview.classList.remove("visible");

        const file = this.files[0];

        if (!file) return;

        const error = validatePDF(file);

        if (error) {

            alert(error);
            this.value = "";

            return;

        }

        const fileName = document.createElement("span");

        fileName.className = "file-name";
        fileName.textContent = "✓ " + file.name;

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.className = "remove-file";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {

            input.value = "";

            preview.innerHTML = "";
            preview.classList.remove("visible");

        });

        preview.append(fileName, removeButton);

        preview.classList.add("visible");

    });

}


displayFile(bankLetter, bankPreview);

displayFile(policeClearance, policePreview);


/* =====================================================
   8. VALIDATE COMPLETE FORM
===================================================== */

function validateForm() {

    if (!supportForm.checkValidity()) {

        supportForm.reportValidity();

        return false;

    }

    if (!southAfricanBanks[bankSelect.value]) {

        alert("Please select a valid bank.");

        bankSelect.focus();

        return false;

    }

    if (!branchCode.value) {

        alert("Please select your bank first.");

        bankSelect.focus();

        return false;

    }

    if (!/^\d{6,20}$/.test(accountNumber.value)) {

        alert("Please enter a valid account number.");

        accountNumber.focus();

        return false;

    }

    const bankError = validatePDF(bankLetter.files[0]);

    if (bankError) {

        alert("Bank Confirmation Letter: " + bankError);

        return false;

    }

    const policeError = validatePDF(policeClearance.files[0]);

    if (policeError) {

        alert("Police Clearance: " + policeError);

        return false;

    }

    return true;

}


/* =====================================================
   9. SUBMIT ALL DOCUMENTS
===================================================== */

supportForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    if (!validateForm()) return;

    const confirmation = confirm(
        "Are you sure you want to submit your banking information and supporting documents?"
    );

    if (!confirmation) return;

    submitButton.disabled = true;

    submitText.textContent = "Submitting...";

    try {

        const formData = new FormData(supportForm);

        /*
           PHP BACKEND REQUIRED

           Create submit-support-documents.php
           to save the details and upload the documents
           securely to the server.
        */

        const response = await fetch(
            "submit-support-documents.php",
            {
                method: "POST",
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message || "Unable to submit your documents."
            );

        }

        /* SHOW SUCCESS POPUP */

        successModal.classList.add("show");

        /* CLEAR FORM */

        supportForm.reset();

        bankPreview.innerHTML = "";
        policePreview.innerHTML = "";

        bankPreview.classList.remove("visible");
        policePreview.classList.remove("visible");

        branchCode.value = "";

        /* LOCK SUBMITTED FORM */

        supportForm.querySelectorAll(
            "input, select, button"
        ).forEach(element => {

            element.disabled = true;

        });

        submitText.textContent = "Documents Submitted";

    }

    catch (error) {

        alert(
            error.message ||
            "Something went wrong. Please try again."
        );

        submitButton.disabled = false;

        submitText.textContent = "Submit All Documents";

    }

});


/* =====================================================
   10. CLOSE SUCCESS POPUP
===================================================== */

closeModal.addEventListener("click", function () {

    window.location.href = "DashbordCleaner.html";

});


/* =====================================================
   11. CLOSE POPUP WHEN CLICKING OUTSIDE
===================================================== */

successModal.addEventListener("click", function (event) {

    if (event.target === successModal) {

        successModal.classList.remove("show");

    }

});
