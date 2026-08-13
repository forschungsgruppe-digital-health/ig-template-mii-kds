# Project status — PROTOTYPE (not yet an MII-endorsed artifact)

**Status as of 2026-07-26: PROTOTYPE.** This repository and its companion
[`mii-kds-module-template`](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template)
are prototypes, to be discussed in the **MII Taskforce Kerndatensatz (TF KDS)**.
They are fully functional and released (current version: see
[CHANGELOG.md](../CHANGELOG.md)), but their governance is not
settled yet.

## What this means in practice

| Question | Current answer |
| --- | --- |
| Is the template registered in [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry)? | **No — and it must not be**, until the maintainer explicitly says so. |
| Is the package published to a FHIR package registry? | **No.** Modules consume the template as a vendored folder (`ig-template/`), re-vendored from this repo's `dev` branch by the module template's `scripts/sync-ig-template.sh` — see [how a module consumes this template](workflows.md#how-a-module-consumes-this-template). |
| Which GitHub organisation will own these repos? | **`medizininformatik-initiative`** is the agreed TARGET organisation. Canonical URLs and package ids already name it; navigation links point at the current organisation so they resolve today, and are swept to the target organisation in one tracked pass at transfer time. |
| Have they moved yet? | **No.** They still live in the pre-move organisation; the transfer happens on an explicit decision. Until then some links here point at the future location, and CI bridges the gap via the `IG_TEMPLATE_REPO_URL` repository variable (module template) — remove it after the move. |
| What happens at the move? | The one-pass link sweep plus the deletions and edits listed in [migration cleanup](migration-cleanup.md). |
| Who owns the template after 2026? | **The MII**, for now. MII funding ends end-2026 and **NUM-DIZ takes over IG development and maintenance** — the template already carries a switchable NUM-DIZ corporate design for that handover ([styleguide §10](styleguide.md#10-the-brand-switch-num-diz-corporate-design)); the formal ownership decision stays with the TF KDS. |

> **Why registration is deliberately deferred:** an `ig-registry` entry and a
> package-registry release are *public, hard-to-retract commitments* that imply
> an owner and a support promise. While the approach is still a proposal to the
> TF KDS, keeping it unregistered lets the design change freely without stranding
> consumers or squatting an identifier.

> The concrete backlog — what is unfinished, what is waiting on a decision,
> and what is a known limit rather than a defect — is in
> [open-tasks.md](open-tasks.md).

## Branch state — `main` and `dev` are reconciled

The documented model is that `main` only ever receives a `dev → main` merge
([CONTRIBUTING.md](../CONTRIBUTING.md)). That is the intent. It is not what
happened between 2026-07-30 and 2026-08-05, and pretending otherwise would
mislead anyone branching off either branch.

**What happened:** the two branches diverged in both directions. `main` had
picked up two Release Please release commits (`0.5.0`, `0.5.1` — those are cut
on `main` by design) plus three pull requests merged straight into it (the
alignment with `mii-kds-module-template` v0.5.0 — structure-tabs, breadcrumb
i18n, content-image CSS —, a README pointer, and the retirement of the
breadcrumb override in favour of the IG-level translation catalogue), while
`dev` carried unreleased work of its own, among it the rename of
`docs/design.md` to `docs/styleguide.md`. Section references therefore resolved
on one branch and dangled on the other.

**As of 2026-08-06 that is repaired:** `main` was back-merged into `dev`, the
overlapping edits were reconciled by hand (the styleguide absorbed the
structure-tabs and content-image material that had been written into the old
`design.md`), and `dev` was promoted to `main`. Both branches point at the same
commit; `git diff main dev` is empty.

**The rule, so this stops growing:**

- Work still goes to `dev` first, and reaches `main` through a `dev → main`
  merge commit. That is unchanged.
- If anything does land on `main` directly — a release commit, a hotfix, a PR
  retargeted in a hurry — it must be **back-merged into `dev`** (`git merge
  main` on `dev`, via a pull request) before the next round of work, not left
  for the next release to sort out.
- Before opening a `dev → main` release PR, check that `dev` is not behind
  `main`: `git fetch && git rev-list --left-right --count origin/main...origin/dev`.
  A non-zero left-hand number means a back-merge is due first.

## What is NOT blocked by this

Everything about developing and reviewing the templates works today: builds,
bilingual previews, releases (SemVer here, CalVer in modules), the vendored
template flow, and creating a module from the module template.

## When the status changes

Only on an explicit decision by the maintainer. At that point:

1. Register the template in `FHIR/ig-registry` (`templates.json`) and name the
   owner.
2. Publish the package so modules can switch from the vendored folder to a
   pinned package reference (see the module template's
   `docs/recipes/switch-template-to-published.md`).
3. Update this file.
