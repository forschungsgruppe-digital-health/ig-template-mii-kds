# Preview Model - MII KDS IG Template — Preview v1.0.1

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Preview Model**

## Logical Model: Preview Model 

| | |
| :--- | :--- |
| *Official URL*:https://github.com/medizininformatik-initiative/ig-template-mii-kds/StructureDefinition/preview-model | *Version*:1.0.1 |
| Draft as of 2026-08-14 | *Computable Name*:PreviewModel |

 
Minimal logical model that exists only so the template preview IG builds and its artifact layout renders; not an MII artifact. 

**Usages:**

* This Logical Model is not used by any profiles in this Specification

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/de.medizininformatikinitiative.template.preview|current/StructureDefinition/StructureDefinition-preview-model.json)

### Formal Views of Profile Content

 [Description of Profiles, Differentials, Snapshots, and their representations](http://build.fhir.org/ig/FHIR/ig-guidance/readingIgs.html#structure-definitions). 

 

Other representations of profile: [CSV](../StructureDefinition-preview-model.csv), [Excel](../StructureDefinition-preview-model.xlsx) 



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "preview-model",
  "url" : "https://github.com/medizininformatik-initiative/ig-template-mii-kds/StructureDefinition/preview-model",
  "version" : "1.0.1",
  "name" : "PreviewModel",
  "title" : "Preview Model",
  "status" : "draft",
  "date" : "2026-08-14T07:41:45+00:00",
  "publisher" : "NUM-DIZ",
  "_publisher" : {
    "extension" : [{
      "extension" : [{
        "url" : "lang",
        "valueCode" : "de"
      },
      {
        "url" : "content",
        "valueString" : "NUM-DIZ"
      }],
      "url" : "http://hl7.org/fhir/StructureDefinition/translation"
    }]
  },
  "contact" : [{
    "name" : "NUM-DIZ",
    "telecom" : [{
      "system" : "url",
      "value" : "https://www.netzwerk-universitaetsmedizin.de"
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
