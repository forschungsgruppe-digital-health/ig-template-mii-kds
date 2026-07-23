# Recipe: add an English translation to a German-default IG

**Goal.** Your MII KDS module IG is authored in **German** (the default,
authoritative language). This recipe adds an **English** rendering the way the
IG Publisher actually supports it, so the guide builds a `/de/` and an `/en/`
site from one source — without ever changing the German source text.

> **Why German-default with English recommended:** it is the language policy for
> these repositories (spec §3.4) and matches the MII naming conventions (German
> is the authoritative documentation language, English is the recommended
> translation). English is a translation aid, never the normative text.

This template (`de.medizininformatikinitiative.template`) **owns the
multi-language mechanism**; the module scaffold
[`mii-kds-module-template`](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template)
ships the `ig-translate` helper tool that automates the file-path bookkeeping
below. The steps here work with or without that tool.

---

## 1. Prerequisites

- A module IG that already builds (SUSHI + IG Publisher, QA errors = 0) — see
  [`first-build-in-devcontainer.md`](first-build-in-devcontainer.md).
- The German source text is written and final enough to translate. **Translate
  last**, once the German wording is stable: a translation supplement points at
  the exact German string, so re-wording the German means re-touching the
  supplement.

---

## 2. Turn on the two languages (`sushi-config.yaml`)

Add these three parameters. They are the whole switch — nothing else is needed
to make the Publisher emit a second-language site.

```yaml
parameters:
  i18n-default-lang: de          # German is the leading/default rendered language
  i18n-lang:
    - en                         # additional rendered language(s)
  translation-sources:
    - input/translations/en      # folder holding the English supplements
```

- `i18n-default-lang: de` — the site root and the default rendering are German.
- `i18n-lang: [en]` — the Publisher additionally renders an `/en/` tree.
- `translation-sources: [input/translations/en]` — where the Publisher looks for
  the per-language **translation supplements** (step 4). Add one folder per
  extra language (`input/translations/<lang>`).

> **Why a separate `translation-sources` folder and not inline text:** a
> supplement is *additive* — it never edits the German source resource. The
> German stays the single source of truth; English lives beside it and can be
> regenerated or dropped without touching the module.

---

## 3. What the toolchain will — and will NOT — translate

Narrative pages and the menu DO translate; several resource-internal fields do
not. The table is empirically verified against this template's self-test build
(IG Publisher **2.2.11** with `fhir2.base.template#0.1.0`). Re-verify on any
toolchain bump — see the note at the end.

| Content | Renders translated today? | How |
|---|---|---|
| **Resource-level text** of **StructureDefinition, CodeSystem, Questionnaire** — `description`, and for StructureDefinition the element `definition` / `comment` / `requirements` and binding descriptions | **Yes** | A translation supplement `input/translations/<lang>/<Type>-<id>.po` (step 4) |
| **CodeSystem `concept.display` / `concept.definition`** | **No — not from a plain `.po` supplement** (verified 2.2.11: they stayed German on `/en/`, at data *and* narrative level). Localize a concept the FHIR-native way, with a language-tagged **`designation`** authored in the resource. | `designation[].language` in the FSH/resource, not a `.po` |
| **Resource `title`** (any type) | **No** | Not applied from a supplement — leave it German |
| **ValueSet** texts, **ImplementationGuide** title/description, the **menu** | **No** | Not supported by the Publisher — a supplement for these is silently ignored. Leave them German. |
| **Narrative pages** (`input/pagecontent/<name>.md`) | **Yes** | Put the translated page at `input/translations/<lang>/pagecontent/<same-filename>` (step 5). Verified 2.2.11: `/en/index.html` renders in English. A page with no translation file falls back to the German source. |
| **Menu** (`input/includes/menu.xml`) | **Yes** | A per-language copy at `input/translations/<lang>/includes/menu.xml` |

> **Why bother translating at all, given the gaps:** conformance resources
> (profiles, code systems, questionnaires) are the machine-readable core a
> reader most needs in their language, and that is exactly what does translate.
> Everything else stays German-leading, which is the policy anyway.

> **Do not "simulate" the unsupported cases.** A `ValueSet-*.po`,
> `ImplementationGuide-*.po`, or `menu.po` is not an error — it is worse: the
> Publisher ignores it, so you get a false sense of coverage. Only create the
> supported supplements.

---

## 4. Translate a conformance resource (the part that renders)

For each StructureDefinition / CodeSystem / Questionnaire you want in English,
create one supplement file.

**4.1 File name — must be exact.** Under the `translation-sources` folder:

```
input/translations/en/<ResourceType>-<id>.po
```

`<ResourceType>` and `<id>` are the `resourceType` and `id` of the **generated**
resource in `fsh-generated/resources/`. A logical model is a
`StructureDefinition`. A wrong name (wrong case, wrong id, or an unsupported
type) is ignored with a log line like *"name is not {type}-{id}"* or *"resource
type … is not supported"*.

**4.2 File content — gettext `.po`.** One block per translatable field:

```po
#: CodeSystem.description
msgid "<exact German source text from the generated resource>"
msgstr "<English translation>"
```

- `#:` is the FHIRPath of the field (`CodeSystem.description`,
  `StructureDefinition.description`,
  `StructureDefinition.snapshot.element[3].definition`, …). It is a gettext
  reference comment; matching is by `msgid`. Only fields the toolchain applies
  (step 3) take effect — a `concept[0].display` entry, for example, is accepted
  into the catalog but does **not** change the rendered concept.
- **`msgid` must match the German source byte for byte**, umlauts included. Get
  it from the generated JSON, not from the `.fsh` — SUSHI may normalise text:

  ```sh
  sushi .
  jq -r '.description' fsh-generated/resources/CodeSystem-<id>.json
  ```

