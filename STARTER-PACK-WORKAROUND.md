# Starter Pack Workaround - PHP-Befehle deaktivieren

## Problem

Das Projekt wurde als "Starter Pack" erstellt, was bedeutet:
- ❌ PHP-Runtime ist deaktiviert
- ❌ PHP-Befehle in `post-deployment-remote-commands` werden nicht ausgeführt
- ❌ Laravel-Commands (migrate, optimize, etc.) funktionieren nicht

## Lösung 1: PHP-Befehle entfernen (temporär)

Falls PHP-Befehle den Fehler verursachen, können wir sie vorübergehend entfernen:

### Option A: PHP-Befehle auskommentieren

```yaml
# .deploy-now/config.yaml
post-deployment-remote-commands:
  # PHP-Befehle vorübergehend deaktiviert (Starter Pack hat kein PHP)
  # - php8.2-cli artisan migrate --force || php8.1-cli artisan migrate --force || true
  # - php8.2-cli artisan optimize:clear || php8.1-cli artisan optimize:clear || true
  # - php8.2-cli artisan migrate --force -n || php8.1-cli artisan migrate --force -n || true
  # - php8.2-cli artisan storage:link || php8.1-cli artisan storage:link || true
  # - php8.2-cli artisan optimize || php8.1-cli artisan optimize || true
  # - php8.2-cli artisan up || php8.1-cli artisan up || true
```

**Nachteil:** Laravel wird nicht richtig funktionieren (keine Migrationen, keine Optimierungen)

### Option B: Nur Dateiberechtigungen setzen

```yaml
# .deploy-now/config.yaml
post-deployment-remote-commands:
  # Nur Dateiberechtigungen (funktioniert auch ohne PHP)
  - find $(pwd) -type f -not -path "$(pwd)/logs/*" -exec chmod 664 {} \;
  - find $(pwd) -type d -not -name "logs" -exec chmod 775 {} \;
  - chmod -R o+w storage bootstrap/cache
```

## Lösung 2: IONOS kontaktieren

**Beste Lösung:** Kontaktiere IONOS Support, um das Package-Type zu ändern:

1. **IONOS Support kontaktieren:**
   - Support-Ticket erstellen
   - Erkläre, dass du ein Laravel-Projekt hast
   - Frage, ob das Projekt von "Starter Pack" auf "PHP Package" geändert werden kann

2. **Alternativ: Projekt löschen und neu erstellen:**
   - Prüfe, ob beim Neuerstellen "PHP Package" verfügbar ist
   - Falls nicht: Kontaktiere IONOS, warum PHP Package nicht verfügbar ist

## Lösung 3: Manuelle Migrationen (Workaround)

Falls PHP-Befehle nicht funktionieren, kannst du Migrationen manuell ausführen:

1. **SSH-Zugriff auf Server:**
   - Verbinde dich per SSH zum Server
   - Navigiere zum Projekt-Verzeichnis
   - Führe Migrationen manuell aus: `php artisan migrate`

2. **Nach jedem Deployment:**
   - SSH-Verbindung herstellen
   - Manuell: `php artisan optimize:clear`
   - Manuell: `php artisan optimize`

**Nachteil:** Sehr umständlich, muss nach jedem Deployment gemacht werden

## Lösung 4: Build-Phase nutzen

Falls möglich, führe Laravel-Commands in der Build-Phase aus (nicht in Deployment):

```yaml
# .github/workflows/simoneyoga-build.yaml
- name: Prepare Laravel for production
  run: |
    php artisan key:generate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
```

**Vorteil:** Funktioniert, da Build-Phase PHP hat
**Nachteil:** Migrationen können nicht in Build-Phase ausgeführt werden (keine DB-Verbindung)

## Empfohlene Vorgehensweise

1. **Versuche zuerst:** PHP-Befehle aus der Config entfernen (siehe Lösung 1)
2. **Teste Deployment:** Prüfe ob Deployment ohne Fehler durchläuft
3. **Kontaktiere IONOS:** Frage nach Möglichkeit, Package-Type zu ändern
4. **Falls nicht möglich:** Nutze manuelle Migrationen (siehe Lösung 3)

## Aktuelle Config anpassen

Soll ich die Config so anpassen, dass sie ohne PHP-Befehle funktioniert?

