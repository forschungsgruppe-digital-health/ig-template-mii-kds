// Minimal self-test artifact.
//
// A local CodeSystem with two concepts. It carries no MII meaning and is never
// published — it exists ONLY so the self-test IG has one real conformance
// resource to render. Its generated page exercises the template's artifact
// layout, header, footer and CSS. A CodeSystem with inline codes is used on
// purpose: it validates without any external terminology server, so the
// self-test builds cleanly on the tx.fhir.org fallback (§2.10).
//
// Multi-language (§3.4): the human-readable text below is authored in GERMAN,
// the default IG language. Its English rendering is supplied by the translation
// supplement input/translations/en/CodeSystem-selftest-palette.po. A CodeSystem
// is chosen deliberately: the IG Publisher renders translation supplements for
// StructureDefinition, CodeSystem and Questionnaire, so this artifact is one the
// toolchain actually translates (see skills/ig-translate and
// docs/recipes/add-translation.md). The code values (#primary, #accent) are FHIR
// identifiers and stay unchanged in every language.
CodeSystem: SelfTestPalette
Id: selftest-palette
Title: "Selbsttest-Palette"
Description: "Zwei beliebige Codes, damit die Selbsttest-IG eine CodeSystem-Seite rendert; kein MII-Artefakt."
* ^status = #draft
* ^experimental = true
* ^caseSensitive = true
* ^content = #complete
* #primary "Primärfarbe" "Platzhalter für den Steckplatz der primären Markenfarbe der Vorlage."
* #accent  "Akzentfarbe" "Platzhalter für den Steckplatz der Akzentfarbe der Vorlage."
