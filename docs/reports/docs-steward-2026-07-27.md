# docs-steward — 2026-07-27

First run of [`skills/docs-steward`](../../skills/docs-steward/SKILL.md) against
this repository. Report mode; the repository was not modified during the run.
The fixes listed under *Fixed* were applied afterwards, in separate commits.

## Scope

**Purpose the run was measured against:** an HL7 IG-Publisher template package
that gives MII Kerndatensatz module Implementation Guides one shared
presentation, derived from `fhir2.base.template` pinned at `0.1.0`. You do not
author an IG here; a module references it.

**Documentation surface:** seven root files; `docs/` (10 top-level files,
`recipes/` with an index, `reports/`); `scripts/README.md`;
`translations/README.md`; three `SKILL.md`; three issue forms; and the long-form
header comments in `sushi-config.yaml`, `ig.ini`, `mii.css`, `includes/*.html`
and the workflow files, which function as documentation and were audited as
such.

**Treated as read-only:** `translations/*.po` (vendored from
`HL7/ig-template-base2`; adding comment lines to one aborts the build),
`CHANGELOG.md` and the release manifest (Release Please owns them), the existing
dated report, the skills symlinks.

**Exported surface** — this repository is the *source* of the vendoring
relationship: the module scaffold copies `package/`, `includes/`, `content/` and
`translations/` out of it. Four findings changed shape because of that: a file
copied into another repository must stay self-contained, and an assertion inside
one must still make sense to a reader who has never seen this repository.

**Steps that returned nothing, and why:** step 4 (assistant residue), step 5
(personal data and overclaimed authority) and step 8 (hedge words, undefined
terms) found nothing. That is not evidence they are ineffective — the branch
under audit was a 24-commit documentation cleanup that had just addressed those
categories directly.

**Not exercised at all:** step 12 (writing this report) and step 13 (offering to
open tracked issues) did not run, because the run was read-only and
non-interactive. They remain untested.

## Fixed

| Finding | File |
| --- | --- |
| The design of record claimed the template does **not** render the HL7 FHIR family logo; it does, and has since `178fca6`. Its advice was also backwards — overriding the header fragment replaces it wholesale, so a module following it would have removed both logos | `docs/design.md` §4 |
| The review procedure told a reviewer to set a bare path as the `ig.ini` template value — the form this repository documents as the failure mode in three other places | `docs/design.md` §8 |
| The script index described the table-styles guard as holding the CSS to the class-only scope, which is the unsafe selector the guard exists to forbid | `scripts/README.md` |
| "The preview carries no conformance resources" — it carries one, `preview-model`, and that resource is load-bearing | `sushi-config.yaml` |
| Three places named two script test suites; three run | `docs/workflows.md`, `.github/workflows/security-scan.yml` |
| The release recipe named two of the three files Release Please bumps | `docs/recipes/cut-a-template-release.md` |
| Six "confirmed by the maintainer, 2026-07-24" banners; four sat in files copied into every module repository, where they are unresolvable | `includes/*`, `content/assets/css/mii.css`, `docs/design.md` |
| The CC-BY attribution URL for two skills, and one evidence row, pointed at a repository that returns 404 | `skills/*/SKILL.md`, `docs/design.md` |
| "The convention check enforces these" — nothing here does | `docs/further-reading.md` |
| The only index omitted three docs and every governance file | `README.md` |
| A pull-request body format was mandated with no template to carry it | `.github/pull_request_template.md` (added) |
| The glossary omitted MII, Kerndatensatz/KDS and CDS — terms the README's first line uses | `docs/glossary.md` |

## Declined

Recorded so a later run does not raise them again.

- **Two findings were already recorded decisions.** The README preview URL is
  covered verbatim by `docs/project-status.md`; re-reporting it would have
  re-raised something already written down.
- **Two quoted their evidence correctly and inferred the opposite of the
  page.** Both fell apart on reading the surrounding sentence — evidence and
  inference fail separately.
- **One counted wrongly** — "five copies each carrying a deletion rule" was
  four, and one cited location carried no such rule.
- **One over-reached on trimming.** Deleting the accepted-CA list from
  `docs/secrets.md` would have removed a caveat, which the language step
  forbids: two steps of the skill pulling against each other, adjudicated here.
- **Four duplicate pairs were merged** rather than reported twice at two
  different severities.

## Needs a human — resolved during this run

- **A private address in one commit message on `main`.** Removing it would mean
  rewriting seven commits, force-pushing two protected branches and
  invalidating the `v0.3.0` tag and release — and would still not remove it,
  because a force-push leaves the old commit reachable by URL until the forge
  purges unreferenced objects on request. Decided: leave it, and prevent
  recurrence at the identity level. Recorded in
  [`docs/open-tasks.md`](../open-tasks.md).

## Could not verify

- **A claim spanning both repositories** — "14 markdown tables and 34 generated,
  across both built sites" in `docs/design.md` §7a. The half derivable here was
  re-derived and holds; the sibling repository's half was not reachable from
  this run. Reported as partially verified rather than called wrong on partial
  evidence.
- **The base template's CSS was read from `main`, not from the pinned `0.1.0`
  package**, which could not be extracted offline. The finding it supports does
  not depend on the difference, but the citation is weaker than it looks.

## What the run said about the skill

The run returned fifteen defects in `docs-steward` itself, five of which would
have produced wrong output — most seriously, an instruction to trust the forge's
community-profile API, which reports `issue_template: null` for a
`.github/ISSUE_TEMPLATE/` *directory* and would have filed "missing issue
templates" against a repository that ships four. All fifteen are fixed in the
skill as it now stands.
