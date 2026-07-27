# Recipe: consume this template in a module IG

**Goal.** Make a module IG render with this MII template.

**Prerequisites.** A module IG project (e.g. one created from
[`mii-kds-module-template`](https://github.com/medizininformatik-initiative/mii-kds-module-template)).

There are two ways to reference the template. Use **published** once this template
has a release; use **vendored** during bring-up before that.

## Steps

Pick the variant that matches where the template stands today.

### A. Published (the normal case)

1. In the module's `ig.ini`, set:
   `template = de.medizininformatikinitiative.template#<version>` (e.g. `#0.1.0`).
   > **Why a pinned version, not `#current`:** reproducible builds — the same input
   > always produces the same rendered guide.
2. Rebuild the module (`sushi . && java -Xmx6g -jar publisher.jar -ig ig.ini`;
   step 6 of the [dev-container recipe](first-build-in-devcontainer.md) shows
   how to obtain `publisher.jar`).
3. To adopt a newer template release later, bump the version and rebuild.

### B. Vendored (bring-up, before this template is published)

1. Copy this template's content (`package/`, `includes/`, `content/` and
   `translations/` — the German UI-string catalogs the pinned base lacks) into
   an `ig-template/` folder in the module repo.
2. In the module's `ig.ini`, set `template = #ig-template` (the leading `#` makes it
   a **local folder**, not a package id).
3. Build as usual. When this template gets published, switch to option A and delete
   `ig-template/` — the module scaffold ships a recipe for exactly that switch
   (`switch-template-to-published.md`).

## Expected result

The module IG renders with the MII header, footer, colours and logo.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| "template not found" | Published version not on a registry yet | Use the vendored option (B) until this template is released |
| Bare `template = ig-template` read as a package | Missing leading `#` | Use `template = #ig-template` for a local folder |
| Branding not applied | Wrong template line or a stale build cache | Fix `ig.ini`; delete `output/`/`template/` and rebuild |
