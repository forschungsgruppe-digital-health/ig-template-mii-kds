# Recipe: publish the preview on GitHub Pages

**Goal.** Get the rendered preview IG served at a URL, so a branding change can
be looked at instead of imagined.

**Prerequisites.** A repository copy of this template (a fork, a transfer, or a
new repository created from it) where GitHub Actions is enabled. Nothing to
install locally.

## What is already automated, and what is not

`ig-preview.yml` builds the preview on **every push to any branch except
`main`, `gh-pages` and `fsh-generated`**, then commits the rendered site to the
`gh-pages` branch under `branches/<branch-name>/` and comments the URL on an
open pull request.

That part needs no setup. **Serving those files does** — pushing to `gh-pages`
publishes nothing until the repository is told to serve that branch. This is the
one manual step, and it is easy to miss because the workflow goes green either
way: it did its job, the files are on the branch, and nothing is reachable.

## Steps

1. **Push any branch.** The first preview build creates `gh-pages` for you —
   it orphan-initialises the branch and adds a `.nojekyll` marker, so no Jekyll
   processing mangles the IG Publisher's output. Until a branch is pushed, the
   `gh-pages` branch does not exist and step 2 has nothing to select.

2. **Point Pages at the branch.** *Settings → Pages → Build and deployment →
   Source: **Deploy from a branch** → Branch: `gh-pages`, folder `/ (root)`* →
   *Save*.

   Or from a terminal:

   ```sh
   gh api -X POST repos/:owner/:repo/pages \
     -f 'source[branch]=gh-pages' -f 'source[path]=/'
   ```

   Use `-X PUT` instead of `-X POST` if Pages is already enabled and you are
   changing the source.

3. **Wait for the deployment**, then open the URL. GitHub reports it under
   *Settings → Pages*, or:

   ```sh
   gh api repos/:owner/:repo/pages --jq '.html_url, .status'
   ```

## Expected result

`gh api repos/:owner/:repo/pages` reports `source.branch: gh-pages`,
`source.path: /` and `status: built`, and a branch preview is reachable at:

```text
https://<owner>.github.io/<repo>/branches/<branch-name>/
```

The English rendering is under `/en/`, the German under `/de/`. On a pull
request, the workflow posts that URL as a comment and updates the same comment
on later pushes rather than adding new ones.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Workflow is green, URL is 404 | Pages was never pointed at `gh-pages` — the usual case | Do step 2 |
| `gh-pages` is not offered in the Settings dropdown | The branch does not exist yet; the first preview build creates it | Push a branch, let `ig-preview.yml` finish, then retry |
| The site renders as raw Markdown or half the assets 404 | Jekyll processed the output | Check `.nojekyll` exists at the root of `gh-pages`; the workflow creates it when it initialises the branch |
| Preview builds stopped appearing | `ENABLE_PREVIEW` is set to `false` | Remove or set the repository variable to anything but `false` |
| A deleted branch's preview is still online | The sweep runs weekly | Run `cleanup-gh-pages.yml` manually, or wait for Sunday |
| Pushing to `main` produces no preview | Deliberate — `main` and `gh-pages` are excluded from the trigger | Preview from a working branch; `main` is what a release publishes from |

> **Why a branch push rather than the Pages Actions deployment:** the Actions
> deployment path publishes one site per run, which would replace the whole
> Pages site each time. Committing under `branches/<branch-name>/` keeps every
> open branch's preview reachable at once, which is what reviewing a branding
> change needs. The module scaffold, which has to publish a real IG at a stable
> path as well as previews, supports both and chooses with a repository
> variable.

## After the repositories move organisation

Pages settings do not travel with a transfer in every case, and the site URL
changes with the owner. Re-check step 2 after any move, and expect the
`https://<owner>.github.io/...` prefix in documentation and in
`sushi-config.yaml` to need updating — see
[issue #114](../../../../issues/114) (the organisation move).
