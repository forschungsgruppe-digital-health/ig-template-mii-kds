# `scripts/`

Every executable helper in this repository. One directory, one concern: things
you run. The distinction between "tools" and "scripts" was not one a reader
could predict, so there is only this one.

| Script | What it does | Run by |
| --- | --- | --- |
| `check-updates.mjs` | Reports drift between the pinned toolchain/dependency versions and what upstream released | `dependency-check.yml` (weekly), and manually |
| `check-updates.test.mjs` | Unit tests for the checker's version parsing | `security-scan.yml`, `dependency-check.yml` |
| `check-language-model.sh` | Fails the build when a file re-asserts the language model this repository moved away from | `security-scan.yml` on a PR to `dev` |
| `set-su-termserv-secrets.sh` | Validates an SU-TermServ client certificate and uploads it as repository secrets | a maintainer, once |
| `trace-logo.sh` | Traces an official MII logo PNG into the SVG the template ships | a maintainer, when a logo changes |

Run the tests offline:

```bash
node --test scripts/check-updates.test.mjs
```
