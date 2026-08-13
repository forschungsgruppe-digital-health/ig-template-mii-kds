# ig-template-mii-kds

A proposed shared **IG template** for MII Kerndatensatz (KDS) module
Implementation Guides — header, footer, colours, logo — so module guides could
share one presentation. It carries **two switchable corporate designs**: MII
(the default) and NUM-DIZ, for the takeover of IG maintenance by NUM-DIZ when
MII funding ends end-2026 — see
[switch the brand to NUM-DIZ](docs/recipes/switch-brand-to-num-diz.md). It is an
[HL7 IG-Publisher](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation)
template package (`de.medizininformatikinitiative.template`) built on the HL7 base
template [`fhir2.base.template`](https://github.com/HL7/ig-template-base2).

**You don't edit this repository to write an IG — you reference it.** A module
names it in `ig.ini` and the IG Publisher applies it at build time. Keeping the
branding in one versioned package means the modules that adopt it look the same,
and a fix here reaches them with one release. The package is not on a registry
yet, so today a module vendors this repository's `dev` branch instead — see
[how a module consumes this template](docs/workflows.md#how-a-module-consumes-this-template).

To start a module, use
[`mii-kds-module-template`](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template)
instead; it already references this template.

> **Status: prototype.** Usable and released, but pending discussion in the MII
> Taskforce Kerndatensatz, and no module uses it yet — see
> [docs/project-status.md](docs/project-status.md).

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

Rendered demo of the current release, plus the development previews:
<https://forschungsgruppe-digital-health.github.io/ig-template-mii-kds/>

Branch previews under `branches/<branch>/` are swept when their branch is deleted;
the release demo under `demo/<version>/` is permanent.

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
| `skills/` | Reusable instructions for recurring maintenance tasks — see [`AGENTS.md`](AGENTS.md) |
| `.github/workflows/` | CI: preview build, release, monitoring |

## Documentation

**[docs/](docs/README.md) is the index** — every guide, with a reading order for
newcomers. The three you are most likely to want first:

- [Recipes](docs/recipes/) — step-by-step for the common tasks
- [Styleguide](docs/styleguide.md) — the layout/design conventions (palette, boxes, tables, language rules, accessibility), with provenance in the appendix
- [Project status](docs/project-status.md) — prototype; what that means in practice

Contributing and policies: [CONTRIBUTING.md](CONTRIBUTING.md) ·
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) · [SECURITY.md](SECURITY.md) ·
[CHANGELOG.md](CHANGELOG.md)

## Getting help

- **FHIR and profiling questions** — HL7 FHIR Zulip <https://chat.fhir.org>,
  stream `german/mi-initiative`. Free to join; this is where the MII KDS IGs
  point their readers.
- **MII coordination** — MII Zulip <https://mii.zulipchat.com/>, stream
  `MII-Kerndatensatz`. Access via the MII Geschäftsstelle
  (<office@medizininformatik-initiative.de>).

## Licence

[CC0-1.0](LICENSE), like the upstream base template.
