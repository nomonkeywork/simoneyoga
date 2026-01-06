#!/bin/bash
# Script zum Push zu GitHub
# WICHTIG: GitHub erfordert ein Personal Access Token statt Passwort!

echo "🚀 Push zu GitHub Repository: nomonkeywork/simoneyoga"
echo ""
echo "⚠️  WICHTIG: GitHub erlaubt keine Passwort-Authentifizierung mehr!"
echo "   Du musst ein Personal Access Token verwenden."
echo ""
echo "📝 Optionen:"
echo "   1. Personal Access Token erstellen:"
echo "      https://github.com/settings/tokens"
echo "      → Generate new token (classic)"
echo "      → Scopes: 'repo' auswählen"
echo ""
echo "   2. Oder SSH Key verwenden (empfohlen)"
echo ""
read -p "Drücke Enter, um fortzufahren (oder Ctrl+C zum Abbrechen)..."

# Push mit Credentials
git push -u origin main

echo ""
echo "✅ Push abgeschlossen!"
echo "   Repository: https://github.com/nomonkeywork/simoneyoga"


