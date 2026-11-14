<?php
$page_title = "Contact";

$ref_code = isset($_GET['ref']) ? htmlspecialchars($_GET['ref']) : '';
$selected_service = isset($_GET['service']) ? htmlspecialchars($_GET['service']) : '';

$status_message = '';
$status_type = '';

$service_groups = [
    'Cleaning Services' => [
        'Office Cleaning',
        'Commercial Cleaning',
        'Specialised Cleaning'
    ],
    'IT Support and Consulting' => [
        'IT strategy and Digitization',
        'Process Improvements',
        'Project Management',
        'Technology Enablement',
        'Hardware and Software Support',
        'Cloud Solutions',
        'Network Support',
        'Remote and Onsite support'
    ],
    'Transport and Logistics' => [
        'Transport and Distribution',
        'Fleet Management',
        'Supply Chain Support'
    ]
];

$allowed_services = array_merge(...array_values($service_groups));

$initial_service = '';
if ($selected_service !== '') {
    foreach ($allowed_services as $item) {
        if (strcasecmp($selected_service, $item) === 0) {
            $initial_service = $item;
            break;
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $company = trim($_POST['company'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $service_choice = trim($_POST['service'] ?? '');
    $contact_method = trim($_POST['contact_method'] ?? 'email');
    $message_text = trim($_POST['message'] ?? '');

    if ($name === '' || $email === '' || $phone === '' || !in_array($service_choice, $allowed_services, true) || $message_text === '') {
        $status_type = 'error';
        $status_message = 'Please complete all required fields and select a valid service.';
        $initial_service = in_array($service_choice, $allowed_services, true) ? $service_choice : '';
    } else {
        if (file_exists('db.php')) {
            include 'db.php';
            if (isset($conn) && $conn) {
                $pref = ($contact_method === 'phone') ? 'phone' : 'email';
                $stmt = mysqli_prepare($conn, "
                    INSERT INTO quote_requests (company_name, full_name, email, phone_number, service_required, project_details, location, preferred_contact)
                    VALUES (?, ?, ?, ?, ?, ?, 'Pretoria', ?)
                ");
                if ($stmt) {
                    mysqli_stmt_bind_param($stmt, "sssssss", $company, $name, $email, $phone, $service_choice, $message_text, $pref);
                    @mysqli_stmt_execute($stmt);
                }
            }
        }

        $to = "info@pileetechgroup.com";
        $subject = "New Website Enquiry: " . $service_choice . " - " . $name;
        $email_body = "Name: {$name}\n"
                    . "Company: " . ($company !== '' ? $company : 'N/A') . "\n"
                    . "Email: {$email}\n"
                    . "Phone: {$phone}\n"
                    . "Service Needed: {$service_choice}\n"
                    . "Preferred Contact: {$contact_method}\n"
                    . "Location: Pretoria\n\n"
                    . "Message:\n{$message_text}\n";

        $headers = "From: noreply@pileetechgroup.com\r\n"
                 . "Reply-To: {$email}\r\n"
                 . "X-Mailer: PHP/" . phpversion();

        @mail($to, $subject, $email_body, $headers);

        $status_type = 'success';
        $status_message = 'Thank you! Your message has been sent to info@pileetechgroup.com.';
        $selected_service = '';
        $initial_service = '';
        $ref_code = '';
    }
}

include 'includes/header.php';
?>

<style>
.custom-select-wrap {
    position: relative;
    width: 100%;
}
.custom-select-trigger {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 14px;
    border: 1px solid #DCE6EE;
    border-radius: 5px;
    background: #ffffff;
    color: #102B49;
    font-size: 14px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: inherit;
}
.custom-select-trigger:focus {
    outline: none;
    border-color: #0879BD;
}
.custom-select-trigger .placeholder-text {
    color: #5D7084;
}
.custom-select-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    z-index: 999;
    background: #ffffff;
    border: 1px solid #DCE6EE;
    border-radius: 5px;
    box-shadow: 0 8px 20px rgba(6, 26, 45, 0.12);
    max-height: 215px;
    overflow-y: auto;
    display: none;
}
.custom-select-menu.open {
    display: block;
}
.custom-select-group {
    padding: 8px 14px 4px;
    font-size: 12px;
    font-weight: 700;
    color: #061A2D;
    background: #F3F7FA;
    border-top: 1px solid #E6EEF5;
}
.custom-select-group:first-child {
    border-top: none;
}
.custom-select-option {
    padding: 9px 14px 9px 22px;
    font-size: 14px;
    color: #102B49;
    cursor: pointer;
    line-height: 1.35;
}
.custom-select-option:hover {
    background: #EBF5FB;
    color: #0879BD;
}
.custom-select-option.selected {
    background: #0879BD;
    color: #ffffff;
    font-weight: 600;
}
</style>

<section class="page-hero hero-contact" style="background-color: #061A2D; color: #ffffff; padding: 55px 0; text-align: center;">
    <div style="width: min(1200px, 90%); margin: 0 auto;">
        <h1 style="color: #ffffff; margin: 0 0 10px; font-size: 2.2rem; font-weight: 700;">Contact Us</h1>
        <p style="font-size: 1.05rem; color: #DCE6EE; margin: 0;">Get in touch with us for quotes, consultations, or service bookings.</p>
    </div>
</section>

<section style="padding: 60px 0; background-color: #F3F7FA;">
    <div style="width: min(1200px, 90%); margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; align-items: start;">

        <div style="background: #ffffff; border: 1px solid #DCE6EE; border-radius: 8px; padding: 32px; box-shadow: 0 4px 14px rgba(6, 26, 45, 0.06);">
            <h2 style="font-size: 1.5rem; color: #061A2D; margin: 0 0 10px; font-weight: 700;">Our Details</h2>
            <p style="font-weight: 700; font-size: 1.15rem; color: #0879BD; margin: 0 0 20px;">Pilee Tech Group</p>

            <div style="display: flex; flex-direction: column; gap: 18px; color: #5D7084; font-size: 0.95rem;">
                <div>
                    <strong style="color: #061A2D; display: block; margin-bottom: 4px;">Email</strong>
                    <a href="mailto:info@pileetechgroup.com" style="color: #0879BD; text-decoration: none;">info@pileetechgroup.com</a>
                </div>

                <div>
                    <strong style="color: #061A2D; display: block; margin-bottom: 4px;">Phone</strong>
                    <a href="tel:+27661305450" style="color: #0879BD; text-decoration: none;">066 130 5450</a>
                </div>

                <div>
                    <strong style="color: #061A2D; display: block; margin-bottom: 4px;">WhatsApp</strong>
                    <a href="https://wa.me/27661305450?text=Hello%20Pilee%20Tech%20Group%2C%20I%20would%20like%20to%20enquire%20about%20your%20services." target="_blank" rel="noopener noreferrer" style="color: #0879BD; text-decoration: none; font-weight: 600;">Chat with us on WhatsApp (066 130 5450)</a>
                </div>

                <div>
                    <strong style="color: #061A2D; display: block; margin-bottom: 4px;">Hours</strong>
                    Mon – Fri: 08:00 – 17:00<br>
                    Sat: 08:00 – 13:00<br>
                    Sun: Closed
                </div>

                <div>
                    <strong style="color: #061A2D; display: block; margin-bottom: 4px;">Location</strong>
                    Pretoria
                </div>
            </div>
        </div>

        <div style="background: #ffffff; border: 1px solid #DCE6EE; border-radius: 8px; padding: 32px; box-shadow: 0 4px 14px rgba(6, 26, 45, 0.06);">
            <h2 style="font-size: 1.5rem; color: #061A2D; margin: 0 0 8px; font-weight: 700;">Send a Message</h2>
            <p style="color: #5D7084; margin: 0 0 24px; font-size: 0.95rem;">Fill out the form below and our team will get back to you.</p>

            <?php if ($status_message !== ''): ?>
                <div style="padding: 14px 16px; border-radius: 5px; margin-bottom: 18px; font-size: 0.92rem; font-weight: 600; <?php echo $status_type === 'success' ? 'background-color: #E6F7ED; color: #116530; border: 1px solid #A3E4BC;' : 'background-color: #FDECEA; color: #A61B1B; border: 1px solid #F5B7B1;'; ?>">
                    <?php echo htmlspecialchars($status_message); ?>
                </div>
            <?php endif; ?>

            <form id="contactForm" method="POST" action="contact.php" style="display: flex; flex-direction: column; gap: 16px;">
                <?php if ($ref_code != ''): ?>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label for="reference_code" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Service Reference Code</label>
                    <input type="text" id="reference_code" name="reference_code" value="<?php echo $ref_code; ?>" readonly style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background-color: #eeeeee; font-weight: bold; color: #061A2D; cursor: not-allowed; font-size: 14px;">
                </div>
                <?php endif; ?>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label for="name" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Full Name</label>
                    <input type="text" id="name" name="name" required placeholder="e.g. John Doe" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background: #ffffff; color: #102B49; font-size: 14px;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label for="company" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Company (Optional)</label>
                    <input type="text" id="company" name="company" placeholder="Business name" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background: #ffffff; color: #102B49; font-size: 14px;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label for="email" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Email</label>
                    <input type="email" id="email" name="email" required placeholder="name@domain.com" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background: #ffffff; color: #102B49; font-size: 14px;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label for="phone" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required placeholder="e.g. 066 123 4567" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background: #ffffff; color: #102B49; font-size: 14px;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label id="serviceLabel" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Service Needed</label>
                    <div class="custom-select-wrap" id="serviceDropdown">
                        <input type="hidden" id="service" name="service" value="<?php echo htmlspecialchars($initial_service); ?>" required>
                        <button type="button" class="custom-select-trigger" id="serviceTrigger" aria-haspopup="listbox" aria-expanded="false">
                            <span id="serviceTriggerText" class="<?php echo $initial_service === '' ? 'placeholder-text' : ''; ?>">
                                <?php echo $initial_service !== '' ? htmlspecialchars($initial_service) : 'Select a service'; ?>
                            </span>
                            <span style="font-size: 11px; color: #5D7084;">▼</span>
                        </button>
                        <div class="custom-select-menu" id="serviceMenu" role="listbox">
                            <?php foreach ($service_groups as $group_label => $items): ?>
                                <div class="custom-select-group"><?php echo htmlspecialchars($group_label); ?></div>
                                <?php foreach ($items as $item): ?>
                                    <div class="custom-select-option <?php echo ($initial_service === $item) ? 'selected' : ''; ?>"
                                         role="option"
                                         data-value="<?php echo htmlspecialchars($item); ?>">
                                        <?php echo htmlspecialchars($item); ?>
                                    </div>
                                <?php endforeach; ?>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label for="contact_method" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Preferred Contact</label>
                    <select id="contact_method" name="contact_method" style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background: #ffffff; color: #102B49; font-size: 14px;">
                        <option value="email">Email</option>
                        <option value="phone">Phone call</option>
                        <option value="whatsapp">WhatsApp</option>
                    </select>
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label for="message" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Message & Optional Add-ons</label>
                    <textarea id="message" name="message" rows="5" placeholder="Specify property size, extras needed, or address..." required style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background: #ffffff; color: #102B49; font-size: 14px; resize: vertical;"><?php if ($selected_service != '') echo "Enquiring about: " . $selected_service . ($ref_code != '' ? " (Ref: " . $ref_code . ")" : "") . ". "; ?></textarea>
                </div>

                <button type="submit" style="width: 100%; padding: 14px; background: #08A9E8; color: #061A2D; border: none; border-radius: 5px; font-weight: 700; font-size: 15px; cursor: pointer; transition: background 0.2s;">
                    Send Message
                </button>
            </form>
        </div>

    </div>
</section>

<script>
document.addEventListener("DOMContentLoaded", () => {
    const wrap = document.getElementById("serviceDropdown");
    const trigger = document.getElementById("serviceTrigger");
    const triggerText = document.getElementById("serviceTriggerText");
    const menu = document.getElementById("serviceMenu");
    const hiddenInput = document.getElementById("service");
    const form = document.getElementById("contactForm");
    const options = menu.querySelectorAll(".custom-select-option");

    trigger.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("open");
        trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    options.forEach(opt => {
        opt.addEventListener("click", () => {
            const val = opt.dataset.value;
            hiddenInput.value = val;
            triggerText.textContent = val;
            triggerText.classList.remove("placeholder-text");
            options.forEach(o => o.classList.remove("selected"));
            opt.classList.add("selected");
            menu.classList.remove("open");
            trigger.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", e => {
        if (!wrap.contains(e.target)) {
            menu.classList.remove("open");
            trigger.setAttribute("aria-expanded", "false");
        }
    });

    form.addEventListener("submit", e => {
        if (!hiddenInput.value) {
            e.preventDefault();
            menu.classList.add("open");
            trigger.focus();
            alert("Please select a service under Service Needed.");
        }
    });
});
</script>

<?php include 'includes/footer.php'; ?>
