# `scripts/`

Every executable helper in this repository lives here.

| Script | What it does | Run by |
| --- | --- | --- |
| `check-updates.mjs` | Reports drift between the pinned toolchain/dependency versions and what upstream released | `dependency-check.yml` (weekly), and manually |
| `check-updates.test.mjs` | Unit tests for the checker's version parsing | `security-scan.yml`, `dependency-check.yml` |
| `terminology-fallback.test.mjs` | Asserts `ig-preview.yml` falls back to `tx.fhir.org` for a missing **or partial** SU-TermServ credential instead of failing the build | `security-scan.yml`, `dependency-check.yml` |
| `narrative-table-styles.test.mjs` | Simulates the shipped table selector against fixtures from both built sites, so it can never widen back to a form (such as bare `table:not([class])`) that repaints publisher-generated tables | `security-scan.yml`, `dependency-check.yml` |
| `brand-switch.test.mjs` | Guards the NUM-DIZ/MII brand switch: `num-diz.css` overrides the complete MII variable set, the fragments' guards match `mii` exactly (unset/unknown values render the NUM-DIZ default; only `{ "design": "mii" }` selects MII), the documented NUM-DIZ pairs hold WCAG AA (recomputed from the shipped hex), and the English combo logo keeps its official-asset vectorization provenance | `security-scan.yml`, `dependency-check.yml` |
| `toolchain-pins.test.mjs` | Fails when `ig-preview.yml` and `release-demo.yml` stop pinning the same IG Publisher / SUSHI / Jekyll / JDK / Node / Ruby, and asserts the release demo writes only under `demo/<tag>/` and drops no sweepable `.branch-name` marker | `security-scan.yml`, `dependency-check.yml` |
| `update-demo-links.mjs` | Conservatively repoints the hand-authored `gh-pages/index.html` at a newly released demo; `--check` dry-runs it and prints the before/after diff | `release-demo.yml`, and manually |
| `update-demo-links.test.mjs` | Pins the rewriter's safety properties: a missing required anchor throws instead of silently leaving the page on the previous release, and rewriting is idempotent and chains across releases | `security-scan.yml`, `dependency-check.yml` |
| `check-language-model.sh` | Fails the build when a file re-asserts the language model this repository moved away from | `security-scan.yml` on a PR to `dev` |
| `set-su-termserv-secrets.sh` | Validates an SU-TermServ client certificate and uploads it as repository secrets | a maintainer, once |
| `trace-logo.sh` | Traces an official MII logo PNG into the SVG the template ships | a maintainer, when a logo changes |

Run the tests offline:

```bash
node --test scripts/*.test.mjs
```

The two CI runner lists (`security-scan.yml`, `dependency-check.yml`) name each
test file instead of globbing, so adding a suite to CI stays a deliberate edit.
A new `*.test.mjs` file has to be added to both.
