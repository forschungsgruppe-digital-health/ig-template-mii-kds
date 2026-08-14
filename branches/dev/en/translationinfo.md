# Translation information - MII KDS IG Template — Preview v1.2.0

* [**Table of Contents**](toc.md)
* **Translation information**

## Translation information

This guide is authored in **English**, the IG's default language, and rendered additionally in **German** under `/de/`. Switch languages with the selector in the navigation bar.

The German rendering is written by hand in this repository — it is not a machine translation:

| | |
| :--- | :--- |
| Narrative pages | [`input/translations/de/pagecontent/`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/tree/main/input/translations/de/pagecontent)— one file per source page, same file name |
| Navigation menu | [`input/translations/de/includes/menu.xml`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/input/translations/de/includes/menu.xml) |
| The template's own UI strings (footer, table headers, buttons) | [`translations/stringsBase-de.po`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/translations/stringsBase-de.po)and[`stringsArtifacts-de.po`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/translations/stringsArtifacts-de.po)— the base template's German catalogs, vendored here because the pinned base release ships none |

A page that has no German counterpart is rendered in English on `/de/`, with a notice at the top of the page saying so.

### Feedback on a translation

Write to the HL7 FHIR Zulip, stream `german/mi-initiative` ([https://chat.fhir.org](https://chat.fhir.org)), naming the page and the wording — or open an issue on the repository this guide is built from. Corrections go through the same pull-request review as any other change; the step-by-step is in the repository's [`docs/recipes/add-translation.md`](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/blob/main/docs/recipes/add-translation.md).

> The repository's issue tracker is deliberately not linked with a fixed URL: a built guide outlives repository moves — such as the move to the MII's GitHub organisation, `medizininformatik-initiative` — and a URL burned into an older build would go stale. Open the issue on the repository this guide was built from; Zulip is reachable regardless. The **file links** on this page do carry a repository URL — it comes from one substitution point, `input/data/repo.json`, which the migration checklist repoints in a single edit; links in builds published before the move keep resolving through GitHub's repository redirect.

> **Scope of this guide:** it is the **preview** of the MII IG template (`de.medizininformatikinitiative.template`), not an MII Core Dataset module. It exists so the branding can be reviewed in both languages before a template release. A module IG carries its own translation-information page.

