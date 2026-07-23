# Selbsttest-Palette - MII KDS IG Template — Self-Test v0.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Selbsttest-Palette**

## CodeSystem: Selbsttest-Palette () 

| | |
| :--- | :--- |
| **:https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/CodeSystem/selftest-palette | **:0.1.0 |
| Draft | **:SelfTestPalette |

 
Zwei beliebige Codes, damit die Selbsttest-IG eine CodeSystem-Seite rendert; kein MII-Artefakt. 

* This CodeSystem is not used here; it may be used elsewhere (e.g. specifications and/or implementations that use this content)

-------

 . 



## Resource Content

```json
{
  "resourceType" : "CodeSystem",
  "id" : "selftest-palette",
  "url" : "https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/CodeSystem/selftest-palette",
  "version" : "0.1.0",
  "name" : "SelfTestPalette",
  "title" : "Selbsttest-Palette",
  "status" : "draft",
  "experimental" : true,
  "date" : "2026-07-23T22:28:29+00:00",
  "publisher" : "Forschungsgruppe Digital Health, TU Dresden",
  "contact" : [{
    "name" : "Forschungsgruppe Digital Health, TU Dresden",
    "telecom" : [{
      "system" : "url",
      "value" : "https://github.com/forschungsgruppe-digital-health"
    }]
  }],
  "description" : "Zwei beliebige Codes, damit die Selbsttest-IG eine CodeSystem-Seite rendert; kein MII-Artefakt.",
  "_description" : {
    "extension" : [{
      "extension" : [{
        "url" : "lang",
        "valueCode" : "en"
      },
      {
        "url" : "content",
        "valueString" : "Two arbitrary codes so the self-test IG renders a CodeSystem page; not an MII artifact."
      }],
      "url" : "http://hl7.org/fhir/StructureDefinition/translation"
    }]
  },
  "jurisdiction" : [{
    "coding" : [{
      "system" : "urn:iso:std:iso:3166",
      "code" : "DE",
      "display" : "Germany"
    }]
  }],
  "caseSensitive" : true,
  "content" : "complete",
  "count" : 2,
  "concept" : [{
    "code" : "primary",
    "display" : "Primärfarbe",
    "definition" : "Platzhalter für den Steckplatz der primären Markenfarbe der Vorlage."
  },
  {
    "code" : "accent",
    "display" : "Akzentfarbe",
    "definition" : "Platzhalter für den Steckplatz der Akzentfarbe der Vorlage."
  }]
}

```
