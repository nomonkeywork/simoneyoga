# Git Push Anleitung

## Repository ist vorbereitet

Das Repository wurde initialisiert und alle Dateien wurden committed.

## Push zu GitHub

**WICHTIG:** Für den Push musst du deine GitHub Credentials eingeben.

### Option 1: Push mit Credentials (einmalig)

```bash
cd /Users/frederickkuhrt/Desktop/anima

# Push zu GitHub (wird nach Credentials fragen)
git push -u origin main
```

Wenn nach Credentials gefragt wird:
- **Username:** `fk1973@gmail.com`
- **Password:** `Cursor:2025`

### Option 2: Personal Access Token verwenden (empfohlen)

GitHub erlaubt seit 2021 keine Passwort-Authentifizierung mehr. Du musst ein **Personal Access Token** verwenden:

1. Gehe zu: https://github.com/settings/tokens
2. Klicke auf **"Generate new token"** → **"Generate new token (classic)"**
3. Name: z.B. "IONOS Deployment"
4. Scopes: Wähle `repo` (vollständiger Zugriff auf private Repositories)
5. Klicke **"Generate token"**
6. **Kopiere den Token** (wird nur einmal angezeigt!)

Dann beim Push:
- **Username:** `fk1973@gmail.com`
- **Password:** `DEIN_PERSONAL_ACCESS_TOKEN` (nicht dein GitHub Passwort!)

### Option 3: SSH Key verwenden (am sichersten)

```bash
# SSH Key generieren (falls noch nicht vorhanden)
ssh-keygen -t ed25519 -C "fk1973@gmail.com"

# Public Key anzeigen
cat ~/.ssh/id_ed25519.pub

# Kopiere den Key und füge ihn zu GitHub hinzu:
# https://github.com/settings/keys → "New SSH key"
```

Dann Remote auf SSH umstellen:
```bash
git remote set-url origin git@github.com:nomonkeywork/simoneyoga.git
git push -u origin main
```

## Nach dem Push

1. Gehe zu: https://github.com/nomonkeywork/simoneyoga
2. Prüfe, ob alle Dateien hochgeladen wurden
3. Gehe zu **Settings** → **Secrets and variables** → **Actions**
4. Füge die FTP Secrets hinzu (siehe GITHUB-SETUP.md)

## Automatisches Deployment

Nach dem Push und nach dem Einrichten der Secrets wird bei jedem weiteren Push zu `main` automatisch zu IONOS deployed.


