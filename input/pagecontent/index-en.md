<!--
  Future-proof English translation of the German source page index.md.

  Narrative-page translation uses the sibling-file convention
  input/pagecontent/<name>-<lang>.md (NOT input/translations/en, which is only
  for resource supplements). Per the rendering table in skills/ig-translate, the
  current IG Publisher + fhir2.base.template do NOT yet consume these siblings:
  the /en/ page tree still shows this page's German source with the base note
  "There is no translation page available ...". The file is kept in the correct
  scheme so it renders automatically once the toolchain implements page
  translation. See docs/recipes/add-translation.md.
-->
This page exists solely for the **self-test** of the
`de.medizininformatikinitiative.template` IG template. It is **not** an MII Core
Dataset module.

The self-test builds the template standalone so that branding changes (header,
footer, CSS, logo) can be reviewed in a rendered IG before a template version is
released. The build renders in German (the default language) and English, to
check the language-aware header and footer.

What the template is and how a module uses it is described in the repository's
`README.md`.

### Artifacts

The included [Self-Test Palette](CodeSystem-selftest-palette.html) CodeSystem
exists only so that a real artifact page is produced.
