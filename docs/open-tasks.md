# Open tasks

Everything known to be unfinished in this repository, and why. If you are
wondering "was this forgotten, or decided?", this is the file that answers it.

`docs/project-status.md` says what the repository *is* (a prototype, pending TF
KDS discussion). This file says what is *left to do*.

Nothing here blocks developing, reviewing or releasing the template.

## Waiting on a decision, not on work

These are finished as far as this repository is concerned. Each needs someone to
say "go" — none should be done by an agent.

| Task | Blocked on | What unblocks it |
| --- | --- | --- |
| Register the template in [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry) (`templates.json`) and name its owner | An explicit maintainer decision | A registry entry is a public, hard-to-retract commitment implying an owner and a support promise. While the approach is a proposal to the TF KDS, staying unregistered lets the design change without stranding consumers. |
| Publish `de.medizininformatikinitiative.template` to a FHIR package registry | The same decision | Until then modules vendor the template as a folder. Once published, a module switches per [switch-template-to-published](https://github.com/medizininformatik-initiative/mii-kds-module-template/blob/main/docs/recipes/switch-template-to-published.md) in the module scaffold. |
| Move both repositories to the `medizininformatik-initiative` organisation | The same decision | All content already names the target org. After the move, delete the module template's `IG_TEMPLATE_REPO_URL` repository variable — it only exists to bridge the gap. |
| Decide who owns the template after 2026 | TF KDS | Currently "the MII, for now". |
| Store the SU-TermServ client certificate as repository secrets | A maintainer with the certificate | The procedure is written and the handshake was verified locally against the live server. See [secrets](secrets.md); run `scripts/set-su-termserv-secrets.sh`. Without it, builds fall back to `tx.fhir.org`. |
| Store the Zulip announcement key | A maintainer | See [secrets](secrets.md). Release announcements stay silent until then. |

## Needs an official asset

<!-- Issue links need three `..`. A docs/ page renders under
     /OWNER/REPO/blob/<ref>/docs/, so `../../../issues/N` is the form that lands
     on /OWNER/REPO/issues/N; a root-level file such as README.md needs two.
     Kept relative so the pending move to `medizininformatik-initiative` does not
     have to touch them. -->

| Task | Issue | Note |
| --- | --- | --- |
| Replace the traced logos with official MII SVGs | [#25](../../../issues/25) | `content/assets/images/logo-de.svg` and `logo-en.svg` are traced from the official PNGs with `scripts/trace-logo.sh`. They render correctly; they are not the vendor's own vector files. |
| Confirm trademark permission for the MII logo and wordmark | [#26](../../../issues/26) | Needed before any use beyond this prototype. |

## To raise upstream

Neither is a defect in this repository. Both are worth reporting so the
workaround can eventually be deleted.

- **[`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) — the
  `TRANS_HLP` string is inserted without `| markdownify`.** The pinned base
  (`fhir2.base.template#0.1.0`, `includes/template-page-md.html:35`) emits it
  raw, so the markdown link in every language catalog reaches the page verbatim
  and readers see a literal `[here](translationinfo.html)`. The same defect is
  visible in HL7's own reference IG, `FHIR/multi-lang-test-ig`. This repository
  works around it by writing the link as HTML in its vendored German catalog —
  see [`translations/README.md`](../translations/README.md).
- **The same repository ships no German UI-string catalog** at the pinned
  version, which is why `translations/` exists here at all. Delete the vendored
  copies once a pinned base ships `de` itself; the dependency checker watches
  `fhir2.base.template` and proposes that bump.

## Known limits, deliberately not "fixed"

- **The build reports broken links; CI does not gate on the count.** The QA gate
  is `Errors: 0`, which the preview meets. Broken links are reported separately
  and are usually external URLs whose reachability depends on the network at
  build time, so failing a build on them would make CI flaky. Read the count in
  `qa.html` when you change page content: it was 2 for several builds because
  the preview's `translationinfo` page linked to the target organisation's issue
  tracker, which does not exist yet. Rendered page content therefore does not
  hard-code a repository URL — see the note on that page.

- **The footer's publisher link is English on German pages.** It cannot be
  branched from this template: the pinned base emits it in
  `fragment-pageend.html:48` from the single-valued `publisher` block in
  `sushi-config.yaml`, *before* `fragment-footer.html` runs. There is also no
  language-neutral MII URL to point at — `medizininformatik-initiative.de`
  redirects with `content-language: de`. Recorded in [design](design.md) §6.
- **The preview's "Directory of published versions" link is inert.** The publish
  box derives it from the canonical, which for a template package is its GitHub
  repository URL. Recorded in [design](design.md).
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

## Cross-repo consistency — decided, not pending

No sync mechanism between this repository and the module scaffold is planned. A
created module must be self-contained: replacing its copy of a shared page such
as `glossary.md` or `maintenance.md` with a link back here would break the moment
that module is developed independently, which is the whole point of a template.
The two repositories share several documentation filenames, and the copies
differ where the repositories differ — `project-status.md` because each names the
other, `glossary.md` because the module scaffold defines terms this repository
has no use for. Convergence is checked when a shared doc is edited, not enforced
by tooling.
