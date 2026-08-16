# Hinweise zur Übersetzung - MII KDS IG Template — Preview v1.2.1

* [**Inhaltsverzeichnis**](toc.md)
* **Hinweise zur Übersetzung**

## Hinweise zur Übersetzung

 Diese Seite enthält Übersetzungen aus der Originalsprache, in der der Leitfaden verfasst wurde. Informationen zu diesen Übersetzungen und Anweisungen zum Abgeben von Feedback zu den Übersetzungen finden Sie [hier](translationinfo.md). 

Dieser Leitfaden wird auf **Englisch** verfasst — das ist die Standardsprache der IG — und zusätzlich auf **Deutsch** unter `/de/` dargestellt. Die Sprache wechseln Sie über die Auswahl in der Navigationsleiste.

Die deutsche Fassung ist im Repository von Hand geschrieben, es handelt sich nicht um eine maschinelle Übersetzung:

| | |
| :--- | :--- |
| Narrative Seiten | [`input/translations/de/pagecontent/`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/tree/main/input/translations/de/pagecontent)— eine Datei je Quellseite, gleicher Dateiname |
| Navigationsmenü | [`input/translations/de/includes/menu.xml`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/input/translations/de/includes/menu.xml) |
| UI-Texte der Vorlage (Fußzeile, Tabellenköpfe, Schaltflächen) | [`translations/stringsBase-de.po`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/translations/stringsBase-de.po)und[`stringsArtifacts-de.po`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/translations/stringsArtifacts-de.po)— die deutschen Kataloge der Basisvorlage, hier mitgeliefert, weil die gepinnte Basis-Version keine enthält |

Eine Seite ohne deutsche Entsprechung wird unter `/de/` auf Englisch dargestellt, mit einem entsprechenden Hinweis am Seitenanfang.

### Rückmeldungen zu einer Übersetzung

Bitte im HL7-FHIR-Zulip, Stream `german/mi-initiative` ([https://chat.fhir.org](https://chat.fhir.org)), Seite und Formulierung nennen — oder ein Issue im Repository anlegen, aus dem dieser Leitfaden gebaut wird. Korrekturen durchlaufen dieselbe Pull-Request-Prüfung wie jede andere Änderung; die Schritt-für-Schritt-Anleitung steht im Repository unter [`docs/recipes/add-translation.md`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/docs/recipes/add-translation.md).

> Der Issue-Tracker des Repositories ist hier bewusst nicht mit fester URL verlinkt: Ein einmal gebauter Leitfaden überdauert Repository-Umzüge — etwa den Umzug in die GitHub-Organisation der MII (`medizininformatik-initiative`) — und eine in einen älteren Build eingebrannte URL würde veralten. Legen Sie das Issue im Repository an, aus dem dieser Leitfaden gebaut wurde; Zulip bleibt unabhängig davon erreichbar. Die **Dateilinks** dieser Seite tragen dagegen eine Repository-URL — sie stammt aus einem einzigen Substitutionspunkt, `input/data/repo.json`, den die Migrations-Checkliste mit einer einzigen Änderung umstellt; Links in vor dem Umzug veröffentlichten Builds funktionieren über die Repository-Weiterleitung von GitHub weiter.

> **Geltungsbereich:** Dies ist die **Vorschau** der KDS-IG-Vorlage (`de.medizininformatikinitiative.template`) und kein MII-Kerndatensatz-Modul. Sie dient nur dazu, das Branding vor einem Release in beiden Sprachen zu prüfen. Ein Modul-IG bringt seine eigene Seite mit Übersetzungshinweisen mit.

