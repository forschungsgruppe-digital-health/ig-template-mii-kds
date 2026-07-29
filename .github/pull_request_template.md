<!-- Delete any section that does not apply. A one-line fix does not need three
     headings; a branding change does. The title must be a Conventional Commit
     line — it becomes the squash commit on `dev`. See CONTRIBUTING.md. -->

## Summary

<!-- What this changes, as bullets. -->

## Rationale

<!-- Why. Reference the doc, spec or issue that motivated it, and call out any
     choice a reviewer would not guess. Skip for an obvious fix. -->

## How to verify

<!-- Numbered, copy-pasteable steps a reviewer can run. For a visual change,
     link the CI preview URL and say which page to open. -->

---

<!-- Tick what applies. Unticked boxes are fine if the row is irrelevant —
     they are a prompt, not a gate. -->

- [ ] Targets `dev` (only a maintainer's release PR targets `main`)
- [ ] CI is green
- [ ] Docs updated in the same PR as the change they describe
- [ ] Branding or CSS change: preview checked in **both** `/en/` and `/de/`
- [ ] Touches `includes/`, `content/`, `package/` or `translations/`: these are
      copied into every module repository, so they must stay self-contained and
      the module scaffold needs a re-vendor afterwards
- [ ] Version pin changed: the checksum next to it was updated too
