# Recipe: languages in the template

**Goal.** Add or fix a language in the part of the bilingual setup that **this
template owns**: the base UI chrome (footer labels, buttons, boilerplate) and the
preview IG's own two pages.

**Prerequisites.** A local or CI build of the bundled preview IG
([first build in the dev container](first-build-in-devcontainer.md)), so you can
see a change render in both languages.

**Not here:** translating a *module's* pages, menu and conformance resources.
That is the module author's job and is documented in the module scaffold —
[`mii-kds-module-template` → `docs/recipes/add-translation.md`](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template/blob/main/docs/recipes/add-translation.md).

## Language model

English is the default rendering language, German the additional one
(`i18n-default-lang: en`, `i18n-lang: [de]`) — the same model as
kerndatensatz-basis.

> **Why English leads the guide (this project's reading):** the MII meta wiki
> ([Namenskonventionen für FHIR-Ressourcen in der MII](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Namenskonventionen-für-FHIR‐Ressourcen-in-der-MII),
> § Sprache) prefers German for a conformance resource's `description`/`name`/
> `title`, but requires a Translation extension whose content is shown "im
> englischsprachigen Implementierungsleitfaden". That phrasing assumes an
> English guide, and `kerndatensatz-basis` is built that way, so this project
> follows it. The wiki does not state the rule directly — if the TF KDS decides
> otherwise, this choice (and the `language-model` CI job that pins it here) is
> what changes. Resource *descriptions* stay German; the narrative guide leads
> in English.

## Steps

### 1. The base UI chrome — what this template owns

The footer's `Links` / table-of-contents / QA labels, the copyright line,
`Package … based on FHIR …`, `Generated <date>` and the page-navigation buttons
come from the **base template**, looked up as
`site.data.stringsBase[<lang>][<key>]`.

**If a language has no catalog, all of those labels render blank.** That is what
happened to German: `fhir2.base.template` is pinned to `0.1.0`, which ships
catalogs for `ar`/`es`/`fr`/`nl`/`pt`/`ru` — but not `de`.

This template therefore vendors the base's own German catalogs:

```text
translations/stringsBase-de.po        # base UI strings, German
translations/stringsArtifacts-de.po   # artifact-page strings, German
```

**To add another language** (say French), four steps — the first two are the
ones without which nothing renders at all:

1. In the consuming IG's `sushi-config.yaml`, add the language to `i18n-lang`
   (`i18n-lang: [de, fr]`) and its folder to `translation-sources`
   (`input/translations/fr`).
2. In this template, extend the `include.lang` handling: the header, footer and
   language selector in `includes/` list the offered languages explicitly —
   a language they do not know falls back to the default strings.
3. Copy that language's catalogs from
   [`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) (CC0)
   into `translations/` — only needed if the pinned base lacks the language.
4. Rebuild and check both the narrative pages (`/fr/`) and the generated
   artifact pages render in the new language.

> **Why this is safe, and why the `.json` table is not:** `.po` catalogs are
> **additive** — template files layer base-then-child, so a *new* filename
> supplements the base's. The master `stringsBase.json` would *replace* the base
> file wholesale, so never ship that. The publisher compiles the `.po` files into
> the language table at build time.

**Upkeep:** delete the vendored copy once the pinned base ships that language
itself — see [`../../translations/README.md`](../../translations/README.md). The
dependency checker watches `fhir2.base.template` and proposes the bump.

### 2. The preview IG's own pages and menu

The preview ships two pages and one menu per language, purely so branding
changes are reviewable in both renderings:

```text
input/pagecontent/index.md                              # English (default)
input/translations/de/pagecontent/index.md              # German — same file name
input/pagecontent/translationinfo.md                    # English (default)
input/translations/de/pagecontent/translationinfo.md    # German — same file name
input/includes/menu.xml                                 # English
input/translations/de/includes/menu.xml                 # German
```

Keep each pair in step when you change either half. A page with no translation
falls back to the default language.

> **Why `translationinfo.md` is not optional:** the base template puts a notice
> at the top of every translated page linking to `translationinfo.html`. Without
> the page, that link 404s on the whole German tree.

## Expected result

Build the preview (or push a branch and open the CI preview) and confirm on
**both** `/en/` and `/de/`:

1. the menu is in that language;
2. the footer shows the copyright, `Package … based on FHIR …` and the
   generated-date line — blank labels mean a missing base catalog;
3. the language switcher moves between the two renderings.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Footer/base labels blank in one language | No UI-string catalog for it in the pinned base | Vendor that language's `.po` files into `translations/` |
| A menu label does not change with the language | The per-language `menu.xml` is missing, or a `menu:` property was added to `sushi-config.yaml` | Ship `input/translations/<lang>/includes/menu.xml`; never use the `menu:` property — it generates one untranslatable menu |
| Language-switcher flag missing | The flag asset is not resolvable from the language folder | The template ships `content/assets/images/deu.svg` for exactly this reason |
| The organisation name and link in the footer's copyright line stay English on `/de/` | They are not UI strings: the base reads them from the IG's single-valued `publisher` block and emits them before our footer fragment runs | Not fixable from the template — see the "Known limit" bullet in [`../styleguide.md`](../styleguide.md) §6 |

## Re-verify on a toolchain bump

The behaviour above is tied to the pinned IG Publisher and base-template
versions. When either pin changes, rebuild and re-inspect a `/de/` and an `/en/`
page, then update this recipe and
[`skills/ig-translate/SKILL.md`](../../skills/ig-translate/SKILL.md).
