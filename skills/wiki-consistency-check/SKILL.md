---
name: wiki-consistency-check
description: >-
  The convention checker used by this template project — it compares a
  repository against the MII meta wiki (kerndatensatz-meta/wiki, authoritative)
  — naming conventions, terminology policy, reusable validation workflows, dev
  container, release/versioning, language, folder structure — and against the
  metadata conventions these templates adopt (packageId, id, name, title,
  canonical, version scheme, no floating dependency pins). Intended for these
  two template repositories and for module repositories that choose to use the
  scaffold; it is not an MII compliance tool. Report-only: it never merges
  anything; fixes it proposes go through a pull request targeting dev.
license: CC-BY-4.0
---

# wiki-consistency-check (repository ↔ MII meta wiki + metadata conventions)

**This is the single convention checker for the project.** The wiki-drift
check and the metadata checks live in ONE checker — do not build a second
linter next to it.

> **Why one checker:** two overlapping linters drift apart and confuse a
> maintainer about which is authoritative. One check run, one source of truth,
> covering both wiki drift and the metadata conventions.

Adapted from the skill of the same name in the MII KDS sample IG
([`mii-kds-sample-ig-inoffiziell`](https://github.com/forschungsgruppe-digital-health/mii-kds-sample-ig-inoffiziell),
CC-BY-4.0), generalized for the template repositories and module IGs.

## When to activate

- Before a release of this repository, or periodically, to catch drift against
  the authoritative MII meta wiki early.
- On demand, when a maintainer asks whether the repo still matches the MII
  conventions.

> **Run it by hand here.** This repository has **no** mechanical convention-check
> CI job. The checker that automates the hard assertions
> (`scripts/convention-check.mjs` and its workflow) lives in
> `mii-kds-module-template`, where a module's substituted `sushi-config.yaml`
> gives it something to assert against. In this repository the assertions are
> evaluated and reported by whoever runs the skill.

## Two check classes

1. **Hard assertions — the metadata conventions.** A small, fixed set of
   metadata rules (see the clearly marked section in
   [`references/check-matrix.md`](references/check-matrix.md)). A violation is
   a **failure** — non-zero exit where the mechanical checker runs (the module
   scaffold), a reported failed assertion here. The matrix states per assertion
   whether it applies to **template repositories** or to **module IGs**, and
   whether it restates a wiki rule or is this project's own preference — only
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
4. **Report.** Output a table: area · repo state · expected (wiki/convention) ·
   `OK`/`DEVIATION`/`UNCLEAR` · recommendation. Where the checker runs in CI,
   the table goes into the job summary and hard-assertion failures fail the job;
   advisory findings never do. Here the run is manual, so report the failures in
   the run's output and block the release on them.
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
  check points (repo file ↔ wiki page) and the hard metadata conventions.
