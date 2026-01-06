# SimoneYoga - Laravel Application

## 🏗️ Architektur

Dieses Projekt wurde von React + PHP zu einer vollständigen **Laravel PHP-Anwendung** konvertiert, die für IONOS Deploy Now optimiert ist.

```
Browser
  ↓
Laravel Application (PHP)
  ↓
MariaDB Database
```

## 📁 Projektstruktur

```
simoneyoga/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── PageController.php      # Web-Controller
│   │       └── Api/
│   │           └── PageApiController.php  # API-Controller
│   └── Models/
│       └── Page.php                    # Page Model
│
├── bootstrap/
│   └── app.php                         # Laravel Bootstrap
│
├── config/
│   └── database.php                    # Datenbank-Konfiguration
│
├── database/
│   └── migrations/
│       └── 2024_01_01_000001_create_pages_table.php
│
├── public/                              # Öffentliches Verzeichnis (Web-Root)
│   ├── index.php                       # Laravel Entry Point
│   ├── .htaccess                        # Apache Rewrite Rules
│   ├── css/                            # CSS-Dateien
│   ├── js/                             # JavaScript-Dateien
│   ├── images/                         # Bilder
│   └── videos/                         # Videos
│
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php           # Master Layout
│       └── pages/
│           ├── home.blade.php          # Startseite
│           ├── faq.blade.php           # FAQ
│           ├── contact.blade.php       # Kontakt
│           ├── confidentialite.blade.php
│           └── mentions-legales.blade.php
│
├── routes/
│   ├── web.php                         # Web-Routes
│   └── console.php                     # Console-Routes
│
├── storage/                            # Laravel Storage
│   ├── app/
│   ├── framework/
│   └── logs/
│
├── .deploy-now/
│   └── simoneyoga/
│       └── config.yaml                 # IONOS Deploy Now Config
│
├── .github/
│   └── workflows/
│       ├── simoneyoga-build.yaml       # Build Workflow
│       ├── simoneyoga-orchestration.yaml
│       └── deploy-to-ionos.yaml
│
├── composer.json                       # PHP Dependencies
└── artisan                             # Laravel CLI
```

## 🚀 Setup

### 1. Lokale Entwicklung

```bash
# Composer Dependencies installieren
composer install

# .env Datei erstellen
cp .env.example .env

# Application Key generieren
php artisan key:generate

# Datenbank-Migrationen ausführen
php artisan migrate

# Development Server starten
php artisan serve
```

Die Anwendung ist dann unter `http://localhost:8000` erreichbar.

### 2. Datenbank-Konfiguration

Die Datenbank-Konfiguration erfolgt über die `.env` Datei:

```env
DB_CONNECTION=mysql
DB_HOST=db5019339232.hosting-data.io
DB_PORT=3306
DB_DATABASE=simoneyoga26
DB_USERNAME=dbu529946
DB_PASSWORD=TivedenYoga_Retreat_2026
```

### 3. IONOS Deploy Now

Das Projekt ist für **IONOS Deploy Now** konfiguriert:

- **Build-Prozess:** Installiert Composer-Dependencies und optimiert Laravel
- **Deployment:** Kopiert alle Dateien nach `/htdocs/` auf IONOS
- **Konfiguration:** `.deploy-now/simoneyoga/config.yaml`

## 📝 Routes

### Web Routes

- `/` - Startseite
- `/faq` - FAQ
- `/contact` - Kontakt
- `/confidentialite` - Datenschutz
- `/mentions-legales` - Impressum

### API Routes

- `GET /api/pages` - Liste aller Seiten
- `GET /api/pages/{slug}` - Seite nach Slug

## 🔧 Laravel Features

- ✅ **MVC-Architektur**
- ✅ **Blade Templates** für Views
- ✅ **Eloquent ORM** für Datenbankzugriff
- ✅ **Routing** für Web und API
- ✅ **Migrations** für Datenbankschema
- ✅ **Environment Configuration** (.env)

## 📦 Dependencies

### PHP (composer.json)

- Laravel Framework 10.x
- PHP 8.1+

## 🔄 Automatisches Deployment

Bei jedem Push zu `main`:

1. **GitHub Actions** baut die Laravel-Anwendung
2. **Composer** installiert Dependencies
3. **Laravel** wird für Production optimiert
4. **IONOS Deploy Now** deployed zu `/htdocs/`

## 📚 Weitere Informationen

- [Laravel Dokumentation](https://laravel.com/docs)
- [IONOS Deploy Now PHP Apps](https://docs.ionos.space/docs/deploy-php-apps/)

## 🔒 Sicherheit

- ✅ **Prepared Statements** (SQL Injection Schutz)
- ✅ **CSRF Protection** (Laravel Standard)
- ✅ **Input Validation**
- ✅ **Environment Variables** für Credentials

## 🐛 Troubleshooting

### Composer install schlägt fehl

```bash
composer install --no-interaction --prefer-dist
```

### Laravel Key fehlt

```bash
php artisan key:generate
```

### Datenbank-Verbindung fehlschlägt

- Prüfe `.env` Datei
- Prüfe Datenbank-Credentials in IONOS
- Prüfe Firewall-Einstellungen

### Permissions auf IONOS

Stelle sicher, dass `storage/` und `bootstrap/cache/` schreibbar sind:

```bash
chmod -R 775 storage bootstrap/cache
```

