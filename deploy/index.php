<?php
/**
 * Main entry point for React SPA
 * Serves the React build files
 */

$indexFile = __DIR__ . '/assets/index.html';

if (file_exists($indexFile)) {
    readfile($indexFile);
} else {
    http_response_code(404);
    echo '<!DOCTYPE html><html><head><title>404</title></head><body><h1>Build files not found</h1><p>Please run: npm run build</p></body></html>';
}

