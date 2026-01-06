# Manuelles Deployment zu IONOS

## Werte für manuelles Deployment

### 1. **version** (Git Commit SHA)
```
1c41d175245c8bb228a86f8483fc1b6eff12aaec
```
**Oder neuester Commit:**
```bash
git rev-parse HEAD
```

### 2. **project-id**
```
992c602c-dc50-471b-b840-90b04674003b
```

### 3. **branch-id**
Dieser Wert wird von IONOS Deploy Now generiert. Du findest ihn:
- In den GitHub Actions Logs des "check readiness" Jobs
- Im IONOS Deploy Now Dashboard
- Oder durch API-Aufruf (siehe unten)

**Typischer Wert (aus vorherigen Runs):**
```
0cf0f24c-fb35-4eb2-9314-a45d14b72fc3
```

### 4. **deployment-ids** (JSON Array)
Dieser Wert ist ein JSON-Array mit den Deployment-IDs. Du findest ihn:
- Im IONOS Deploy Now Dashboard
- In den GitHub Actions Logs des "trigger deployment" Jobs
- Oder durch API-Aufruf

**Beispiel:**
```json
["acf05f8d-fd65-4d77-af49-370dc3c00699"]
```

## So findest du branch-id und deployment-ids

### Option 1: Aus GitHub Actions Logs
1. Gehe zu: GitHub → Actions → "Deploy Now: Orchestration"
2. Öffne den neuesten erfolgreichen Run
3. Öffne den "check readiness" Job
4. Suche nach `branch-id` in den Logs
5. Öffne den "trigger deployment" Job
6. Suche nach `deployment-ids` in den Logs

### Option 2: Über IONOS Deploy Now API
```bash
curl -H "Authorization: Bearer YOUR_IONOS_API_KEY" \
  https://api-eu.ionos.space/projects/992c602c-dc50-471b-b840-90b04674003b/branches
```

### Option 3: Im IONOS Deploy Now Dashboard
- Logge dich ins IONOS Deploy Now Dashboard ein
- Öffne dein Projekt
- Die branch-id und deployment-ids sind dort sichtbar

## Manuelles Deployment ausführen

### Schritt-für-Schritt Anleitung:

1. **Gehe zu:** [GitHub Actions - Deploy Now: Deploy to IONOS](https://github.com/nomonkeywork/simoneyoga/actions/workflows/deploy-to-ionos.yaml)

2. **Klicke auf "Run workflow"** (rechts oben)

3. **Fülle die Felder aus:**

   **version** (VOLLSTÄNDIGER Commit SHA - WICHTIG: Nicht nur die ersten 7 Zeichen!):
   ```
   07a7015a4a8a436994534314af390754638e8310
   ```
   ⚠️ **KRITISCH:** Du musst den vollständigen 40-stelligen SHA verwenden!
   - ✅ **RICHTIG:** `07a7015a4a8a436994534314af390754638e8310` (vollständig)
   - ❌ **FALSCH:** `07a7015` (nur 7 Zeichen - funktioniert nicht!)
   
   *Neuester Commit SHA: `git rev-parse HEAD`*

   **project-id**:
   ```
   992c602c-dc50-471b-b840-90b04674003b
   ```

   **branch-id**:
   ```
   0cf0f24c-fb35-4eb2-9314-a45d14b72fc3
   ```
   ⚠️ **Wichtig:** Prüfe in den neuesten GitHub Actions Logs, ob dieser Wert noch aktuell ist!

   **deployment-ids** (JSON Array - WICHTIG: Muss als JSON-String eingegeben werden!):
   ```json
   ["acf05f8d-fd65-4d77-af49-370dc3c00699"]
   ```
   ⚠️ **KRITISCH:** Du musst die eckigen Klammern und Anführungszeichen eingeben!
   - ✅ **RICHTIG:** `["acf05f8d-fd65-4d77-af49-370dc3c00699"]`
   - ❌ **FALSCH:** `acf05f8d-fd65-4d77-af49-370dc3c00699` (ohne Klammern)
   
   ⚠️ **Wichtig:** Prüfe in den neuesten GitHub Actions Logs, ob diese ID noch aktuell ist!

4. **Klicke auf "Run workflow"** (grüner Button unten)

## Schnellste Methode: Neueste Werte aus Logs extrahieren

Führe diesen Befehl aus, um die neuesten Werte zu finden:

```bash
# Neuester Commit SHA (version)
git rev-parse HEAD

# Dann prüfe die GitHub Actions Logs für branch-id und deployment-ids
```

## Wichtig

- **version**: Muss der SHA des Commits sein, der gebaut wurde
- **branch-id**: Kann sich ändern, wenn IONOS Deploy Now neu konfiguriert wird
- **deployment-ids**: Kann mehrere IDs enthalten, wenn mehrere Deployments konfiguriert sind

