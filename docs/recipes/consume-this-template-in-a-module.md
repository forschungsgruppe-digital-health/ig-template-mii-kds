# Recipe: consume this template in a module IG

**Goal.** Make a module IG render with this MII template.

**Prerequisites.** A module IG project (e.g. one created from
[`mii-kds-module-template`](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template)).

There are two ways to reference the template. Today only **vendored** works: the
package `de.medizininformatikinitiative.template` is not resolvable from a FHIR
package registry. A GitHub release is not the trigger — this repository already
cuts releases, but the IG Publisher cannot fetch a template it cannot resolve.
Switch to **published** when that changes; see [open tasks](../open-tasks.md).

## Steps

### A. Vendored — the working variant today

1. Copy this template's content (`package/`, `includes/`, `content/` and
   `translations/` — the German UI-string catalogs the pinned base lacks) into
   an `ig-template/` folder in the module repo.
2. In the module's `ig.ini`, set `template = #ig-template` (the leading `#` makes it
   a **local folder**, not a package id).
3. Build as usual.

### B. Published — once the package is on a registry

1. In the module's `ig.ini`, set:
   `template = de.medizininformatikinitiative.template#<version>` — any version
   from the [releases page](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/releases).
   > **Why a pinned version, not `#current`:** reproducible builds — the same input
   > always produces the same rendered guide.
2. Delete `ig-template/` — the module scaffold ships a recipe for exactly that
   switch (`switch-template-to-published.md`).
3. Rebuild the module (`sushi . && java -Xmx6g -jar publisher.jar -ig ig.ini`;
   step 6 of the [dev-container recipe](first-build-in-devcontainer.md) shows
   how to obtain `publisher.jar`). To adopt a newer template release later, bump
   the version and rebuild.

## Expected result

The module IG renders with the MII header, footer, colours and logo.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| "template not found" | Published version not on a registry yet | Use the vendored option (A) until this template is published |
| Bare `template = ig-template` read as a package | Missing leading `#` | Use `template = #ig-template` for a local folder |
| Branding not applied | Wrong template line or a stale build cache | Fix `ig.ini`; delete `output/`/`template/` and rebuild |
