# GitHub Repository Setup für IONOS Deployment

## 1. GitHub Repository erstellen

### Option A: Neues Repository auf GitHub erstellen

1. Gehe zu [github.com](https://github.com) und logge dich ein
2. Klicke auf **"New repository"** (oder **"+"** → **"New repository"**)
3. Repository-Name: z.B. `simoneyoga` oder `simoneyoga-website`
4. Beschreibung: "SimoneYoga Website - React + PHP + MariaDB"
5. **Wichtig:** Wähle **Private** (falls du die Datenbank-Credentials nicht öffentlich machen willst)
6. **NICHT** "Initialize with README" aktivieren (wenn du bereits Code hast)
7. Klicke **"Create repository"**

### Option B: Bestehendes Repository verwenden

Falls du bereits ein Repository hast, verwende dieses.

## 2. Lokales Repository initialisieren (falls noch nicht geschehen)

```bash
cd /Users/frederickkuhrt/Desktop/anima

# Git initialisieren (falls noch nicht geschehen)
git init

# Alle Dateien hinzufügen
git add .

# Erster Commit
git commit -m "Initial commit: React + PHP + MariaDB setup"

# GitHub Repository als Remote hinzufügen
git remote add origin https://github.com/DEIN-USERNAME/simoneyoga.git

# Branch umbenennen zu main (falls nötig)
git branch -M main

# Ersten Push
git push -u origin main
```

## 3. GitHub Secrets konfigurieren

### Secrets für FTP-Deployment

1. Gehe zu deinem GitHub Repository
2. Klicke auf **Settings** → **Secrets and variables** → **Actions**
3. Klicke auf **"New repository secret"**
4. Füge folgende Secrets hinzu:

#### FTP_SERVER
```
Name: FTP_SERVER
Value: ftp.simoneyoga.de
```

#### FTP_USER
```
Name: FTP_USER
Value: dein-ftp-benutzername
```
*(IONOS FTP Benutzername - findest du im IONOS Control Panel)*

#### FTP_PASSWORD
```
Name: FTP_PASSWORD
Value: dein-ftp-passwort
```
*(IONOS FTP Passwort)*

## 4. IONOS FTP-Zugangsdaten finden

1. Logge dich in das [IONOS Control Panel](https://www.ionos.de/hilfe/websites/websites-verwalten/ftp-zugang-zu-deiner-website/) ein
2. Gehe zu **Websites & Shops** → **Deine Domain** → **FTP-Zugang**
3. Dort findest du:
   - **FTP-Server:** `ftp.simoneyoga.de` (oder ähnlich)
   - **Benutzername:** z.B. `ftp123456` oder `simoneyoga`
   - **Passwort:** (wird angezeigt oder musst du setzen)

## 5. Workflow-Datei prüfen

Die Workflow-Datei ist bereits konfiguriert unter:
`.github/workflows/deploy.yml`

**Wichtig:** Stelle sicher, dass der `server` Wert korrekt ist:
```yaml
server: ftp.simoneyoga.de
```

Falls dein FTP-Server anders heißt, passe dies an.

## 6. Deployment testen

### Automatisches Deployment

Nach jedem Push zu `main` oder `master` Branch wird automatisch:
1. React App gebaut
2. Deploy-Ordner vorbereitet
3. Zu IONOS hochgeladen

```bash
# Änderungen committen
git add .
git commit -m "Update website"

# Push zu GitHub (triggert automatisches Deployment)
git push origin main
```

### Deployment-Status prüfen

1. Gehe zu deinem GitHub Repository
2. Klicke auf **Actions** Tab
3. Du siehst alle Deployment-Runs
4. Klicke auf einen Run, um Details zu sehen

## 7. Repository-Struktur

```
simoneyoga/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Workflow
├── frontend/                   # React App
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/                    # PHP API
│   ├── api/
│   ├── config/
│   └── .htaccess
├── deploy/                     # Wird zu /htdocs/ hochgeladen
│   ├── index.php
│   ├── .htaccess
│   ├── assets/                 # React Build (wird generiert)
│   ├── api/                    # PHP API (wird kopiert)
│   └── config/                 # PHP Config (wird kopiert)
├── .gitignore
└── README.md
```

## 8. Wichtige Dateien für Git

### Was wird committed:
- ✅ Source Code (frontend/, backend/)
- ✅ Konfigurationsdateien (.github/, deploy/)
- ✅ Dokumentation (README.md, etc.)

### Was wird NICHT committed:
- ❌ `node_modules/` (via .gitignore)
- ❌ `frontend/dist/` (Build-Output, wird generiert)
- ❌ `deploy/assets/` (wird beim Build generiert)
- ❌ `.env` Dateien mit Secrets
- ❌ `.use-mock` (lokale Entwicklung)

## 9. Troubleshooting

### Deployment schlägt fehl

1. **Prüfe GitHub Actions Logs:**
   - Repository → Actions → Fehlgeschlagener Run → Logs ansehen

2. **Häufige Probleme:**
   - FTP-Credentials falsch → Prüfe Secrets
   - FTP-Server nicht erreichbar → Prüfe Server-Name
   - Build-Fehler → Prüfe `npm install` und `npm run build` lokal

### FTP-Verbindung schlägt fehl

```bash
# Teste FTP-Verbindung lokal
ftp ftp.simoneyoga.de
# Oder mit curl
curl -v ftp://ftp.simoneyoga.de/
```

### Build schlägt fehl

```bash
# Teste Build lokal
cd frontend
npm install
npm run build
```

## 10. Best Practices

1. **Branch-Strategy:**
   - `main` = Production (wird deployed)
   - `develop` = Development (optional)

2. **Commits:**
   - Beschreibende Commit-Messages
   - Kleine, logische Commits

3. **Secrets:**
   - Niemals Secrets in Code committen
   - Immer GitHub Secrets verwenden

4. **Testing:**
   - Teste Build lokal vor Push
   - Prüfe GitHub Actions nach Deployment

## Nächste Schritte

1. ✅ GitHub Repository erstellen
2. ✅ Code zu GitHub pushen
3. ✅ GitHub Secrets konfigurieren
4. ✅ Ersten Push machen und Deployment testen
5. ✅ Website auf simoneyoga.de prüfen


