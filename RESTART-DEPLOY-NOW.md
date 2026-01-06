# IONOS Deploy Now - Projekt neu einrichten

## Problem
Das Projekt wurde möglicherweise mit dem falschen Template (Starter Pack) initialisiert, was zu Version-Konflikten führt.

## Lösung: Projekt neu einrichten mit PHP Package

### Schritt 1: Projekt aus IONOS Deploy Now löschen

1. **Gehe zum IONOS Deploy Now Dashboard:**
   - URL: https://dash.ionos.space/ (oder dein IONOS Kundencenter)
   - Logge dich ein

2. **Projekt löschen:**
   - Öffne dein Projekt "simoneyoga"
   - Gehe zu **Settings** oder **Project Settings**
   - Suche nach **"Delete Project"** oder **"Remove Project"**
   - Bestätige die Löschung
   - ⚠️ **WICHTIG:** Das Repository auf GitHub bleibt erhalten!

### Schritt 2: Projekt neu verbinden mit PHP Package

1. **Neues Projekt erstellen:**
   - Im IONOS Deploy Now Dashboard: **"New Project"** oder **"Add Project"**
   - Wähle **"From GitHub Repository"**

2. **Repository auswählen:**
   - Repository: `nomonkeywork/simoneyoga`
   - Branch: `main`

3. **WICHTIG: PHP Package auswählen:**
   - Wenn nach einem **Template** oder **Package** gefragt wird:
     - ❌ **NICHT** "Starter Pack" wählen
     - ✅ **"PHP Package"** oder **"PHP Application"** wählen
   - Falls Laravel spezifisch verfügbar ist: **"Laravel"** wählen

4. **Projekt konfigurieren:**
   - Projekt-Name: `simoneyoga` (oder wie gewünscht)
   - Domain: `simoneyoga.de` (falls bereits konfiguriert)

### Schritt 3: GitHub Secrets prüfen

Nach dem Neuerstellen des Projekts:

1. **IONOS API Key:**
   - Gehe zu IONOS Deploy Now → Project Settings → API Keys
   - Kopiere den API Key
   - Gehe zu GitHub → Repository → Settings → Secrets and variables → Actions
   - Prüfe ob `IONOS_API_KEY` vorhanden ist
   - Falls nicht: Erstelle neuen Secret `IONOS_API_KEY` mit dem Wert

2. **IONOS SSH Key:**
   - Prüfe ob `IONOS_SSH_KEY` vorhanden ist
   - Falls nicht: IONOS generiert diesen automatisch beim ersten Deployment

3. **Deployment SSH Username:**
   - Wird automatisch generiert beim ersten Deployment
   - Format: `IONOS_DEPLOYMENT_<DEPLOYMENT-ID>_SSH_USERNAME`
   - Wird nach dem ersten Deployment in den GitHub Actions Logs sichtbar

### Schritt 4: Workflows anpassen (falls nötig)

Nach dem Neuerstellen werden neue Workflow-Dateien generiert. Prüfe:

1. **Neue project-id:**
   - Die `project-id` in den Workflows wird sich ändern
   - Neue ID findest du in:
     - IONOS Deploy Now Dashboard → Project Settings
     - GitHub Actions Logs nach dem ersten Run

2. **Workflow-Dateien:**
   - `.github/workflows/simoneyoga-orchestration.yaml`
   - `.github/workflows/simoneyoga-build.yaml`
   - `.github/workflows/deploy-to-ionos.yaml`
   
   Diese werden automatisch generiert. Falls du Anpassungen hast, musst du sie nach dem Neuerstellen wieder anwenden.

### Schritt 5: Config-Dateien anpassen

Nach dem Neuerstellen:

1. **`.deploy-now/config.yaml`:**
   - Diese Datei wird möglicherweise nicht benötigt
   - Falls sie generiert wird, sollte sie keine `version` haben oder `version: 1` (ohne `.0`)

2. **`.deploy-now/simoneyoga/config.yaml`:**
   - Diese Datei sollte automatisch generiert werden
   - Falls `version` vorhanden: Entferne es oder setze auf `1` (Integer, nicht String)

3. **`deployment-info.json`:**
   - Wird automatisch generiert
   - Sollte `"version": 2` enthalten (für `deploy-to-ionos-action@v2`)

### Schritt 6: Ersten Deployment testen

1. **Push zu GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Deploy Now restart"
   git push origin main
   ```

2. **GitHub Actions prüfen:**
   - Gehe zu: https://github.com/nomonkeywork/simoneyoga/actions
   - Der Workflow sollte automatisch getriggert werden
   - Prüfe die Logs auf Fehler

3. **IONOS Dashboard prüfen:**
   - Gehe zum IONOS Deploy Now Dashboard
   - Prüfe ob das Deployment läuft/erfolgreich ist

## Falls Probleme auftreten

### Problem: "unknown version" Fehler weiterhin

**Lösung:** Entferne die `version` Felder komplett aus den Config-Dateien:

```yaml
# .deploy-now/config.yaml
# Entferne die version-Zeile komplett
```

```yaml
# .deploy-now/simoneyoga/config.yaml
# Entferne die version-Zeile komplett
bootstrap:
  excludes:
    # ... rest bleibt gleich
```

### Problem: Workflows werden nicht getriggert

**Lösung:**
1. Prüfe GitHub Actions Permissions
2. Prüfe ob der Workflow in `.github/workflows/` vorhanden ist
3. Prüfe ob `IONOS_API_KEY` Secret korrekt gesetzt ist

### Problem: Deployment schlägt fehl

**Lösung:**
1. Prüfe GitHub Actions Logs für genaue Fehlermeldung
2. Prüfe IONOS Deploy Now Dashboard für Server-Logs
3. Prüfe ob alle Secrets korrekt gesetzt sind

## Checkliste nach Neuerstellung

- [ ] Projekt aus IONOS Deploy Now gelöscht
- [ ] Neues Projekt mit PHP Package erstellt
- [ ] GitHub Secrets geprüft (`IONOS_API_KEY`, `IONOS_SSH_KEY`)
- [ ] Neue `project-id` in Workflows aktualisiert
- [ ] Config-Dateien angepasst (Version entfernt oder auf 1 gesetzt)
- [ ] Erster Deployment erfolgreich
- [ ] Website funktioniert: https://simoneyoga.de/

## Notizen

- **Alte project-id:** `992c602c-dc50-471b-b840-90b04674003b` (wird sich ändern)
- **Repository:** `nomonkeywork/simoneyoga`
- **Branch:** `main`
- **Domain:** `simoneyoga.de`

