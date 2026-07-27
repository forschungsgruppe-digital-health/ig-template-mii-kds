# Recipe: cut a template release

**Goal.** Publish a new **SemVer** version of this template package.

**Prerequisites.** Your change is merged into `dev` and the preview builds green.
Releases are cut on `main` by **Release Please** (see [workflows.md](../workflows.md)).

## Steps

1. Make sure every change since the last release used **Conventional Commits**
   (`feat:`, `fix:`, `docs:` …) — Release Please derives the version bump and
   changelog from them.
2. Open a **`dev → main` pull request**. Merge it as a **merge commit** (not a
   squash), so the individual commits reach `main`.
   > **Why not squash:** squashing collapses the changelog to one line.
3. On `main`, `release-please.yml` opens (or updates) a **release PR** that bumps
   the version in `package/package.json` + `package-list.json` and writes the
   `CHANGELOG.md`.
4. Review that release PR (check the proposed version — `feat:` → minor, `fix:` →
   patch, a `!`/`BREAKING CHANGE` → major) and **merge it**.
5. Merging cuts the git tag `vX.Y.Z` and a GitHub Release; `notify-zulip.yml` then
   announces it to the MII Zulip (topic *Template Releases*).

## Expected result

A new `vX.Y.Z` tag + GitHub Release, an updated `CHANGELOG.md`, matching versions in
`package/package.json` and `package-list.json`, and a Zulip announcement (if the key
is configured — otherwise the job skips with a notice).

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| No release PR appeared | No release-worthy Conventional Commits since last release, or `ENABLE_RELEASE_PLEASE=false` | Ensure `feat:`/`fix:` commits exist; check the repo variable |
| Changelog is one line | The `dev → main` PR was squashed | Use a **merge commit** for `dev → main` |
| Version files out of sync | An embedded version was not in `extra-files` | Add it to `release-please-config.json` |
| Zulip not posted | `ZULIP_API_KEY` secret absent | Expected — the job skips with a notice; add the secret to enable |

> Modules do **not** use this recipe: the MII meta wiki's
> [Module Release Workflow](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Module-Release-Workflow)
> defines **CalVer** releases for them. Adding Release Please on top of that
> would produce a second, conflicting version stream — which is why these
> template repositories keep the two schemes strictly apart.
