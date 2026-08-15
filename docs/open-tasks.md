# Open tasks

Everything known to be unfinished in this repository, and why. If you are
wondering "was this forgotten, or decided?", this is the file that answers it.

`docs/project-status.md` says what the repository *is* (a prototype, pending TF
KDS discussion). This file says what is *left to do*.

Nothing here blocks developing, reviewing or releasing the template.

## Waiting on a decision, not on work

These are finished as far as this repository is concerned. Each needs an explicit
decision by a maintainer before anything is done.

| Task | Blocked on | What unblocks it |
| --- | --- | --- |
| Register the template in [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry) (`templates.json`) and name its owner | An explicit maintainer decision | A registry entry is a public, hard-to-retract commitment implying an owner and a support promise. While the approach is a proposal to the TF KDS, staying unregistered lets the design change without stranding consumers. |
| Publish `de.medizininformatikinitiative.template` to a FHIR package registry | The same decision | Until then modules vendor the template as a folder. Once published, a module switches per [switch-template-to-published](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template/blob/main/docs/recipes/switch-template-to-published.md) in the module scaffold. |
| Move both repositories to the `medizininformatik-initiative` organisation — then work through [migration cleanup](migration-cleanup.md) | The same decision | All content already names the target org. After the move, delete the module template's `IG_TEMPLATE_REPO_URL` repository variable — it only exists to bridge the gap. |
| Decide who owns the template after 2026 | TF KDS | Currently "the MII, for now". MII funding ends end-2026 and NUM-DIZ takes over IG development and maintenance; the NUM-DIZ design is now the rendering **default** (MII stays switchable — styleguide §10), anticipating the handover technically — the ownership decision is separate. |
| Name a code owner in `.github/CODEOWNERS` and an enforcement contact in `CODE_OF_CONDUCT.md` | The same decision | Both are deliberately empty: naming an individual would present one person as responsible for an MII-branded artifact, and routing reports to the MII Geschäftsstelle would claim it owns repositories it does not. Set a team once the repositories move to the organisation. |
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
| Request HL7 permission for the FHIR logo + add the trademark attribution | — | The header renders the **HL7 FHIR flame** (`fhir-logo-www.png`, shipped by `fhir2.base.template`, linked to hl7.org/fhir — mirroring kerndatensatz-basis and standard IG practice). HL7's policy: FHIR® and the flame are registered trademarks; permission is requested via <https://www.hl7.org/community-use/index.cfm> (or HL7trademarks@HL7.org), the logo must stand alone/unmodified (it does), and the attribution sentence — "HL7, FHIR and the FHIR [FLAME DESIGN] are the registered trademarks of Health Level Seven International and their use does not constitute endorsement by HL7." — should be added to a rendered legal surface. TF-KDS/maintainer action: file the (free) community-use request naming the template and module IGs, and decide where the attribution line renders. |
| Obtain NUM-DIZ consent for the vendored NUM-DIZ logos | — | `logo-num-diz-de.svg` is the official combo fetched from the NUM website; the NUM/NUM-DIZ logos are third-party brand assets and shipping them needs NUM-DIZ (TF-KDS-level) consent — see styleguide §10. **Urgency raised:** NUM-DIZ is now the *default* design, so every rendering that does not switch to MII ships these logos out of the box — no longer an opt-in surface. |
| Obtain NUM-DIZ approval for the **derived** English combo logo | — | `logo-num-diz-en.svg` is composed from two official assets (derivation in the file header); as a *new* brand lockup it additionally needs NUM-DIZ approval. Replace it the day an official English combo exists. **Urgency raised:** as part of the NUM-DIZ default it now renders on every English page of an out-of-the-box build. |

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
- **The pinned base's landing-page redirect never reaches the second language.**
  In `fhir2.base.template#0.1.0` the `return` in `lang-redirects.js` sits inside
  the loop but outside the language match, so a browser in any language other
  than the first is left on the blank root page. Already fixed on
  `HL7/ig-template-base2` `main`, but no release carries the fix, so this
  template ships a corrected `content/assets/js/lang-redirects.js` at the same
  path (the full reasoning is in that file). Delete it once a base release with
  the fix is pinned.

## Needs work here

- **The rendering table in [`skills/ig-translate`](../skills/ig-translate/SKILL.md)
  contains a claim the catalog has since retired.** That skill stays local — it is
  template-owner scope (language policy, the header/footer/CSS obligations, the
  vendored German UI strings) and the organization's catalog deliberately does not
  cover it. But its "what the toolchain renders" table was ported into the catalog
  skill `fhir-ig-translation` and *maintained there*, and the 2026-08-05 revision
  retired one row of it: the IG's own `title` and the titles of `pages:`-tree pages
  do render, via `input/translations/<lang>/ImplementationGuide-<ig-id>.po`, which
  the publisher imports at load time instead of treating as a resource supplement.
  This repository already ships such a catalogue
  (`input/translations/de/ImplementationGuide-de.medizininformatikinitiative.template.preview.po`),
  so the file and the skill now disagree. Reconcile the table against the catalog
  skill — or cut it down to a pointer and keep only what is template-owner scope.
  A ⚠️ note in the skill marks the row until then. Left to the owner deliberately:
  it is a technical claim about the toolchain, not a mechanical de-duplication.

## Known limits, deliberately not "fixed"

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

- **The footer's publisher link is English on German pages.** It cannot be
  branched from this template: the pinned base emits it in
  `fragment-pageend.html:48` from the single-valued `publisher` block in
  `sushi-config.yaml`, *before* `fragment-footer.html` runs. There is also no
  language-neutral MII URL to point at — `medizininformatik-initiative.de`
  redirects with `content-language: de`. Recorded in [styleguide](styleguide.md) §6.
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
