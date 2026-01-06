<?php
/**
 * Mock API for development when database is not available
 * Returns sample data for testing
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$slug = $_GET['slug'] ?? 'home';

$mockPages = [
    'home' => [
        'id' => 1,
        'slug' => 'home',
        'title' => 'Willkommen bei SimoneYoga',
        'content' => '<h1>Herz-Kohärenz-App</h1><p>Die App, die deinen Stress in 5 Minuten reduziert, kostenlos.</p>',
        'meta_description' => 'SimoneYoga - Herz-Kohärenz-App für Stressreduktion',
        'created_at' => date('Y-m-d H:i:s')
    ],
    'about' => [
        'id' => 2,
        'slug' => 'about',
        'title' => 'Über uns',
        'content' => '<h1>Über SimoneYoga</h1><p>Wir helfen dir, deinen Stress zu reduzieren und dein Wohlbefinden zu steigern.</p>',
        'meta_description' => 'Über SimoneYoga',
        'created_at' => date('Y-m-d H:i:s')
    ],
    'retreat' => [
        'id' => 3,
        'slug' => 'retreat',
        'title' => 'Yoga Retreat - Juni 2026',
        'content' => '<h1>Yoga Retreat</h1><p>Unser Retreat im Juni 2026 bietet dir die Möglichkeit, tief zu entspannen und neue Energie zu tanken.</p>',
        'meta_description' => 'Yoga Retreat Juni 2026',
        'created_at' => date('Y-m-d H:i:s')
    ]
];

$page = $mockPages[$slug] ?? null;

if (!$page) {
    http_response_code(404);
    echo json_encode(['error' => 'Page not found']);
    exit;
}

echo json_encode($page);

