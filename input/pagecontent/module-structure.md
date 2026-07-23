This page renders the **canonical MII KDS module page structure** that this IG
template owns (Option B). It is the single source of truth every module built
from `mii-kds-module-template` mirrors — defined in
[`structure/menu.yaml`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/structure/menu.yaml)
and [`structure/pages.yaml`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/structure/pages.yaml).

> **Why here:** so every MII module IG has the same, centrally-maintained page
> set and navigation. A module mirrors this structure and re-syncs when it
> changes. (The IG Publisher cannot inject a menu from a template, so "ownership"
> means *authoritative here, mirrored in the module* — see `structure/README.md`.)

### Canonical navigation (menu)

- **Home**
- **Guidance** — Guidance · Guidance for Researchers · Guidance for Implementers · Datasets and Descriptions · UML Diagrams
- **Conformance** — Conformance · General Requirements · Must Support · Handling Missing Data
- **Artifacts** — Profiles and Extensions · Terminology · Capability Statements · Search Parameters and Operations · Logical Models · Examples
- **Downloads**
- **Versioning** — Versioning · Changelog
- **Metadata**

### Canonical page set

Every module ships one `input/pagecontent/<name>.md` per entry: `index`,
`guidance`, `researcher-guidance`, `implementer-guidance`,
`datasets-and-descriptions`, `uml-diagrams`, `conformance`,
`general-requirements`, `must-support`, `missing-data`,
`profiles-and-extensions`, `terminology`, `capability-statements`,
`search-parameters-and-operations`, `logical-models`, `examples`, `downloads`,
`version-history`, `changes`, `translationinfo`, `metadata`.
