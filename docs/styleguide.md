# Styleguide — MII branding for `de.medizininformatikinitiative.template`

The layout and design conventions of this template: what the branding is, which
rules keep it consistent and accessible, and which boundaries must not be
crossed. Every color and asset traces to a file that MII or HL7 publishes; the full
source-by-source derivation (URLs, checksums, pixel analyses) is preserved in
this repository's git history (`docs/design.md`, the styleguide's
predecessor). Follow-ups on the logo assets (an official SVG, trademark
permission) are tracked in [open-tasks.md](open-tasks.md).

---

## 1. Inheritance rules (how this template extends the base)

The template derives from `fhir2.base.template` (pinned `0.1.0`) — the
language-aware base both MII reference repos use. The rules:

- **Override only the base's extension points.** The override set is exactly:
  `includes/fragment-header.html`, `includes/fragment-css.html`,
  `includes/fragment-footer.html`, one CSS file
  (`content/assets/css/mii.css`), the logo/favicon assets, and the vendored
  German UI catalogs in `translations/`. Header and CSS fragments are the
  base's *designed* child extension points (empty placeholders); the footer
  override preserves the base's link structure and appends to it.
- **Never ship `config.json`, `layouts/`, `liquid/`, `scripts/` or a
  `translations/stringsBase.json`.** The IG Publisher *replaces* (does not
  merge) these per template directory — a copy forks the whole base and
  silently detaches from base updates. This is also why the template cannot add
  new `stringsBase` keys of its own.
