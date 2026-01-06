# Lokale Entwicklung - Laravel Setup

## Schnellstart

```bash
# 1. Composer Dependencies installieren
composer install

# 2. .env Datei erstellen (falls nicht vorhanden)
# Laravel wird automatisch eine .env erstellen, wenn sie fehlt

# 3. Application Key generieren
php artisan key:generate

# 4. Development Server starten
php artisan serve
```

Die Anwendung ist dann unter **http://localhost:8000** erreichbar.

## Alternative: PHP Built-in Server direkt auf public/

```bash
# Vom Projekt-Root aus:
php -S localhost:8000 -t public
```

## Vollständige Setup-Schritte

### 1. Composer installieren (falls nicht vorhanden)
```bash
# macOS
brew install composer

# Oder download von https://getcomposer.org/
```

### 2. Dependencies installieren
```bash
cd /Users/frederickkuhrt/Desktop/anima
composer install
```

### 3. Environment-Variablen konfigurieren
```bash
# .env wird automatisch erstellt, wenn sie fehlt
# Oder manuell:
php artisan key:generate
```

### 4. Server starten
```bash
# Standard (Port 8000)
php artisan serve

# Mit Port-Angabe
php artisan serve --port=8080

# Mit Host-Angabe
php artisan serve --host=127.0.0.1
```

## Troubleshooting

### "vendor/autoload.php not found"
```bash
composer install
```

### "APP_KEY not set"
```bash
php artisan key:generate
```

### "Database connection failed"
- Für lokales Testen: `.env` mit Mock-Daten konfigurieren
- Oder: Datenbank-Verbindung in `.env` anpassen

### Port bereits belegt
```bash
# Anderen Port verwenden
php artisan serve --port=8080
```

## Nützliche Befehle

```bash
# Routes anzeigen
php artisan route:list

# Cache leeren
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Migrationen ausführen (falls Datenbank konfiguriert)
php artisan migrate
```

