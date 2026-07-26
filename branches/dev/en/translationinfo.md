# Translation information - MII KDS IG Template — Preview v0.2.0

* [**Table of Contents**](toc.md)
* **Translation information**

## Translation information

This guide is authored in **English**, the IG's default language, and rendered additionally in **German** under `/de/`. Switch languages with the selector in the navigation bar.

The German rendering is written by hand in this repository — it is not a machine translation:

| | |
| :--- | :--- |
| Narrative pages | `input/translations/de/pagecontent/`— one file per source page, same file name |
| Navigation menu | `input/translations/de/includes/menu.xml` |
| The template's own UI strings (footer, table headers, buttons) | `translations/stringsBase-de.po`and`stringsArtifacts-de.po`— the base template's German catalogs, vendored here because the pinned base release ships none |

A page that has no German counterpart is rendered in English on `/de/`, with a notice at the top of the page saying so.

### Feedback on a translation

Open an issue at [https://github.com/medizininformatik-initiative/ig-template-mii-kds/issues](https://github.com/medizininformatik-initiative/ig-template-mii-kds/issues), naming the page and the wording. Corrections go through the same pull-request review as any other change; the step-by-step is in the repository's `docs/recipes/add-translation.md`.

> **Scope of this guide:** it is the **preview** of the MII IG template (`de.medizininformatikinitiative.template`), not an MII Core Dataset module. It exists so the branding can be reviewed in both languages before a template release. A module IG carries its own translation-information page.

