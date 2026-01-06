# IONOS Deploy Now Konfiguration

Diese Datei dokumentiert die vollständige IONOS Deploy Now Konfiguration für das Laravel-Projekt.

## 📋 Übersicht

Das Projekt ist vollständig für IONOS Deploy Now konfiguriert gemäß der offiziellen Dokumentation:

- [Build Configuration](https://docs.ionos.space/docs/github-actions-customization/)
- [Deployment Configuration](https://docs.ionos.space/docs/deployment-configuration/)
- [Runtime Configuration](https://docs.ionos.space/docs/runtime-configuration/)
- [Apache Configuration](https://docs.ionos.space/docs/apache-configuration-htaccess/)

## 📁 Konfigurationsdateien

### 1. Build Configuration

**Datei:** `.github/workflows/simoneyoga-build.yaml`

- **PHP Setup:** PHP 8.1 mit erforderlichen Extensions
- **Composer:** Installiert Dependencies mit `--no-dev --optimize-autoloader`
- **Laravel Optimierung:** Config, Route, View Caching
- **Deployment Folder:** `./` (Root-Verzeichnis)

### 2. Deployment Configuration

**Datei:** `.deploy-now/simoneyoga/config.yaml`

#### Excludes

**Bootstrap (Initial Deployment):**
- Entwicklung-Dateien (.git, tests, node_modules, etc.)
- Frontend/Backend alte Struktur
- Dokumentation

**Recurring (Folgende Deployments):**
- Storage-Dateien (logs, cache, sessions, views)
- `.env` Datei (wird nicht überschrieben)
- Bootstrap Cache

#### Remote Commands

**Pre-Deployment:**
- Maintenance Mode aktivieren

**Post-Deployment:**
- Caches leeren (config, cache, view, route)
- Laravel optimieren
- Datenbank-Migrationen ausführen
- Maintenance Mode deaktivieren

#### Cron Jobs

Aktuell keine Cron Jobs konfiguriert. Falls benötigt, können Laravel Scheduler-Befehle hinzugefügt werden.

### 3. Runtime Configuration

**Datei:** `.deploy-now/simoneyoga/.env.template`

Diese Datei wird während des Deployments automatisch zu `.env` generiert. IONOS-Variablen werden automatisch ersetzt:

- `$IONOS_APP_URL` - App URL
- `$IONOS_DB_HOST` - Datenbank Host
- `$IONOS_DB_NAME` - Datenbank Name
- `$IONOS_DB_USERNAME` - Datenbank Benutzername
- `$IONOS_DB_PASSWORD` - Datenbank Passwort
- `$IONOS_MAIL_*` - Mail-Konfiguration

### 4. Apache Configuration

**Dateien:**
- `.deploy-now/simoneyoga/.htaccess.template` → Root `.htaccess`
- `.deploy-now/simoneyoga/public/.htaccess.template` → `public/.htaccess`

#### Features

- **URL Rewriting:** Redirect zu `public/` Verzeichnis
- **Security Headers:** X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Compression:** GZIP für Text-Dateien
- **Caching:** Cache-Control Headers für statische Assets

## 🔄 Deployment-Prozess

1. **Git Push** zu `main` Branch
2. **GitHub Actions** startet Build:
   - Checkout Code
   - PHP 8.1 Setup
   - Composer Dependencies installieren
   - Laravel optimieren
3. **IONOS Deploy Now** deployed:
   - Templates rendern (.env.template, .htaccess.template)
   - Dateien hochladen (excludes beachten)
   - Pre-Deployment Commands ausführen
   - Post-Deployment Commands ausführen

## 🔧 Anpassungen

### PHP Version ändern

In `.github/workflows/simoneyoga-build.yaml`:
```yaml
php-version: '8.1'  # Ändern zu 8.0, 8.2, etc.
```

In `.deploy-now/simoneyoga/config.yaml`:
```yaml
php8.1-cli  # Anpassen zu php8.0-cli, php8.2-cli, etc.
```

### Cron Jobs hinzufügen

In `.deploy-now/simoneyoga/config.yaml`:
```yaml
runtime:
  cron-jobs:
    - command: cd $HOME/htdocs && php8.1-cli artisan schedule:run
      schedule: "* * * * *"
```

### Weitere Excludes hinzufügen

In `.deploy-now/simoneyoga/config.yaml`:
```yaml
recurring:
  excludes:
    - storage/app/uploads/*
    - custom-folder/*
```

## 📚 Weitere Informationen

- [IONOS Deploy Now Dokumentation](https://docs.ionos.space/)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🐛 Troubleshooting

### Deployment schlägt fehl

1. Prüfe GitHub Actions Logs
2. Prüfe IONOS Deploy Now Dashboard
3. Prüfe `.env` Datei auf Server
4. Prüfe Apache Error Logs

### Datenbank-Verbindung fehlschlägt

- Prüfe `.env` Datei auf Server
- Prüfe IONOS Datenbank-Credentials
- Prüfe Firewall-Einstellungen

### Caches nicht geleert

- Prüfe Post-Deployment Commands in `config.yaml`
- Führe manuell aus: `php artisan config:clear`


