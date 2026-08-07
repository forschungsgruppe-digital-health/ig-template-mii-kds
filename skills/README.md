# `skills/` — the agent skills of this repository

One folder per skill, instructions in `SKILL.md` ([agent-skills
format](https://agentskills.io)). `.claude/skills` and `.agents/skills` are relative symlinks to
this directory, so every agent runtime reads the identical content.

Every skill here is **written here** — this repository is their source of truth, and a fix belongs
in this repository.

| Skill | What it does |
| --- | --- |
| [`wiki-consistency-check/`](wiki-consistency-check/SKILL.md) | The single convention checker: repo ↔ MII meta wiki drift plus the metadata conventions these templates adopt. |
| [`ig-translate/`](ig-translate/SKILL.md) | Multi-language support in **template-owner scope**: the en-default language policy and its guard, the language-neutrality of the header/footer/CSS overrides, the vendored German UI strings, the verified rendering table. |
| [`docs-steward/`](docs-steward/SKILL.md) | Checks, repairs and trims this repository's documentation — links, paths and factual claims verified against the repo itself. |

Report-only by design: they propose, a human decides, and any change lands as a pull request
targeting `dev`.

## Skills this repository does not carry

Measuring an Implementation Guide and producing a *guide's* translation supplements are **not**
local skills here. They live in the organization's skill catalog,
[`forschungsgruppe-digital-health/agent-skills`](https://github.com/forschungsgruppe-digital-health/agent-skills),
which is their single source of truth:

| Task | Catalog skill | Note |
| --- | --- | --- |
| Measure / compare Implementation Guides (read-only statistics, hygiene, maturity) | `fhir-ig-analysis` | Ported from `mii-kds-module-template`, developed further in the catalog |
| Produce a *guide's* translation supplements (translate or harvest) | `fhir-ig-translation` | Ported likewise, and generalised to any language pair |
| Migrate a Simplifier/Forge-published KDS module onto the module scaffold | `mii-ig-migration` | Never local |

```bash
CATALOG=https://github.com/forschungsgruppe-digital-health/agent-skills/tree/v0.12.0
npx skills add "$CATALOG" --list
npx skills add "$CATALOG" --skill fhir-ig-analysis fhir-ig-translation --agent claude-code codex --global --yes
```

Pin with the `/tree/<ref>` form — `owner/repo@v0.12.0` does *not* pin: in that CLI `@` introduces a
skill *name*, and the install silently comes from the default branch. The catalog's own
[`docs/consuming-skills.md`](https://github.com/forschungsgruppe-digital-health/agent-skills/blob/main/docs/consuming-skills.md)
documents all three consumption paths.

### Why they are not vendored here

[`mii-kds-module-template`](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template)
**does** vendor `fhir-ig-analysis` and `fhir-ig-translation` at a pinned ref, because that is where a
module author measures and translates a guide, and because "Use this template" copies tracked files
while fetching nothing — an agent can only invoke a skill that is present on disk.

This repository is the **branding package**: the header, footer, CSS, layouts and language mechanism
a guide is rendered *with*. It contains no Implementation Guide to measure and no guide content to
translate. A vendored copy here would be a second pinned copy to keep current with no user behind
it. Install the catalog skills globally (`--global`, above) if you want them while working here.

`ig-translate` is **not** superseded by the catalog's `fhir-ig-translation` and is not a duplicate of
it: this one is the *template package's* obligations, which the catalog skill explicitly delegates
back to this repository; the catalog skill covers a *guide's* content.

## Skills never install other skills

A skill that needs another one states it as a **precondition** and prints the exact install command
for the user to run. It never installs anything itself: `allowed-tools` grants permissions, it does
not declare dependencies; an auto-install would write into the user's project as a side effect of an
unrelated invocation and make the run depend on a network fetch nobody asked for.
