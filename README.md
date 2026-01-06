# SimoneYoga - React + PHP + MariaDB Deployment

## 🏗️ Architektur

```
Browser
  ↓
React SPA (build/)
  ↓ fetch()
PHP API (htdocs/api)
  ↓
MariaDB
```

## 📁 Projektstruktur

```
repo-root/
├── frontend/                # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/                 # PHP API
│   ├── api/
│   │   └── pages.php
│   ├── config/
│   │   └── database.php
│   └── .htaccess
│
├── deploy/                  # Zielstruktur für IONOS
│   ├── index.php
│   ├── api/
│   ├── config/
│   └── assets/
│
├── .github/workflows/
│   └── deploy.yml
└── database-schema.sql
```

## 🚀 Setup

### 1. Datenbank einrichten

1. Logge dich in IONOS ein
2. Öffne phpMyAdmin oder nutze einen MySQL-Client
3. Führe `database-schema.sql` aus

**Datenbank-Zugangsdaten:**
- Host: `db5019339232.hosting-data.io`
- Port: `3306`
- Benutzer: `dbu529946`
- Datenbank: `simoneyoga26`
- Passwort: `TivedenYoga_Retreat_2026`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run build
```

### 3. Backend Setup

Die PHP-Dateien sind bereits konfiguriert. Die Datenbankverbindung nutzt Environment-Variablen, die in `.htaccess` gesetzt werden.

### 4. Lokales Testen

**Wichtig:** Für lokales Development müssen beide Server laufen:

```bash
# Terminal 1: PHP API Server
cd backend
./start-dev-server.sh
# Oder: php -S localhost:8001 -t .

# Terminal 2: React Development Server
cd frontend
npm run dev
```

Der Vite Dev Server (Port 5173) leitet automatisch alle `/api/*` Requests an den PHP Server (Port 8001) weiter.

**Alternative: Mock API für Testing**
Falls keine Datenbankverbindung möglich ist, kann `backend/api/mock-pages.php` verwendet werden:
- Benenne `pages.php` temporär um
- Benenne `mock-pages.php` zu `pages.php` um

### 5. Deployment-Struktur vorbereiten

```bash
# Manuell (für Test)
rm -rf deploy/assets deploy/api deploy/config
mkdir -p deploy/assets deploy/api deploy/config

cp -r frontend/dist/* deploy/assets/
cp -r backend/api/* deploy/api/
cp -r backend/config/* deploy/config/
```

## 🔄 Automatisches Deployment

### GitHub Secrets einrichten

1. Gehe zu GitHub → Settings → Secrets and variables → Actions
2. Füge folgende Secrets hinzu:

```
FTP_SERVER=ftp.yourdomain.de
FTP_USER=dein-ftp-benutzer
FTP_PASSWORD=dein-ftp-passwort
```

### Deployment-Prozess

1. Push zu `main` oder `master` Branch
2. GitHub Actions baut automatisch:
   - React App wird gebaut
   - Deploy-Ordner wird vorbereitet
   - Upload zu IONOS via FTP

## 📝 IONOS Konfiguration

### .htaccess Environment Variables

Die `.htaccess` Dateien setzen automatisch die Datenbank-Umgebungsvariablen:

```apache
SetEnv DB_HOST db5019339232.hosting-data.io
SetEnv DB_NAME simoneyoga26
SetEnv DB_USER dbu529946
SetEnv DB_PASS ******
```

### FTP Upload

Nach dem Build wird der `deploy/` Ordner komplett zu `/htdocs/` hochgeladen.

## 🧪 API Testing

```bash
# Test API direkt
curl http://simoneyoga.de/api/pages.php?slug=home

# Erwartete Antwort:
{
  "id": 1,
  "slug": "home",
  "title": "Willkommen bei SimoneYoga",
  "content": "<h1>Herz-Kohärenz-App</h1>...",
  "created_at": "2024-01-01 00:00:00"
}
```

## 🔒 Sicherheit

- ✅ Prepared Statements (SQL Injection Schutz)
- ✅ Input Sanitization
- ✅ CORS Headers konfiguriert
- ✅ Security Headers in .htaccess
- ✅ Environment Variables für Credentials

## 📦 Dependencies

### Frontend
- React 18.2.0
- React Router DOM 6.20.0
- Vite 5.0.8

### Backend
- PHP 7.4+ (IONOS Standard)
- PDO Extension
- MariaDB 10.11

## 🐛 Troubleshooting

### API gibt 500 Error
- Prüfe Datenbankverbindung
- Prüfe `.htaccess` Environment Variables
- Prüfe PHP Error Logs in IONOS

### React Router funktioniert nicht
- Stelle sicher, dass `.htaccess` Rewrite Rules aktiv sind
- Prüfe, ob `mod_rewrite` auf IONOS aktiviert ist

### Build schlägt fehl
- Prüfe Node.js Version (18+)
- Lösche `node_modules` und `package-lock.json`
- Führe `npm install` erneut aus

## 📞 Support

Bei Problemen:
1. Prüfe GitHub Actions Logs
2. Prüfe IONOS Error Logs
3. Teste API direkt im Browser

