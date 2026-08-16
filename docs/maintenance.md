# Maintenance — dependency & vulnerability monitoring

This repo pins every dependency to a fixed version. Pinning is safe but goes
stale **silently**. Three monitoring layers actively surface available updates
and known vulnerabilities. None of them ever changes a version by itself: every
bump is a proposal that a human reviews and merges.

> **Why three layers:** each tool sees a different slice. Dependabot reads
> standard package manifests; the custom checker reads the FHIR/IG-specific
> pins Dependabot cannot see; the scanners find *known vulnerabilities* rather
> than newer versions. Only together do they cover this repo.

## The cadence at a glance

| Layer | What it watches | When | Where results land | Switch |
|---|---|---|---|---|
| **A — Dependabot** (`.github/dependabot.yml`) | GitHub Actions pins; dev container **feature** versions (`devcontainers` ecosystem — the dev container is image-only, so there is no Dockerfile for the `docker` ecosystem to read) | weekly, Monday | update PRs targeting `dev`; Dependabot alerts under **Security → Dependabot** | config-file presence + repo Dependabot settings (no `vars.*` toggle — Dependabot is not a gated job) |
| **B — Version checker** (`.github/workflows/dependency-check.yml` + `scripts/check-updates.mjs`) | `fhir2.base.template` (from `package/package.json`), IG Publisher, SUSHI, Jekyll (from the build workflow env), FHIR package deps (from `sushi-config.yaml`, when present) | Monday 06:00 UTC + manual dispatch | one continuously-updated tracking issue **"Dependency status \<YYYYWww\>"** (label `dependencies`) + a `drift-report` workflow artifact | `vars.ENABLE_DEPENDENCY_CHECK` (ON by default) |
| **C — Security scan** (`.github/workflows/security-scan.yml`) | known vulnerabilities (OSV database), misconfigurations, committed secrets — via OSV-Scanner + Trivy `fs`; plus Trivy `image` over the dev container's digest-pinned base image (OS/base-image vulnerabilities the other scans miss) | Monday 07:00 UTC + every PR to `dev` + manual dispatch | **Security → Code scanning** (SARIF categories `osv-scanner`, `trivy-fs`, `trivy-image`) | `vars.ENABLE_SECURITY_SCAN` (ON by default) |

A disabled workflow still triggers but its jobs show as **skipped** — that is
expected, not an error.

## Where each pin lives (single source of truth)

The checker reads pins from the real files — it is never a second list to keep
in sync:

| Pin | Location |
|---|---|
| `fhir2.base.template` | `package/package.json` → `dependencies` |
| IG Publisher / SUSHI / Jekyll | `env:` values (`PUBLISHER_VERSION` **and** `PUBLISHER_SHA256`, `SUSHI_VERSION`, `JEKYLL_VERSION`) in `.github/workflows/ig-preview.yml` — the only build workflow here. The checker reads the three version pins; the jar checksum has to move with `PUBLISHER_VERSION` in the same edit ([recipe step 4](recipes/review-a-dependency-update.md)) |
| GitHub Actions | commit-SHA pins in `.github/workflows/*.yml` (with `# vX.Y.Z` comments) |
| FHIR package dependencies | `sushi-config.yaml` `dependencies:` block (module repos; not present here) |
| Dev container (base-image digest, feature versions, SUSHI/Jekyll installs) | `.devcontainer/devcontainer.json` — features come as Dependabot PRs; the image digest and the `postCreateCommand` tool pins are bumped manually |
| SU-TermServ client-cert proxy image | `.github/workflows/ig-preview.yml` — the `docker run` in the terminology step, pinned `nginx:<tag>@sha256:<digest>`; no tool watches it, so it is bumped manually |

Note the two manual entries: the checker (layer B) reads neither the dev
container nor the proxy image, and Dependabot covers only the dev container's
*features*. Those pins stay current only because someone bumps them.

Until a pin's file lands, the tracking issue shows a `pin not found` row — a
reminder, not an error.

## Honest coverage limits — read this before trusting a green scan

The layer-C scanners cover the **tooling** ecosystems only (npm, gem,
Docker/OS packages, GitHub Actions). They do **not** meaningfully cover:

- **FHIR content packages** (`fhir2.base.template`, `de.basisprofil.r4`,
  MII Kerndatensatz packages, …) — not indexed in any vulnerability database.
- **The IG Publisher jar** — a downloaded binary, likewise not indexed.

For those artifacts the **layer-B version checker is the available safeguard**:
staying on the latest reviewed release is the only systematic mitigation.
A green Security tab therefore does *not* mean "the FHIR toolchain is known
to be safe" — it means "no known vulnerability in the scannable ecosystems".

Two further dev-container limits, stated plainly:

- The `trivy-image` job scans the **pinned base image**, not a fully built dev
  container: feature layers and the `postCreateCommand` installs (SUSHI,
  Jekyll) are not in the scanned image. Their manifests are covered by the
  fs/OSV scans and layer B.
