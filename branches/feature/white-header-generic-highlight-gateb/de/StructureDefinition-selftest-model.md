# Self-Test Model - MII KDS IG Template — Self-Test v0.1.0

* [**Table of Contents**](toc.md)
* [**Artifacts Summary**](artifacts.md)
* **Self-Test Model**

## : Self-Test Model 

| | |
| :--- | :--- |
| **:https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/StructureDefinition/selftest-model | **:0.1.0 |
| Draft | **:SelfTestModel |

 
Minimal logical model that exists only so the template self-test IG builds and its artifact layout renders; not an MII artifact. 

**Usages:**

* This Logical Model is not used by any profiles in this Specification

You can also check for [usages in the FHIR IG Statistics](https://packages2.fhir.org/xig/resource/de.medizininformatikinitiative.template.selftest|current/StructureDefinition/StructureDefinition-selftest-model.json)

### 

 . 

*   
*   
*   
*   
*   

** Summary **

 **View** 

** Summary **

 

 ,  



## Resource Content

```json
{
  "resourceType" : "StructureDefinition",
  "id" : "selftest-model",
  "url" : "https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/StructureDefinition/selftest-model",
  "version" : "0.1.0",
  "name" : "SelfTestModel",
  "title" : "Self-Test Model",
  "status" : "draft",
  "date" : "2026-07-23T23:18:01+00:00",
  "publisher" : "Forschungsgruppe Digital Health, TU Dresden",
  "contact" : [{
    "name" : "Forschungsgruppe Digital Health, TU Dresden",
    "telecom" : [{
      "system" : "url",
      "value" : "https://github.com/forschungsgruppe-digital-health"
    }]
  }],
  "description" : "Minimal logical model that exists only so the template self-test IG builds and its artifact layout renders; not an MII artifact.",
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
  "type" : "https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/StructureDefinition/selftest-model",
  "baseDefinition" : "http://hl7.org/fhir/StructureDefinition/Base",
  "derivation" : "specialization",
  "differential" : {
    "element" : [{
      "id" : "selftest-model",
      "path" : "selftest-model",
      "short" : "Self-Test Model",
      "definition" : "Minimal logical model that exists only so the template self-test IG builds and its artifact layout renders; not an MII artifact."
    },
    {
      "id" : "selftest-model.placeholder",
      "path" : "selftest-model.placeholder",
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
