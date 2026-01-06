# GitHub Secrets Konfiguration

## IONOS SFTP Zugangsdaten

Für das automatische Deployment zu IONOS müssen folgende Secrets in GitHub konfiguriert werden:

### Option 1: SFTP mit Passwort (Einfacher)

Die Workflow-Datei verwendet jetzt `easingthemes/ssh-deploy`, das SFTP mit Passwort unterstützt.

#### Secrets hinzufügen

1. Gehe zu: https://github.com/nomonkeywork/simoneyoga/settings/secrets/actions
2. Klicke auf **"New repository secret"**
3. Füge folgende Secrets hinzu:

##### FTP_USER
```
Name: FTP_USER
Value: u105266880
```

##### FTP_PASSWORD
```
Name: FTP_PASSWORD
Value: Pirol_721
```

### Option 2: SFTP mit SSH Key (Sicherer)

Falls du SSH Keys bevorzugst:

1. **SSH Key generieren:**
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/ionos_deploy
   ```

2. **Public Key zu IONOS hinzufügen:**
   - Kopiere den Inhalt von `~/.ssh/ionos_deploy.pub`
   - Füge ihn zu IONOS SSH Keys hinzu (falls verfügbar)

3. **Private Key zu GitHub Secrets hinzufügen:**
   ```
   Name: SSH_PRIVATE_KEY
   Value: [Inhalt von ~/.ssh/ionos_deploy]
   ```

### IONOS SFTP Details

- **Server:** `access877587871.webspace-data.io`
- **Port:** `22`
- **Protokoll:** `SFTP`
- **Benutzername:** `u105266880`
- **Passwort:** `Pirol_721`
- **Server-Verzeichnis:** `/htdocs/`

### Workflow-Konfiguration

Die Workflow-Datei (`.github/workflows/deploy.yml`) ist konfiguriert mit:
- SFTP Protokoll
- Port 22
- Server: `access877587871.webspace-data.io`
- Action: `easingthemes/ssh-deploy@v4.1.5`

### Alternative: FTP-Deploy-Action (falls SFTP nicht funktioniert)

Falls SFTP Probleme macht, kann die Workflow-Datei auf FTP umgestellt werden:

```yaml
- name: Deploy to IONOS via FTP
  uses: SamKirkland/FTP-Deploy-Action@v4.3.0
  with:
    server: access877587871.webspace-data.io
    username: ${{ secrets.FTP_USER }}
    password: ${{ secrets.FTP_PASSWORD }}
    server-dir: /htdocs/
    local-dir: ./deploy/
```

**Hinweis:** IONOS unterstützt normalerweise sowohl FTP (Port 21) als auch SFTP (Port 22).

### Test nach Konfiguration

Nach dem Hinzufügen der Secrets:

1. Push zu `main` Branch:
   ```bash
   git add .
   git commit -m "Update deployment config"
   git push origin main
   ```

2. Prüfe GitHub Actions:
   - Gehe zu: https://github.com/nomonkeywork/simoneyoga/actions
   - Klicke auf den neuesten Workflow Run
   - Prüfe die Logs auf Fehler

3. Prüfe die Website:
   - Gehe zu: https://simoneyoga.de
   - Prüfe, ob die Änderungen live sind

### Troubleshooting

**SFTP-Verbindung schlägt fehl:**
- Prüfe, ob Port 22 von GitHub Actions aus erreichbar ist
- Prüfe Firewall-Einstellungen bei IONOS
- Versuche FTP (Port 21) als Alternative

**Deployment schlägt fehl:**
- Prüfe GitHub Actions Logs
- Prüfe, ob Secrets korrekt gesetzt sind
- Prüfe, ob `/htdocs/` Verzeichnis existiert

### Sicherheit

⚠️ **WICHTIG:** 
- Secrets werden niemals im Code gespeichert
- Nur GitHub Actions können auf die Secrets zugreifen
- Die Secrets sind verschlüsselt gespeichert
- Verwende SSH Keys statt Passwörter, wenn möglich
