# Backend Development Guide

## Lokale Entwicklung ohne Datenbank

Für lokale Entwicklung ohne Datenbankverbindung:

### Option 1: .use-mock Datei erstellen

```bash
cd backend
touch .use-mock
```

Die API verwendet dann automatisch Mock-Daten aus `api/mock-pages.php`.

### Option 2: Environment Variable

```bash
export USE_MOCK_API=true
php -S localhost:8001 -t .
```

### Option 3: Mock API direkt verwenden

```bash
cd backend/api
# Temporär umbenennen
mv pages.php pages.php.real
mv mock-pages.php pages.php
```

## Mit Datenbank verbinden

1. **Entferne .use-mock Datei:**
   ```bash
   rm backend/.use-mock
   ```

2. **Stelle sicher, dass die Datenbank erreichbar ist:**
   - Prüfe Firewall/Netzwerk
   - Prüfe Datenbank-Zugangsdaten in `config/database.php`

3. **Teste die Verbindung:**
   ```bash
   php -r "require 'config/database.php'; var_dump($pdo);"
   ```

## Datenbank Setup

1. Führe `database-schema.sql` in IONOS phpMyAdmin aus
2. Prüfe die Zugangsdaten:
   - Host: `db5019339232.hosting-data.io`
   - Database: `dbs15144294`
   - User: `dbu529946`
   - Port: `3306`

## Troubleshooting

### "Database connection failed"

**Lokale Entwicklung:**
- Erstelle `.use-mock` Datei für Mock-Modus
- Oder prüfe, ob die Datenbank von deinem Standort erreichbar ist

**IONOS Production:**
- Prüfe `.htaccess` Environment Variables
- Prüfe PHP Error Logs in IONOS Panel
- Prüfe Datenbank-Zugangsdaten

### API gibt Mock-Daten zurück obwohl DB verfügbar

- Prüfe, ob `.use-mock` Datei existiert und lösche sie
- Prüfe `USE_MOCK_API` Environment Variable
- Prüfe PHP Error Logs für Datenbankfehler


