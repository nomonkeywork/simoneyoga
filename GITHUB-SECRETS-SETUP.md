# GitHub Secrets Setup für IONOS Deployment

## Repository Status
✅ Repository existiert: https://github.com/nomonkeywork/simoneyoga

## GitHub Secrets konfigurieren

### Schritt 1: Gehe zu Repository Settings

1. **Öffne:** https://github.com/nomonkeywork/simoneyoga/settings
2. **Klicke auf:** "Secrets and variables" → "Actions"
3. **Klicke auf:** "New repository secret"

### Schritt 2: Füge Secrets hinzu

#### Secret 1: FTP_USER
```
Name: FTP_USER
Value: u105266880
```
Klicke "Add secret"

#### Secret 2: FTP_PASSWORD
```
Name: FTP_PASSWORD
Value: Pirol_721
```
Klicke "Add secret"

### Schritt 3: Secrets prüfen

Du solltest jetzt 2 Secrets sehen:
- ✅ `FTP_USER`
- ✅ `FTP_PASSWORD`

## Workflow testen

Nach dem Konfigurieren der Secrets:

1. **Mache eine kleine Änderung:**
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test deployment"
   git push origin main
   ```

2. **Prüfe GitHub Actions:**
   - Gehe zu: https://github.com/nomonkeywork/simoneyoga/actions
   - Du solltest einen Workflow-Run sehen
   - Klicke darauf, um die Logs zu sehen

3. **Prüfe Deployment:**
   - Gehe zu: https://simoneyoga.de
   - Prüfe, ob die Änderungen live sind

## Workflow-Konfiguration

Die Workflow-Datei (`.github/workflows/deploy.yml`) ist bereits konfiguriert mit:
- ✅ Server: `access877587871.webspace-data.io`
- ✅ Port: `22` (SFTP)
- ✅ Server-Dir: `/htdocs/`
- ✅ Verwendet `FTP_USER` und `FTP_PASSWORD` Secrets

## Troubleshooting

### Workflow schlägt fehl

1. **Prüfe Secrets:**
   - Gehe zu: https://github.com/nomonkeywork/simoneyoga/settings/secrets/actions
   - Stelle sicher, dass beide Secrets existieren

2. **Prüfe Workflow-Logs:**
   - Gehe zu: https://github.com/nomonkeywork/simoneyoga/actions
   - Klicke auf fehlgeschlagenen Run
   - Prüfe die Logs auf Fehler

3. **Häufige Probleme:**
   - SFTP-Verbindung schlägt fehl → Prüfe Firewall/Port 22
   - FTP-Credentials falsch → Prüfe Secrets
   - Build schlägt fehl → Prüfe `npm install` und `npm run build`

### SFTP-Verbindung testen

```bash
# Teste SFTP-Verbindung lokal
sftp -P 22 u105266880@access877587871.webspace-data.io
# Passwort: Pirol_721
```

## Nächste Schritte

1. ✅ Repository erstellt
2. ⏳ Secrets konfigurieren (siehe oben)
3. ⏳ Ersten Push machen
4. ⏳ Deployment testen


