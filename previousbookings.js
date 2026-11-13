/* ==========================================
   PILEE TECH GROUP
   PREVIOUS BOOKINGS - previousbookings.js
   ========================================== */

var bookings = [
    
];

var tableBody   = document.getElementById("bookingsBody");
var countLabel  = document.getElementById("bookingCount");
var modal       = document.getElementById("ratingModal");
var modalName   = document.getElementById("modalName");
var modalSub    = document.getElementById("modalSub");
var modalScore  = document.getElementById("modalScore");
var modalStars  = document.getElementById("modalStars");
var modalFeedback = document.getElementById("modalFeedback");

/* Build the table rows */
function renderBookings() {
    countLabel.textContent = bookings.length + " completed bookings";
    tableBody.innerHTML = "";

    bookings.forEach(function (b, index) {
        var row = document.createElement("tr");

        row.innerHTML =
            "<td><strong></strong></td>" +
            "<td></td>" +
            "<td></td>" +
            "<td><span class='status-badge'>Completed</span></td>" +
            "<td><button class='view-btn' type='button'>View rating</button></td>";

        /* textContent keeps the data safe from HTML injection */
        row.children[0].firstChild.textContent = b.name;
        row.children[1].textContent = b.location;
        row.children[2].textContent = b.house;
        row.querySelector(".view-btn").addEventListener("click", function () {
            openRating(index);
        });

        tableBody.appendChild(row);
    });
}

/* Open the rating popup */
function openRating(index) {
    var b = bookings[index];
    var stars = "";

    for (var i = 1; i <= 5; i++) {
        stars += i <= b.rating ? "★" : "<span class='star-off'>★</span>";
    }

    modalName.textContent = b.name;
    modalSub.textContent = b.location + " · " + b.house;
    modalScore.textContent = b.rating + ".0 / 5";
    modalStars.innerHTML = stars;
    modalFeedback.textContent = "\u201C" + b.feedback + "\u201D";
    modal.classList.add("open");
}

/* Close the rating popup */
function closeRating() {
    modal.classList.remove("open");
}

document.getElementById("closeModal").addEventListener("click", closeRating);
modal.addEventListener("click", function (e) {
    if (e.target === modal) { closeRating(); }
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeRating(); }
});

renderBookings();