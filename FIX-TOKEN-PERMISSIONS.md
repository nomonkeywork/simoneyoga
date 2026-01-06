# Fix: Token Permission Denied

## Problem
Das Token hat keine Schreibrechte auf das Repository.

## Lösung: Token mit korrekten Scopes erstellen

### Schritt 1: Neues Token erstellen

1. **Gehe zu:** https://github.com/settings/tokens
2. **Klicke:** "Generate new token" → "Generate new token (classic)"
3. **Note:** "IONOS Deployment - Full Access"
4. **Expiration:** Wähle eine Dauer (z.B. 90 Tage oder "No expiration")
5. **Scopes:** Wähle **unbedingt**:
   - ✅ **repo** (vollständiger Zugriff auf private Repositories)
     - ✅ repo:status
     - ✅ repo_deployment
     - ✅ public_repo
     - ✅ repo:invite
     - ✅ security_events
   - ✅ **workflow** (für GitHub Actions)
6. **Klicke:** "Generate token"
7. **Kopiere den Token** (wird nur einmal angezeigt!)

### Schritt 2: Remote URL mit neuem Token aktualisieren

```bash
cd /Users/frederickkuhrt/Desktop/anima

# Ersetze [NEUER_TOKEN] mit deinem neuen Token
git remote set-url origin https://[NEUER_TOKEN]@github.com/nomonkeywork/simoneyoga.git

# Push
git push -u origin main
```

### Schritt 3: Token in GitHub Secrets speichern (für Actions)

Falls du das Token auch für GitHub Actions brauchst:

1. Gehe zu: https://github.com/nomonkeywork/simoneyoga/settings/secrets/actions
2. Füge hinzu:
   ```
   Name: GITHUB_TOKEN
   Value: [DEIN_NEUER_TOKEN]
   ```

## Alternative: SSH verwenden

Falls Token-Probleme weiterhin bestehen:

### SSH Key Setup

```bash
# SSH Key generieren
ssh-keygen -t ed25519 -C "fk1973@gmail.com"

# Public Key anzeigen
cat ~/.ssh/id_ed25519.pub
```

1. **Kopiere den Public Key**
2. **Füge ihn zu GitHub hinzu:**
   - Gehe zu: https://github.com/settings/keys
   - Klicke "New SSH key"
   - Titel: "IONOS Deployment"
   - Key: Füge den Public Key ein
   - Klicke "Add SSH key"

3. **Remote auf SSH umstellen:**
   ```bash
   git remote set-url origin git@github.com:nomonkeywork/simoneyoga.git
   git push -u origin main
   ```

## Prüfen, ob Token funktioniert

```bash
# Teste Token
curl -H "Authorization: token [DEIN_TOKEN]" \
  https://api.github.com/user

# Sollte deinen Benutzernamen zurückgeben
```

## Wichtige Scopes für Deployment

Für vollständigen Zugriff benötigt das Token:
- ✅ **repo** (vollständiger Zugriff)
- ✅ **workflow** (GitHub Actions)

Ohne diese Scopes wird der Push fehlschlagen!


