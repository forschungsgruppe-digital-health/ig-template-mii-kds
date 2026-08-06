# Further reading

A curated, verified reading list. Each entry says **why** you would read it. Links
were checked when this file was written; if one moves, search its title.

## MII — the rules this project follows, and where they are actually defined

MII-wide rules are defined in the MII's own governance and in the
[MII meta wiki](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki),
not here; when they and this repo disagree, they win.

- [KDS-Governance v4.0](https://www.medizininformatik-initiative.de/sites/default/files/2026-07/KDS-Governance-v4.pdf)
  (PDF, 7 May 2026) — the governance adopted by the Nationales Steuerungsgremium:
  how a KDS module is developed, decided and released. § 5.1.2 names the two
  sanctioned comment channels — the HL7 Deutschland ballot portal, or an issue in
  the module's own GitHub repository — and § 3.5.4 obliges the module team to
  answer every comment. Read it before assuming any rule in this repository is an
  MII rule.
- [Namenskonventionen für FHIR-Ressourcen in der MII](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Namenskonventionen-für-FHIR‐Ressourcen-in-der-MII)
  — the naming rules for packageId, id, name, title and canonicals. Read before
  you name anything. What checks them depends on the rule: some are asserted
  mechanically in a created module (`scripts/convention-check.mjs`, and the
  Simplifier quality-control rules in `qc/custom.rules.yaml` that the MII
  reusable validation reads); some surface only when the FHIR validator runs;
  and some are conventions nothing enforces, which somebody has to compare by
  hand. **This repository runs none of them** — it carries no
  convention checker and no `qc/` rules; both live in the module scaffold.
- [Conformance](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Conformance)
  — what "conformant" means for MII modules (Must-Support, cardinalities).
- [Terminology Version Policy](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Terminology-Version-Policy)
  — how code system versions are pinned; relevant to terminology-server choice.
- [Module Release Workflow](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow)
  — the **CalVer** release process for modules (contrast with this template's SemVer).
- [GitHub Reusable Validation Workflows](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/GitHub-Reusable-Validation-Workflows)
  — the shared CI validation the module scaffold consumes.
- [Dev Container ‐ IG Publisher](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Dev-Container-‐-IG-Publisher)
  — the dev-container approach this repo aligns with.
- [Release 2027](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Release-2027)
  — evidence that the KDS is maintained past 2026; the post-funding horizon this
  repo is built for.

## FHIR, IG Publisher and authoring

- [FHIR R4 specification](https://hl7.org/fhir/R4/) — the standard itself (this
  project is R4 / 4.0.1). Start with "Resource" and "Profiling".
- [IG Publisher documentation](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation)
  — the build tool, its parameters, templates and `-go-publish`.
- [SUSHI documentation](https://fshschool.org/docs/sushi/) and
  [FSH School](https://fshschool.org/) — learn FHIR Shorthand and how SUSHI turns
  it into resources.
- [`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) — the base
  template this one derives from; read its `package/package.json`, `includes/` and
  `package-list.json` to understand what we override vs inherit.
- [`FHIR/ig-registry`](https://github.com/FHIR/ig-registry) — the public IG/template
  registry; `templates.json` is where a template like this one would be listed.
- [FHIR sample IG](https://build.fhir.org/ig/FHIR/sample-ig/) — a minimal reference
  IG, useful when you want to see a complete small example.

## Tooling conventions

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) — the
  commit-message format that drives releases here (see [CONTRIBUTING.md](../CONTRIBUTING.md)).
- [Semantic Versioning 2.0.0](https://semver.org/) — the version scheme for the
  **template repos** (modules use CalVer).
- [Release Please](https://github.com/googleapis/release-please) — the release
  automation used on `main`.
- [Development Containers](https://containers.dev/) — the dev-container standard our
  `.devcontainer/` follows.

## Getting help

- HL7 FHIR community Zulip — <https://chat.fhir.org>, stream `german/mi-initiative`.
- MII Zulip — <https://mii.zulipchat.com/>, stream `MII-Kerndatensatz`.

See also [Getting help in the README](../README.md#getting-help).
