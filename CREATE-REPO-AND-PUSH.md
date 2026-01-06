# Repository erstellen und pushen

## Problem
Das Repository `nomonkeywork/simoneyoga` existiert noch nicht auf GitHub.

## Lösung: Repository erstellen

### Schritt 1: Repository auf GitHub erstellen

1. **Gehe zu:** https://github.com/new
2. **Repository-Name:** `simoneyoga`
3. **Beschreibung:** (optional) "SimoneYoga Website - React + PHP + MariaDB"
4. **Sichtbarkeit:** Wähle **Private** (empfohlen)
5. **WICHTIG:** **NICHT** "Add a README file" aktivieren
6. **WICHTIG:** **NICHT** "Add .gitignore" aktivieren
7. **WICHTIG:** **NICHT** "Choose a license" auswählen
8. Klicke **"Create repository"**

### Schritt 2: Nach dem Erstellen - Push durchführen

Nachdem das Repository erstellt wurde, führe aus:

```bash
cd /Users/frederickkuhrt/Desktop/anima

# Remote prüfen
git remote -v

# Push mit Token
git push -u origin main
```

**Bei der Abfrage:**
- **Username:** `fk1973@gmail.com`
- **Password:** `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`

### Alternative: Token in URL verwenden

```bash
git remote set-url origin https://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@github.com/nomonkeywork/simoneyoga.git
git push -u origin main
```

## Nach erfolgreichem Push

1. **Prüfe Repository:** https://github.com/nomonkeywork/simoneyoga
2. **GitHub Secrets konfigurieren:**
   - Gehe zu: https://github.com/nomonkeywork/simoneyoga/settings/secrets/actions
   - Füge hinzu:
     - `FTP_USER` = `u105266880`
     - `FTP_PASSWORD` = `Pirol_721`
3. **Automatisches Deployment testen:**
   - Mache eine kleine Änderung
   - Commit und Push
   - Prüfe GitHub Actions

## Status

✅ **Lokales Repository:** Bereit (3 Commits)
✅ **GitHub Token:** Erstellt
⏳ **GitHub Repository:** Muss noch erstellt werden
⏳ **Push:** Wartet auf Repository-Erstellung

