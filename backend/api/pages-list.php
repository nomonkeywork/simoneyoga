<?php
/**
 * Pages List API Endpoint
 * Returns all pages or filtered list
 */

require __DIR__ . '/../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
    $limit = min(max($limit, 1), 100); // Clamp between 1 and 100
    
    $stmt = $pdo->prepare("SELECT id, slug, title, created_at FROM pages ORDER BY created_at DESC LIMIT ?");
    $stmt->execute([$limit]);
    
    $pages = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'count' => count($pages),
        'pages' => $pages
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}

