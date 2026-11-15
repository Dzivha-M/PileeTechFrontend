<?php
$page_title = "Cleaning Services";
include 'includes/header.php';

$services = [];
$dbConnected = false;

if (file_exists(__DIR__ . '/db.php')) {
    include __DIR__ . '/db.php';
} elseif (file_exists(dirname(__DIR__) . '/db.php')) {
    include dirname(__DIR__) . '/db.php';
} else {
    $conn = @mysqli_connect('localhost', 'root', '', 'pileetech');
}

if (isset($conn) && $conn) {
    $db_query = "SELECT s.service_id, s.service_name, s.description, s.price, s.pricing_type, MAX(sp.image_path) AS image_path 
                 FROM services s 
                 LEFT JOIN service_photos sp ON s.service_id = sp.service_id 
                 WHERE s.is_active = 1 
                 GROUP BY s.service_id, s.service_name, s.description, s.price, s.pricing_type 
                 ORDER BY s.service_id ASC";
    $result = @mysqli_query($conn, $db_query);
    if ($result) {
        $dbConnected = true;
        while ($row = mysqli_fetch_assoc($result)) {
            $unit = '/ Per visit';
            if ($row['pricing_type'] === 'hourly_team_rate') {
                $unit = '/ Per hour';
            } elseif ($row['pricing_type'] === 'per_square_metre') {
                $unit = '/ Per m²';
            }

            $services[] = [
                'id' => (int)$row['service_id'],
                'name' => $row['service_name'],
                'desc' => $row['description'] ?? '',
                'price' => 'From R' . number_format((float)$row['price'], 2),
                'raw_price' => (float)$row['price'],
                'pricing_type' => $row['pricing_type'],
                'unit' => $unit,
                'extras' => '',
                'image' => !empty($row['image_path']) ? $row['image_path'] : 'assets/cleaner-1.jpg'
            ];
        }
    }
}

if (!$dbConnected) {
    $services = [
        [
            'id' => 1,
            'name' => 'Indoor Cleaning',
            'desc' => 'Routine cleaning of indoor living spaces, surfaces, and floors. Best for regular home upkeep.',
            'price' => 'From R120.00',
            'raw_price' => 120,
            'pricing_type' => 'hourly_team_rate',
            'unit' => '/ Per hour',
            'extras' => 'Ironing (R120/basket), Interior Walls (R200), Fridge (R100), Oven (R150)',
            'image' => 'assets/cleaner-1.jpg'
        ],
        [
            'id' => 2,
            'name' => 'Deep House Cleaning',
            'desc' => 'Intensive clean for built-up dirt, neglected areas, cupboards, and detailed edge extraction.',
            'price' => 'From R300.00',
            'raw_price' => 300,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Per visit',
            'extras' => 'Kitchen Cupboards (R180), Skirting Boards (R120), Sofa/Mattress Vacuuming',
            'image' => 'assets/deep-clean.jpg'
        ],
        [
            'id' => 3,
            'name' => 'Apartment Cleaning',
            'desc' => 'Tailored cleaning for flats, studios, and apartments including kitchens, bathrooms, and floors.',
            'price' => 'From R150.00',
            'raw_price' => 150,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Per visit',
            'extras' => 'Extra Bedroom (R60), Extra Bathroom (R80), Balcony Sweep (R80)',
            'image' => 'assets/half-day.jpg'
        ],
        [
            'id' => 4,
            'name' => 'Office Cleaning',
            'desc' => 'Cleaning for small offices, reception areas, workstations, kitchenettes, and shared facilities.',
            'price' => 'From R150.00',
            'raw_price' => 150,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Per visit',
            'extras' => 'Meeting Room (R100), Kitchenette (R120), Glass Partitions (R25/panel)',
            'image' => 'assets/office-small.jpg'
        ],
        [
            'id' => 5,
            'name' => 'Move-In Cleaning',
            'desc' => 'Detailed sanitisation before moving into a new home or apartment to ensure a fresh start.',
            'price' => 'From R250.00',
            'raw_price' => 250,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Per property',
            'extras' => 'Empty Cupboards (R180), Garage Sweep (R150), Wall Spot-Cleaning (R120)',
            'image' => 'assets/house-3bed.jpg'
        ],
        [
            'id' => 6,
            'name' => 'Move-Out Cleaning',
            'desc' => 'Thorough end-of-tenancy turnover clean to prepare your property for inspection and handover.',
            'price' => 'From R300.00',
            'raw_price' => 300,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Per property',
            'extras' => 'Inside Fridge (R100), Inside Oven (R150), Balcony/Patio (From R100)',
            'image' => 'assets/move-in-out.jpg'
        ],
        [
            'id' => 7,
            'name' => 'Outdoor Cleaning',
            'desc' => 'Clearing and washing accessible exterior areas including patios, balconies, entrances, and paving.',
            'price' => 'From R140.00',
            'raw_price' => 140,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Per visit',
            'extras' => 'Driveway Sweep (R120), Bin Wash (R50/bin), Outdoor Windows (R25/window)',
            'image' => 'assets/post-construction.jpg'
        ],
        [
            'id' => 8,
            'name' => 'Laundry Services',
            'desc' => 'Wash, fold, and linen sanitisation support alongside accessible window and runner care.',
            'price' => 'From R90.00',
            'raw_price' => 90,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Per load',
            'extras' => 'Wash & Fold (From R80/load), Ironing (From R60/basket), Bedding Wash (From R100)',
            'image' => 'assets/rug-carpet.jpg'
        ],
        [
            'id' => 9,
            'name' => 'Car Wash',
            'desc' => 'Vehicle washing packages for everyday sedans, hatchbacks, SUVs, and commercial light vehicles.',
            'price' => 'From R100.00',
            'raw_price' => 100,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Exterior Wash',
            'extras' => 'Interior Vacuum (R50), Dashboard Wipe (R40), Tyre Shine (R30), Seat Detailing',
            'image' => 'assets/courier-delivery.jpg'
        ],
        [
            'id' => 10,
            'name' => 'Airbnb Cleaning',
            'desc' => 'Turnover cleaning between guest stays with guest-ready presentation and restock checklists.',
            'price' => 'From R150.00',
            'raw_price' => 150,
            'pricing_type' => 'fixed_job_price',
            'unit' => '/ Per turnover',
            'extras' => 'Linen Change (R40/bed), Host Restock (R50), Urgent Same-Day Turnover',
            'image' => 'assets/house-4bed.jpg'
        ]
    ];
}
?>

