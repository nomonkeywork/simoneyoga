<?php
/**
 * Backend Index Page
 * Overview of available API endpoints
 */
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SimoneYoga API - Backend</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2em;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px;
        }
        .status {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .status.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .endpoint h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .endpoint code {
            background: #e9ecef;
            padding: 5px 10px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            display: inline-block;
            margin: 5px 0;
        }
        .endpoint a {
            color: #667eea;
            text-decoration: none;
            display: inline-block;
            margin-top: 10px;
            padding: 8px 15px;
            background: #667eea;
            color: white;
            border-radius: 4px;
            transition: background 0.3s;
        }
        .endpoint a:hover {
            background: #5568d3;
        }
        .links {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
        }
        .links a {
            display: inline-block;
            margin: 5px 10px 5px 0;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
        }
        .links a:hover {
            background: #5568d3;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘 SimoneYoga API</h1>
            <p>Backend Server - Development Mode</p>
        </div>
        
        <div class="content">
            <?php
            // Test database connection
            require __DIR__ . '/config/database.php';
            
            if ($pdo === null):
            ?>
                <div class="status error">
                    <strong>⚠️ Database Connection Failed</strong><br>
                    The API will use mock data. Check your database configuration.
                </div>
            <?php else: ?>
                <div class="status success">
                    <strong>✅ Database Connection Successful</strong><br>
                    Connected to: <?php echo htmlspecialchars(getenv('DB_NAME') ?: 'dbs15144294'); ?>
                </div>
            <?php endif; ?>
            
            <h2>Available API Endpoints</h2>
            
            <div class="endpoint">
                <h3>Get Page by Slug</h3>
                <p>Retrieve a single page by its slug.</p>
                <code>GET /api/pages.php?slug=home</code><br>
                <a href="/api/pages.php?slug=home" target="_blank">Test: home</a>
                <a href="/api/pages.php?slug=about" target="_blank">Test: about</a>
                <a href="/api/pages.php?slug=retreat" target="_blank">Test: retreat</a>
            </div>
            
            <div class="endpoint">
                <h3>List All Pages</h3>
                <p>Get a list of all pages in the database.</p>
                <code>GET /api/pages-list.php</code><br>
                <a href="/api/pages-list.php" target="_blank">Test Endpoint</a>
            </div>
            
            <div class="endpoint">
                <h3>Database Connection Test</h3>
                <p>Test database connectivity and view all pages.</p>
                <code>GET /test-connection.php</code><br>
                <a href="/test-connection.php" target="_blank">Test Connection</a>
            </div>
            
            <div class="links">
                <h3>Quick Links</h3>
                <a href="/api/pages.php?slug=home">API: Home</a>
                <a href="/api/pages-list.php">API: All Pages</a>
                <a href="/test-connection.php">Test Connection</a>
            </div>
        </div>
    </div>
</body>
</html>


