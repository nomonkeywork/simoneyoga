# Git Repository Problem beheben

## Problem
Das Repository `https://github.com/nomonkeywork/simoneyoga.git` wird nicht gefunden.

## Mögliche Ursachen

1. **Repository existiert noch nicht auf GitHub**
2. **Repository ist privat und Authentifizierung fehlt**
3. **Falscher Benutzername oder Repository-Name**

## Lösungen

### Option 1: Repository auf GitHub erstellen

1. Gehe zu: https://github.com/new
2. Repository-Name: `simoneyoga`
3. Wähle **Private** (empfohlen)
4. **NICHT** "Initialize with README" aktivieren
5. Klicke **"Create repository"**

### Option 2: Remote URL prüfen und korrigieren

```bash
# Aktuelle Remote prüfen
git remote -v

# Falls falsch, korrigieren:
git remote set-url origin https://github.com/nomonkeywork/simoneyoga.git

# Oder falls der Benutzername anders ist:
git remote set-url origin https://github.com/DEIN-RICHTIGER-USERNAME/simoneyoga.git
```

### Option 3: Mit Authentifizierung pushen

GitHub erfordert ein **Personal Access Token** statt Passwort:

1. **Token erstellen:**
   - Gehe zu: https://github.com/settings/tokens
   - "Generate new token (classic)"
   - Scopes: `repo` auswählen
   - Token kopieren

2. **Push mit Token:**
   ```bash
   git push -u origin main
   # Username: fk1973@gmail.com
   # Password: [DEIN_PERSONAL_ACCESS_TOKEN]
   ```

### Option 4: SSH verwenden (empfohlen)

```bash
# SSH Key generieren (falls noch nicht vorhanden)
ssh-keygen -t ed25519 -C "fk1973@gmail.com"

# Public Key anzeigen
cat ~/.ssh/id_ed25519.pub

# Key zu GitHub hinzufügen:
# https://github.com/settings/keys → "New SSH key"

# Remote auf SSH umstellen
git remote set-url origin git@github.com:nomonkeywork/simoneyoga.git

# Push
git push -u origin main
```

## Schnelllösung

Falls das Repository noch nicht existiert:

1. **Erstelle es auf GitHub** (siehe Option 1)
2. **Dann push:**
   ```bash
   git push -u origin main
   ```

Falls Authentifizierung benötigt wird, verwende ein Personal Access Token.

