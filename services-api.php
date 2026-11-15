<?php
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT s.service_id, s.category_id, s.service_name, s.description, s.price, s.pricing_type, s.is_active,
            MAX(sp.image_path) AS image_path,
            (SELECT COUNT(*) FROM bookings b WHERE b.service_id = s.service_id) AS bookings
            FROM services s
            LEFT JOIN service_photos sp ON s.service_id = sp.service_id
            GROUP BY s.service_id, s.category_id, s.service_name, s.description, s.price, s.pricing_type, s.is_active
            ORDER BY s.service_id ASC";
    $result = mysqli_query($conn, $sql);
    $services = [];

    $categoryMap = [
        1 => 'Commercial',
        2 => 'Residential',
        3 => 'Commercial',
        4 => 'Specialist'
    ];

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $unit = 'Per visit';
            if ($row['pricing_type'] === 'hourly_team_rate') {
                $unit = 'Per hour';
            } elseif ($row['pricing_type'] === 'per_square_metre') {
                $unit = 'Per square metre';
            }

            $services[] = [
                'id' => (int)$row['service_id'],
                'name' => $row['service_name'],
                'category' => isset($categoryMap[(int)$row['category_id']]) ? $categoryMap[(int)$row['category_id']] : 'Residential',
                'unit' => $unit,
                'pricing_type' => $row['pricing_type'],
                'price' => (float)$row['price'],
                'bookings' => (int)$row['bookings'],
                'status' => (int)$row['is_active'] === 1 ? 'Active' : 'Inactive',
                'description' => $row['description'] ?? '',
                'image' => $row['image_path'] ?? ''
            ];
        }
    }

    echo json_encode($services);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $input = strpos($contentType, 'application/json') !== false
        ? (json_decode(file_get_contents('php://input'), true) ?? [])
        : $_POST;

    $action = $input['action'] ?? '';

    if ($action === 'save') {
        $id = !empty($input['id']) ? (int)$input['id'] : 0;
        $name = trim($input['name'] ?? '');
        $categoryText = $input['category'] ?? 'Residential';
        $unitText = $input['unit'] ?? 'Per visit';
        $price = (float)($input['price'] ?? 0);
        $isActive = ($input['status'] ?? 'Active') === 'Active' ? 1 : 0;
        $description = trim($input['description'] ?? '');
        $removeImage = ($input['remove_image'] ?? '0') === '1';

        $categoryId = 2;
        if ($categoryText === 'Commercial') {
            $categoryId = 1;
        } elseif ($categoryText === 'Specialist' || $categoryText === 'Deep Cleaning') {
            $categoryId = 4;
        }

        $pricingType = 'fixed_job_price';
        if ($unitText === 'Per hour') {
            $pricingType = 'hourly_team_rate';
        } elseif ($unitText === 'Per square metre') {
            $pricingType = 'per_square_metre';
        }

        if ($id > 0) {
            $stmt = mysqli_prepare($conn, "UPDATE services SET category_id = ?, service_name = ?, description = ?, price = ?, pricing_type = ?, is_active = ? WHERE service_id = ?");
            mysqli_stmt_bind_param($stmt, "issdsii", $categoryId, $name, $description, $price, $pricingType, $isActive, $id);
            $success = mysqli_stmt_execute($stmt);
        } else {
            $stmt = mysqli_prepare($conn, "INSERT INTO services (category_id, service_name, description, price, pricing_type, online_bookable, is_active) VALUES (?, ?, ?, ?, ?, 1, ?)");
            mysqli_stmt_bind_param($stmt, "issdsi", $categoryId, $name, $description, $price, $pricingType, $isActive);
            $success = mysqli_stmt_execute($stmt);
            $id = mysqli_insert_id($conn);
        }

        if ($success && $id > 0) {
            if ($removeImage) {
                $delStmt = mysqli_prepare($conn, "DELETE FROM service_photos WHERE service_id = ?");
                mysqli_stmt_bind_param($delStmt, "i", $id);
                mysqli_stmt_execute($delStmt);
            }

            if (!empty($_FILES['service_image']['name']) && $_FILES['service_image']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = __DIR__ . '/uploads/services/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $ext = strtolower(pathinfo($_FILES['service_image']['name'], PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                    $fileName = 'service_' . $id . '_' . time() . '.' . $ext;
                    if (move_uploaded_file($_FILES['service_image']['tmp_name'], $uploadDir . $fileName)) {
                        $relPath = 'uploads/services/' . $fileName;

                        $delOld = mysqli_prepare($conn, "DELETE FROM service_photos WHERE service_id = ?");
                        mysqli_stmt_bind_param($delOld, "i", $id);
                        mysqli_stmt_execute($delOld);

                        $insPhoto = mysqli_prepare($conn, "INSERT INTO service_photos (service_id, image_path) VALUES (?, ?)");
                        mysqli_stmt_bind_param($insPhoto, "is", $id, $relPath);
                        mysqli_stmt_execute($insPhoto);
                    }
                }
            }
        }

        echo json_encode(['success' => $success, 'id' => $id]);
        exit;
    }

    if ($action === 'toggle') {
        $id = (int)($input['id'] ?? 0);
        $isActive = ($input['status'] ?? 'Active') === 'Active' ? 1 : 0;

        $stmt = mysqli_prepare($conn, "UPDATE services SET is_active = ? WHERE service_id = ?");
        mysqli_stmt_bind_param($stmt, "ii", $isActive, $id);
        $success = mysqli_stmt_execute($stmt);

        echo json_encode(['success' => $success]);
        exit;
    }

    if ($action === 'delete') {
        $id = (int)($input['id'] ?? 0);

        $stmt = mysqli_prepare($conn, "DELETE FROM services WHERE service_id = ?");
        mysqli_stmt_bind_param($stmt, "i", $id);
        $success = mysqli_stmt_execute($stmt);

        echo json_encode(['success' => $success]);
        exit;
    }
}
?>