# How this template relates to the official HL7 IG guidance

This template is a proposal for a shared MII KDS look. HL7 publishes guidance for
IG and template authors; this page records, item by item, how this repository
currently follows it and where it deliberately differs. It is a self-assessment
by this repository's maintainer, not an MII or HL7 conformance statement, and it
says nothing about what a module IG is obliged to do.

The module-author counterpart lives in the module scaffold:
[`mii-kds-module-template` → `docs/ig-best-practices-checklist.md`](https://github.com/forschungsgruppe-digital-health/mii-kds-module-template/blob/dev/docs/ig-best-practices-checklist.md).

## Sources (all official, retrieved 2026-07-26)

| # | Source | What it covers |
|---|---|---|
| S1 | [Guidance for FHIR IG Creation — **IG Best Practices**](https://build.fhir.org/ig/FHIR/ig-guidance/best-practice.html) (HL7 International / FHIR Management Group) | pages & organisation, writing, diagrams, artifacts, profiles, terminology, security & privacy, examples |
| S2 | [**Using the HL7 IG Templates**](https://build.fhir.org/ig/FHIR/ig-guidance/using-templates.html) and [**Extending the HL7 IG Templates**](https://build.fhir.org/ig/FHIR/ig-guidance/template.html) | how a template is built, extended and consumed |
| S3 | [**Multi-language IGs**](https://build.fhir.org/ig/FHIR/ig-guidance/languages.html) | translation mechanics |
| S4 | [**Changing colors in the template**](https://build.fhir.org/ig/FHIR/ig-guidance/colors.html) | branding via template CSS variables |
| S5 | [**Managing Canonical Versions (pinning)**](https://build.fhir.org/ig/FHIR/ig-guidance/pinning.html) | canonical/version pinning |
| S6 | [HL7 **IG Publisher Documentation**](https://confluence.hl7.org/display/FHIR/IG+Publisher+Documentation) | build & publication (`-go-publish`) |
| S7 | [`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) — the base this template derives from | template package structure |
| S8 | [MII meta wiki](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki) | MII naming, conformance, terminology and release rules |

**Legend** — ✅ met · ⚠️ met with a deviation, named in the row · 📝 module
author's responsibility (this template provides the mechanism) · ➖ not
applicable to a template.

---

## 1. Template construction (S2, S7)

| Check | State | Evidence |
|---|---|---|
| Derives from an official HL7 base template rather than forking it | ✅ | `package/package.json` declares `fhir2.base.template` as its base |
| Overrides only the designed extension points | ⚠️ | Two of the shipped files fill the base's empty placeholders (`fragment-header.html`, `fragment-css.html`). The others do not: `fragment-footer.html` replaces a fragment that carries base content, `content/assets/js/lang-redirects.js` and `content/assets/ico/favicon.png` replace base files at the same path, and `includes/structure-tabs.html` is an added include with no base counterpart. Each is listed with its reason in [`docs/styleguide.md`](styleguide.md) §1. The deviation that matters is the same-path replacement: a base change to those two files is silently discarded |
| Does **not** ship `config.json` (which replaces, not merges) | ✅ | [`docs/styleguide.md`](styleguide.md) §1 |
| Branding is done through the base's CSS **variables**, not rule overrides | ⚠️ | Every *colour* is a base variable and no base colour rule is re-declared — [`docs/styleguide.md`](styleguide.md) §1–§2. But `mii.css` is not variables-only: it ships four rule blocks (highlight boxes, narrative tables, content images, structure-tabs), listed in [`docs/styleguide.md`](styleguide.md) §5a. Three add new classes; the content-image block deliberately overrides the base's `p > img` float |
| The base version is pinned (reproducible builds) | ✅ | `0.1.0`, never `#current`; drift is surfaced by `dependency-check.yml` |
| The template is exercised by a real build before release | ✅ | The bundled preview IG builds on every push (`ig-preview.yml`) |
| Validated against a real module | ✅ | `kerndatensatz-basis` (`main`, `2026.0.1`, 63 generated conformance resources) was built with its `ig.ini` pointing at this template, vendored: SUSHI compiled it with 0 errors and 0 warnings. The full IG-Publisher render is covered by the preview build in CI |

## 2. Multi-language support (S3)

| Check | State | Evidence |
|---|---|---|
| Multi-language is set up the supported way | ✅ | `i18n-default-lang: en`, `i18n-lang: [de]` — the same model as `kerndatensatz-basis` ([`docs/recipes/add-translation.md`](recipes/add-translation.md)) |
| Uses the language-aware base and the supported translation mechanism | ✅ | `fhir2.base.template` is the *translated* base; translations follow the HL7 reference layout |
| Header/footer overrides are language-aware, not hard-coded to one language | ✅ | [`docs/styleguide.md`](styleguide.md) §4 (logo variants) and §6 (footer labels and link targets) |
| The base UI strings resolve in every offered language | ✅ | German catalogs vendored, because the pinned base ships none — [`translations/README.md`](../translations/README.md) |
| The menu can be translated | ✅ | Per-language `input/translations/<lang>/includes/menu.xml`; the untranslatable `menu:` property is deliberately not used |
| Language switching works in the rendered output | ✅ | `/de/` and `/en/` both render with the correct menu, footer and content; the landing-page redirect is overridden in `content/assets/js/lang-redirects.js` (the reason is in that file) |

## 3. Presentation quality (S1 §Pages/Writing/Images, S4)

| Check | State | Evidence |
|---|---|---|
| Consistent, deliberate colour scheme | ✅ | Every colour in `mii.css` is sourced from an MII asset and contrast-checked — [`docs/styleguide.md`](styleguide.md) §2 |
| Accessible contrast on chrome (navbar, footer, breadcrumb) | ✅ | WCAG AA computed per surface in [`docs/styleguide.md`](styleguide.md) §8; one known limitation is recorded in §7 (footer links are not underlined — site-faithful, accepted) |
| Consistent page chrome (no mixed white/grey surfaces) | ✅ | Header sides and container are both white, matching the logo background and the content area |
| Graphics are licence-clean and their source is available | ✅ / 📝 | Logo/favicon provenance + SHA-256 are preserved in this repository's git history (`docs/design.md`, the styleguide's predecessor); the reproduction commands are in [`docs/recipes/replace-the-logo.md`](recipes/replace-the-logo.md) — [`docs/styleguide.md`](styleguide.md) §4; open follow-ups: an official SVG and MII trademark redistribution confirmation (issues #25/#26) |
| Reusable callout styles for authors | ✅ | Five `mii-highlight-<color>` classes, purpose-neutral so modules assign meaning — [`docs/styleguide.md`](styleguide.md) §3 |
| A tabbed structure view an author can drop into a page | ✅ | `includes/structure-tabs.html` — [`docs/recipes/tab-an-artifact-structure.md`](recipes/tab-an-artifact-structure.md) |

## 4. What the template makes easy for module authors (S1)

What HL7 recommends below is fulfilled *in a module*, but a template either
enables or obstructs it. This is what the scaffold provides as a starting point;
what a module keeps is the module author's call:

| HL7 recommends (S1) | Provided by the scaffold |
|---|---|
| Separate non-normative from normative content | The scaffold's page set (guidance/downloads vs conformance pages), modelled on `kerndatensatz-basis` |
| A Security & Privacy Considerations section | `security-and-privacy.md` ships with a suggested structure a module can keep or replace |
| Explain `mustSupport` | `must-support.md` ships suggested server/client expectations, phrased as a starting point for the module author |
| Say how to engage with the community | Index *Contact* block → `chat.fhir.org` `german/mi-initiative` + GitHub issues |
| Reference the IG registry / related guides | Index *Related guides* block → [FHIR IG Registry](https://fhir.org/guides/registry/) |
| Artifact intros and notes | `input/intro-notes/` wired via `path-pages` |
| Examples with synthetic data only | A worked example instance (`Max Mustermann-Testpatient`) |
| Pin canonicals and dependencies (S5 describes the options) | The scaffold sets `pin-canonicals: pin-all` and fixed dependency versions; in repositories created from it, its `convention-check` job fails the build on any floating dependency or template pin |

## 5. Publication (S6, S8)

| Check | State | Evidence |
|---|---|---|
| Publication uses the IG Publisher's `-go-publish` mode | ✅ | In the module scaffold: `go-publish.yml`, `workflow_dispatch`-only and dry-run by default, so publishing is always a human step |
| The template itself is versioned and released so modules can pin it | ✅ | SemVer via Release Please; `package-list.json` tracks the versions |
| Consumers can pin a template version | ✅ | `template = de.medizininformatikinitiative.template#<version>` in a module's `ig.ini` — today via the vendored mirror, since the package is not registry-published ([`docs/project-status.md`](project-status.md)) |
| Registry publication is a deliberate, human decision | ✅ | Deferred by decision — see [`docs/project-status.md`](project-status.md) |

---

## Where this project deliberately differs

- **The base template is pinned to `0.1.0`, while the MII reference repos float
  `#current`** — for reproducibility; see [`docs/concepts.md`](concepts.md) §2.
- **The template is not listed in `FHIR/ig-registry`** — a deferred decision; see
  [`docs/project-status.md`](project-status.md).

## Re-check on a toolchain bump

The evidence above is tied to the pinned IG Publisher and base-template versions.
When either pin changes, rebuild the preview, re-inspect `/de/` and `/en/`, and
update this page together with [`docs/recipes/add-translation.md`](recipes/add-translation.md).
