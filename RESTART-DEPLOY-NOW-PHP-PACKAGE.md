# IONOS Deploy Now - Projekt neu einrichten mit PHP Package

## ⚠️ WICHTIG: PHP Package auswählen (nicht Starter Pack!)

Das Projekt wurde möglicherweise mit dem falschen Template (Starter Pack) initialisiert. Diese Anleitung führt dich durch den Neustart mit dem **PHP Package**.

---

## Schritt 1: Projekt aus IONOS Deploy Now löschen

### 1.1 IONOS Deploy Now Dashboard öffnen

1. Gehe zu: **https://dash.ionos.space/** (oder dein IONOS Kundencenter)
2. Logge dich mit deinen IONOS-Zugangsdaten ein
3. Navigiere zu **Deploy Now** oder **My Projects**

### 1.2 Projekt löschen

1. **Finde dein Projekt "simoneyoga"** in der Projektliste
2. **Klicke auf das Projekt** um es zu öffnen
3. Gehe zu **Settings** oder **Project Settings** (meist im Menü oben rechts)
4. Scrolle nach unten zu **"Danger Zone"** oder **"Delete Project"**
5. **Klicke auf "Delete Project"** oder **"Remove Project"**
6. **Bestätige die Löschung** (es wird nach dem Projektnamen gefragt)

⚠️ **WICHTIG:** 
- Das Repository auf GitHub bleibt erhalten!
- Nur die IONOS Deploy Now Verbindung wird gelöscht
- Alle GitHub Actions Workflows bleiben bestehen

---

## Schritt 2: Neues Projekt mit PHP Package erstellen

### 2.1 Neues Projekt starten

1. Im IONOS Deploy Now Dashboard: **Klicke auf "New Project"** oder **"Add Project"**
2. Wähle **"From GitHub Repository"** oder **"Connect GitHub Repository"**

### 2.2 GitHub Repository auswählen

1. **Autorisiere IONOS** für GitHub-Zugriff (falls noch nicht geschehen)
2. **Suche nach deinem Repository:** `nomonkeywork/simoneyoga`
3. **Wähle das Repository** aus
4. **Wähle den Branch:** `main`

### 2.3 ⚠️ WICHTIG: PHP Package auswählen

**Hier ist der kritische Schritt!**

Wenn nach einem **Template** oder **Package** gefragt wird:

- ❌ **NICHT** "Starter Pack" wählen
- ❌ **NICHT** "Static Site" wählen
- ✅ **"PHP Package"** oder **"PHP Application"** wählen
- ✅ Falls verfügbar: **"Laravel"** wählen (falls als spezifische Option vorhanden)

**Was passiert, wenn du Starter Pack wählst:**
- Falsche Config-Struktur wird generiert
- PHP-Befehle funktionieren nicht
- "unknown version" Fehler
- "php is disabled" Fehler

**Was passiert, wenn du PHP Package wählst:**
- Korrekte Config-Struktur wird generiert
- PHP-Befehle funktionieren
- Laravel-spezifische Optimierungen werden angewendet

### 2.4 Projekt konfigurieren

1. **Projekt-Name:** `simoneyoga` (oder wie gewünscht)
2. **Domain:** `simoneyoga.de` (falls bereits in IONOS konfiguriert)
3. **Region:** Wähle die passende Region (z.B. EU)

### 2.5 Projekt erstellen

1. **Klicke auf "Create Project"** oder **"Deploy"**
2. IONOS wird jetzt:
   - GitHub Actions Workflows generieren
   - Secrets automatisch setzen
   - Ersten Deployment starten

---

## Schritt 3: GitHub Secrets prüfen

Nach dem Neuerstellen des Projekts:

### 3.1 IONOS API Key

1. **Gehe zu IONOS Deploy Now Dashboard** → Dein Projekt → **Settings**
2. **Suche nach "API Keys"** oder **"Access Tokens"**
3. **Kopiere den API Key** (beginnt meist mit `ion_` oder ähnlich)
4. **Gehe zu GitHub:**
   - Repository: `https://github.com/nomonkeywork/simoneyoga`
   - **Settings** → **Secrets and variables** → **Actions**
5. **Prüfe ob `IONOS_API_KEY` vorhanden ist:**
   - ✅ Falls vorhanden: Prüfe ob der Wert noch aktuell ist
   - ❌ Falls nicht vorhanden: **New repository secret** → Name: `IONOS_API_KEY`, Value: (API Key einfügen)

### 3.2 IONOS SSH Key

1. **Prüfe ob `IONOS_SSH_KEY` vorhanden ist:**
   - ✅ Falls vorhanden: Sollte automatisch funktionieren
   - ❌ Falls nicht vorhanden: Wird beim ersten Deployment automatisch generiert

### 3.3 Deployment SSH Username

- Wird automatisch beim ersten Deployment generiert
- Format: `IONOS_DEPLOYMENT_<DEPLOYMENT-ID>_SSH_USERNAME`
- Wird nach dem ersten Deployment in den GitHub Actions Logs sichtbar

---

## Schritt 4: Workflows prüfen

Nach dem Neuerstellen werden neue Workflow-Dateien generiert. Prüfe:

### 4.1 Neue project-id

Die `project-id` wird sich ändern. Finde sie:

1. **IONOS Deploy Now Dashboard** → Projekt → Settings
2. Oder in den **GitHub Actions Logs** nach dem ersten Run
3. **Aktualisiere die project-id in:**
   - `.github/workflows/simoneyoga-orchestration.yaml`
   - `.github/workflows/simoneyoga-build.yaml`
   - `.github/workflows/deploy-to-ionos.yaml`

**Aktuelle project-id (wird sich ändern):**
```
992c602c-dc50-471b-b840-90b04674003b
```

