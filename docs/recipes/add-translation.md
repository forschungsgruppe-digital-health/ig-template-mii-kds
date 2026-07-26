# Recipe: extend the translations of an IG (menu, footer, content, resources)

**Goal.** Add or extend a translation for any part of a bilingual IG — the
navigation **menu**, the **footer / base UI chrome**, the **narrative content**,
and the **conformance resources**.

**Language policy.** These repositories are **German-default,
English-recommended**: German is the authoritative content language
(`i18n-default-lang: de`), English the recommended second rendering
(`i18n-lang: [en]`). Everything below works the same for a further language —
replace `en` with that language code.

> **Why translation is *additive*:** you never edit the German source to
> translate it. Each language gets its own file beside the source, and a part
> with no translation falls back to German. Nothing added here can break a build
> — at worst it is ignored.

This template (`de.medizininformatikinitiative.template`) **owns the
multi-language mechanism**; every module built from
[`mii-kds-module-template`](https://github.com/medizininformatik-initiative/mii-kds-module-template)
inherits it.

---

## 0. The four layers at a glance

An IG's visible text comes from four different places, and **each has its own
translation mechanism**. This is the table to come back to:

| # | Layer | Example text | Where the translation goes | Owned by |
|---|---|---|---|---|
| 1 | **Narrative content** | your page prose | `input/translations/<lang>/pagecontent/<same-filename>.md` | the IG |
| 2 | **Menu** | `Startseite`, `Anleitung` | `input/translations/<lang>/includes/menu.xml` | the IG |
| 3 | **Base UI chrome** (footer, buttons, boilerplate) | `Erstellt <date>`, `Inhaltsverzeichnis` | `translations/stringsBase-<lang>.po` in the **template** | the IG **template** |
| 4 | **Conformance resources** | a profile's `description` | `input/translations/<lang>/<ResourceType>-<id>.po` | the IG |

Layers 1, 2 and 4 live in a module; layer 3 lives in this template repository and
every module inherits it.

---

## 1. Narrative content (pages)

Put the translated page in the translation-source folder under `pagecontent/`,
with the **same file name** as the German page:

```text
input/pagecontent/index.md                     # German — the source
input/translations/en/pagecontent/index.md     # English — renders on /en/
```

- Keep structure, headings and links 1:1 with the German page.
- Leave internal artifact links (`StructureDefinition-<id>.html`, …) and FHIR
  identifiers unchanged — translate prose, not identifiers.
- A page with no translation file falls back to the German source on `/en/`,
  with a "no translation available" note. That is fine — translate the pages
  that matter most first.

> **The mistake to avoid:** a `<name>-en.md` sibling inside `input/pagecontent/`
> is **not** a translation. The toolchain treats it as a *separate page*, so
> `/en/` keeps showing German. It must live under
> `input/translations/<lang>/pagecontent/`. This mirrors the HL7 reference IG
> [`FHIR/multi-lang-test-ig`](https://github.com/FHIR/multi-lang-test-ig).

---

## 2. Menu

The menu **is** translatable, but only if it is maintained as a **file**:

```text
input/includes/menu.xml                      # German — the source menu
input/translations/en/includes/menu.xml      # English translation
```

Rules:

- **Do not use the `menu:` property in `sushi-config.yaml`.** SUSHI generates a
  single `menu.xml` from it that cannot be translated, and it competes with the
  files above. Remove the property if it is present.
- Keep the `href` targets **identical** across languages; translate only labels.
- A dropdown parent must link to a **real page** (`href="#"` is rejected by the
  template's menu QA check).
- The IG Publisher supports **one** sub-menu level.
- Add the same entries to every language file, or the navigation differs per
  language.

> **Why the property cannot work:** that menu is generated once, before any
> per-language rendering, so there is nothing language-specific to translate. The
> per-language file is the mechanism the HL7 reference IG uses.

---

## 3. Base UI chrome (footer, buttons, boilerplate) — template-level

Text the **base template** contributes — the footer's `Links` /
table-of-contents / QA-report labels, the copyright line, `Package … based on
FHIR …`, `Generated <date>`, the page-navigation buttons — is not in your IG at
all. It comes from the base template's UI-string catalogs, looked up as
`site.data.stringsBase[<lang>][<Key>]`.

**If a language has no catalog, every one of those labels renders blank.** That
is exactly what happened to German before this was fixed: the `/de/` footer lost
its copyright, package and generated-date lines while `/en/` showed all of them.

### How this template solves it (and how to add another language)

`fhir2.base.template` is pinned to `0.1.0`, which ships catalogs for
`ar`/`es`/`fr`/`nl`/`pt`/`ru` — **not** `de`. This template therefore vendors the
base's own German catalogs into its `translations/` folder:

```text
translations/stringsBase-de.po        # base UI strings, German
translations/stringsArtifacts-de.po   # artifact-page strings, German
```

To add a further language, copy that language's catalogs from
[`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) (CC0) into
`translations/` here, then rebuild.

> **Why this is safe (and why the `.json` table is not):** the `.po` catalogs are
> **additive** — template files are layered base-then-child, so a *new* filename
> supplements the base's catalogs. The master `stringsBase.json` would *replace*
> the base file wholesale, so never ship that. The Publisher compiles the `.po`
> files into the language table at build time.

**Upkeep:** when the pinned base is bumped to a release that ships the language
itself, delete the vendored copy — see
[`../../translations/README.md`](../../translations/README.md). The dependency
checker watches `fhir2.base.template` and proposes that bump.

> **In a module:** nothing to do — a module inherits this from the template.

---

## 4. Conformance resources (profiles, code systems, questionnaires)

For each resource whose text you want in English, add one supplement named
exactly `<ResourceType>-<id>.po`:

```text
input/translations/en/StructureDefinition-example-patient.po
```

Format (`msgid` = the German source, `msgstr` = the translation):

```po
#: StructureDefinition.description
msgid "Minimales Beispielprofil …"
msgstr "Minimal example profile …"
```

- The `msgid` must match the generated German text **byte for byte**. Copy it
  from `fsh-generated/resources/<Type>-<id>.json` after running `sushi .` —
  quote style, umlauts and trailing punctuation included.
- The file name must match the **generated** `resourceType` + `id`, not the FSH
  name.

### What actually renders (verified on IG Publisher 2.2.11)

| Field | Translated by a `.po` supplement? |
|---|---|
| Resource-level `description` (StructureDefinition, CodeSystem, Questionnaire), and a StructureDefinition's element `definition` / `comment` / `requirements` | **Yes** |
| `CodeSystem.concept.display` / `concept.definition` | **No** — localize these the FHIR-native way, with a language-tagged `designation` authored in the resource |
| Resource `title` | **No** — leave it German |
| ValueSet texts, ImplementationGuide title/description | **No** — a supplement is silently ignored |

> **Do not "simulate" the unsupported cases.** A `ValueSet-*.po` or
> `ImplementationGuide-*.po` is not an error — it is worse: it is ignored, giving
> a false sense of coverage. Only create supplements that render.

---

## 5. Build and check

```sh
sushi .
# then the IG Publisher (see the dev-container recipe), or push the branch and
# let CI build the /de/ and /en/ preview.
```

Check, in this order:

1. `/de/` — menu in German; footer shows the copyright, `Package … basiert auf
   FHIR …` and `Erstellt <date>`.
2. `/en/` — menu in English; footer shows `Package … based on FHIR …` and
   `Generated <date>`.
3. A translated page renders in English on `/en/`; an untranslated one falls back
   to German with the "no translation available" note.
4. A translated resource's `description` is English on `/en/`, German on `/de/`.

The build must stay green (QA errors = 0).

---

## 6. Common errors

| Symptom | Cause | Fix |
|---|---|---|
| Menu stays in one language on every rendering | The `menu:` property is still in `sushi-config.yaml`, or `input/translations/<lang>/includes/menu.xml` is missing | Remove the property; add the per-language menu file (§2) |
| Menu QA error about `href="#"` | A dropdown parent has no real target | Point it at a real page (§2) |
| On `/de/` the footer/base labels are **blank** | No German UI-string catalog for the pinned base | Vendor `stringsBase-de.po` + `stringsArtifacts-de.po` into the template's `translations/` (§3) |
| A translated page does not appear on `/en/` | It is a `<name>-en.md` sibling in `input/pagecontent/`, or its file name differs from the German page | Move it to `input/translations/en/pagecontent/<same-filename>` (§1) |
| A resource supplement seems to do nothing | `msgid` does not match the generated German byte-for-byte, the file name is not `<ResourceType>-<id>.po`, or the field is not translatable | Copy the `msgid` from `fsh-generated/resources/…`; check the table in §4 |
| The language-switcher flag image is missing | The pinned base does not ship the ISO-639-3 flag SVGs the current Publisher expects | Known base-version gap; suppressed in `input/ignoreWarnings.txt` |

---

## Re-verify on a toolchain bump

The rendering tables above are a snapshot of what the **pinned** IG Publisher and
`fhir2.base.template` actually do. Whenever either pin changes, re-verify:
rebuild, inspect a `/de/` and an `/en/` page, and update this recipe and
[`skills/ig-translate/SKILL.md`](../../skills/ig-translate/SKILL.md).
