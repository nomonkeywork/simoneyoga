# Deployment Troubleshooting Guide

## Aktuelles Problem

**Fehler:** `JSON::ParserError: unexpected token at ''`

Die `deploy-to-ionos-action@v2` kann die `deployment-info.json` nicht finden oder sie ist leer.

## Mögliche Ursachen

### 1. Datei wird nicht gefunden
- Die Action sucht `deployment-info.json` im `deployment-folder`
- Aktuell: `deployment-folder: deployment`
- Erwartete Datei: `deployment/deployment-info.json`

### 2. Datei ist leer beim Artifact-Download
- Beim "Retrieve stored deployment" wird die Datei möglicherweise nicht korrekt extrahiert
- Lösung: Sicherheits-Step erstellt die Datei nach dem Download

### 3. Falscher Pfad
- Die Action könnte die Datei im Root-Verzeichnis erwarten, nicht im `deployment/` Unterordner

## Debugging-Steps hinzugefügt

Der Workflow enthält jetzt einen Debug-Step, der:
- ✅ Zeigt das aktuelle Verzeichnis
- ✅ Listet den Inhalt des `deployment/` Ordners
- ✅ Erstellt die Datei falls sie fehlt
- ✅ Validiert die JSON-Syntax
- ✅ Zeigt die Dateigröße

## Nächste Schritte

1. **Prüfe GitHub Actions Logs:**
   - Schaue in den "Ensure deployment-info.json exists" Step
   - Prüfe ob die Datei erstellt wurde
   - Prüfe ob die JSON-Validierung erfolgreich war

2. **Falls die Datei nicht gefunden wird:**
   - Prüfe ob sie im richtigen Verzeichnis ist
   - Prüfe ob der `deployment-folder` Parameter korrekt ist

3. **Falls die Datei leer ist:**
   - Prüfe ob sie beim Artifact-Download korrekt extrahiert wird
   - Der Sicherheits-Step sollte sie neu erstellen

## Alternative Lösung

Falls das Problem weiterhin besteht, könnte die `deployment-info.json` auch im Root-Verzeichnis erwartet werden:

```yaml
deployment-folder: .
```

Dann würde die Datei als `./deployment-info.json` erwartet werden.

## Status

- ✅ `deployment/deployment-info.json` existiert im Repository
- ✅ Sicherheits-Step erstellt die Datei nach Artifact-Download
- ✅ Debugging-Output hinzugefügt
- ⏳ Warte auf nächstes Deployment für Debug-Output

