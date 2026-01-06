<?php
/**
 * Pages API Endpoint
 * Returns page content from database or mock data
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

$slug = $_GET['slug'] ?? 'home';
$slug = preg_replace('/[^a-z0-9-]/', '', strtolower($slug));

// If no database connection, use mock data
if ($pdo === null) {
    require __DIR__ . '/mock-pages.php';
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, slug, title, content, created_at FROM pages WHERE slug = ?");
    $stmt->execute([$slug]);
    
    $page = $stmt->fetch();
    
    if (!$page) {
        http_response_code(404);
        echo json_encode(['error' => 'Page not found']);
        exit;
    }
    
    echo json_encode($page);
    
} catch (PDOException $e) {
    // Fallback to mock if database query fails
    error_log("Database query failed: " . $e->getMessage());
    require __DIR__ . '/mock-pages.php';
}

