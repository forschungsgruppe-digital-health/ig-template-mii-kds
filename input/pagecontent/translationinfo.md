<!-- TRANSLATION INFORMATION — English is the IG's DEFAULT language, so this
     file is the source. The German rendering is
     input/translations/de/pagecontent/translationinfo.md.
     This page exists because the base template's translation notice links to
     translationinfo.html on every translated page; without it that link 404s. -->

This guide is authored in **English**, the IG's default language, and rendered
additionally in **German** under `/de/`. Switch languages with the selector in
the navigation bar.

The German rendering is written by hand in this repository — it is not a machine
translation:

| What is translated | Where it comes from |
| --- | --- |
| Narrative pages | `input/translations/de/pagecontent/` — one file per source page, same file name |
| Navigation menu | `input/translations/de/includes/menu.xml` |
| The template's own UI strings (footer, table headers, buttons) | `translations/stringsBase-de.po` and `stringsArtifacts-de.po` — the base template's German catalogs, vendored here because the pinned base release ships none |

A page that has no German counterpart is rendered in English on `/de/`, with a
notice at the top of the page saying so.

### Feedback on a translation

Write to the HL7 FHIR Zulip, stream `german/mi-initiative`
(<https://chat.fhir.org>), naming the page and the wording — or open an issue on
the repository this guide is built from. Corrections go through the same
pull-request review as any other change; the step-by-step is in the repository's
`docs/recipes/add-translation.md`.

> The repository's issue tracker is deliberately not linked here. This guide is
> a prototype whose GitHub organisation is not settled, so a hard-coded issues
> URL would 404 for readers of a build made before the move. Zulip is stable
> either way.

> **Scope of this guide:** it is the *preview* of the MII IG template
> (`de.medizininformatikinitiative.template`), not an MII Core Dataset module.
> It exists so the branding can be reviewed in both languages before a template
> release. A module IG carries its own translation-information page.
