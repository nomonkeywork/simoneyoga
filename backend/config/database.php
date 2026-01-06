<?php
/**
 * Database Configuration
 * Uses environment variables for security
 */

// Check if we're in development mode (no database available)
$use_mock = getenv('USE_MOCK_API') === 'true' || file_exists(__DIR__ . '/../.use-mock');

if ($use_mock) {
    // Return null to indicate mock mode
    $pdo = null;
} else {
    $host = getenv('DB_HOST') ?: 'db5019339232.hosting-data.io';
    $db   = getenv('DB_NAME') ?: 'dbs15144294';
    $user = getenv('DB_USER') ?: 'dbu529946';
    $pass = getenv('DB_PASS') ?: 'TivedenYoga_Retreat_2026';

    try {
        $pdo = new PDO(
            "mysql:host=$host;dbname=$db;charset=utf8mb4;port=3306",
            $user,
            $pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 5
            ]
        );
    } catch (PDOException $e) {
        // Log error for debugging (remove in production)
        error_log("Database connection failed: " . $e->getMessage());
        
        // Return null to allow fallback to mock
        $pdo = null;
    }
}


