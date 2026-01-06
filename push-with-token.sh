#!/bin/bash
# Push zu GitHub mit Personal Access Token

TOKEN="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"
USERNAME="fk1973@gmail.com"

echo "🚀 Pushing to GitHub..."
echo ""

# Setze Remote URL
git remote set-url origin https://github.com/nomonkeywork/simoneyoga.git

# Push mit Token als Passwort
git push -u origin main <<EOF
$USERNAME
$TOKEN
EOF

echo ""
echo "✅ Push abgeschlossen!"


