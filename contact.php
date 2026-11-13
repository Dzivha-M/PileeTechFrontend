<?php
$page_title = "Contact";
include 'includes/header.php';

$ref_code = '';
if (isset($_GET['ref'])) {
    $ref_code = htmlspecialchars($_GET['ref']);
}

$selected_service = '';
if (isset($_GET['service'])) {
    $selected_service = htmlspecialchars($_GET['service']);
}
?>

<section class="page-hero hero-contact" style="background-color: #061A2D; color: #ffffff; padding: 55px 0; text-align: center;">
    <div style="width: min(1200px, 90%); margin: 0 auto;">
        <h1 style="color: #ffffff; margin: 0 0 10px; font-size: 2.2rem; font-weight: 700;">Contact Us</h1>
        <p style="font-size: 1.05rem; color: #DCE6EE; margin: 0;">Get in touch with us for quotes, consultations, or service bookings.</p>
    </div>
</section>

<section style="padding: 60px 0; background-color: #F3F7FA;">
    <div style="width: min(1200px, 90%); margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 40px; align-items: start;">

        <!-- Left Column: Contact Details -->
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
                    <strong style="color: #061A2D; display: block; margin-bottom: 4px;">Hours</strong>
                    Mon – Fri: 08:00 – 17:00<br>
                    Sat: 08:00 – 13:00<br>
                    Sun: Closed
                </div>

                <div>
                    <strong style="color: #061A2D; display: block; margin-bottom: 4px;">Location</strong>
                    Operating across Gauteng and nationwide depending on project requirements.
                </div>
            </div>
        </div>

        <!-- Right Column: Form in a Neat Box -->
        <div style="background: #ffffff; border: 1px solid #DCE6EE; border-radius: 8px; padding: 32px; box-shadow: 0 4px 14px rgba(6, 26, 45, 0.06);">
            <h2 style="font-size: 1.5rem; color: #061A2D; margin: 0 0 8px; font-weight: 700;">Send a Message</h2>
            <p style="color: #5D7084; margin: 0 0 24px; font-size: 0.95rem;">Fill out the form below and our team will get back to you.</p>

            <form id="contactForm" onsubmit="event.preventDefault(); alert('Thank you! Your message has been sent.'); this.reset();" style="display: flex; flex-direction: column; gap: 16px;">
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
                    <label for="service" style="font-weight: 600; font-size: 0.9rem; color: #102B49;">Service Needed</label>
                    <select id="service" name="service" required style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background: #ffffff; color: #102B49; font-size: 14px;">
                        <option value="">Select a service</option>
                        <optgroup label="Catalogue Cleaning Services">
                            <option value="indoor" <?php if ($selected_service == 'Indoor Cleaning' || $ref_code == 'CLN-INDOOR') echo 'selected'; ?>>Indoor Cleaning (From R120/hr)</option>
                            <option value="deep_house" <?php if ($selected_service == 'Deep House Cleaning' || $ref_code == 'CLN-DEEP') echo 'selected'; ?>>Deep House Cleaning (From R300)</option>
                            <option value="apartment" <?php if ($selected_service == 'Apartment Cleaning' || $ref_code == 'CLN-APT') echo 'selected'; ?>>Apartment Cleaning (From R150)</option>
                            <option value="office" <?php if ($selected_service == 'Office Cleaning' || $ref_code == 'CLN-OFFICE') echo 'selected'; ?>>Office Cleaning (From R150)</option>
                            <option value="move_in" <?php if ($selected_service == 'Move-In Cleaning' || $ref_code == 'CLN-MOVEIN') echo 'selected'; ?>>Move-In Cleaning (From R250)</option>
                            <option value="move_out" <?php if ($selected_service == 'Move-Out Cleaning' || $ref_code == 'CLN-MOVEOUT') echo 'selected'; ?>>Move-Out Cleaning (From R300)</option>
                            <option value="outdoor" <?php if ($selected_service == 'Outdoor Cleaning' || $ref_code == 'CLN-OUTDOOR') echo 'selected'; ?>>Outdoor Cleaning (From R140)</option>
                            <option value="laundry" <?php if ($selected_service == 'Laundry Services' || $ref_code == 'CLN-LAUNDRY') echo 'selected'; ?>>Laundry Services (From R90/load)</option>
                            <option value="car_wash" <?php if ($selected_service == 'Car Wash' || $ref_code == 'CLN-CARWASH') echo 'selected'; ?>>Car Wash (From R100)</option>
                            <option value="airbnb" <?php if ($selected_service == 'Airbnb Cleaning' || $ref_code == 'CLN-AIRBNB') echo 'selected'; ?>>Airbnb Cleaning (From R150)</option>
                        </optgroup>
                        <optgroup label="Upcoming Project Inquiries">
                            <option value="tech">Technology Division (Pilot / Consultation)</option>
                            <option value="logistics">Logistics & Transport (Pilot / Route Quote)</option>
                        </optgroup>
                        <option value="other">General Enquiry / Consultation</option>
                    </select>
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
                    <textarea id="message" name="message" rows="5" placeholder="Specify property size, extras needed, or address..." required style="width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid #DCE6EE; border-radius: 5px; background: #ffffff; color: #102B49; font-size: 14px; resize: vertical;"><?php if ($selected_service != '') echo "Enquiring about: " . $selected_service . " (Ref: " . $ref_code . "). "; ?></textarea>
                </div>

                <button type="submit" style="width: 100%; padding: 14px; background: #08A9E8; color: #061A2D; border: none; border-radius: 5px; font-weight: 700; font-size: 15px; cursor: pointer; transition: background 0.2s;">
                    Send Message
                </button>
            </form>
        </div>

    </div>
</section>

<?php include 'includes/footer.php'; ?>