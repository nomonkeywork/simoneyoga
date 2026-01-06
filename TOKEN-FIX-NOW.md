# 🔧 Token-Problem beheben - JETZT

## Problem
Das Token hat nicht den **"repo"** Scope, daher schlägt der Push fehl.

## ✅ Lösung (2 Minuten)

### Schritt 1: Neues Token mit "repo" Scope erstellen

1. **Gehe zu:** https://github.com/settings/tokens
2. **Klicke:** "Generate new token" → **"Generate new token (classic)"**
3. **Note:** "IONOS Deployment"
4. **Expiration:** Wähle (z.B. 90 Tage)
5. **WICHTIG - Scopes auswählen:**
   - ✅ **repo** (vollständiger Zugriff) - **DIESER IST KRITISCH!**
     - Das aktiviert automatisch alle repo-Sub-Scopes
   - ✅ **workflow** (für GitHub Actions)
6. **Klicke:** "Generate token"
7. **Kopiere den neuen Token** (wird nur einmal angezeigt!)

### Schritt 2: Remote URL mit neuem Token aktualisieren

```bash
cd /Users/frederickkuhrt/Desktop/anima

# Ersetze [NEUER_TOKEN] mit deinem neuen Token
git remote set-url origin https://[NEUER_TOKEN]@github.com/nomonkeywork/simoneyoga.git

# Push
git push -u origin main
```

### Schritt 3: GitHub Secrets für Deployment

Nach erfolgreichem Push:

1. **Gehe zu:** https://github.com/nomonkeywork/simoneyoga/settings/secrets/actions
2. **Füge Secrets hinzu:**
   - `FTP_USER` = `u105266880`
   - `FTP_PASSWORD` = `Pirol_721`

## ⚠️ Wichtig

Das aktuelle Token (`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`) hat **KEINEN "repo" Scope**, daher funktioniert der Push nicht.

**Du MUSST ein neues Token mit "repo" Scope erstellen!**

## Status

- ✅ Repository existiert: https://github.com/nomonkeywork/simoneyoga
- ✅ Lokale Commits: 3 Commits bereit
- ❌ Token: Fehlt "repo" Scope
- ⏳ Push: Wartet auf neues Token


