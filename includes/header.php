
<?php
/**
 * =====================================================
 * PILEE TECH GROUP
 * SHARED WEBSITE HEADER
 * =====================================================
 *
 * Included by:
 * services.php
 * projects.php
 * contact.php
 *
 */

// Page title
$page_title = $page_title ?? "Pilee Tech Group";

// Detect current page
$current_page = basename($_SERVER['PHP_SELF'] ?? '');

// Active navigation helper
function isCurrentPage($page, $current_page) {
    return $page === $current_page ? 'active' : '';
}
?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>
        <?php echo htmlspecialchars($page_title); ?> | Pilee Tech Group
    </title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
    >

    <!-- =================================================
         ALL ORIGINAL STYLING KEPT IN THIS PHP FILE
    ================================================== -->

    <style>

        /* =====================================
           GLOBAL VARIABLES
        ===================================== */

        :root {
            --navy: #061a2d;
            --navy-light: #092844;
            --blue: #08a9e8;
            --blue-dark: #0879bd;

            --bg: #f3f7fa;
            --surface: #ffffff;

            --text: #102b49;
            --text-muted: #5d7084;

            --border: #dce6ee;

            --radius-sm: 5px;
            --radius-md: 8px;

            --shadow-sm: 0 4px 14px rgba(6, 26, 45, 0.06);
            --shadow-md: 0 10px 25px rgba(6, 26, 45, 0.10);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: "DM Sans", Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.6;
        }

        h1, h2, h3, h4 {
            font-family: "Manrope", Arial, sans-serif;
            color: var(--navy);
        }

        .container {
            width: min(1200px, 90%);
            margin: 0 auto;
        }


        /* =====================================
           EXISTING SERVICES PAGE STYLES
        ===================================== */

        .page-hero {
            background-color: var(--navy);
            color: #ffffff;
            padding: 64px 0;
            text-align: center;
        }

        .page-hero h1 {
            color: #ffffff;
            font-size: clamp(1.9rem, 3.2vw, 2.6rem);
            font-weight: 800;
            margin: 0 0 12px;
        }

        .page-hero p {
            color: #dce6ee;
            font-size: 1.05rem;
            max-width: 700px;
            margin: 0 auto;
        }

        .service-block {
            padding: 64px 0;
            background-color: var(--bg);
        }

        .service-block.alt-bg {
            background-color: #ebf2f7;
        }

        .service-block h2 {
            font-size: 1.85rem;
            font-weight: 800;
            margin: 0 0 8px;
        }

        .section-intro {
            color: var(--text-muted);
            font-size: 1rem;
            margin: 0 0 36px;
        }

        .status {
            display: inline-block;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.06em;
            color: var(--blue-dark);
            background-color: rgba(8, 169, 232, 0.12);
            padding: 5px 12px;
            border-radius: 999px;
            text-transform: uppercase;
        }

        .booking-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 28px;
        }

        .booking-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .booking-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-md);
        }

        .service-thumb {
            width: 100%;
            height: 210px;
            object-fit: cover;
            display: block;
            background-color: #e2ebf2;
        }

        .booking-card-body {
            padding: 24px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .booking-card-body h3 {
            font-size: 1.2rem;
            font-weight: 800;
            margin: 6px 0 10px;
        }

        .service-desc {
            color: var(--text-muted);
            font-size: 0.92rem;
            margin: 0 0 18px;
            flex: 1;
        }

        .price-box {
            margin-bottom: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--border);
        }

        .price-box .price {
            font-family: "Manrope", Arial, sans-serif;
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--navy);
        }

        .price-box .unit {
            font-size: 0.88rem;
            color: var(--text-muted);
        }

        .service-accordion {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            margin-bottom: 16px;
            box-shadow: var(--shadow-sm);
            overflow: hidden;
        }

        .service-accordion summary {
            padding: 20px 24px;
            font-family: "Manrope", Arial, sans-serif;
            font-size: 1.08rem;
            font-weight: 700;
            color: var(--navy);
            cursor: pointer;
            list-style: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .service-accordion summary::after {
            content: "+";
            font-size: 1.4rem;
            color: var(--blue-dark);
            font-weight: 700;
        }

        .service-accordion[open] summary::after {
            content: "−";
        }

        .service-accordion .accordion-content {
            padding: 0 24px 22px;
            color: var(--text-muted);
            font-size: 0.95rem;
            border-top: 1px solid var(--border);
        }

        .service-accordion .accordion-content p {
            margin: 16px 0 10px;
        }

        .service-accordion .accordion-content ul {
            margin: 0;
            padding-left: 20px;
        }

        .service-accordion .accordion-content li {
            margin-bottom: 6px;
        }

        .cta-strip {
            background-color: var(--navy-light);
            color: #ffffff;
            padding: 60px 0;
            text-align: center;
        }

        .cta-strip h2 {
            color: #ffffff;
            font-size: 1.85rem;
            margin: 0 0 10px;
        }

        .cta-strip p {
            color: #dce6ee;
            margin: 0 auto 24px;
            max-width: 640px;
        }


        /* =====================================
           SHARED BUTTON DESIGN
        ===================================== */

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;

            padding: 13px 22px;

            border-radius: 6px;
            border: 2px solid transparent;

            font-family: "DM Sans", Arial, sans-serif;
            font-size: 13px;
            font-weight: 700;

            text-decoration: none;
            text-align: center;
            cursor: pointer;

            transition: all 0.25s ease;
        }

        .btn-primary {
            background: #061A2D;
            color: #ffffff;
            border-color: #061A2D;
        }

        .btn-primary:hover {
            background: #08A9E8;
            border-color: #08A9E8;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(8, 169, 232, 0.20);
        }

        .button-secondary {
            background: #ffffff;
            color: #061A2D;
            border-color: #061A2D;
        }

        .button-secondary:hover {
            background: #061A2D;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(6, 26, 45, 0.15);
        }

        .btn:focus-visible {
            outline: 3px solid #08A9E8;
            outline-offset: 3px;
        }


        /* =====================================
           SITE HEADER
        ===================================== */

        .site-header {
            position: relative;
            z-index: 1000;

            width: 100%;
            min-height: 85px;

            background: #ffffff;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 12px 5%;

            box-shadow: 0 3px 15px rgba(6, 26, 45, 0.07);
        }

        .logo {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            text-decoration: none;
        }

        .logo img {
            display: block;
            width: auto;
            max-width: 190px;
            height: 55px;
            object-fit: contain;
        }

        .navigation {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
        }

        .navigation > a,
        .navigation .dropdown-trigger {
            font-family: "DM Sans", sans-serif;
            font-size: 13px;
            font-weight: 700;
            color: #102B49;

            display: flex;
            align-items: center;

            padding: 9px 0;
            text-decoration: none;

            transition: all 0.3s ease;
        }

        .navigation > a:hover,
        .navigation .dropdown-trigger:hover,
        .navigation .dropdown-trigger.active,
        .navigation > a.active {
            color: #0879BD;
        }

        .navigation > a:not(.nav-cta):not(.request-service) {
            position: relative;
        }

        .navigation > a:not(.nav-cta):not(.request-service)::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 2px;

            width: 0;
            height: 2px;

            background: #08A9E8;
            transition: width 0.25s ease;
        }

        .navigation > a:not(.nav-cta):not(.request-service):hover::after {
            width: 100%;
        }

        .navigation > a.request-service {
            background: #061A2D;
            color: #ffffff;

            padding: 12px 18px;
            border-radius: 6px;

            transition: all 0.25s ease;
        }

        .navigation > a.request-service:hover {
            background: #08A9E8;
            color: #ffffff;
            transform: translateY(-2px);
        }


        /* =====================================
           NAVIGATION DROPDOWNS
        ===================================== */

        .nav-dropdown {
            position: relative;
            display: flex;
            align-items: center;
        }

        .dropdown-trigger {
            display: flex;
            align-items: center;
            gap: 8px;

            background: transparent;
            border: none;

            color: #061A2D;

            font-family: inherit;
            font-size: 15px;
            font-weight: 600;

            padding: 12px 10px;

            cursor: pointer;
            transition: color 0.3s ease;
        }

        .dropdown-trigger:hover,
        .dropdown-trigger.active {
            color: #08A9E8;
        }

        .dropdown-arrow {
            width: 8px;
            height: 8px;

            border-right: 2px solid currentColor;
            border-bottom: 2px solid currentColor;

            transform: rotate(45deg);
            margin-top: -4px;

            transition: transform 0.3s ease;
        }

        .dropdown-menu {
            position: absolute;

            top: 100%;
            left: 0;

            min-width: 220px;

            background: #ffffff;

            border-radius: 10px;
            padding: 10px 0;

            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.13);

            border: 1px solid #E2E8F0;

            display: none;

            z-index: 1000;
        }

        .dropdown-menu a {
            display: block;

            padding: 12px 18px;

            color: #102B49;

            font-size: 14px;
            font-weight: 500;

            text-decoration: none;

            transition: all 0.25s ease;
        }

        .dropdown-menu a:hover {
            background: #F0F8FC;
            color: #08A9E8;
            padding-left: 24px;
        }

        .nav-dropdown:hover .dropdown-menu,
        .nav-dropdown:focus-within .dropdown-menu {
            display: block;
        }

        .nav-dropdown:hover .dropdown-arrow {
            transform: rotate(225deg);
            margin-top: 4px;
        }


        /* =====================================
           LOGIN BUTTON
        ===================================== */

        .login-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;

            padding: 11px 20px;

            background: #ffffff;
            color: #061A2D;

            border: 2px solid #061A2D;
            border-radius: 6px;

            font-family: "DM Sans", Arial, sans-serif;
            font-size: 13px;
            font-weight: 700;

            text-decoration: none;
            white-space: nowrap;

            transition: all 0.25s ease;
        }

        .login-btn:hover {
            background: #061A2D;
            color: #ffffff;
            transform: translateY(-2px);
        }


        /* =====================================
           PROFILE MENU
        ===================================== */

        .profile-menu-container {
            position: relative;
            display: none;
            flex-shrink: 0;
        }

        .profile-btn {
            width: 43px;
            height: 43px;

            border-radius: 50%;
            border: 2px solid #061A2D;

            background: #f3f7fa;

            display: flex;
            align-items: center;
            justify-content: center;

            cursor: pointer;
            transition: all 0.25s ease;
        }

        .profile-btn:hover {
            background: #08A9E8;
            border-color: #08A9E8;
        }

        .profile-icon {
            position: relative;
            display: block;
            width: 19px;
            height: 19px;
        }

        .profile-icon::before {
            content: "";
            position: absolute;

            width: 7px;
            height: 7px;

            border: 2px solid #061A2D;
            border-radius: 50%;

            top: 0;
            left: 4px;
        }

        .profile-icon::after {
            content: "";
            position: absolute;

            width: 15px;
            height: 8px;

            border: 2px solid #061A2D;
            border-radius: 10px 10px 5px 5px;

            bottom: 0;
            left: 0;
        }

        .profile-dropdown {
            position: absolute;
            top: calc(100% + 12px);
            right: 0;

            width: 245px;

            background: #ffffff;
            border: 1px solid #E2E8F0;
            border-radius: 10px;

            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.13);

            padding: 10px 0;
            z-index: 1100;
        }

        .profile-dropdown[hidden] {
            display: none !important;
        }

        .profile-dropdown-header {
            padding: 12px 18px;
        }

        .profile-dropdown-header strong {
            color: #061A2D;
            font-size: 14px;
        }

        .profile-dropdown-header p {
            margin: 4px 0 0;
            color: #5D7084;
            font-size: 12px;
        }

        .profile-dropdown > a {
            display: block;
            padding: 11px 18px;

            color: #102B49;
            text-decoration: none;
            font-size: 13px;

            transition: all 0.2s ease;
        }

        .profile-dropdown > a:hover {
            background: #F0F8FC;
            color: #0879BD;
            padding-left: 23px;
        }

        .profile-dropdown-divider {
            height: 1px;
            background: #E2E8F0;
            margin: 8px 0;
        }

        .logout-link {
            color: #c0392b !important;
        }


        /* =====================================
           MOBILE MENU BUTTON
        ===================================== */

        .menu-toggle {
            display: none;

            width: 42px;
            height: 42px;

            background: #ffffff;
            border: 1px solid #DCE6EE;
            border-radius: 6px;

            cursor: pointer;
            padding: 9px;
        }

        .menu-toggle span {
            display: block;
            width: 100%;
            height: 2px;

            background: #061A2D;
            margin: 5px 0;

            transition: all 0.25s ease;
        }


        /* =====================================
           RESPONSIVE HEADER
        ===================================== */

        @media (max-width: 1050px) {

            .site-header {
                padding: 12px 3%;
            }

            .navigation {
                gap: 14px;
            }

            .logo img {
                max-width: 155px;
            }

        }

        @media (max-width: 850px) {

            .site-header {
                min-height: 75px;
            }

            .menu-toggle {
                display: block;
                order: 3;
            }

            .navigation {
                display: none;

                position: absolute;
                top: 100%;
                left: 0;

                width: 100%;

                background: #ffffff;

                padding: 18px 5% 24px;

                flex-direction: column;
                align-items: stretch;
                gap: 8px;

                box-shadow: 0 10px 20px rgba(6, 26, 45, 0.10);
            }

            .navigation.open {
                display: flex;
            }

            .navigation > a,
            .navigation .dropdown-trigger {
                width: 100%;
                padding: 12px 10px;
                justify-content: flex-start;
            }

            .nav-dropdown {
                width: 100%;
                display: block;
            }

            .dropdown-menu {
                position: static;
                width: 100%;
                box-shadow: none;
                border-radius: 6px;
                margin: 5px 0 10px;
            }

            .nav-dropdown:hover .dropdown-menu,
            .nav-dropdown:focus-within .dropdown-menu {
                display: block;
            }

            .navigation > a.request-service {
                justify-content: center;
            }

            .login-btn {
                margin-left: auto;
                margin-right: 12px;
            }

            .profile-menu-container {
                margin-left: auto;
                margin-right: 12px;
            }

        }

        @media (max-width: 600px) {

            .logo img {
                max-width: 130px;
                height: 45px;
            }

            .login-btn {
                padding: 9px 12px;
                font-size: 12px;
            }

            .btn {
                width: 100%;
            }

            .booking-grid {
                grid-template-columns: 1fr;
            }

        }

        /* =====================================
   MOVE NAVIGATION TO THE RIGHT
===================================== */

