<?php
$page_title = "Cleaning Services";
include 'includes/header.php';

$services = [
    [
        'id' => 1,
        'name' => '1. Indoor Cleaning',
        'desc' => 'Routine cleaning of indoor living spaces, surfaces, and floors. Best for regular home upkeep.',
        'price' => 'From R120',
        'unit' => '/ Per hour',
        'extras' => 'Ironing (R120/basket), Interior Walls (R200), Fridge (R100), Oven (R150)',
        'image' => 'assets/cleaner-1.jpg'
    ],
    [
        'id' => 2,
        'name' => '2. Deep House Cleaning',
        'desc' => 'Intensive clean for built-up dirt, neglected areas, cupboards, and detailed edge extraction.',
        'price' => 'From R300',
        'unit' => '/ Per visit',
        'extras' => 'Kitchen Cupboards (R180), Skirting Boards (R120), Sofa/Mattress Vacuuming',
        'image' => 'assets/deep-clean.jpg'
    ],
    [
        'id' => 3,
        'name' => '3. Apartment Cleaning',
        'desc' => 'Tailored cleaning for flats, studios, and apartments including kitchens, bathrooms, and floors.',
        'price' => 'From R150',
        'unit' => '/ Per visit',
        'extras' => 'Extra Bedroom (R60), Extra Bathroom (R80), Balcony Sweep (R80)',
        'image' => 'assets/half-day.jpg'
    ],
    [
        'id' => 4,
        'name' => '4. Office Cleaning',
        'desc' => 'Cleaning for small offices, reception areas, workstations, kitchenettes, and shared facilities.',
        'price' => 'From R150',
        'unit' => '/ Per visit',
        'extras' => 'Meeting Room (R100), Kitchenette (R120), Glass Partitions (R25/panel)',
        'image' => 'assets/office-small.jpg'
    ],
    [
        'id' => 5,
        'name' => '5. Move-In Cleaning',
        'desc' => 'Detailed sanitisation before moving into a new home or apartment to ensure a fresh start.',
        'price' => 'From R250',
        'unit' => '/ Per property',
        'extras' => 'Empty Cupboards (R180), Garage Sweep (R150), Wall Spot-Cleaning (R120)',
        'image' => 'assets/house-3bed.jpg'
    ],
    [
        'id' => 6,
        'name' => '6. Move-Out Cleaning',
        'desc' => 'Thorough end-of-tenancy turnover clean to prepare your property for inspection and handover.',
        'price' => 'From R300',
        'unit' => '/ Per property',
        'extras' => 'Inside Fridge (R100), Inside Oven (R150), Balcony/Patio (From R100)',
        'image' => 'assets/move-in-out.jpg'
    ],
    [
        'id' => 7,
        'name' => '7. Outdoor Cleaning',
        'desc' => 'Clearing and washing accessible exterior areas including patios, balconies, entrances, and paving.',
        'price' => 'From R140',
        'unit' => '/ Per visit',
        'extras' => 'Driveway Sweep (R120), Bin Wash (R50/bin), Outdoor Windows (R25/window)',
        'image' => 'assets/post-construction.jpg'
    ],
    [
        'id' => 8,
        'name' => '8. Laundry Services',
        'desc' => 'Wash, fold, and linen sanitisation support alongside accessible window and runner care.',
        'price' => 'From R90',
        'unit' => '/ Per load',
        'extras' => 'Wash & Fold (From R80/load), Ironing (From R60/basket), Bedding Wash (From R100)',
        'image' => 'assets/rug-carpet.jpg'
    ],
    [
        'id' => 9,
        'name' => '9. Car Wash',
        'desc' => 'Vehicle washing packages for everyday sedans, hatchbacks, SUVs, and commercial light vehicles.',
        'price' => 'From R100',
        'unit' => '/ Exterior Wash',
        'extras' => 'Interior Vacuum (R50), Dashboard Wipe (R40), Tyre Shine (R30), Seat Detailing',
        'image' => 'assets/courier-delivery.jpg'
    ],
    [
        'id' => 10,
        'name' => '10. Airbnb Cleaning',
        'desc' => 'Turnover cleaning between guest stays with guest-ready presentation and restock checklists.',
        'price' => 'From R150',
        'unit' => '/ Per turnover',
        'extras' => 'Linen Change (R40/bed), Host Restock (R50), Urgent Same-Day Turnover',
        'image' => 'assets/house-4bed.jpg'
    ]
];

if (file_exists('wisdom-db.php')) {
    include 'wisdom-db.php';
    if (isset($conn) && $conn) {
        $db_query = "SELECT * FROM services ORDER BY id ASC";
        $result = @mysqli_query($conn, $db_query);
        if ($result && mysqli_num_rows($result) > 0) {
            $services = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $services[] = [
                    'id' => $row['id'],
                    'name' => $row['name'],
                    'desc' => $row['description'],
                    'price' => $row['price'],
                    'unit' => isset($row['unit']) ? $row['unit'] : '',
                    'extras' => isset($row['extras']) ? $row['extras'] : '',
                    'image' => isset($row['image']) && $row['image'] != '' ? $row['image'] : 'assets/cleaner-1.jpg'
                ];
            }
        }
    }
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

        <div class="booking-grid">
            <?php foreach ($services as $service): ?>
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
                    <a href="Request-service.html?service_id=<?php echo urlencode($service['id']); ?>" class="btn btn-primary" style="display: block; width: 100%;">Book This Service</a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <div style="margin-top: 60px; background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 36px; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
                <div style="max-width: 680px;">
                    <span class="status" style="margin-bottom: 10px;">EXPANSION DIVISIONS</span>
                    <h3 style="margin: 0 0 10px; color: var(--navy);">Looking for Technology & Logistics Services?</h3>
                    <p style="margin: 0; color: var(--text-muted); font-size: 0.95rem;">
                        Our upcoming Technology Infrastructure and Regional Freight Transport divisions are currently operating in pilot deployment stages. Explore our roadmap, case studies, and upcoming milestones on our Projects page.
                    </p>
                </div>
                <a href="projects.php#upcoming" class="btn button-secondary">Explore Upcoming Projects →</a>
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