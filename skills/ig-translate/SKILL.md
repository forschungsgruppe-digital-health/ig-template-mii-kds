---
name: ig-translate
description: >-
  Multi-language support for MII KDS Implementation Guides — the part the
  TEMPLATE owns. German is the default IG language, English the recommended
  translation. Documents the empirically verified rendering behavior of the
  toolchain (which artifacts actually render translations), the i18n
  configuration conventions modules must use, and the language-neutrality
  rules for this template's header/footer/CSS overrides. The module-facing
  translate/harvest workflow lives in the module scaffold repository, not
  here. Report/propose only; any change goes through a pull request
  targeting dev.
license: CC-BY-4.0
---

# ig-translate — multi-language support (template-owner scope)

Adapted from the `ig-translate` skill of the MII KDS sample IG
([`mii-kds-sample-ig-inoffiziell`](https://github.com/medizininformatik-initiative/mii-kds-sample-ig-inoffiziell),
CC-BY-4.0), trimmed to what the **template** owns.

## Scope split (read this first)

Multi-language support is split across the two template repositories:

- **This repo (`ig-template-mii-kds`, the template package)** owns the
  language *mechanism*: language-neutral header/footer/CSS overrides, the
  inherited UI-string translations of the base template, and the documented
  conventions below.
- **The module scaffold
  ([`mii-kds-module-template`](https://github.com/medizininformatik-initiative/mii-kds-module-template))**
  owns the module-facing *workflow*: creating or harvesting the actual
  translation supplements (`input/translations/en/…`) and translated
  narrative pages for a concrete module IG, including the supporting
  tooling.

If the task is "translate this module's content", switch to the module
scaffold's `ig-translate` skill. Stay here for template mechanics.

## Language policy

**German is the default IG language; English is the recommended second
language.**

- `i18n-default-lang: en` — the guide leads in English.
- `i18n-lang: [de]` — German is the additional rendering.
- Conformance-resource `description`/`name`/`title` stay **German** in the FSH
  (the MII naming conventions prefer German there), surfaced in the English
  guide via a Translation extension.

> **Why en-default:** the same model as `kerndatensatz-basis`. The MII meta
> wiki's naming conventions prefer German for a conformance resource's
> description/name/title but require a translation extension whose content is
> shown "im englischsprachigen Implementierungsleitfaden" — i.e. they assume the
> guide is English. Note this reverses an earlier project decision; do not
> "correct" it back to German-default. Translation extension details for
> the English guide.

## Ground truth: what the toolchain actually renders (empirically verified)

Re-verified with **IG Publisher 2.2.11** + `fhir2.base.template` 0.1.0 on this
repo's preview (2026-07): the earlier sample-IG table was WRONG about narrative
pages because it used the wrong file location (a `*-<lang>.md` sibling). The
correct location is a **translation-source folder**, exactly as the HL7 reference
[`FHIR/multi-lang-test-ig`](https://github.com/FHIR/multi-lang-test-ig) uses:

| Content | Translatable? | Mechanism (file path) |
|---------|---------------|-----------------------|
| **Narrative pages** (`input/pagecontent/<name>.md`) | **Yes, renders** | `input/translations/<lang>/pagecontent/<same-filename>` — the whole page renders in `<lang>` on `/<lang>/`. A page with no such file falls back to the default-language source. |
| Resource texts of **StructureDefinition, CodeSystem, Questionnaire** (`description`, designations, element `definition`) | **Yes, renders** | Supplement `input/translations/<lang>/<Type>-<id>.{po\|xliff\|json}` |
| Menu (`input/includes/menu.xml`) | **Yes** | `input/translations/<lang>/includes/menu.xml` (per-language copy) |
| **ValueSet**, some **ImplementationGuide** title fields, `concept.display`/`concept.definition` | **Partial / No** | Not applied from a plain `.po` supplement on this toolchain (verified) |

Consequence: place the English rendering of `input/pagecontent/index.md` at
`input/translations/en/pagecontent/index.md`, and `/en/index.html` renders in
English. Do NOT use a `*-<lang>.md` sibling in `input/pagecontent/` — the
toolchain treats it as a separate page, not a translation.

> Treat this table as ground truth until re-verified. **Re-verify it whenever
> the pinned base template or the IG Publisher version changes**, and update
> the table (here and in the module scaffold's copy) with the new
> verification statement.

## Configuration conventions (what modules must declare)

The template supports — and the module scaffold pre-configures — this
`sushi-config.yaml` parameter set:

```yaml
parameters:
  i18n-default-lang: en          # leading language
  i18n-lang:
    - de                         # additional rendered language(s)
  translation-sources:
    - input/translations/en      # folder holding the supplements
```

## What THIS repo must uphold (template obligations)

1. **Language-neutral overrides.** The header, footer, and CSS fragments this
   template ships must not hard-code UI strings. Use the base template's
   string mechanism — `site.data.stringsBase[include.lang]['<Key>']` — as the
   base's own `fragment-footer.html` does. (Verified in
   `HL7/ig-template-base2`: the base resolves all UI strings through
   `stringsBase[include.lang]`.)
2. **Inherited German UI strings.** The base template ships `.po` UI-string
   translations including German (`translations/stringsBase-de.po`,
   `translations/stringsArtifacts-de.po` — verified in
   `HL7/ig-template-base2`). This template inherits them by deriving from the
   base; do not fork or override them. Verify after a base bump that the
   German strings still render in the preview build.
3. **Do not "translate" FHIR identifiers.** `name`, `id`, codes, and
   canonical URLs stay as they are, in every language.
4. **Additive only.** Translations are supplements; the German source is
   never modified by translation work.

## When to activate (in this repo)

- When changing `includes/` or `content/assets/css/` — check the
  language-neutrality rule (obligation 1).
- When bumping the pinned `fhir2.base.template` version — re-verify the
  rendering table and the German UI strings (obligations 2 and the ground
  truth above).
- When documenting or reviewing the i18n conventions modules rely on.

Findings are reported and proposed as changes via a pull request **targeting
`dev`** — never merged autonomously, never pushed to `main`.

## References

- Module-facing workflow + tooling: the `ig-translate` skill in
  [`mii-kds-module-template`](https://github.com/medizininformatik-initiative/mii-kds-module-template).
- Base template string mechanism and `.po` translations:
  [`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2)
  (`includes/`, `translations/`).
- MII language rule: MII meta wiki → "Namenskonventionen für
  FHIR‐Ressourcen in der MII" → Sprache.
- HL7 multi-language background: <http://hl7.org/fhir/languages.html>.
