# Fix: Write access to repository not granted

## Problem
Der Fehler "Write access to repository not granted" bedeutet, dass das Token keine Schreibrechte hat.

## Mögliche Ursachen

1. **Token hat nicht die richtigen Scopes** (fehlt `repo` scope)
2. **Repository existiert nicht** oder ist privat ohne Zugriff
3. **Token ist abgelaufen** oder ungültig
4. **Falscher Benutzername** - Token gehört zu anderem Account

## Lösungen

### Lösung 1: Token-Berechtigungen prüfen und korrigieren

1. **Gehe zu:** https://github.com/settings/tokens
2. **Finde dein Token** (oder erstelle ein neues)
3. **WICHTIG:** Stelle sicher, dass folgende Scopes aktiviert sind:
   - ✅ **repo** (vollständiger Zugriff auf private Repositories)
   - ✅ **workflow** (für GitHub Actions)

4. **Token neu erstellen** (falls nötig):
   - Klicke auf dein Token → "Regenerate token"
   - Oder erstelle ein neues: "Generate new token (classic)"
   - Scopes: **repo** und **workflow** auswählen
   - Token kopieren

### Lösung 2: Repository-Zugriff prüfen

1. **Prüfe, ob Repository existiert:**
   - Gehe zu: https://github.com/nomonkeywork/simoneyoga
   - Falls 404: Repository erstellen (siehe CREATE-REPO-AND-PUSH.md)

2. **Prüfe Repository-Berechtigungen:**
   - Gehe zu: https://github.com/nomonkeywork/simoneyoga/settings/access
   - Stelle sicher, dass dein Account (`fk1973@gmail.com`) Zugriff hat

### Lösung 3: Remote URL korrigieren

**Option A: Token in URL (einfach, aber weniger sicher)**

```bash
cd /Users/frederickkuhrt/Desktop/anima
git remote set-url origin https://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@github.com/nomonkeywork/simoneyoga.git
git push -u origin main
```

**Option B: Credential Helper verwenden**

```bash
cd /Users/frederickkuhrt/Desktop/anima
git remote set-url origin https://github.com/nomonkeywork/simoneyoga.git

# Push mit interaktiver Eingabe
git push -u origin main
# Username: fk1973@gmail.com
# Password: [DEIN_TOKEN]
```

**Option C: SSH verwenden (am sichersten)**

```bash
# SSH Key generieren
ssh-keygen -t ed25519 -C "fk1973@gmail.com"

# Public Key anzeigen
cat ~/.ssh/id_ed25519.pub

# Key zu GitHub hinzufügen:
# https://github.com/settings/keys → "New SSH key"

# Remote auf SSH umstellen
git remote set-url origin git@github.com:nomonkeywork/simoneyoga.git
git push -u origin main
```

### Lösung 4: Token neu erstellen mit korrekten Scopes

1. **Gehe zu:** https://github.com/settings/tokens
2. **Klicke:** "Generate new token (classic)"
3. **Name:** "IONOS Deployment"
4. **Expiration:** Wähle eine Dauer (z.B. 90 Tage)
5. **Scopes:** Wähle:
   - ✅ **repo** (vollständiger Zugriff)
   - ✅ **workflow** (GitHub Actions)
6. **Klicke:** "Generate token"
7. **Kopiere den neuen Token**

Dann Remote URL aktualisieren:
```bash
git remote set-url origin https://[NEUER_TOKEN]@github.com/nomonkeywork/simoneyoga.git
git push -u origin main
```

## Schnelltest

Teste, ob das Token funktioniert:

```bash
curl -H "Authorization: token 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" \
  https://api.github.com/user
```

Falls das einen Benutzernamen zurückgibt, funktioniert das Token.

## Empfohlene Lösung

1. **Token neu erstellen** mit `repo` und `workflow` Scopes
2. **Remote URL aktualisieren** mit neuem Token
3. **Push durchführen**