<section class="page-hero hero-services">
    <div class="container">
        <h1>Cleaning Services</h1>
        <p>Clean spaces, more peace of mind. Choose a service, select your add-on extras, and request a booking.</p>
    </div>
</section>

<section class="service-block" id="services-grid">
    <div class="container">

        <h2>Our Cleaning Services</h2>
        <p class="section-intro">Comprehensive cleaning solutions for homes, apartments, offices, vehicles, and short-stay properties.</p>

        <?php if (empty($services)): ?>
            <p style="text-align:center; padding: 32px 0; color: var(--text-muted);">No active cleaning services are currently available. Please check back soon.</p>
        <?php else: ?>
        <div class="booking-grid">
            <?php foreach ($services as $service): ?>
            <?php
                $bookingQuery = http_build_query([
                    'service_id' => $service['id'],
                    'service' => $service['name'],
                    'price' => $service['raw_price'],
                    'unit' => $service['unit']
                ]);
            ?>
            <div class="booking-card">
                <img src="<?php echo htmlspecialchars($service['image']); ?>" alt="<?php echo htmlspecialchars($service['name']); ?>" class="service-thumb" onerror="this.src='assets/logo.jpeg'">
                <div class="booking-card-body">
                    <h3><?php echo htmlspecialchars($service['name']); ?></h3>
                    <p class="service-desc"><?php echo htmlspecialchars($service['desc']); ?></p>
                    <div class="price-box">
                        <span class="price"><?php echo htmlspecialchars($service['price']); ?></span>
                        <span class="unit"><?php echo htmlspecialchars($service['unit']); ?></span>
                    </div>
                    <?php if (!empty($service['extras'])): ?>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
                        <strong>Popular Extras:</strong> <?php echo htmlspecialchars($service['extras']); ?>
                    </div>
                    <?php endif; ?>
                    <a href="Request-service.html?<?php echo htmlspecialchars($bookingQuery); ?>" class="btn btn-primary" style="display: block; width: 100%;">Book This Service</a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <div style="margin-top: 60px; background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 36px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                <div style="max-width: 680px;">
                    <span class="status" style="margin-bottom: 10px;">PARTNER OPPORTUNITIES</span>
                    <h3 style="margin: 0 0 10px; color: var(--navy);">Looking to Become an Independent Partner?</h3>
                    <p style="margin: 0; color: var(--text-muted); font-size: 0.95rem;">
                        If you are looking to become an independent cleaning partner with Pilee Tech Group, submit your application online to join our verified service team across Pretoria and Gauteng.
                    </p>
                </div>
                <a href="cleaning-partner-recruitment.html" class="btn button-secondary">Apply as a Partner →</a>
            </div>
        </div>

    </div>
</section>

<section class="cta-strip">
    <div class="container">
        <h2>Need a custom site assessment or larger quote?</h2>
        <p>Send our management team a message for large buildings, recurring contracts, or tailored specs.</p>
        <a href="contact.php" class="btn btn-primary">Request Custom Quote</a>
    </div>
</section>

<?php include 'includes/footer.php'; ?>
