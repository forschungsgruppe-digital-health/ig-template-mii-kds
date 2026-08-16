# How this repository operates

One page a newcomer can read in a sitting to understand how **this** repo builds,
previews and releases. Details live in the linked docs; this is the map.

## 1. Branching

The full model with a diagram is in [CONTRIBUTING.md](../CONTRIBUTING.md). In short:

- **`main`** — stable, released, the default branch. Protected; changes are meant
  to arrive only by a `dev → main` **merge commit** (never a squash). Release
  Please's own release commits are cut on `main`, and a few other changes have
  landed there directly — see
  [project-status.md](project-status.md#branch-state--main-and-dev-are-reconciled)
  for the current state and the back-merge rule.
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
| `ig-preview.yml` | push to any branch except `main`/`gh-pages`/`fsh-generated`; `workflow_dispatch` | Builds the **preview IG** (SUSHI + IG Publisher) and deploys a preview | `gh-pages/branches/<branch>/` + PR comment with the URL | `ENABLE_PREVIEW` (ON) | no |
| `release-demo.yml` | `release: published`; `workflow_dispatch` (inputs `tag`, `update_landing_page`) | Rebuilds the demo IG **from the released tag** with the same pinned toolchain, verifies the render carries that version, publishes it, and repoints the Pages landing page at it | `gh-pages/demo/<tag>/` + a conservatively rewritten `gh-pages/index.html` | `ENABLE_RELEASE_DEMO` (ON) | reacts only to a release a human published |
| `cleanup-gh-pages.yml` | schedule (Sun 00:00 UTC); `workflow_dispatch` | Removes previews whose branch was deleted; preserves the root + version paths | pruned `gh-pages` | `ENABLE_PREVIEW` (ON) | no |
| `release-please.yml` | push to `main` | Opens/updates the release PR; on merge cuts the SemVer tag + GitHub Release + changelog | tag `vX.Y.Z`, release | `ENABLE_RELEASE_PLEASE` (ON) | the release PR is a human merge |
| `notify-zulip.yml` | `release: published` | Announces the release to the MII Zulip (`MII-Kerndatensatz`, topic *Template Releases*); public FHIR Zulip only if opted in | Zulip message | `ENABLE_ZULIP_ANNOUNCE` (ON) · `ANNOUNCE_PUBLIC_ZULIP` (OFF) | public channel needs a human flag + key |
| `dependency-check.yml` | schedule (Mon 06:00 UTC); `workflow_dispatch` | Runs the `scripts/` unit tests, then compares pinned versions (IG Publisher, SUSHI, Jekyll, base template, FHIR deps) to upstream | one continuously-updated `dependencies` tracking issue + a `drift-report` artifact | `ENABLE_DEPENDENCY_CHECK` (ON) | proposals only; never opens or merges a PR |
| `security-scan.yml` | schedule (Mon 07:00 UTC); PR to `dev`; `workflow_dispatch` | OSV + Trivy (fs + dev-container image); plus the `language-model` job (`scripts/check-language-model.sh`) and the `tooling-tests` job (`node --test` on the `scripts/*.test.mjs` suites) | SARIF in the Security tab; red job on language-model drift or a failing script test | `ENABLE_SECURITY_SCAN` (ON) — `language-model` and `tooling-tests` are not gated | no |

> **How it is triggered.** Not by a `release` event: release-please publishes the
> release with the default `GITHUB_TOKEN`, and GitHub suppresses workflow triggers
> raised by that token, so a release trigger would never fire and the demo would
> keep serving the previous release. `release-please.yml` calls this workflow
> directly in the run that created the release; `workflow_dispatch` re-renders a
> given tag by hand.

> **One manual setting is required and the workflow cannot tell you it is
> missing:** pushing to `gh-pages` publishes nothing until the repository is set
> to serve that branch (*Settings → Pages → Deploy from a branch → `gh-pages`,
> `/ (root)`*). Without it the build goes green and every preview URL is a 404.
> See [publish the preview on GitHub Pages](recipes/publish-the-preview-on-github-pages.md).

Notes:
- **The published demo tracks the latest release automatically.** The Pages
  landing page advertises one rendering as "the current release"; since
  `release-demo.yml` exists, nobody promotes it by hand. Publishing a GitHub
  Release triggers a fresh build **from that tag** — same pinned toolchain as the
  previews, same terminology selection — which is published to
  `demo/<tag>/`, and the landing page's demo links and version label are
  rewritten to match in the same `gh-pages` commit. See
  [§ 4 The published demo](#4-the-published-demo) for the guarantees and the
  retention rule.
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
  `toolchain-pins.test.mjs` and `update-demo-links.test.mjs` were added with
  `release-demo.yml` — the first fails when the two build workflows stop pinning
  the same toolchain, the second pins the landing-page rewriter's behaviour.

## 3. Release

This repository is **tooling**, so it uses **SemVer** via Release Please, running on
`main`:

1. Conventional Commits accumulate on `dev`, then land on `main` via a merge commit.
2. Release Please opens a release PR (version bump in `package/package.json`,
   `sushi-config.yaml` and `package-list.json`, changelog). A human merges it.
3. Merging cuts the tag + GitHub Release; `notify-zulip.yml` announces it and
   `release-demo.yml` renders the published demo (§ 4).
4. Production publication (if any) stays a manual, gated step — never automatic.

### How a module consumes this template

**Once the package is published**, a module picks up a release by bumping the
pinned version in its `ig.ini` (or `sushi-config.yaml` dependency), e.g.
`template = de.medizininformatikinitiative.template#<version>` (a released
version from the [releases page](https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds/releases)), then rebuilding. See
[recipes/consume-this-template-in-a-module.md](recipes/consume-this-template-in-a-module.md).

**It is not published yet** ([issue #113](../../../issues/113)), so no module pins a
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

## 4. The published demo

The [Pages landing page](https://forschungsgruppe-digital-health.github.io/ig-template-mii-kds/)
advertises one rendering of this repository's preview IG as *the current
release*. **It tracks the latest release automatically** — `release-demo.yml`
(§ 2) does the whole thing; there is no manual promotion step, and there must
not be one again.

### What the automation guarantees

| | |
| --- | --- |
| **Built from the tag** | The job checks out the released tag into `release-src/` and builds only that. The workspace root stays on the workflow's own ref so the publishing tooling (`scripts/update-demo-links.mjs`) is current even when re-rendering an old tag. |
| **The render carries the tag's version** | Before SUSHI runs, `sushi-config.yaml`'s `version:` is **written** from the tag. After the build, the generated `ImplementationGuide` is read back and the job fails if its `version` is not the tag. Release Please already keeps that field in step (`extra-files` in `release-please-config.json`); a disagreement is reported as a warning so re-rendering an old tag stays possible. |
| **The links follow** | `gh-pages/index.html` is rewritten in the same commit as the demo it points at. Path, rendered content and link therefore move together or not at all. |
| **Same toolchain as the previews** | The pins are copied from `ig-preview.yml` under the same names, and `scripts/toolchain-pins.test.mjs` fails the build if the two blocks drift apart. |

> **Why this exists.** The demo used to be copied by hand out of a
> feature-branch preview built *before* Release Please bumped the version, so
> `demo/v0.5.1/en/index.html` rendered `… — Preview v0.5.0`. The path claimed one
> release and the content another, and the landing page linked it as the
> release.

### How the landing page is edited

`index.html` on `gh-pages` is **hand-authored** and is never regenerated.
`scripts/update-demo-links.mjs` changes four narrowly anchored things and
nothing else: every `demo/<version>/` path segment, the version token in the
`<h2>` that introduces the demo, the one-paragraph per-release note (replaced
by a link to the actual release notes, which cannot go stale), and — once — an
obsolete sentence about `dev` predating the release. The first two are
**required**: if either anchor is missing the script exits non-zero and the job
fails, because a page that silently keeps linking the previous release is the
exact bug being fixed. Rewrites are idempotent.

Dry-run it against the live page before changing the script:

```bash
curl -sSL -o /tmp/index.html \
  https://forschungsgruppe-digital-health.github.io/ig-template-mii-kds/index.html
node scripts/update-demo-links.mjs --check --file /tmp/index.html \
  --version v9.9.9 \
  --repo-url https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds
```

### Retention — old demos are kept

Previous `demo/<tag>/` directories are **never pruned**. They are permanent,
externally linkable renderings, and removing one would break links this project
does not control. `cleanup-gh-pages.yml` cannot touch them either: it only
removes directories carrying a `.branch-name` marker, and `release-demo.yml`
deliberately writes none (a guard fails the job if one appears). Only the
landing page's *current* links move; superseded demos stay reachable at their
stable URLs. The job prints the accumulated `demo/` size and warns above the
1 GB Pages limit — if a demo ever has to be retired, every link to it must be
updated in the same change.

### Re-rendering a release by hand

Dispatch `release-demo.yml` with the `tag` input — e.g. after a toolchain bump,
or to publish the demo for a tag released before this workflow existed. Set
`update_landing_page: false` to publish `demo/<tag>/` without moving the
landing-page links. A **pre-release** is skipped on the `release: published`
trigger (it is not "the current release"); dispatch it manually if you want one
rendered.

## Secrets & enabling the gated features

All builds and releases work without secrets. To enable the optional gated
features — SU-TermServ terminology and the Zulip release announcement — see
[docs/secrets.md](secrets.md) for the exact `gh secret set` commands. The
workflows are already wired; adding the secret is the only step.
