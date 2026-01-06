<?php
/**
 * Test Database Connection
 * Run this to verify database connectivity
 */

require __DIR__ . '/config/database.php';

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Database Connection Test</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; background: #d4edda; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #f8d7da; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .info { background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
        th { background: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Database Connection Test</h1>
    
    <?php if ($pdo === null): ?>
        <div class="error">
            <strong>❌ Database connection failed</strong><br>
            The API will use mock data. Check your database credentials.
        </div>
    <?php else: ?>
        <div class="success">
            <strong>✅ Database connection successful!</strong>
        </div>
        
        <div class="info">
            <strong>Connection Details:</strong><br>
            Host: <?php echo htmlspecialchars(getenv('DB_HOST') ?: 'db5019339232.hosting-data.io'); ?><br>
            Database: <?php echo htmlspecialchars(getenv('DB_NAME') ?: 'dbs15144294'); ?><br>
            User: <?php echo htmlspecialchars(getenv('DB_USER') ?: 'dbu529946'); ?>
        </div>
        
        <?php
        try {
            // Test query
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM pages");
            $result = $stmt->fetch();
            $pageCount = $result['count'];
            
            echo "<div class='info'><strong>Pages in database:</strong> $pageCount</div>";
            
            // List all pages
            $stmt = $pdo->query("SELECT id, slug, title FROM pages ORDER BY id");
            $pages = $stmt->fetchAll();
            
            if (count($pages) > 0):
        ?>
            <h2>Pages in Database:</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Slug</th>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($pages as $page): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($page['id']); ?></td>
                            <td><?php echo htmlspecialchars($page['slug']); ?></td>
                            <td><?php echo htmlspecialchars($page['title']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php
            endif;
        } catch (PDOException $e) {
            echo "<div class='error'><strong>Query Error:</strong><br>" . htmlspecialchars($e->getMessage()) . "</div>";
        }
        ?>
    <?php endif; ?>
    
    <hr>
    <p><a href="/api/pages.php?slug=home">Test API: /api/pages.php?slug=home</a></p>
</body>
</html>


