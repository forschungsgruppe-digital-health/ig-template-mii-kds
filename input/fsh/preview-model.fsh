// Minimal preview resource (build mechanics only — NOT an MII artifact).
//
// The IG Publisher cannot assemble an installable package for an IG that has zero
// conformance resources (it fails with "Error generating combined package"), so
// the preview ships exactly ONE minimal resource. A Logical Model is used on
// purpose: it needs no terminology server and carries no coded content, so the
// preview builds cleanly on the tx.fhir.org fallback, and it is clearly a
// structural placeholder rather than fake clinical data or terminology. It is
// never published. A real module replaces it with its own profiles/value sets.
Logical: PreviewModel
Id: preview-model
Title: "Preview Model"
Description: "Minimal logical model that exists only so the template preview IG builds and its artifact layout renders; not an MII artifact."
* placeholder 0..1 string "A single placeholder element."
