#!/bin/bash
# Test API endpoints

echo "🧪 Testing SimoneYoga API"
echo "========================="
echo ""

echo "1️⃣  Testing: Get home page"
echo "---------------------------"
curl -s "http://localhost:8001/api/pages.php?slug=home" | python3 -m json.tool 2>/dev/null || curl -s "http://localhost:8001/api/pages.php?slug=home"
echo ""
echo ""

echo "2️⃣  Testing: Get about page"
echo "----------------------------"
curl -s "http://localhost:8001/api/pages.php?slug=about" | python3 -m json.tool 2>/dev/null || curl -s "http://localhost:8001/api/pages.php?slug=about"
echo ""
echo ""

echo "3️⃣  Testing: List all pages"
echo "----------------------------"
curl -s "http://localhost:8001/api/pages-list.php" | python3 -m json.tool 2>/dev/null || curl -s "http://localhost:8001/api/pages-list.php"
echo ""
echo ""

echo "✅ API Tests complete!"


