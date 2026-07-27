# Recipes

Short, task-shaped guides for maintaining this template. Each one takes a single
job from start to a checkable result. Start with the
[first build](first-build-in-devcontainer.md) if you have not built the preview
yet.

## Maintaining the template

| Recipe | Use it when |
| --- | --- |
| [first build in the dev container](first-build-in-devcontainer.md) | You just cloned and need a working toolchain |
| [change the brand colour](change-the-brand-color.md) | A colour has to change |
| [replace the logo](replace-the-logo.md) | A logo file has to change |
| [languages in the template](add-translation.md) | A UI label is blank in one language, or you add a language |
| [cut a template release](cut-a-template-release.md) | `dev` is ready to be pinned as a version — vendoring modules already have it |

## Using the template

| Recipe | Use it when |
| --- | --- |
| [consume this template in a module IG](consume-this-template-in-a-module.md) | A module has to reference this template |

## Keeping it healthy

| Recipe | Use it when |
| --- | --- |
| [review a dependency update](review-a-dependency-update.md) | A bump was proposed and someone has to decide |
| [triage a vulnerability alert](triage-a-vulnerability-alert.md) | A security finding needs a decision |

## The pattern every recipe follows

Recipes are written to the same shape so you always know where to look. If you
add one, follow it:

```markdown
# Recipe: <imperative task>

**Goal.** One sentence: what you will have achieved.

**Prerequisites.** What must already be true.

## Steps
1. …

## Expected result
What you should see when it worked.

## Common errors & fixes
| Symptom | Cause | Fix |
```

Sections in between are fine — background, a comparison table, a "why" note —
but the five anchors above stay, in that order, so a reader can skip to the
part they need. File names are kebab-case and start with the verb.
