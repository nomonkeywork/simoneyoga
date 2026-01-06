#!/bin/bash
# Script zur Erstellung des GitHub Repositories

echo "🔍 Prüfe, ob Repository existiert..."
echo ""

# Versuche Repository-Info abzurufen
if curl -s -o /dev/null -w "%{http_code}" https://github.com/nomonkeywork/simoneyoga | grep -q "200\|404"; then
    echo "✅ Repository existiert bereits oder ist erreichbar"
else
    echo "❌ Repository nicht gefunden"
fi

echo ""
echo "📝 Nächste Schritte:"
echo ""
echo "1. Gehe zu: https://github.com/new"
echo "2. Repository-Name: simoneyoga"
echo "3. Wähle 'Private' (empfohlen)"
echo "4. NICHT 'Initialize with README' aktivieren"
echo "5. Klicke 'Create repository'"
echo ""
echo "6. Dann führe aus:"
echo "   git push -u origin main"
echo ""
echo "⚠️  WICHTIG: Du benötigst ein Personal Access Token:"
echo "   https://github.com/settings/tokens"
echo "   → Generate new token (classic)"
echo "   → Scopes: 'repo' auswählen"

