const cartItems = document.getElementById("cartItems");
const itemCount = document.getElementById("itemCount");
const summaryCount = document.getElementById("summaryCount");
const subtotal = document.getElementById("subtotal");
const total = document.getElementById("total");
const emptyCart = document.getElementById("emptyCart");
const cartMessage = document.getElementById("cartMessage");

function formatCurrency(amount) {
    return amount.toLocaleString("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0
    }).replace("ZAR", "R").trim();
}

function updateCart() {
    const items = [...cartItems.querySelectorAll(".cart-item")];

    const count = items.length;

    const amount = items.reduce((sum, item) => {
        return sum + Number(item.dataset.price || 0);
    }, 0);

    itemCount.textContent =
        `${count} ${count === 1 ? "service" : "services"}`;

    summaryCount.textContent = count;
    subtotal.textContent = formatCurrency(amount);
    total.textContent = formatCurrency(amount);

    emptyCart.hidden = count !== 0;
    cartItems.hidden = count === 0;

    document.getElementById("quoteButton").disabled = count === 0;
    document.getElementById("paymentButton").disabled = count === 0;

    document.getElementById("quoteButton").style.opacity =
        count === 0 ? "0.5" : "1";

    document.getElementById("paymentButton").style.opacity =
        count === 0 ? "0.5" : "1";
}

// Remove a service from the cart.
cartItems.addEventListener("click", function (event) {
    const removeButton = event.target.closest(".remove-button");

    if (!removeButton) return;

    const item = removeButton.closest(".cart-item");

    if (item) {
        item.remove();
        cartMessage.textContent = "Service removed from your cart.";
        updateCart();
    }
});

// Request a quote.
document.getElementById("quoteButton").addEventListener("click", function () {
    const items = [...cartItems.querySelectorAll(".cart-item")];

    if (items.length === 0) {
        cartMessage.textContent = "Please add a service before requesting a quote.";
        return;
    }

    // This is a frontend demonstration.
    // Connect to PHP/MySQL to save the quote request permanently.
    cartMessage.textContent =
        "Your quote request is ready. Connect this button to the PHP backend to submit it to Pilee Tech.";

    cartMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

// Proceed to the payment page.
document.getElementById("paymentButton").addEventListener("click", function () {
    if (cartItems.querySelectorAll(".cart-item").length === 0) {
        cartMessage.textContent = "Please add a service before proceeding to payment.";
        return;
    }

    window.location.href = "payment.html";
});

// Mobile navbar.
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

updateCart();