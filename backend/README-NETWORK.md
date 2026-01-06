# Datenbank-Netzwerk-Problem

## Problem

Die IONOS-Datenbank (`db5019339232.hosting-data.io`) ist **nur von IONOS Servern aus erreichbar**, nicht von deinem lokalen Entwicklungsrechner.

## Warum funktioniert die API trotzdem?

Die API hat einen **automatischen Fallback zu Mock-Daten**, wenn die Datenbankverbindung fehlschlägt. Das ist gewollt für lokale Entwicklung.

## Lösungen

### Option 1: Mock-Modus aktivieren (Empfohlen für lokale Entwicklung)

```bash
cd backend
touch .use-mock
```

Die API verwendet dann explizit Mock-Daten, auch wenn eine Verbindung versucht wird.

### Option 2: VPN/Tunnel zu IONOS

Falls du direkten Zugriff auf die Datenbank brauchst, müsstest du:
- VPN zu IONOS verwenden
- SSH-Tunnel einrichten
- IONOS Support kontaktieren für Remote-Zugriff

### Option 3: Lokale Datenbank für Entwicklung

Für lokale Entwicklung könntest du eine lokale MariaDB-Instanz verwenden:

```bash
# Lokale MariaDB installieren
brew install mariadb  # macOS
# oder
sudo apt install mariadb-server  # Linux

# Datenbank erstellen und Schema importieren
mysql -u root -p < database-schema.sql
```

Dann in `backend/config/database.php` die lokalen Credentials verwenden.

## Production (IONOS)

Auf IONOS Production funktioniert die Datenbankverbindung automatisch, da:
- Die Datenbank auf demselben Netzwerk liegt
- `.htaccess` die Environment Variables setzt
- Keine Firewall die Verbindung blockiert

## Status prüfen

```bash
# Test ob Mock-Modus aktiv ist
ls backend/.use-mock && echo "Mock-Modus aktiv" || echo "Echte DB wird versucht"

# API testen (funktioniert immer, mit Mock oder echten Daten)
curl "http://localhost:8001/api/pages.php?slug=home"
```


