# Concepts — how this template works and why

Read this after the [Glossary](glossary.md). It explains the ideas behind this
repository so the recipes and workflows make sense. Every non-obvious choice
carries a **Why**.

## 1. What an IG template is, and why MII needs its own

The HL7 **IG Publisher** renders an Implementation Guide website. It applies
exactly **one template** per build — the template decides the header, footer,
navigation, colours and fonts. This repository is that template, packaged as an
installable FHIR **template package**, `de.medizininformatikinitiative.template`.

A module IG does not copy any layout files. In its `ig.ini` it writes one line —
`template = de.medizininformatikinitiative.template#<version>` — and the IG
Publisher downloads and applies this package.

> **Why a shared template package:** every MII KDS module IG then looks identical,
> a branding fix ships to all of them by releasing one new version here, and each
> module pins a *version* so its build stays reproducible.

## 2. Derived from `fhir2.base.template` — override, don't fork

This template is **derived from** the HL7 base template
[`fhir2.base.template`](https://github.com/HL7/ig-template-base2) (pinned to
version `0.1.0`). It declares that base as a dependency and ships **only the few
files that differ** — the header, footer and CSS fragments, plus the MII logo.
Everything else (page layouts, Liquid partials, build scripts, translations) is
inherited from the base.

> **Why override instead of copy:** the base template ships the branding fragments
> as *empty placeholders* precisely so a child fills them. Copying the whole base
> would re-introduce drift and lose upstream fixes. The small override surface is
> the entire point — see [design.md](design.md) for the exact files.

> **Why pin the base to `0.1.0` instead of the moving `#current`:** reproducibility.
> A build in 2029 must produce the same output as today. The
> [dependency checker](maintenance.md) watches for a newer base and proposes the
> bump as a reviewable PR, so pinning does not mean going stale silently.

## 3. How an IG is created and published (the big picture)

1. An author writes profiles/value sets in **FSH** and narrative pages in Markdown.
2. **SUSHI** compiles the FSH into FHIR JSON.
3. The **IG Publisher** takes that JSON + this template + a terminology server and
   produces (a) a browsable website and (b) a downloadable FHIR package.
4. The package is published to a **registry** (so tools can install it) and the
   website is hosted (for humans).

This repository sits at step 3: it is the *template* the Publisher applies. It also
ships a tiny **preview IG** so it can build itself and prove the branding renders
before a release (see [workflows.md](workflows.md)).

## 4. Registries and where things get listed

- **FHIR package registry** (`packages.fhir.org`) — where installable packages,
  including template packages, are resolved by id + version.
- **[`FHIR/ig-registry`](https://github.com/FHIR/ig-registry)** — HL7's public
  index; its `templates.json` lists IG **templates** so the Publisher can resolve
  this one by id. Getting listed there is a deliberate, gated step (a human
  decision about the post-2026 owner). **This template is deliberately NOT
  registered yet:** it is a prototype pending
  discussion in the MII Taskforce KDS — see [project-status.md](project-status.md).
- **Simplifier** — an alternative FHIR registry platform; not required here.

## 5. The MII governance context

The Medical Informatics Initiative (MII) maintains the **Kerndatensatz (KDS)** — a
core dataset split into modules (Person, Diagnose, Prozedur, …), each published as
its own IG. Naming, terminology policy, the release workflow and the reusable CI
are defined in the [MII meta wiki](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki).
This template exists so those module IGs share one MII-branded presentation. When
this document and the wiki disagree, **the wiki wins** — see
[further-reading.md](further-reading.md) for the pages that matter.

## 6. Two version schemes — do not mix them

- **This template repo** is *tooling*; it uses **SemVer** (`0.2.0`) via Release
  Please, because consumers pin to a version and need to know breaking vs
  compatible changes.
- **MII modules** use **CalVer** (`YYYY.n.n`) via the MII Module Release Workflow.

> **Why this matters here:** a module that consumes this template must never confuse
> the template's SemVer with its own CalVer. The two are announced on different
> Zulip topics and cut by different automation on purpose.
