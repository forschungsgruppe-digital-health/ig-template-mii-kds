# Preview Model - MII KDS IG Template — Preview v0.4.0

* [**Inhaltsverzeichnis**](toc.md)
* [**Artefaktübersicht**](artifacts.md)
* **Preview Model**

## Logisches Modell: Preview Model 

| | |
| :--- | :--- |
| *Offizielle URL*:https://github.com/medizininformatik-initiative/ig-template-mii-kds/StructureDefinition/preview-model | *Version*:0.4.0 |
| Draft Stand: 2026-08-05 | *Maschinenlesbarer Name*:PreviewModel |

 
Minimal logical model that exists only so the template preview IG builds and its artifact layout renders; not an MII artifact. 

**Usages:**

* This Logical Model is not used by any profiles in this Specification

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/de.medizininformatikinitiative.template.preview|current/StructureDefinition/StructureDefinition-preview-model.json)

### Formale Ansichten des Profilinhalts

 [Beschreibung von Profilen, Differentials, Snapshots und deren Repräsentationen](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

*  [Schlüsselelemente-Tabelle](#tabs-key) 
*  [Differential-Tabelle](#tabs-diff) 
*  [Snapshot-Tabelle](#tabs-snap) 
*  [Statistiken/Referenzen](#tabs-summ) 
*  [Alle](#tabs-all) 

Diese Struktur ist abgeleitet von [Base](http://build.fhir.org/types.html#Base) 

Diese Struktur ist abgeleitet von [Base](http://build.fhir.org/types.html#Base) 

** Summary **

 **Schlüsselelemente-Ansicht** 

 **Differential-Ansicht** 

Diese Struktur ist abgeleitet von [Base](http://build.fhir.org/types.html#Base) 

 **Snapshot-AnsichtView** 

Diese Struktur ist abgeleitet von [Base](http://build.fhir.org/types.html#Base) 

** Summary **

 

Weitere Repräsentationen des Profils: [CSV](../StructureDefinition-preview-model.csv), [Excel](../StructureDefinition-preview-model.xlsx) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "preview-model",
  "url" : "https://github.com/medizininformatik-initiative/ig-template-mii-kds/StructureDefinition/preview-model",
  "version" : "0.4.0",
  "name" : "PreviewModel",
  "title" : "Preview Model",
  "status" : "draft",
  "date" : "2026-08-05T20:55:41+00:00",
  "publisher" : "Medical Informatics Initiative (MII)",
  "_publisher" : {
    "extension" : [{
      "extension" : [{
        "url" : "lang",
        "valueCode" : "de"
      },
      {
        "url" : "content",
        "valueString" : "Medizininformatik-Initiative (MII)"
      }],
      "url" : "http://hl7.org/fhir/StructureDefinition/translation"
    }]
  },
  "contact" : [{
    "name" : "Medical Informatics Initiative (MII)",
    "telecom" : [{
      "system" : "url",
      "value" : "https://www.medizininformatik-initiative.de"
    }]
  }],
  "description" : "Minimal logical model that exists only so the template preview IG builds and its artifact layout renders; not an MII artifact.",
  "jurisdiction" : [{
    "coding" : [{
      "system" : "urn:iso:std:iso:3166",
      "code" : "DE",
      "display" : "Germany"
    }]
  }],
  "fhirVersion" : "4.0.1",
  "kind" : "logical",
  "abstract" : false,
  "type" : "https://github.com/medizininformatik-initiative/ig-template-mii-kds/StructureDefinition/preview-model",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/Base",
  "derivation" : "specialization",
  "differential" : {
    "element" : [{
      "id" : "preview-model",
      "path" : "preview-model",
      "short" : "Preview Model",
      "definition" : "Minimal logical model that exists only so the template preview IG builds and its artifact layout renders; not an MII artifact."
    },
    {
      "id" : "preview-model.placeholder",
      "path" : "preview-model.placeholder",
      "short" : "A single placeholder element.",
      "definition" : "A single placeholder element.",
      "min" : 0,
      "max" : "1",
      "type" : [{
        "code" : "string"
      }]
    }]
  }
}

```