### 4.2 Workflow-Dateien

IONOS generiert automatisch:
- `.github/workflows/simoneyoga-orchestration.yaml`
- `.github/workflows/simoneyoga-build.yaml`
- `.github/workflows/deploy-to-ionos.yaml`

**Falls du Anpassungen hast:**
- Prüfe ob sie nach dem Neuerstellen noch vorhanden sind
- Falls nicht, wende sie erneut an

---

## Schritt 5: Config-Dateien prüfen

### 5.1 `.deploy-now/config.yaml`

Diese Datei sollte bereits korrekt sein:
- ✅ `version: 1.0`
- ✅ `deploy:` Objekt mit `bootstrap:` und `recurring:`
- ✅ PHP-Befehle verwenden `php8.2-cli` oder `php8.1-cli`

**Falls IONOS eine neue Config generiert:**
- Prüfe ob sie die gleiche Struktur hat
- Falls nicht, ersetze sie mit unserer angepassten Version

### 5.2 `deployment-info.json`

Wird automatisch generiert und sollte enthalten:
```json
{
  "version": 2,
  "type": "php",
  "build": {
    "distFolder": "."
  }
}
```

---

## Schritt 6: Ersten Deployment testen

### 6.1 Automatisches Deployment

Nach dem Neuerstellen sollte IONOS automatisch:
1. GitHub Actions Workflow triggern
2. Build durchführen
3. Deployment starten

### 6.2 GitHub Actions prüfen

1. **Gehe zu:** https://github.com/nomonkeywork/simoneyoga/actions
2. **Prüfe ob ein Workflow läuft:**
   - Name: "Deploy Now: Orchestration"
   - Status sollte "in progress" oder "success" sein
3. **Prüfe die Logs auf Fehler:**
   - Klicke auf den laufenden Workflow
   - Öffne die einzelnen Jobs
   - Suche nach Fehlermeldungen

### 6.3 IONOS Dashboard prüfen

1. **Gehe zum IONOS Deploy Now Dashboard**
2. **Öffne dein Projekt**
3. **Prüfe den Deployment-Status:**
   - Sollte "Deploying" oder "Success" anzeigen
   - Falls "Failed": Klicke darauf für Details

### 6.4 Website testen

1. **Öffne:** https://simoneyoga.de/
2. **Prüfe ob die Website lädt**
3. **Prüfe ob Laravel funktioniert** (keine 500 Errors)

---

## Schritt 7: Falls Probleme auftreten

### Problem: "unknown version" Fehler

**Lösung:**
- Prüfe ob `.deploy-now/config.yaml` `version: 1.0` enthält
- Prüfe ob `deployment-info.json` `"version": 2` enthält

### Problem: "php is disabled" Fehler

**Lösung:**
- Prüfe ob alle PHP-Befehle `php8.2-cli` oder `php8.1-cli` verwenden
- Prüfe ob das Projekt als **PHP Package** erstellt wurde (nicht Starter Pack)

### Problem: Workflows werden nicht getriggert

**Lösung:**
1. Prüfe GitHub Actions Permissions
2. Prüfe ob `IONOS_API_KEY` Secret korrekt gesetzt ist
3. Prüfe ob die Workflow-Dateien in `.github/workflows/` vorhanden sind

### Problem: Deployment schlägt fehl

**Lösung:**
1. Prüfe GitHub Actions Logs für genaue Fehlermeldung
2. Prüfe IONOS Deploy Now Dashboard für Server-Logs
3. Prüfe ob alle Secrets korrekt gesetzt sind
4. Prüfe ob die `.env` Datei auf dem Server korrekt ist

---

## Checkliste nach Neuerstellung

- [ ] Projekt aus IONOS Deploy Now gelöscht
- [ ] Neues Projekt mit **PHP Package** (nicht Starter Pack!) erstellt
- [ ] GitHub Repository verbunden (`nomonkeywork/simoneyoga`, Branch: `main`)
- [ ] GitHub Secrets geprüft (`IONOS_API_KEY`, `IONOS_SSH_KEY`)
- [ ] Neue `project-id` in Workflows aktualisiert
- [ ] Config-Dateien geprüft (`.deploy-now/config.yaml`)
- [ ] Erster Deployment erfolgreich
- [ ] Website funktioniert: https://simoneyoga.de/

---

## Wichtige Notizen

- **Alte project-id:** `992c602c-dc50-471b-b840-90b04674003b` (wird sich ändern)
- **Repository:** `nomonkeywork/simoneyoga`
- **Branch:** `main`
- **Domain:** `simoneyoga.de`
- **PHP Version:** 8.2 (im Build), 8.2/8.1 (auf Server)

---

## Nächste Schritte nach erfolgreichem Deployment

1. **Datenbank-Migrationen prüfen:**
   - Sollten automatisch via Post-Deployment Commands ausgeführt werden
   - Prüfe in Laravel Logs ob Migrationen erfolgreich waren

2. **Umgebungsvariablen prüfen:**
   - Prüfe ob `.env` auf dem Server korrekt generiert wurde
   - Prüfe ob Datenbank-Verbindung funktioniert

3. **Website testen:**
   - Teste alle wichtigen Seiten
   - Prüfe ob Datenbank-Zugriffe funktionieren
   - Prüfe ob Caches korrekt funktionieren

---

## Support

Falls du weiterhin Probleme hast:

1. **IONOS Deploy Now Dokumentation:**
   - https://docs.ionos.space/docs/deployment-configuration/
   - https://docs.ionos.space/docs/github-actions-customization/

2. **Laravel Starter (Referenz):**
   - https://github.com/ionos-deploy-now/laravel-starter

3. **GitHub Actions Logs:**
   - Detaillierte Fehlermeldungen finden
   - Workflow-Schritte einzeln prüfen

