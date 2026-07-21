# ig-template-mii-kds

This repository is an [HL7 IG-Publisher](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation) **template package** (`de.medizininformatikinitiative.template`) that carries the branding of the Medical Informatics Initiative (MII — Medizininformatik-Initiative). It is derived from the HL7 base template [`fhir2.base.template`](https://github.com/HL7/ig-template-base2) and is consumed by the MII Kerndatensatz (KDS) module Implementation Guides (IGs): a module IG names this package as its template in `ig.ini`, and the IG Publisher then renders that guide with the MII layout, header, footer, and styles. It is for maintainers of MII KDS module IGs and for anyone who builds an MII-branded FHIR IG — you do not edit this repo to write an IG, you *reference* it.

> **Why a template package instead of copying layout files into every IG:** the IG Publisher applies exactly one template per build. Keeping the branding in one versioned package means every module IG gets the identical look by referencing one version, and a branding fix ships to all guides by releasing one new version here.

## Relation to `mii-kds-module-template` (Repo B)

[`mii-kds-module-template`](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template) is a separate GitHub **template repository** that scaffolds a brand-new MII KDS module IG. That scaffold **references this template package by version**. This repository does **not** contain the module scaffold — the two repos are consumed in different ways: this one is downloaded by the IG Publisher at build time; Repo B is copied once via GitHub's "Use this template" button.

> **Why by version and not by branch:** a module IG build must be reproducible. Referencing a released version of this package (instead of a moving branch) guarantees the same input produces the same rendered guide.

## Quickstart

TODO: completed by the docs task (A8).

## How this repo is structured

Planned layout — the directories are added by the ongoing build-out pull requests, so not all of them exist yet:

| Path | Purpose |
| --- | --- |
| `package/` | The template package itself (`package.json`, template configuration) — this is what the IG Publisher downloads and applies |
| `includes/` | HTML/Liquid fragments (header, footer, navigation) that override the base template |
| `content/` | Static branding assets: CSS, logos, images |
| `docs/` | Documentation for humans: glossary, concepts, recipes, further reading |
| `skills/` | Vendor-neutral agent skills (agentskills.io format) for maintenance workflows |
| `.github/` | CI workflows, issue forms, repository housekeeping |

> **Why the split mirrors the base template:** the IG Publisher's template mechanism resolves files by well-known paths (`package/`, `includes/`, `content/`); keeping the upstream layout makes the diff against `fhir2.base.template` reviewable and upgrades mechanical.

## Where to get help

- **HL7 FHIR community Zulip** — <https://chat.fhir.org>, stream **`german/mi-initiative`**. The channel the MII KDS IGs themselves direct questions to; anyone can create a free account and join. Best for FHIR, IG-Publisher, and profiling questions.
- **MII Zulip organization** — <https://mii.zulipchat.com/>, stream **`MII-Kerndatensatz`**. The MII's own chat for KDS coordination. Register at the org URL; if access must be granted, request it from the MII Geschäftsstelle (<office@medizininformatik-initiative.de>).

> **Why two channels:** the public FHIR Zulip reaches the broad FHIR/implementer community and keeps a searchable history — post technical questions there where possible (and search existing threads first). The MII Zulip is the initiative-internal coordination space.

## License

[CC0-1.0](LICENSE) — the same license as the upstream base template `fhir2.base.template`.
