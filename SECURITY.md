# Security Policy

## Reporting a vulnerability

Please report suspected vulnerabilities **privately** via GitHub's private
vulnerability reporting:

1. Open the **Security** tab **of the repository you are reading this in**.
2. Choose **Report a vulnerability** — that opens a draft security advisory.
3. Describe the issue, affected files/versions, and reproduction steps.

> **No absolute link on purpose.** These repositories are moving to the
> `medizininformatik-initiative` organisation. A hard-coded advisory URL sends
> reports to whichever copy the link names — which, while the move is in
> progress, may be an empty repository nobody is watching. A vulnerability
> report that goes somewhere unread is worse than an inconvenient one.

Do **not** open a public issue for security problems.

> **Why private reporting instead of a public issue:** a public report exposes
> consumers of the template before a fixed version exists; the advisory flow
> keeps the report confidential until a fix is released.

## Scope

This repository contains a **static IG-Publisher template package** (HTML/Liquid
fragments, CSS, images, configuration). It ships **no runtime service**, stores
no data, and exposes no network endpoints. The security-relevant surface is
therefore limited to:

- **Generated site content** — e.g. script injection (XSS) via template
  fragments that end up in every rendered Implementation Guide.
- **Supply chain** — the CI workflows, pinned actions/tools, and the integrity
  of the published template package that downstream IG builds download.

Reports about the *content* of an Implementation Guide built with this template
belong to that guide's own repository, not here.
