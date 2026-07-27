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
| `ig-preview.yml` | push to any branch except `main`/`gh-pages`; `workflow_dispatch` | Builds the **preview IG** (SUSHI + IG Publisher) and deploys a preview | `gh-pages/branches/<branch>/` + PR comment with the URL | `ENABLE_PREVIEW` (ON) | no |
| `cleanup-gh-pages.yml` | schedule (Sun 00:00 UTC); `workflow_dispatch` | Removes previews whose branch was deleted; preserves the root + version paths | pruned `gh-pages` | `ENABLE_PREVIEW` (ON) | no |
| `release-please.yml` | push to `main` | Opens/updates the release PR; on merge cuts the SemVer tag + GitHub Release + changelog | tag `vX.Y.Z`, release | `ENABLE_RELEASE_PLEASE` (ON) | the release PR is a human merge |
| `notify-zulip.yml` | `release: published` | Announces the release to the MII Zulip (`MII-Kerndatensatz`, topic *Template Releases*); public FHIR Zulip only if opted in | Zulip message | `ENABLE_ZULIP_ANNOUNCE` (ON) · `ANNOUNCE_PUBLIC_ZULIP` (OFF) | public channel needs a human flag + key |
| `dependency-check.yml` | schedule (Mon 06:00 UTC); `workflow_dispatch` | Runs the `scripts/` unit tests, then compares pinned versions (IG Publisher, SUSHI, Jekyll, base template, FHIR deps) to upstream | one continuously-updated `dependencies` tracking issue + a `drift-report` artifact | `ENABLE_DEPENDENCY_CHECK` (ON) | proposals only; never opens or merges a PR |
| `security-scan.yml` | schedule (Mon 07:00 UTC); PR to `dev`; `workflow_dispatch` | OSV + Trivy (fs + dev-container image); plus the `language-model` job (`scripts/check-language-model.sh`) and the `tooling-tests` job (`node --test` on the `scripts/*.test.mjs` suites) | SARIF in the Security tab; red job on language-model drift or a failing script test | `ENABLE_SECURITY_SCAN` (ON) — `language-model` and `tooling-tests` are not gated | no |

Notes:
- **Dependabot** (`.github/dependabot.yml`) is not a job you gate with `if:` — it is
  switched by its config presence and the repo's Dependabot setting.
- **Terminology** is not an on/off pipeline: `ig-preview.yml` auto-selects
  **SU-TermServ** when the client-cert secrets are present, else falls back to HL7
  `tx.fhir.org` with a notice (see [maintenance.md](maintenance.md)). "Present"
  means **all three** `SU_TERMSERV_CLIENT_*` secrets; a partial set falls back
  too, which `scripts/terminology-fallback.test.mjs` keeps true.
- Each workflow file starts with a comment block (purpose · triggers · toggle ·
  gated steps) so the explanation lives next to the code.
- **The `language-model` job** is content hygiene, not a scanner:
  `scripts/check-language-model.sh` fails the pull request when a file re-asserts
  the abandoned language model (the script lists the exact phrases). The IG is
  English-default with a German translation under `input/translations/de/` —
  see [add-translation.md](recipes/add-translation.md). The job lives in
  `security-scan.yml` because that is the only pull-request-triggered workflow.
- **The `tooling-tests` job** runs the repository's script tests
  (`check-updates.test.mjs`, `terminology-fallback.test.mjs` and
  `narrative-table-styles.test.mjs`, offline, no `npm install`). It rides in `security-scan.yml` for the same reason as the
  language-model guard. `dependency-check.yml` runs the same suites as a
  pre-flight, so the weekly check fails loudly instead of filing a garbled
  tracking issue. Both list the files by name rather than globbing
  `scripts/*.test.mjs`, so a new suite reaches CI only when someone adds it.

## 3. Release

This repository is **tooling**, so it uses **SemVer** via Release Please, running on
`main`:

1. Conventional Commits accumulate on `dev`, then land on `main` via a merge commit.
2. Release Please opens a release PR (version bump in `package/package.json`,
   `sushi-config.yaml` and `package-list.json`, changelog). A human merges it.
3. Merging cuts the tag + GitHub Release; `notify-zulip.yml` announces it.
4. Production publication (if any) stays a manual, gated step — never automatic.

### How a module consumes this template

**Once the package is published**, a module picks up a release by bumping the
pinned version in its `ig.ini` (or `sushi-config.yaml` dependency), e.g.
`template = de.medizininformatikinitiative.template#0.2.0`, then rebuilding. See
[recipes/consume-this-template-in-a-module.md](recipes/consume-this-template-in-a-module.md).

**It is not published yet** ([open-tasks.md](open-tasks.md)), so no module pins a
release today. Modules vendor this repository's `dev` branch instead:

- `mii-kds-module-template` copies `package/`, `includes/`, `content/` and
  `translations/` from `ig-template-mii-kds@dev` into its own `ig-template/`
  folder, and its `ig.ini` points at that folder.
- Its `sync-ig-template.yml` re-vendors on a schedule (Mondays 05:00 UTC) and
  opens a **reviewable** pull request — it never auto-merges.
- The same workflow runs `sync-ig-template.sh --check --ref dev` on every module
  pull request into `dev`, so a module PR opened after a merge into `dev` here
  fails that check until the sync PR lands.

**So `dev` is a consumer-visible surface, not an internal branch.** Work in
progress that has passed CI and review belongs there; a known-broken state does
not, because the next sync ships it to every repository created from the
scaffold. A module cannot pin its way out: the module template's workflow
hardcodes `--ref dev` in both jobs. The two
things that do stop the sync — setting the module's `ENABLE_TEMPLATE_SYNC`
variable to `false`, or editing those two lines — contradict that repo's stated
intent ("the module IG must always build against the CURRENT MII IG template"),
so if either is ever wanted it belongs in the module template's docs, not here.

## Secrets & enabling the gated features

All builds and releases work without secrets. To enable the optional gated
features — SU-TermServ terminology and the Zulip release announcement — see
[docs/secrets.md](secrets.md) for the exact `gh secret set` commands. The
workflows are already wired; adding the secret is the only step.
