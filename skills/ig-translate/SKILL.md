---
name: ig-translate
description: >-
  Multi-language support for MII KDS Implementation Guides — the part the
  TEMPLATE owns. This project's model is English as the default IG language
  and German as the additional rendering. Documents the empirically verified
  rendering behavior of the toolchain (which artifacts actually render
  translations), the i18n configuration this template is built and tested
  against and which the module scaffold pre-configures, and the
  language-neutrality rules for this template's header/footer/CSS overrides.
  The module-facing translate/harvest workflow lives in the module scaffold
  repository, not here. Report/propose only; any change goes through a pull
  request targeting dev.
license: CC-BY-4.0
---

# ig-translate — multi-language support (template-owner scope)

Adapted from the `ig-translate` skill of the MII KDS sample IG
([`mii-kds-sample-ig-inoffiziell`](https://github.com/forschungsgruppe-digital-health/mii-kds-sample-ig-inoffiziell),
CC-BY-4.0), trimmed to what the **template** owns.

## Scope split (read this first)

Multi-language support is split across the two template repositories:

- **This repo (`ig-template-mii-kds`, the template package)** owns the
  language *mechanism*: the header/footer/CSS overrides, the base template's
  UI-string catalogs, and the documented conventions below.
- **The organization's skill catalog
  ([`agent-skills`](https://github.com/forschungsgruppe-digital-health/agent-skills))**
  owns the guide-facing *workflow*: creating or harvesting the actual
  translation supplements (`input/translations/<lang>/…`) and translated
  narrative pages for a concrete IG, including the supporting tooling. The
  skill is `fhir-ig-translation`. This skill does not install it for you —
  **precondition**, to be run by the user:
  `npx skills add https://github.com/forschungsgruppe-digital-health/agent-skills/tree/v0.12.0 --skill fhir-ig-translation --agent claude-code codex --global --yes`
  (pin with the `/tree/<ref>` form; `owner/repo@<tag>` does *not* pin — `@`
  introduces a skill *name* there and the install silently comes from the
  default branch). It began as the `ig-translate` skill of
  `mii-kds-module-template`, which now consumes it from the catalog under its
  catalog name, as a pinned vendored copy.

If the task is "translate this module's content", switch to
`fhir-ig-translation`. Stay here for template mechanics.

## Language policy

**This project's model: English is the default IG language, German the
additional rendering** — following `kerndatensatz-basis`.

- `i18n-default-lang: en` — the guide leads in English.
- `i18n-lang: [de]` — German is the additional rendering.
- Conformance-resource `description`/`name`/`title` stay **German** in the FSH
  (the MII naming conventions prefer German there), surfaced in the English
  guide via a Translation extension.

> **Why en-default (this project's reading):** the MII meta wiki's naming
> conventions prefer German for a conformance resource's
> description/name/title but require a translation extension whose content is
> shown "im englischsprachigen Implementierungsleitfaden" — that phrasing
> assumes an English guide, and `kerndatensatz-basis` is built that way. The
> wiki does not state the rule directly, so no MII rule stops a module from
> choosing otherwise, and the template's overrides are language-neutral either
> way. The model is nevertheless binding wherever the guard runs: here, on
> every pull request into `dev` (`.github/workflows/security-scan.yml`), and in
> a repository created from the module scaffold, which inherits the scaffold's
> own copy (`scripts/language-model-check.sh`, run by `convention-check.yml`
> and never removed by the first-run bootstrap). It reverses an earlier draft
> decision of this project — do not flip a repository back without changing its
> guard too.

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

Consequence: place the German rendering of `input/pagecontent/index.md` at
`input/translations/de/pagecontent/index.md`, and `/de/index.html` renders in
German. Do NOT use a `*-<lang>.md` sibling in `input/pagecontent/` — the
toolchain treats it as a separate page, not a translation.

> Treat this table as ground truth until re-verified. **Re-verify it whenever
> the pinned base template or the IG Publisher version changes**, and update
> the table with the new verification statement.

> ⚠️ **This table is no longer the authoritative copy — reconcile it.** The
> catalog skill `fhir-ig-translation` carries the maintained version, and its
> 2026-08-05 revision **retires a claim still standing in row 4 above**: the
> IG's own `title` and the titles of `pages:`-tree pages (breadcrumbs, TOC,
> browser `<title>`) *do* render, from
> `input/translations/<lang>/ImplementationGuide-<ig-id>.po`, which the
> publisher imports at load time rather than as a resource supplement. It was
> verified on our own pin (2.2.11) and on HL7's reference build (2.0.13).
> Read the catalog skill before acting on the row above; this copy is kept
> because the rest of the file is template-owner scope, not because the row is
> still correct. Reconciling it is
> [open work for this repo's owner](../../../../issues/123), not something to
> assume has happened.

## Configuration the scaffold pre-configures (and this template is verified against)

The template supports — and the module scaffold pre-configures — this
`sushi-config.yaml` parameter set:

```yaml
parameters:
  i18n-default-lang: en          # leading language
  i18n-lang:
    - de                         # additional rendered language(s)
  translation-sources:
    - input/translations/de      # folder holding the translations
```

## What THIS repo must uphold (template obligations)

1. **Every offered language renders.** The header, footer, and CSS fragments
   this template ships must produce correct text in `de` and `en` alike. The
   base's string mechanism — `site.data.stringsBase[include.lang]['<Key>']` —
   is the default way to get that. The header and CSS fragments avoid the
   question entirely: they carry no UI strings, only an asset and its `alt`
   text switched on `include.lang`. The footer fragment does resolve labels,
   and deliberately not through the base: the base has no `Impressum` key, a
   child template cannot add one, and the pinned base ships no German catalog,
   so those lookups render blank on `/de/`. It hard-codes an
   `include.lang`-branched label set instead. Read `docs/styleguide.md` §5 and §6
   before changing it, and keep every branch complete when adding a language.
2. **Vendored German UI strings.** The pinned base
   `fhir2.base.template#0.1.0` ships `.po` catalogs for
   `ar`/`es`/`fr`/`nl`/`pt`/`ru` — **not** `de` (German was added upstream
   after `0.1.0` was cut). This template therefore vendors the base's own
   `translations/stringsBase-de.po` and `stringsArtifacts-de.po`; `.po` files
   layer additively, so a new filename supplements the base rather than
   replacing it. After a base bump, verify the German strings still render in
   the preview — and delete the vendored copies once the pinned base ships `de`
   itself.
3. **Do not "translate" FHIR identifiers.** `name`, `id`, codes, and
   canonical URLs stay as they are, in every language.
4. **Additive only.** Translations are supplements; the English source page is
   never modified by translation work.

## When to activate (in this repo)

- When changing `includes/` or `content/assets/css/` — check that both
  renderings still show correct text (obligation 1).
- When bumping the pinned `fhir2.base.template` version — re-verify the
  rendering table and the German UI strings (obligations 2 and the ground
  truth above).
- When documenting or reviewing the i18n conventions modules rely on.

Findings are reported and proposed as changes via a pull request **targeting
`dev`** — never merged autonomously, never pushed to `main`.

## References

- Guide-facing workflow + tooling: the `fhir-ig-translation` skill in
  [`agent-skills`](https://github.com/forschungsgruppe-digital-health/agent-skills),
  the organization's skill catalog — the maintained successor of the
  `ig-translate` skill `mii-kds-module-template` used to carry.
- Base template string mechanism and `.po` translations:
  [`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2)
  (`includes/`, `translations/`).
- MII language rule: MII meta wiki → "Namenskonventionen für
  FHIR‐Ressourcen in der MII" → Sprache.
- HL7 multi-language background: <http://hl7.org/fhir/languages.html>.
