// Minimal self-test resource (build mechanics only — NOT an MII artifact).
//
// The IG Publisher cannot assemble an installable package for an IG that has zero
// conformance resources (it fails with "Error generating combined package"), so
// the self-test ships exactly ONE minimal resource. A Logical Model is used on
// purpose: it needs no terminology server and carries no coded content, so the
// self-test builds cleanly on the tx.fhir.org fallback, and it is clearly a
// structural placeholder rather than fake clinical data or terminology. It is
// never published. A real module replaces it with its own profiles/value sets.
Logical: SelfTestModel
Id: selftest-model
Title: "Self-Test Model"
Description: "Minimal logical model that exists only so the template self-test IG builds and its artifact layout renders; not an MII artifact."
* placeholder 0..1 string "A single placeholder element."
