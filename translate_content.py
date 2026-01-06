#!/usr/bin/env python3
"""
Script to translate French content to German in HTML files.
This handles the bulk translation of long text content.
"""

import re
import sys

# Translation dictionary for common phrases
translations = {
    # FAQ questions and answers
    "Qu'est-ce que la cohérence cardiaque ?": "Was ist Herz-Kohärenz?",
    "Pourquoi exactement 5 minutes par exercice ?": "Warum genau 5 Minuten pro Übung?",
    "Puis-je pratiquer n'importe où ?": "Kann ich überall praktizieren?",
    "Puis-je pratiquer allongé ou dois-je être assis ?": "Kann ich liegend praktizieren oder muss ich sitzen?",
    "Dois-je fermer les yeux ou puis-je les garder ouverts ?": "Soll ich die Augen schließen oder kann ich sie offen lassen?",
    "Quelle est la différence entre cohérence cardiaque et méditation ?": "Was ist der Unterschied zwischen Herz-Kohärenz und Meditation?",
    "Que faire si je rate une session ?": "Was soll ich tun, wenn ich eine Sitzung verpasse?",
    "Découvrir les bénéfices": "Vorteile entdecken",
    "simoneyoga en détails": "simoneyoga im Detail",
    "Accueil": "Startseite",
    "Contact": "Kontakt",
    "Confidentialité": "Datenschutz",
    "Mentions légales": "Impressum",
    "Loading": "Lädt",
}

def translate_file(filepath):
    """Translate French content to German in an HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Apply translations
    for fr, de in translations.items():
        content = content.replace(fr, de)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Translated {filepath}")

if __name__ == "__main__":
    files = ['faq.html', 'contact.html', 'confidentialite.html', 'mentions-legales.html']
    for file in files:
        try:
            translate_file(file)
        except Exception as e:
            print(f"Error translating {file}: {e}")


