# ig-template-mii-kds

The **IG template** that gives every MII Kerndatensatz (KDS) module
Implementation Guide its MII look — header, footer, colours, logo. It is an
[HL7 IG-Publisher](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation)
template package (`de.medizininformatikinitiative.template`) built on the HL7 base
template [`fhir2.base.template`](https://github.com/HL7/ig-template-base2).

**You don't edit this repository to write an IG — you reference it.** A module
names it in `ig.ini` and the IG Publisher applies it at build time. Keeping the
branding in one versioned package means every module looks the same, and a fix
here reaches all of them with one release.

To start a module, use
[`mii-kds-module-template`](https://github.com/medizininformatik-initiative/mii-kds-module-template)
instead; it already references this template.

> **Status: prototype.** Usable and released, but pending discussion in the MII
> Taskforce Kerndatensatz — see [docs/project-status.md](docs/project-status.md).

## Quickstart (for maintaining the template)

To *use* the template in a module, see
[consume this template in a module](docs/recipes/consume-this-template-in-a-module.md).
This is for changing the template itself.

1. **Clone and open in the dev container** (VS Code → *Reopen in Container*) — it
   brings the whole toolchain.
   → [details](docs/recipes/first-build-in-devcontainer.md)
2. **Build the preview** — a small IG bundled here so you can see the branding
   render: `sushi .`, then the IG Publisher, then open `output/index.html`.
   Pushing a branch does the same in CI and comments the preview URL on your PR.
   → [the exact commands, including how to get
   `publisher.jar`](docs/recipes/first-build-in-devcontainer.md)
3. **Change something** — e.g. a brand colour is one CSS variable in
   `content/assets/css/mii.css`.
   → [change the brand colour](docs/recipes/change-the-brand-color.md) ·
   [replace the logo](docs/recipes/replace-the-logo.md)
4. **Release** — merge `dev → main`; Release Please opens a SemVer release PR.
   → [cut a template release](docs/recipes/cut-a-template-release.md)

Current `dev` preview:
<https://medizininformatik-initiative.github.io/ig-template-mii-kds/branches/dev/>

Unfamiliar terms are in the [glossary](docs/glossary.md).

## Where things live

The paths mirror the base template, because the IG Publisher resolves them by name.

| Path | What it is |
| --- | --- |
| `package/` | The template package manifest — what the IG Publisher applies |
| `includes/` | Header, footer and CSS fragments that override the base template |
| `content/` | Branding assets: CSS, logo, favicon |
| `translations/` | German UI-string catalogs for the base template |
| `input/`, `ig.ini` | The bundled preview IG (so branding changes are reviewable) |
| `docs/` | Guides and step-by-step recipes |
| `scripts/` | Helper scripts: dependency check, language-model guard, logo trace, secret upload — see [`scripts/README.md`](scripts/README.md) |
| `skills/` | Vendor-neutral agent skills for maintenance tasks |
| `.github/workflows/` | CI: preview build, release, monitoring |

## Documentation

- [Recipes](docs/recipes/) — step-by-step for the common tasks
- [Glossary](docs/glossary.md) · [Concepts](docs/concepts.md) — the vocabulary and the ideas behind it
- [Design](docs/design.md) — every branding decision and where its value comes from
- [Workflows](docs/workflows.md) — what the CI does, and how releases work
- [IG best-practices checklist](docs/ig-best-practices-checklist.md) — how this template meets the official HL7 guidance
- [Secrets](docs/secrets.md) — optional: MII terminology server, release announcements
- [Open tasks](docs/open-tasks.md) — what is unfinished, and why

## Getting help

- **FHIR and profiling questions** — HL7 FHIR Zulip <https://chat.fhir.org>,
  stream `german/mi-initiative`. Free to join; this is where the MII KDS IGs
  point their readers.
- **MII coordination** — MII Zulip <https://mii.zulipchat.com/>, stream
  `MII-Kerndatensatz`. Access via the MII Geschäftsstelle
  (<office@medizininformatik-initiative.de>).

## Licence

[CC0-1.0](LICENSE), like the upstream base template.