.site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.navigation {
    display: flex;
    align-items: center;
    gap: 24px;

    margin-left: auto;
    margin-right: 15px;
}

/* =====================================
   LOGIN - NO BOX OR BORDER
===================================== */

.login-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    padding: 9px 12px;

    background: transparent;
    color: #102B49;

    border: none;
    border-radius: 0;

    font-family: "DM Sans", Arial, sans-serif;
    font-size: 13px;
    font-weight: 700;

    text-decoration: none;
    white-space: nowrap;

    transition: color 0.25s ease;
}

.login-btn:hover {
    background: transparent;
    color: #08A9E8;
    transform: none;
    box-shadow: none;
}

/* Booking Cleaning Service Button */

.navigation > a.request-service {
    background: #061A2D;
    color: #ffffff;

    padding: 12px 22px;

    border: none;
    border-radius: 30px;

    font-weight: 700;
    text-decoration: none;

    transition: all 0.25s ease;
}

.navigation > a.request-service:hover {
    background: #08A9E8;
    color: #ffffff;

    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(8, 169, 232, 0.20);
}

    </style>

</head>

<body>

<!-- =================================================
     SHARED WEBSITE HEADER
================================================== -->

<header class="site-header">

    <!-- LOGO -->
    <a href="index.html" class="logo">
        <img src="logo.png" alt="Pilee Tech Group Logo">
    </a>


    <!-- MAIN NAVIGATION -->
    <nav class="navigation" id="mainNavigation" aria-label="Main navigation">

        <!-- HOME DROPDOWN -->
        <div class="nav-dropdown">

            <button
                class="dropdown-trigger <?php echo $current_page === 'index.html' ? 'active' : ''; ?>"
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="home-dropdown"
            >
                Home
                <span class="dropdown-arrow"></span>
            </button>

            <div class="dropdown-menu" id="home-dropdown">
                <a href="index.html#top">Homepage</a>
                <a href="index.html#about">Who We Are</a>
                <a href="index.html#values">Our Core Values</a>
                <a href="index.html#why-us">Why Choose Us</a>
                <a href="index.html#divisions">Business Divisions</a>
                <a href="index.html#contact">Contact Section</a>
            </div>

        </div>


        <!-- ABOUT US DROPDOWN -->
        <div class="nav-dropdown">

            <button
                class="dropdown-trigger"
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="about-dropdown"
            >
                About Us
                <span class="dropdown-arrow"></span>
            </button>

            <div class="dropdown-menu" id="about-dropdown">
                <a href="AboutPage.html#who-we-are">Who We Are</a>
                <a href="AboutPage.html#our-story">Our Story</a>
                <a href="AboutPage.html#business-divisions">Business Divisions</a>
                <a href="AboutPage.html#core-values">Our Core Values</a>
                <a href="AboutPage.html#our-approach">Our Approach</a>
                <a href="AboutPage.html#contact-section">Contact Section</a>
            </div>

        </div>


        <!-- NORMAL NAVIGATION LINKS -->
        <a href="services.php"
           class="<?php echo isCurrentPage('services.php', $current_page); ?>">
            Pilee Cleaning Services
        </a>

        <a href="projects.php"
           class="<?php echo isCurrentPage('projects.php', $current_page); ?>">
            Other Divisions
        </a>

        <a href="contact.php"
           class="<?php echo isCurrentPage('contact.php', $current_page); ?>">
            Contact
        </a>

        <a href="cleaning-partner-recruitment.html">
            Careers Page
        </a>

        <a href="Request-service.html" class="request-service">
            Booking Cleaning Service
        </a>

    </nav>


    <!-- LOGIN BUTTON -->
    <a href="login.html" class="login-btn" id="loginBtn">
        Login
    </a>


    <!-- PROFILE MENU: ONLY VISIBLE WHEN LOGGED IN -->
    <div class="profile-menu-container" id="profileMenuContainer">

        <button
            type="button"
            class="profile-btn"
            id="profileBtn"
            aria-label="Open profile menu"
            aria-expanded="false"
        >
            <span class="profile-icon"></span>
        </button>

        <div class="profile-dropdown" id="profileDropdown" hidden>

            <div class="profile-dropdown-header">
                <strong>My Account</strong>
                <p>Manage your Pilee Tech account</p>
            </div>

            <a href="customer profile.html">
                👤 My Profile
            </a>

            <a href="customer-booking-history-page.html">
                📋 My Bookings
            </a>

            <div class="profile-dropdown-divider"></div>

            <a href="report-issue.html">
                🛠 Report an Issue
            </a>

            <div class="profile-dropdown-divider"></div>

            <a href="#" class="logout-link" id="logoutBtn">
                ↪ Logout
            </a>

        </div>

    </div>


    <!-- MOBILE MENU BUTTON -->
    <button
        type="button"
        class="menu-toggle"
        id="menuToggle"
        aria-label="Open navigation"
        aria-expanded="false"
        aria-controls="mainNavigation"
    >
        <span></span>
        <span></span>
        <span></span>
    </button>

