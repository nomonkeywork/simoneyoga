#!/bin/bash
# Start PHP development server for API

echo "🚀 Starting PHP development server on http://localhost:8001"
echo "📡 API will be available at http://localhost:8001/api/"
echo "🏠 Backend overview: http://localhost:8001/"
echo ""
echo "Press Ctrl+C to stop"
echo ""

cd "$(dirname "$0")"
php -S localhost:8001 -t .

