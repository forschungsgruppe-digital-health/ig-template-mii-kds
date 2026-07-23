# `structure/` — canonical MII KDS module page structure (Option B)

This folder is the **single source of truth for the page structure and menu** of
an MII KDS module Implementation Guide: which pages a module has
([`pages.yaml`](pages.yaml)) and how they are navigated ([`menu.yaml`](menu.yaml)).

> **Why it lives in the IG template, not each module:** so every MII module IG has
> the same, centrally-maintained structure. When the standard MII module page set
> changes, it changes here once.

**Important — how "ownership" works technically.** The IG Publisher reads a module's
menu only from that module's own `input/includes/menu.xml` or its `sushi-config.yaml`
`menu:` property; a template **cannot** inject a menu that modules inherit
automatically. So this folder is *authoritative*, and each module **mirrors** it:
the module template (`mii-kds-module-template`) ships a copy in its
`sushi-config.yaml` and re-syncs against this folder when it changes (see that
repo's `docs/recipes/sync-structure.md`). The template package's self-test renders
this structure on its **Module Structure** page so the canonical set is visible.
