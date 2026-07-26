# Recipe: languages in the template

**Goal.** Add or fix a language in the part of the bilingual setup that **this
template owns**: the base UI chrome (footer labels, buttons, boilerplate) and the
preview IG's own two pages.

**Prerequisites.** A local or CI build of the bundled preview IG
([first build in the dev container](first-build-in-devcontainer.md)), so you can
see a change render in both languages.

**Not here:** translating a *module's* pages, menu and conformance resources.
That is the module author's job and is documented in the module scaffold —
[`mii-kds-module-template` → `docs/recipes/add-translation.md`](https://github.com/medizininformatik-initiative/mii-kds-module-template/blob/main/docs/recipes/add-translation.md).

## Language model

English is the default rendering language, German the additional one
(`i18n-default-lang: en`, `i18n-lang: [de]`) — the same model as
kerndatensatz-basis.

> **Why English leads the guide:** the MII meta wiki
> ([Namenskonventionen für FHIR-Ressourcen in der MII](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Namenskonventionen-für-FHIR‐Ressourcen-in-der-MII),
> § Sprache) prefers German for a conformance resource's `description`/`name`/
> `title`, but requires a Translation extension whose content is shown "im
> englischsprachigen Implementierungsleitfaden" — it assumes the guide is
> English. Resource *descriptions* therefore stay German; the narrative guide
> leads in English.

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

**To add another language:** copy that language's catalogs from
[`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) (CC0) into
`translations/`, then rebuild.

> **Why this is safe, and why the `.json` table is not:** `.po` catalogs are
> **additive** — template files layer base-then-child, so a *new* filename
> supplements the base's. The master `stringsBase.json` would *replace* the base
> file wholesale, so never ship that. The publisher compiles the `.po` files into
> the language table at build time.

**Upkeep:** delete the vendored copy once the pinned base ships that language
itself — see [`../../translations/README.md`](../../translations/README.md). The
dependency checker watches `fhir2.base.template` and proposes the bump.

### 2. The preview IG's own pages and menu

The preview ships one page and one menu per language, purely so branding changes
are reviewable in both renderings:

```text
input/pagecontent/index.md                     # English (default)
input/translations/de/pagecontent/index.md     # German — same file name
input/includes/menu.xml                        # English
input/translations/de/includes/menu.xml        # German
```

Keep both in step when you change either. A page with no translation falls back
to the default language.

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

## Re-verify on a toolchain bump

The behaviour above is tied to the pinned IG Publisher and base-template
versions. When either pin changes, rebuild and re-inspect a `/de/` and an `/en/`
page, then update this recipe and
[`skills/ig-translate/SKILL.md`](../../skills/ig-translate/SKILL.md).
