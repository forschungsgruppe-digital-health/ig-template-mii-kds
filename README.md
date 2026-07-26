# ig-template-mii-kds

This repository is an [HL7 IG-Publisher](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation) **template package** (`de.medizininformatikinitiative.template`) that carries the branding of the Medical Informatics Initiative (MII — Medizininformatik-Initiative). It is derived from the HL7 base template [`fhir2.base.template`](https://github.com/HL7/ig-template-base2) and is consumed by the MII Kerndatensatz (KDS) module Implementation Guides (IGs): a module IG names this package as its template in `ig.ini`, and the IG Publisher then renders that guide with the MII layout, header, footer, and styles. It is for maintainers of MII KDS module IGs and for anyone who builds an MII-branded FHIR IG — you do not edit this repo to write an IG, you *reference* it.

> **Why a template package instead of copying layout files into every IG:** the IG Publisher applies exactly one template per build. Keeping the branding in one versioned package means every module IG gets the identical look by referencing one version, and a branding fix ships to all guides by releasing one new version here.

## Relation to `mii-kds-module-template` (Repo B)

[`mii-kds-module-template`](https://github.com/medizininformatik-initiative/mii-kds-module-template) is a separate GitHub **template repository** that scaffolds a brand-new MII KDS module IG. That scaffold **references this template package by version**. This repository does **not** contain the module scaffold — the two repos are consumed in different ways: this one is downloaded by the IG Publisher at build time; Repo B is copied once via GitHub's "Use this template" button.

> **Why by version and not by branch:** a module IG build must be reproducible. Referencing a released version of this package (instead of a moving branch) guarantees the same input produces the same rendered guide.

> **Status: PROTOTYPE.** This repository and the module template are prototypes
> pending discussion in the MII Taskforce Kerndatensatz. They are released and
> fully usable, but the template is deliberately **not** registered in
> `FHIR/ig-registry` and the repos must not be moved to another organisation
> until that is explicitly decided — see [docs/project-status.md](docs/project-status.md).

## Quickstart

You do **not** need this Quickstart to *use* the template in a module — for that,
see [recipes/consume-this-template-in-a-module.md](docs/recipes/consume-this-template-in-a-module.md).
This Quickstart is for *maintaining* the template: build its preview, see the
rendered branding, change something, and release.

1. **Clone** and open in the dev container (installs the whole toolchain for you):
   `git clone https://github.com/medizininformatik-initiative/ig-template-mii-kds && cd ig-template-mii-kds`, then in VS Code run **"Reopen in Container"**. Details: [recipes/first-build-in-devcontainer.md](docs/recipes/first-build-in-devcontainer.md).
2. **Build the preview IG** (the template applied to a tiny sample so you can see
   it render): `sushi . && curl -L -o publisher.jar https://github.com/HL7/fhir-ig-publisher/releases/download/2.2.11/publisher.jar && java -jar publisher.jar -ig ig.ini`.
3. **Open** `output/index.html` in a browser — you now see the MII header, footer,
   colours and logo applied.
4. **Or just push a branch:** every push to a `feature/*` branch builds the
   preview in CI and posts a **preview URL** on the PR (see [docs/workflows.md](docs/workflows.md)).
   The current `dev` preview is at
   `https://medizininformatik-initiative.github.io/ig-template-mii-kds/branches/dev/`.
5. **Change the brand colour** in `content/assets/css/mii.css` (override a CSS
   variable — one line): [recipes/change-the-brand-color.md](docs/recipes/change-the-brand-color.md).
   Rebuild (step 2) and see it.
6. **Cut a release** when your change is ready: merge `dev → main`; Release Please
   opens a SemVer release PR: [recipes/cut-a-template-release.md](docs/recipes/cut-a-template-release.md).

New to any of the words above? Start with the [Glossary](docs/glossary.md) and
[Concepts](docs/concepts.md).

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
