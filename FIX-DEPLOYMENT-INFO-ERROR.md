# Fix: JSON::ParserError für deployment-info

## Problem

Die `deploy-to-ionos-action@v2` versucht, leere Environment-Variablen `INPUT_DEPLOYMENT-INFO` und `DEPLOYMENT_INFO` als JSON zu parsen, auch wenn `deployment-info` nicht im `with:` Block steht.

**Fehler:**
```
JSON::ParserError: 859: unexpected token at ''
```

## Lösung: 3 Schritte

### 1. Workflow prüfen: Kein `deployment-info` Parameter

✅ **Bereits erledigt:** Der Workflow `.github/workflows/deploy-to-ionos.yaml` hat **keinen** `deployment-info:` Parameter im `with:` Block.

**Korrekte Konfiguration:**
```yaml
- name: Deploy to IONOS
  uses: ionos-deploy-now/deploy-to-ionos-action@v2
  with:
    api-key: ${{ secrets.IONOS_API_KEY }}
    service-host: api-eu.ionos.space
    project-id: ${{ inputs.project-id }}
    branch-id: ${{ inputs.branch-id }}
    deployment-id: ${{ matrix.deployment-id }}
    deployment-folder: deployment
    ssh-user: ${{ secrets[env.SSH_USERNAME_SECRET] }}
    ssh-key: ${{ secrets.IONOS_SSH_KEY }}
```

**Wichtig:** Es darf **keine** Zeile `deployment-info:` geben (auch nicht als leere Zeile oder mit `""`).

### 2. GitHub Repository-Variablen entfernen

Die Action kann `DEPLOYMENT_INFO` auch aus GitHub Repository-Variablen lesen. Diese müssen entfernt werden:

1. Gehe zu: **https://github.com/nomonkeywork/simoneyoga/settings/secrets/actions**
2. Klicke auf **"Variables"** Tab
3. Suche nach Variablen mit Namen:
   - `DEPLOYMENT_INFO`
   - `IONOS_DEPLOYMENT_INFO`
   - `INPUT_DEPLOYMENT_INFO`
   - Jede Variable mit `*DEPLOYMENT*` im Namen
4. **Lösche alle gefundenen Variablen**

**Auch prüfen:**
- **Environment variables:** Falls du Environments verwendest, prüfe auch dort
- **Repository secrets:** Secrets sind OK, aber **Variables** müssen entfernt werden

### 3. Verification: Logs prüfen

Nach dem nächsten Deployment-Run:

1. Gehe zu: **https://github.com/nomonkeywork/simoneyoga/actions**
2. Öffne den neuesten Run
3. Öffne den Step **"Run ionos-deploy-now/deploy-to-ionos-action@v2"**
4. Prüfe die Log-Header (erste Zeilen)

**Erfolg:** Die folgenden Zeilen sollten **NICHT** mehr erscheinen:
```
-e "INPUT_DEPLOYMENT-INFO"
-e "DEPLOYMENT_INFO"
```

**Wenn diese Zeilen verschwunden sind:** Der JSON-Parse-Fehler sollte behoben sein! ✅

## Falls der Fehler weiterhin auftritt

1. **Paste den exakten `deploy-to-ionos` Step** aus `.github/workflows/deploy-to-ionos.yaml`
2. **Liste alle Repository-Variablen** mit `*DEPLOYMENT*` im Namen
3. Dann können wir gezielt die problematischen Zeilen identifizieren

## Alternative: deployment-info explizit setzen (nur wenn nötig)

Falls du `deployment-info` tatsächlich benötigst, setze es mit **gültigem JSON**:

```yaml
deployment-info: '{"stage":"production","source":"github-actions"}'
```

**Wichtig:** Der Wert muss **immer** gültiges JSON sein und **nie** leer (`""`) werden.