- `msgstr` is your English text. Leave `msgstr ""` empty for fields you have not
  translated yet — the Publisher then falls back to the German source for that
  field.

> **Why `msgid` must be exact:** matching is by the source string, not by
> position. One changed character (a straight vs. curly quote, a missing
> umlaut) and the entry no longer matches, so it is silently skipped and the
> field shows German on `/en/`.

**4.3 Do not translate FHIR identifiers.** `name`, `id`, code values, and
canonical URLs stay identical in every language — never put them in a
supplement. Only human-readable text is translated.

**Worked example in this repo.** The self-test ships exactly one supplement,
[`input/translations/en/CodeSystem-selftest-palette.po`](../../input/translations/en/CodeSystem-selftest-palette.po),
for the German-authored CodeSystem
[`input/fsh/selftest-palette.fsh`](../../input/fsh/selftest-palette.fsh). On the
`/en/` CodeSystem page its `description` renders in **English**, while its
concept displays and `title` stay German — a live, inspectable illustration of
the table in step 3 (only the `description` translated on Publisher 2.2.11).

### Harvest instead of hand-writing (optional)

The module scaffold's `ig-translate` helper lists, for every generated resource,
the target supplement path and whether it exists — so you translate against a
generated to-do list rather than guessing file names:

```sh
tools/ig-translate.sh --scan en        # show the target path for each page/resource
tools/ig-translate.sh --validate en    # check that existing supplements are named/placed correctly
```

The tool determines paths and validates conventions; it does **not** invent
translations — a human (or an agent, reviewed) writes the `msgstr` values. Run
it after `sushi .`, because it reads `fsh-generated/resources/`.

---

## 5. Translate a narrative page

Narrative pages DO translate. Put the translated page in the translation-source
folder, under `pagecontent/`, with the **same file name** as the German page:

```
input/pagecontent/index.md                     # German (leading / default)
input/translations/en/pagecontent/index.md     # English — renders on /en/
```

- Keep the structure, headings, and links 1:1 with the German page.
- Leave internal artifact links (`CodeSystem-<id>.html`, …) and FHIR identifiers
  unchanged.
- The file goes under `input/translations/<lang>/pagecontent/`, **not** as a
  `<name>-<lang>.md` sibling in `input/pagecontent/` (the toolchain would treat a
  sibling as a separate page, not a translation — this is exactly the mistake to
  avoid). This mirrors the HL7 reference
  [`FHIR/multi-lang-test-ig`](https://github.com/FHIR/multi-lang-test-ig).
- A page with no translation file simply falls back to the German source on
  `/en/` — that is fine; translate the pages that matter most first.

This repo carries one such translation,
[`input/translations/en/pagecontent/index.md`](../../input/translations/en/pagecontent/index.md),
and `/en/index.html` renders it in English.

---

## 6. Build and check the result

```sh
sushi .
# then run the IG Publisher (see the dev-container recipe), or push and let the
# ig-preview CI build the /de/ and /en/ site.
```

Expected result:

- The build stays green (QA errors = 0). A translation supplement never *breaks*
  a build — at worst it is ignored.
- Open `output/en/CodeSystem-<id>.html`: the `description` you translated appears
  in **English**; concept displays, the title, and untranslated fields stay
  German (step 3).
- Open `output/de/…`: unchanged German — translation work is additive.
- Narrative pages under `/en/` still show German plus "There is no translation
  page available …" — expected (step 3).

---

## 7. Common errors

| Symptom | Cause | Fix |
|---|---|---|
| The `/en/` artifact page still shows German text | `msgid` does not match the German source exactly (quote style, umlaut, trailing period), or the field is not a translatable one | Copy the `msgid` from `fsh-generated/resources/<Type>-<id>.json`; check it is a supported field (step 3) |
| A supplement seems to do nothing at all | File name is not `<ResourceType>-<id>.po`, or the type is unsupported (ValueSet/IG/menu) | Rename to the exact generated `resourceType`+`id`; drop supplements for unsupported types |
| On the **German** (`/de/`) pages the base **chrome** labels are **blank** — e.g. the footer shows empty, textless links to `toc.html`/`qa.html` (and the breadcrumb shows the English "Table of Contents") | The pinned base template `fhir2.base.template#0.1.0` ships **no German UI-string catalog** (`stringsBase-de.po` was added upstream only after 0.1.0), so `site.data.stringsBase['de']` is empty and the Liquid label lookups return nothing — see [`docs/DESIGN.md`](../DESIGN.md) §6 | Not a module bug and not fixable in the module. It resolves when the base template is bumped to a version that carries German; the dependency checker watches `fhir2.base.template` and proposes that bump ([`docs/MAINTENANCE.md`](../MAINTENANCE.md)). |
| Your translated page does not appear on `/en/` | The file is in the wrong place — e.g. a `<name>-en.md` sibling in `input/pagecontent/`, or a wrong file name | Put it at `input/translations/en/pagecontent/<same-filename-as-the-German-page>` and rebuild |
| The language-switcher flag is broken/missing | `fhir2.base.template#0.1.0` does not ship the ISO-639-3 flag SVGs the current Publisher expects | Known base-version gap; harmless (see `input/ignoreWarnings.txt`) |

---

## Re-verify on a toolchain bump

The rendering table in step 3 is a snapshot of what the pinned IG Publisher and
`fhir2.base.template` actually do. **Whenever either pin changes, re-verify it**
(especially the base-template chrome gap): rebuild the self-test, inspect a `/de/`
and an `/en/` page, and update the table here and in
[`skills/ig-translate/SKILL.md`](../../skills/ig-translate/SKILL.md).
