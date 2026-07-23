# How this repository operates

One page a newcomer can read in a sitting to understand how **this** repo builds,
previews and releases. Details live in the linked docs; this is the map.

## 1. Branching

The full model with a diagram is in [CONTRIBUTING.md](../CONTRIBUTING.md). In short:

- **`main`** — stable, released, the default branch. Protected; changes arrive only
  by a `dev → main` **merge commit** (never a squash).
- **`dev`** — integration branch where reviewed changes accumulate; CI previews run
  here.
- **`feature|change|fix/*`** — short-lived branches off `dev`, one change each,
  squash-merged back into `dev`.

> **Why `dev → main` is a merge commit, not a squash:** Release Please builds the
> changelog from the individual Conventional Commits; squashing would collapse them
> to one line.

## 2. CI & automation — every workflow

Every workflow has an on/off switch: a repo **variable** `vars.ENABLE_*`. Unset =
the default in the table. A disabled workflow still triggers but its jobs **skip**
(shown as "skipped" — that is expected, not a failure).

| Workflow | Trigger | What it does | Output | Toggle (default) | Human-gated? |
| --- | --- | --- | --- | --- | --- |
| `ig-preview.yml` | push to any branch except `main`/`gh-pages`; `workflow_dispatch` | Builds the **self-test IG** (SUSHI + IG Publisher) and deploys a preview | `gh-pages/branches/<branch>/` + PR comment with the URL | `ENABLE_PREVIEW` (ON) | no |
| `cleanup-gh-pages.yml` | schedule (Sun 00:00 UTC); `workflow_dispatch` | Removes previews whose branch was deleted; preserves the root + version paths | pruned `gh-pages` | `ENABLE_PREVIEW` (ON) | no |
| `release-please.yml` | push to `main` | Opens/updates the release PR; on merge cuts the SemVer tag + GitHub Release + changelog | tag `vX.Y.Z`, release | `ENABLE_RELEASE_PLEASE` (ON) | the release PR is a human merge |
| `notify-zulip.yml` | `release: published` | Announces the release to the MII Zulip (`MII-Kerndatensatz`, topic *Template Releases*); public FHIR Zulip only if opted in | Zulip message | `ENABLE_ZULIP_ANNOUNCE` (ON) · `ANNOUNCE_PUBLIC_ZULIP` (OFF) | public channel needs a human flag + key |
| `dependency-check.yml` | schedule (Mon 06:00 UTC); `workflow_dispatch` | Compares pinned versions (IG Publisher, SUSHI, Jekyll, base template, FHIR deps) to upstream; opens a tracking issue/PR | `dependencies` issue/PR | `ENABLE_DEPENDENCY_CHECK` (ON) | proposals only; never auto-merges |
| `security-scan.yml` | schedule (Mon 07:00 UTC); PR to `dev`; `workflow_dispatch` | OSV + Trivy (fs + dev-container image) | SARIF in the Security tab | `ENABLE_SECURITY_SCAN` (ON) | no |

Notes:
- **Dependabot** (`.github/dependabot.yml`) is not a job you gate with `if:` — it is
  switched by its config presence and the repo's Dependabot setting.
- **Terminology** is not an on/off pipeline: `ig-preview.yml` auto-selects
  **SU-TermServ** when the client-cert secrets are present, else falls back to HL7
  `tx.fhir.org` with a notice (see §2.10 of the build spec and
  [MAINTENANCE.md](MAINTENANCE.md)).
- Each workflow file starts with a comment block (purpose · triggers · toggle ·
  gated steps) so the explanation lives next to the code.

## 3. Release

This repository is **tooling**, so it uses **SemVer** via Release Please, running on
`main`:

1. Conventional Commits accumulate on `dev`, then land on `main` via a merge commit.
2. Release Please opens a release PR (version bump in `package/package.json` +
   `package-list.json`, changelog). A human merges it.
3. Merging cuts the tag + GitHub Release; `notify-zulip.yml` announces it.
4. Production publication (if any) stays a manual, gated step — never automatic.

**How a module picks up a template release:** in the module's `ig.ini` (or
`sushi-config.yaml` dependency), bump the pinned version, e.g.
`template = de.medizininformatikinitiative.template#0.2.0`, then rebuild. See
[recipes/consume-this-template-in-a-module.md](recipes/consume-this-template-in-a-module.md).

> **Why one page:** the operational knowledge would otherwise be scattered across
> `CONTRIBUTING.md`, `MAINTENANCE.md` and six workflow files. Post-2026 a new
> maintainer needs one place that says "this is how this repo builds, previews and
> releases."
