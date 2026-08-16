# Migration cleanup — what to delete, edit or decide when this repository moves

The repositories move to the `medizininformatik-initiative` GitHub
organisation on an explicit decision (see [project status](project-status.md)).
This page is the checklist for that day. **Work through it top to bottom, then
delete this file last.** The module template repository carries its own copy
(`docs/migration-cleanup.md` there).

## Delete after migration

| File | Why it can go |
| --- | --- |
| `docs/project-status.md` | The prototype/organisation status page. Its open questions dissolve at adoption + move; carry any surviving decision into the README or an ADR-style note before deleting. |
| `docs/migration-cleanup.md` | This file — last, once every row is done. |

## Edit in one pass after migration (do not delete)

| File / place | What to change |
| --- | --- |
| Navigation links repo-wide | The recorded one-pass sweep: `forschungsgruppe-digital-health` → `medizininformatik-initiative` in README, docs, skills. Canonical URLs and package ids already name the target and stay untouched (`docs/project-status.md`). |
| `input/data/repo.json` | The single substitution point for the demo pages' file links (see `translationinfo`): set `url` to the target-organisation repository. Older published builds keep resolving through GitHub's repository redirect. |
| `.github/CODEOWNERS` | No active rule by design; add the owning team of the target organisation. |
| `SECURITY.md`, `CODE_OF_CONDUCT.md` | Fill the deliberately-unset contacts/routes with the target organisation's. |
| `docs/secrets.md` `--repo` examples | The sweep above covers them. |

## Not migration business (different lifecycle)

- Publishing `de.medizininformatikinitiative.template` to a FHIR package
  registry and registering it in `FHIR/ig-registry` — an explicit publication
  decision ([#112](../../../issues/112)/[#113](../../../issues/113)), not the org move.
- The preview IG (`input/`, `sushi-config.yaml`, `ig.ini`) — stays: the
  template needs its rendered preview wherever it lives.
