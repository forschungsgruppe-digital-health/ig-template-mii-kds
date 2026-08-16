# Documentation

Start with the [recipes](recipes/) if you have a task in hand. This page is the
map of everything else.

You do not edit this repository to write an IG — you reference it. To *use* the
template in a module, see
[recipes/consume-this-template-in-a-module.md](recipes/consume-this-template-in-a-module.md).
Everything else here is about changing the template itself.

## I want to …

| … do this | … read this |
| --- | --- |
| Get the toolchain running and build the preview | [recipes/first-build-in-devcontainer.md](recipes/first-build-in-devcontainer.md) |
| Understand a term I do not recognise | [glossary.md](glossary.md) |
| Understand what an IG template is and why this one exists | [concepts.md](concepts.md) |
| Publish the preview so someone can look at it | [recipes/publish-the-preview-on-github-pages.md](recipes/publish-the-preview-on-github-pages.md) |
| Change a colour, a logo, or the footer | [styleguide.md](styleguide.md) · [recipes/change-the-brand-color.md](recipes/change-the-brand-color.md) |
| Show one artifact's structure as tabs inside a page | [recipes/tab-an-artifact-structure.md](recipes/tab-an-artifact-structure.md) |
| Know what CI runs, and which variable turns it off | [workflows.md](workflows.md) |
| Keep the toolchain and dependencies current | [maintenance.md](maintenance.md) |
| Cut a release so modules can pin it | [recipes/cut-a-template-release.md](recipes/cut-a-template-release.md) |
| Enable the terminology server or release announcements | [secrets.md](secrets.md) |
| See how this follows the published HL7 guidance | [ig-best-practices-checklist.md](ig-best-practices-checklist.md) |
| Know whether this is production-ready | [project-status.md](project-status.md) |
| Know what is unfinished, and why | the [issue tracker](../../../issues); decided limits: [maintenance.md](maintenance.md) |
| Read the specifications this is built on | [further-reading.md](further-reading.md) |

## Reading order for a newcomer

1. [glossary.md](glossary.md) — the vocabulary, so the rest reads faster.
2. [concepts.md](concepts.md) — what this package is, and what it is not.
3. [recipes/first-build-in-devcontainer.md](recipes/first-build-in-devcontainer.md)
   — get a build before changing anything.
4. [styleguide.md](styleguide.md) — the layout/design conventions; the full source derivations are preserved in git history (`docs/design.md`).

## What is a recommendation and what is a rule

Almost everything here is **this template's** own choice or a recommendation. It
is not MII policy: the MII's published rules live in the KDS governance and on
the [MII website](https://www.medizininformatik-initiative.de/), and
[CONTRIBUTING.md](../CONTRIBUTING.md) says which of them apply.

The exceptions — things that genuinely fail a build here — are stated as such in
[workflows.md](workflows.md).
