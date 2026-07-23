This page exists solely for the **self-test** of the
`de.medizininformatikinitiative.template` IG template. It is **not** an MII Core
Dataset module.

The self-test builds the template standalone so that branding changes (header,
footer, CSS, logo) can be reviewed in a rendered IG before a template version is
released. The build renders in German (the default language) and English, to
check the language-aware header and footer.

What the template is and how a module uses it is described in the repository's
`README.md`.

### Target-audience boxes (highlight-colour demo)

The template ships reusable CSS classes for the "who is this for?" boxes (classes
`mii-audience mii-audience-implementers` / `mii-audience-researchers`). A module
uses them on its home page:

<div class="mii-audience mii-audience-implementers">
<h5>Implementers</h5>
<p>Data Integration Centers (DIC), software developers and system architects implementing FHIR-based solutions.</p>
</div>

<div class="mii-audience mii-audience-researchers">
<h5>Researchers</h5>
<p>Scientists using MII data for medical research.</p>
</div>

### Artifacts

The included [Self-Test Palette](CodeSystem-selftest-palette.html) CodeSystem
exists only so that a real artifact page is produced.
