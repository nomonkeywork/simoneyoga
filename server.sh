#!/bin/bash
# Simple local web server for offline simoneyoga site
# Usage: ./server.sh

PORT=8000
echo "Starting local web server on http://localhost:$PORT"
echo "Open http://localhost:$PORT/index.html in your browser"
echo "Press Ctrl+C to stop the server"
echo ""
python3 -m http.server $PORT