</header>


<!-- =================================================
     SHARED HEADER JAVASCRIPT
================================================== -->

<script>

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       MOBILE NAVIGATION
    ===================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("mainNavigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

        });

        navigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");

            });

        });

    }


    /* =====================================
       LOGIN / PROFILE VISIBILITY
    ===================================== */

    const loginBtn = document.getElementById("loginBtn");
    const profileMenu = document.getElementById("profileMenuContainer");

    function updateLoginDisplay() {

        // Demo login state only.
        // Replace with PHP session authentication in production.
        const isLoggedIn = localStorage.getItem("pileeTechLoggedIn") === "true";

        if (loginBtn) {
            loginBtn.style.display = isLoggedIn ? "none" : "inline-flex";
        }

        if (profileMenu) {
            profileMenu.style.display = isLoggedIn ? "block" : "none";
        }

    }

    updateLoginDisplay();


    /* =====================================
       PROFILE DROPDOWN
    ===================================== */

    const profileBtn = document.getElementById("profileBtn");
    const profileDropdown = document.getElementById("profileDropdown");

    if (profileBtn && profileDropdown) {

        profileBtn.addEventListener("click", function (event) {

            event.stopPropagation();

            const isOpen = profileDropdown.hidden;

            profileDropdown.hidden = !isOpen;

            profileBtn.setAttribute("aria-expanded", String(isOpen));

        });


        document.addEventListener("click", function (event) {

            if (!event.target.closest(".profile-menu-container")) {

                profileDropdown.hidden = true;

                profileBtn.setAttribute("aria-expanded", "false");

            }

        });


        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                profileDropdown.hidden = true;

                profileBtn.setAttribute("aria-expanded", "false");

                profileBtn.focus();

            }

        });

    }


    /* =====================================
       LOGOUT
    ===================================== */

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function (event) {

            event.preventDefault();

            localStorage.removeItem("pileeTechLoggedIn");

            window.location.href = "index.html";

        });

    }

});

</script>

<!-- =================================================
     PAGE CONTENT STARTS AFTER THIS HEADER
================================================== -->
