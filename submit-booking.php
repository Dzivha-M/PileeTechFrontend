<?php
session_start();
header('Content-Type: application/json');

if (file_exists(__DIR__ . '/db.php')) {
    include __DIR__ . '/db.php';
} elseif (file_exists(dirname(__DIR__) . '/db.php')) {
    include dirname(__DIR__) . '/db.php';
} else {
    $conn = @mysqli_connect('localhost', 'root', '', 'pileetech');
}

if (!isset($conn) || !$conn) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$reference = trim($data['reference'] ?? ('PILEE-' . rand(100000, 999999)));
$email = trim($data['customer']['email'] ?? ($_SESSION['email'] ?? ''));
$customerId = (int)($data['customer_id'] ?? ($_SESSION['customer_id'] ?? 0));
$serviceName = trim($data['service'] ?? '');
$serviceId = (int)($data['service_id'] ?? 0);
$cleaningDate = trim($data['date'] ?? date('Y-m-d'));
$preferredTime = trim($data['time'] ?? '09:00');
if (strlen($preferredTime) === 5) {
    $preferredTime .= ':00';
}
$durationHours = (int)($data['duration'] ?? 3);
$requestedCleaners = max(1, (int)($data['cleanerCount'] ?? 1));
$totalPrice = (float)($data['total'] ?? 0);

$addr = $data['address'] ?? [];
$propertyAddress = implode(', ', array_filter([
    trim($addr['street'] ?? ''),
    trim($addr['building'] ?? ''),
    trim($addr['city'] ?? ''),
    trim($addr['province'] ?? ''),
    trim($addr['postal'] ?? '')
]));
if ($propertyAddress === '') {
    $propertyAddress = '14 Jacaranda Street, Johannesburg, Gauteng, 2006';
}

$instructionsParts = [];
if (!empty($data['frequency']) && $data['frequency'] !== 'One-time') {
    $instructionsParts[] = 'Frequency: ' . $data['frequency'] . ' (' . ($data['scheduleDuration'] ?? 4) . ' weeks/months)';
}
if (!empty($data['extras']) && is_array($data['extras'])) {
    $instructionsParts[] = 'Extras: ' . implode(', ', $data['extras']);
}
if (!empty($data['pets']) && $data['pets'] === 'Yes') {
    $instructionsParts[] = 'Pets: ' . trim($data['petDetails'] ?? 'Yes');
}
if (!empty($data['instructions'])) {
    $instructionsParts[] = trim($data['instructions']);
}
$specialInstructions = implode(' | ', $instructionsParts);

if ($customerId <= 0 && $email !== '') {
    $stmtC = mysqli_prepare($conn, "SELECT c.customer_id FROM customers c INNER JOIN users u ON c.user_id = u.user_id WHERE u.email = ? LIMIT 1");
    mysqli_stmt_bind_param($stmtC, "s", $email);
    mysqli_stmt_execute($stmtC);
    if ($r = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtC))) {
        $customerId = (int)$r['customer_id'];
    }
}
if ($customerId <= 0) {
    $anyC = mysqli_query($conn, "SELECT customer_id FROM customers ORDER BY customer_id ASC LIMIT 1");
    $customerId = ($anyC && ($r = mysqli_fetch_assoc($anyC))) ? (int)$r['customer_id'] : 1;
}

if ($serviceId <= 0 && $serviceName !== '') {
    $stmtS = mysqli_prepare($conn, "SELECT service_id FROM services WHERE service_name = ? LIMIT 1");
    mysqli_stmt_bind_param($stmtS, "s", $serviceName);
    mysqli_stmt_execute($stmtS);
    if ($r = mysqli_fetch_assoc(mysqli_stmt_get_result($stmtS))) {
        $serviceId = (int)$r['service_id'];
    }
}
if ($serviceId <= 0) {
    $anyS = mysqli_query($conn, "SELECT service_id FROM services WHERE is_active = 1 ORDER BY service_id ASC LIMIT 1");
    $serviceId = ($anyS && ($r = mysqli_fetch_assoc($anyS))) ? (int)$r['service_id'] : 1;
}

$pricingType = 'fixed_job_price';
$ptRes = mysqli_query($conn, "SELECT pricing_type FROM services WHERE service_id = $serviceId LIMIT 1");
if ($ptRes && ($r = mysqli_fetch_assoc($ptRes))) {
    $pricingType = $r['pricing_type'] ?: 'fixed_job_price';
}

$stmt = mysqli_prepare($conn, "
    INSERT INTO bookings (
        booking_reference, customer_id, service_id, requested_cleaners, pricing_type,
        cleaning_date, preferred_time, duration_hours, property_address, property_type,
        special_instructions, price, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'house', ?, ?, 'pending')
");
mysqli_stmt_bind_param(
    $stmt,
    "siiisssissd",
    $reference,
    $customerId,
    $serviceId,
    $requestedCleaners,
    $pricingType,
    $cleaningDate,
    $preferredTime,
    $durationHours,
    $propertyAddress,
    $specialInstructions,
    $totalPrice
);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(['success' => true, 'booking_id' => mysqli_insert_id($conn), 'reference' => $reference]);
} else {
    echo json_encode(['success' => false, 'message' => 'Could not save booking to database.']);
}
?>