- **Never override `fragment-pageend.html`** (or other core layout fragments).
  It is core page layout; a vendored copy risks breaking the whole style on a
  base-template bump. This was tried and deliberately reverted — the known
  consequence (the publisher name in the © line stays English on `/de/`) is
  accepted; see [limitations](#7-recorded-limitations-do-not-fix-by-workaround).
- **CSS is variables-only.** `mii.css` overrides only the custom properties the
  base declares in `project.css` `:root` — no hard rule overrides — so a
  re-theme is a one-file edit with no cascade surprises. The single exception
  is the narrative-table block (§5), which styles a surface the base leaves
  completely unstyled.
- **When re-syncing an overridden fragment against a bumped base:** port
  structural changes only; do not restore the base's `stringsBase` label
  lookups in the footer (they render blank on `/de/` — §6).

## 2. Color palette

Use these tokens and no others; no raw hex outside `mii.css`.

| Role | Hex | Use for | Never for |
| --- | --- | --- | --- |
| MII slate | `#7a8495` | narrative-table borders, grey-hint border | text backgrounds (white on it is 3.78:1 — fails AA) |
| MII slate-dark | `#6a7484` | footer (both bands), IG title/status text, menu-active | — |
| MII blue | `#3473aa` | navbar, menu buttons, link hover | — |
| MII link blue | `#5773a2` | body links, menu hover, gradients | — |
| MII accent green | `#9abc31` | the top stripe, decorative accents | **any text surface** (white on it is 2.18:1) |
| MII vivid green | `#71b800` | logo artwork only | text surfaces (2.45:1 on white) |
| MII teal | `#528a94` | logo artwork only; reserved | text (white on it is 3.87:1) |
| Body text | `#333333` | text on white/light surfaces | — |
| Light background | `#ebedef` | breadcrumb, narrative-table headers | — |

The footer is **one uniform grey** (`#6a7484` for band *and* container):
slate-dark rather than the MII site's own footer slate because text sits on the
footer here, and white on true slate fails AA. Do not reintroduce the two-tone
band — it reads as a seam.

The page chrome at the top is **consistently white**: header sides and header
container are both `#ffffff` (the base ships three different light shades,
which read as an inconsistent white/grey mix). The green stripe and the blue
navbar provide the visual structure; the breadcrumb keeps `#ebedef` as a subtle
functional band.

Variables deliberately **not** overridden (they are IG-Publisher semantic
signals, not brand surfaces): publish box, TOC box, STU note, footer-nav strip,
dragon, translation box.

## 3. Highlight boxes

Five reusable classes for calling out content in narrative pages
(`<div class="mii-highlight mii-highlight-<color>">` with an `<h5>` heading, or
a kramdown attribute line `{: .mii-highlight .mii-highlight-<color>}` under a
blockquote). Styling only — a module decides what each color means; the
conventional reading:

| Class | Conventional meaning |
| --- | --- |
| `mii-highlight-blue` | neutral call-out |
| `mii-highlight-green` | positive/confirming note |
| `mii-highlight-orange` | warning |
| `mii-highlight-red` | important notice |
| `mii-highlight-grey` | hint / authoring note (all `[TODO: …]` prompts use it) |

All heading-on-background pairs are ≥ 6.1:1 (AA); the orange/red/grey borders
are ≥ 3.2:1 (WCAG 1.4.11). The inherited green border sits below the 3:1
non-text bar — kept for parity with kerndatensatz-basis; do not copy that
compromise into new variants.

## 4. Logo, favicon, assets

- The logo ships as **SVG, traced from the official PNGs** (MII publishes no
  brand SVG — the site's only SVG is the "10 Jahre" anniversary mark). This is
  a conversion, not an official asset: **replace both files the day the MII
  publishes a real SVG.** The exact reproduction commands live in
  [replace-the-logo.md](recipes/replace-the-logo.md); source URLs and checksums
  are preserved in git history (`docs/design.md`).
- **Two language variants** (`logo-de.svg`, `logo-en.svg`) because the wordmark
  text differs; `fragment-header.html` switches on `include.lang == 'de'`,
  non-`de` languages get the EN logo. Layout: MII logo in `#project-nav`
  (base's project slot, `height="50"`), HL7 FHIR family logo in `#family-nav`
  linking to <https://hl7.org/fhir> — mirroring kerndatensatz-basis. A module
  overriding `input/includes/fragment-header.html` replaces the fragment
  wholesale and must re-add both logos if it wants them.
- **Asset naming:** language-specific assets use `<name>-<lang>.<ext>`. Names
  dictated by other tools keep that tool's spelling: `favicon.png` (browser
  convention) and `deu.svg` — **never rename it**: the IG Publisher derives the
  flag file name from the IG's jurisdiction (`urn:iso:std:iso:3166#DE` → the
  ISO 3166-1 alpha-3 code). A different jurisdiction expects a different name
  (`aut.svg` for Austria).
- The favicon overrides the base's FHIR-flame icon by shipping the same path
  (`content/assets/ico/favicon.png`); the base's `rel="fhir-logo"` links stay
  untouched.

## 5. Narrative tables

Markdown tables in page content get, once, in `mii.css` (the base styles only
publisher-generated tables; kerndatensatz-basis compensates per page with
inline `<style>` blocks):

| Property | Value |
| --- | --- |
| Header background | `#ebedef` |
| Header text | `#333333` |
| Border | `1px solid #7a8495` |
| Padding | `6px 10px` |

**Guardrails:**

- The selector must exclude `[class]`, `[style]`, `[border]` and `[data-fhir]`.
  The obvious `table:not([class])` is **wrong**: the publisher's profile trees
  carry no class, only presentation attributes, and the short selector repaints
  them (34 generated tables, measured). What separates the two kinds is that a
  markdown table has *no attributes at all*.
  `scripts/narrative-table-styles.test.mjs` asserts the behaviour against
  fixtures from the built output — keep it passing; never "simplify" the
  selector.
- **No `width: 100%`** (kerndatensatz-basis sets it; this template does not):
  full width stretches two-column tables across the page. A module may add it
  for its own tables.

## 6. Language rules

- `{% if include.lang == 'de' %}` branches switch **assets and link targets
  only** — never inline translated body copy (kerndatensatz-basis' own header
  pattern). The one recorded exception: the footer's visible labels
  (`Links`, `Inhaltsverzeichnis`/`Table of Contents`, `QA-Bericht`/`QA Report`,
  `Impressum`/`Legal notice`) are hard-coded per language, because the pinned
  base ships no German catalog and its label mechanism renders **blank** on
  `/de/` — and the base has no Imprint key at all. Adding a third language
  means extending this label branch.
- The footer appends (never replaces) the base's link row, and adds:
  `medizininformatik-initiative.de` plus the imprint — `de` →
  `/de/impressum`, otherwise → `/en/legal-notice` (`/en/imprint` is 404).
- The template vendors the base's own `stringsBase-de.po` /
  `stringsArtifacts-de.po` into `translations/` for the rest of the base
  chrome. Vendored catalogs may differ from upstream in `msgstr` values only.
  Delete both once the pinned base ships `de` itself
  ([translations/README.md](../translations/README.md),
  [add-translation.md](recipes/add-translation.md)).
- Page titles (breadcrumbs, TOC, section captions) translate through the
  IG-resource catalog `input/translations/de/ImplementationGuide-<id>.po` —
  every page needs an `ImplementationGuide.definition.page.title` entry there,
  including "Table of Contents".
- The only other literal texts allowed are bare URLs and `alt` texts quoting
  the proper name of the logo variant shown.

## 7. Recorded limitations (do not fix by workaround)

- **Publisher name in the © line stays English on `/de/`.** The base's
  `fragment-pageend.html` renders the single global IG publisher on every
  language's pages; per-language data does not exist, and kerndatensatz-basis
  ships the same limitation live. An override was tried and reverted (§1). The
  durable fix is upstream: a translatable publisher label in
  `HL7/ig-template-base2`. The publisher **link** is language-neutral
  (`https://www.medizininformatik-initiative.de`).
- **Footer links are white like the surrounding text** (exactly like the MII
  site footer) and distinguishable only on hover (WCAG 1.4.1). Accepted —
  fixing it needs a rule override, which §1 forbids. Revisit only if an
  accessibility review requires underlines (one rule would suffice).
- **The preview's "Directory of published versions" link is dead.** The link is
  the IG's `canonical` + `history.html`; the preview's canonical is the GitHub
  repo URL and the preview is never formally published. Inert, preview-only
  chrome — a module's real canonical yields a working link.

## 8. Accessibility requirements

Every text-bearing surface must hold WCAG 2.1 AA (≥ 4.5:1 normal text) and
every meaningful non-text edge ≥ 3:1 (1.4.11). Current measured values — keep
them true when changing any color:

| Surface | Colors | Ratio |
| --- | --- | --- |
| Navbar / menu buttons | `#ffffff` on `#3473aa` | 5.03:1 |
| Menu hover | `#ffffff` on `#5773a2` | 4.80:1 |
| Menu active / footer | `#ffffff` on `#6a7484` | 4.73:1 |
| Body links | `#5773a2` on `#ffffff` | 4.80:1 |
| Link hover | `#3473aa` on `#ffffff` | 5.03:1 |
| IG title/status | `#6a7484` on `#ffffff` | 4.73:1 |
| Breadcrumb, table headers | `#333333` on `#ebedef` | 10.77:1 |
| Narrative-table border | `#7a8495` on `#ffffff` / `#ebedef` | 3.78:1 / 3.22:1 |

Conventions derived from the measurements: the accent greens and teal are
decorative-only (they fail on text); `--btn-text-color` stays `#ffffff` (the
base's `#e6e6e6` is 4.03:1 on the navbar blue); the language dropdown reads
white on navbar blue (5.03:1).

## 9. How to review a branding change

1. Build the preview — push a branch and CI comments the URL, or run the IG
   Publisher locally on any IG whose `ig.ini` says
   `template = #<folder-holding-a-copy-of-this-repo>` (the leading `#` marks a
   local folder).
2. Compare the rendered header/footer/navbar against
   <https://www.medizininformatik-initiative.de/> and a kerndatensatz-basis
   build.
3. To change a value, edit the hex in `mii.css` or the assets in
   `content/assets/images/` — no other file needs to change. Re-check §8's
   ratios for any color you touch.