- **Nothing auto-bumps the base-image digest.** Dependabot's `devcontainers`
  ecosystem updates feature versions only. A `trivy-image` finding against the
  base image is the signal to bump the digest manually (resolve the new digest
  for the tag, update `devcontainer.json`, PR to `dev`).

## Ground rules

- **Never auto-merge, never auto-float.** Every bump is a PR/issue a human
  reviews (changelog first) and merges into `dev`.
- **Version and checksum move together.** An IG Publisher bump always includes
  the recomputed jar SHA-256 — never one without the other.
- Update PRs target `dev`, never `main` — Dependabot's, and the ones a
  maintainer opens by hand after reading a checker row.

## How-tos

- Review a proposed bump: [`docs/recipes/review-a-dependency-update.md`](recipes/review-a-dependency-update.md)
- Triage a Security-tab finding: [`docs/recipes/triage-a-vulnerability-alert.md`](recipes/triage-a-vulnerability-alert.md)
- Run the checker locally: `node scripts/check-updates.mjs` (Node 22, no npm
  install needed; exits 0 always — drift is in the output)
- Run its unit tests (offline): `node --test scripts/check-updates.test.mjs`

## Accepted risks

Findings assessed as not applicable (and dismissed in the Security tab) are
recorded here so the reasoning survives the alert.

| Date | Finding (CVE/GHSA + artifact) | Why accepted | Review by |
|---|---|---|---|
| _none yet_ | | | |

## Recorded limits and decisions

<!-- Moved here from docs/open-tasks.md when the task board moved to the
     issue tracker (2026-08-16). These are DECIDED records, not open tasks:
     "was this forgotten, or decided?" — decided. -->

- **A private address is in one commit message on `main`, and stays there.** The
  squash-merge of the second verification round carries a
  `Co-authored-by:` trailer with a personal mailbox. Removing it would mean
  rewriting seven commits per repository, force-pushing two protected branches,
  and invalidating the `v0.3.0` tag and its release — and it would **still not
  remove the address**, because a force-push leaves the old commit reachable by
  its URL until the forge purges unreferenced objects on request. The rewrite
  therefore pays the full cost and does not achieve the goal. Decided:
  leave it. The route that does work, if it is ever needed, is asking GitHub
  Support to purge the unreferenced commit after a rewrite.
  Prevented from recurring instead: commits are authored with the GitHub
  noreply address, so no future squash merge generates the trailer.

- **The build reports broken links; CI does not gate on the count.** The QA gate
  is `Errors: 0`, which the preview meets. Broken links are reported separately
  and are usually external URLs whose reachability depends on the network at
  build time, so failing a build on them would make CI flaky. Read the count in
  `qa.html` when you change page content: it was 2 for several builds because
  the preview's `translationinfo` page linked to the target organisation's issue
  tracker, which does not exist yet. Rendered page content therefore does not
  hard-code a repository URL — see the note on that page.

- **The publisher name in the © line cannot be branched per language.** The
  pinned base emits it in `fragment-pageend.html:48` from the single-valued
  `publisher` block in `sushi-config.yaml`, *before* `fragment-footer.html`
  runs. Mitigated since the publisher became **NUM-DIZ** (2026-08-14): the
  name is a language-neutral proper name and the link is the NUM site root.
  Recorded in [styleguide](styleguide.md) §6/§7.
- **The preview's "Directory of published versions" link is inert.** The publish
  box derives it from the canonical, which for a template package is its GitHub
  repository URL. Recorded in [design](styleguide.md).
- **`scripts/check-language-model.sh` is curated, not exhaustive.** It matches
  line by line, so a claim split across a line break passes — which is exactly
  how the comment in `includes/fragment-footer.html` survived `ce3a914`,
  "align the preview IG with the module template's language model": it read
  "the German" / "(default) pages" across two lines. It was tested against 20
  phrasings and catches every wording that has actually occurred here. If you
  add a phrasing, add the pattern; do not weaken the existing ones.

- **Nothing enforces the "list test files by name" convention.** `scripts/*.test.mjs`
  is run by an explicit list in `dependency-check.yml` and `security-scan.yml`,
  not a glob, so a new test file can be written and silently never run in CI.
  The explicit form is deliberate (a glob in the sibling repo's publication gate
  once aborted a release), so the trade is accepted: `scripts/README.md` and both
  workflows say a new test must be added by hand.

### Cross-repo consistency — decided, not pending

No sync mechanism between this repository and the module scaffold is planned. A
created module must be self-contained: replacing its copy of a shared page such
as `glossary.md` or `maintenance.md` with a link back here would break the moment
that module is developed independently, which is the whole point of a template.
The two repositories share several documentation filenames, and the copies
differ where the repositories differ — `project-status.md` because each names the
other, `glossary.md` because the module scaffold defines terms this repository
has no use for. Convergence is checked when a shared doc is edited, not enforced
by tooling.

