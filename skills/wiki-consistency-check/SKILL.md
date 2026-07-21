---
name: wiki-consistency-check
description: >-
  THE single convention checker for the MII KDS template repositories and the
  module IGs built from them. Checks a repository against the MII meta wiki
  (kerndatensatz-meta/wiki) — naming conventions, terminology policy, reusable
  validation workflows, dev container, release/versioning, language, folder
  structure — AND enforces the hard module-metadata contract (packageId, id,
  name, title, canonical, version scheme, no floating dependency pins).
  Report-only: it never merges anything; fixes it proposes go through a pull
  request targeting dev.
license: CC-BY-4.0
---

# wiki-consistency-check (repository ↔ MII meta wiki + metadata contract)

**This is the single convention checker for the project.** The wiki-drift
check and the module-metadata contract live in ONE checker — do not build a
second linter next to it.

> **Why one checker:** two overlapping linters drift apart and confuse a
> maintainer about which is authoritative. One check run, one source of truth,
> covering both wiki drift and the metadata contract.

Adapted from the skill of the same name in the FGDH sample IG
([`mii-kds-sample-ig-inoffiziell`](https://github.com/forschungsgruppe-digital-health/mii-kds-sample-ig-inoffiziell),
CC-BY-4.0), generalized for the template repositories and module IGs.

## When to activate

- Before a release of this repository, or periodically, to catch drift against
  the authoritative MII meta wiki early.
- As the repository's convention-check CI job (one job covers both check
  classes).
- On demand, when a maintainer asks whether the repo still matches the MII
  conventions.

## Two check classes

1. **Hard assertions — the module-metadata contract.** A small, fixed set of
   metadata rules (see the clearly marked section in
   [`references/check-matrix.md`](references/check-matrix.md)). A violation is
   a **failure** (in CI: non-zero exit). The matrix states per assertion
   whether it applies to **template repositories** or to **module IGs** — only
   the template-relevant subset applies to this repository.
2. **Advisory wiki-drift findings.** Everything compared against the current
   wiki text. Deviations are **reported, not failed** (soft-fail): the wiki
   can change at any time, so a human decides whether the repo or the
   expectation must move.

## Source of truth

[MII meta wiki](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki)
— clone it locally for a check run:

```bash
git clone https://github.com/medizininformatik-initiative/kerndatensatz-meta.wiki.git
```

The pages to read per check area are listed in
[`references/check-matrix.md`](references/check-matrix.md). The current online
version of the wiki is always authoritative; do not check against cached or
remembered wiki content.

## Procedure

1. **Fetch the wiki.** Clone (or fetch) the wiki and read the pages named in
   the check matrix.
2. **Run the hard assertions.** Evaluate every metadata assertion that applies
   to this repository type (template repo vs. module). Record pass/fail with
   the exact observed value.
3. **Compare the advisory areas.** For each check area, compare the repo
   artifact against the wiki statement (list in
   [`references/check-matrix.md`](references/check-matrix.md)).
4. **Report.** Output a table: area · repo state · expected (wiki/contract) ·
   `OK`/`DEVIATION`/`UNCLEAR` · recommendation. In CI, put the table into the
   job summary/log. Hard-assertion failures make the run fail; advisory
   findings do not.
5. **Never change anything on its own.** Report and propose only. Corrections
   are made by humans, or after explicit approval — and always as a pull
   request **targeting `dev`** (never `main`, never an auto-merge).

## Limits

- Wiki content changes; the current online version is always authoritative.
- The check covers structure, metadata, and conventions — not the clinical or
  domain content of profiles.
- `UNCLEAR` means the wiki statement and the repo artifact could not be
  compared mechanically; escalate to a human instead of guessing.

## References

- [`references/check-matrix.md`](references/check-matrix.md) — the concrete
  check points (repo file ↔ wiki page) and the hard module-metadata contract.
