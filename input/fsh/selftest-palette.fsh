// Minimal self-test artifact.
//
// A local CodeSystem with two concepts. It carries no MII meaning and is never
// published — it exists ONLY so the self-test IG has one real conformance
// resource to render. Its generated page exercises the template's artifact
// layout, header, footer and CSS. A CodeSystem with inline codes is used on
// purpose: it validates without any external terminology server, so the
// self-test builds cleanly on the tx.fhir.org fallback (§2.10).
CodeSystem: SelfTestPalette
Id: selftest-palette
Title: "Self-Test Palette"
Description: "Two arbitrary codes so the self-test IG renders a CodeSystem page; not an MII artifact."
* ^status = #draft
* ^experimental = true
* ^caseSensitive = true
* ^content = #complete
* #primary "Primary" "Stands in for the template's primary brand colour slot."
* #accent  "Accent"  "Stands in for the template's accent colour slot."
