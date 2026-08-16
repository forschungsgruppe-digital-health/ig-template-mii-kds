# Styleguide — branding for `de.medizininformatikinitiative.template`

The layout and design conventions of this template: what the branding is, which
rules keep it consistent and accessible, and which boundaries must not be
crossed. The template carries **two switchable corporate designs** — **NUM-DIZ**
(the default — NUM-DIZ takes over IG development and maintenance when MII
funding ends end-2026) and **MII** (selected by the explicit brand value
`"mii"`); §10 documents the switch and the NUM-DIZ design, §§2–8 the MII
design and the rules both share. Every color and
asset traces to a file that MII, NUM-DIZ or HL7 publishes; the full
source-by-source derivation (URLs, checksums, pixel analyses) is preserved in
this repository's git history (`docs/design.md`, the styleguide's
predecessor). Follow-ups on the logo assets (an official SVG, trademark
permission — for NUM-DIZ: pending brand-use consent, §10) are tracked in
[open-tasks.md](open-tasks.md).

---

## 1. Inheritance rules (how this template extends the base)

The template derives from `fhir2.base.template` (pinned `0.1.0`) — the
language-aware base both MII reference repos use. The rules:

- **Override only the base's extension points.** What the template ships on top
  of the base is exactly: `includes/fragment-header.html` and
  `includes/fragment-css.html` (the base's *designed* child extension points —
  empty placeholders), `includes/fragment-footer.html` (not a placeholder: the
  override preserves the base's link structure and appends to it),
  `includes/fragment-language.html` (verbatim copy fixing ONE base defect: the
  base hardcodes the literal "Language:" instead of reading its own
  stringsBase catalog, so the label never translated — the override reads the
  catalog with the English literal as fallback; delete it the day the pinned
  base reads its catalog there),
  `includes/structure-tabs.html` (an added authoring include with no base
  counterpart — [recipe](recipes/tab-an-artifact-structure.md)), four CSS
  files (`content/assets/css/bootstrap-accessibility.css` — the vendored
  Bootstrap-3 accessibility patch, §8 — then
  `content/assets/css/template-base.css`, the brand-independent rule
  blocks, always linked; then exactly ONE palette file —
  `content/assets/css/num-diz.css` by default, `content/assets/css/mii.css`
  only when the brand switch selects MII — §10), the logo/favicon assets, the vendored German
  UI catalogs in `translations/`, and four JS assets:
  `content/assets/js/lang-redirects.js`, `font-size-control.js` and
  `back-to-top.js` (both §8), and the vendored
  `bootstrap-accessibility.min.js` (pinned byte-exact, §8).
  > **The two same-path replacements are on borrowed time.**
  > `content/assets/js/lang-redirects.js` and `content/assets/ico/favicon.png`
  > win only because a child template's file at the same path beats the base's.
  > That makes them invisible drift: a base change to either file is silently
  > discarded. The favicon is intentional and permanent (it is branding);
  > `lang-redirects.js` carries the fix for a defect in the pinned base's
  > landing-page redirect and has a deletion condition attached — the reason is
  > written out in the file itself, the follow-up in
  > [open-tasks.md](open-tasks.md).
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
- **Colour is variables-only.** Each palette file (`num-diz.css` / `mii.css`)
  re-colours the guide exclusively through custom properties — the ones the
  base declares in `project.css` `:root` plus the template's own
  `--ig-table-*` and `--ig-highlight-*` — no base colour rule is re-declared,
  so a re-theme is a one-file edit with no cascade surprises. Both palettes
  declare the same variable set (guarded by `scripts/brand-switch.test.mjs`);
  exactly one is loaded per build. The rule blocks that are *not* about colour
  live in `template-base.css`: the highlight boxes (§3), the narrative-table
  styling (§5), the content-image handling and the structure-tabs spacing
  (§5a). Three of them add new classes; the content-image block is the only
  place where a base rule is deliberately countermanded.
- **When re-syncing an overridden fragment against a bumped base:** port
  structural changes only; do not restore the base's `stringsBase` label
  lookups in the footer (they render blank on `/de/` — §6).

## 2. Color palette (MII design)

Use these tokens and no others; no raw hex outside `mii.css` and
`num-diz.css` (the NUM-DIZ palette is in §10).

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
(`<div class="ig-highlight ig-highlight-<color>">` with an `<h5>` heading, or
a kramdown attribute line `{: .ig-highlight .ig-highlight-<color>}` under a
blockquote). Styling only — a module decides what each color means; the
conventional reading:

> **Renamed 2026-08-14:** the class prefix is now the brand-neutral `ig-*` (formerly `mii-*`).
> The old `.mii-highlight*` selectors and `--mii-table-*` variables remain as **deprecated
> aliases** so existing module content keeps rendering; they will be removed in the next major.

| Class | Conventional meaning |
| --- | --- |
| `ig-highlight-blue` | neutral call-out |
| `ig-highlight-green` | positive/confirming note |
| `ig-highlight-orange` | warning |
| `ig-highlight-red` | important notice |
| `ig-highlight-grey` | hint / authoring note (all `[TODO: …]` prompts use it) |

The box STRUCTURE lives in `template-base.css`; the colours are
`--ig-highlight-<variant>-{bg,border,heading}-color` palette variables, so
**each corporate design brings its own set** (TF-KDS feedback 2026-08-14):

| Variant | MII (`mii.css`): bg / border / heading | NUM-DIZ (`num-diz.css`): bg / border / heading | NUM-DIZ source |
| --- | --- | --- | --- |
| blue | `#e8f4f8` / `#5c8db3` / `#406a99` | `#e8f1f8` / `#1d6fa8` / `#16537e` | DIZ wordmark blue `#1d6fa8` |
| green | `#f0f8e8` / `#91bc3d` / `#5a6b2f` | `#f3f8e2` / `#587f4e` / `#42590a` | DIZ emblem greens `#8dbc0b`/`#6ea460`, darkened |
| orange | `#fdf3e7` / `#c9721c` / `#8a4b12` | `#fff7db` / `#a38200` / `#6e5800` | NUM yellow `#ffcc00`, darkened |
| red | `#fbeaea` / `#c0392b` / `#8f2318` | `#fdedf0` / `#ea5167` / `#9c2038` | NUM-DIZ coral itself |
| grey | `#f2f3f5` / `#7a8495` / `#4a5260` | `#f0f1f2` / `#706f6f` / `#485156` | site greys + slate |

MII set: heading-on-background ≥ 6.1:1 (AA); the orange/red/grey borders
≥ 3.2:1 (WCAG 1.4.11). The inherited green border sits below the 3:1
non-text bar — kept for parity with kerndatensatz-basis; do not copy that
compromise into new variants. NUM-DIZ set: every variant passes BOTH bars —
heading-on-background ≥ 6.4:1 and border-on-background ≥ 3.16:1 (no green
exception; guarded by `scripts/brand-switch.test.mjs`).

## 4. Logo, favicon, assets

- The logo ships as **SVG, traced from the official PNGs** (MII publishes no
  brand SVG — the site's only SVG is the "10 Jahre" anniversary mark). This is
  a conversion, not an official asset: **replace both files the day the MII
  publishes a real SVG.** The exact reproduction commands live in
  [replace-the-logo.md](recipes/replace-the-logo.md); source URLs and checksums
  are preserved in git history (`docs/design.md`).
- **Two language variants** (`logo-de.svg`, `logo-en.svg`) because the wordmark
  text differs; `fragment-header.html` switches on `include.lang == 'de'`,
  non-`de` languages get the EN logo. Layout: project logo in `#project-nav`
  (base's project slot, `height="50"`), HL7 FHIR family logo in `#family-nav`
  linking to <https://hl7.org/fhir> — mirroring kerndatensatz-basis. A module
  overriding `input/includes/fragment-header.html` replaces the fragment
  wholesale and must re-add both logos if it wants them.
- The **NUM-DIZ logo pair** (`logo-num-diz-de.svg`, `logo-num-diz-en.svg`)
  follows the same per-language pattern and renders **by default**; the MII
  pair renders instead when the brand switch selects MII. Provenance and
  approval status are documented in §10.
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

## 5a. The rule blocks in `template-base.css`

Colour is variables-only (§1) and lives in the palette files; the six rule
blocks that go beyond variables live in the brand-independent
`template-base.css`. Five of them add *new* classes, which cannot collide
with the base; one deliberately overrides base rules. Anything added here has
to earn its place, because a rule the base later changes will silently keep
the value set here.

| Block | Selectors | New or override | Why |
| --- | --- | --- | --- |
| Highlight boxes (§3) | `.ig-highlight`, `.ig-highlight-<color>` (+ their `h5`) | new classes | Reusable, purpose-neutral callouts for page authors, carried over from `kerndatensatz-basis`. Styling only — a module decides what each colour means |
| Narrative tables (§5) | `table:not([class]):not([style]):not([border]):not([data-fhir])` and its `th`/`td` | new rules on markdown tables the base leaves unstyled | Detailed in §5, including why the obvious short selector is wrong |
| Content images | `#segment-content p > img:not(.float)`, `#segment-content img` | **overrides base rules** | The base floats every `p > img` and caps no width, so a diagram wraps body text beside it and a wide one overflows the column. Content images are block-centred and width-capped instead; a small inline image opts back into the base behaviour with `class="float"` |
| Structure tabs | `.structure-tabs`, `.structure-tabs .tab-content` | new classes | Spacing and a scroll container for `includes/structure-tabs.html` — [recipe](recipes/tab-an-artifact-structure.md) |
| Font-size control (§8) | `.ig-fontsize`, `html[data-fontsize]` over the four reading regions | new classes | Reader-selectable A/A+/A++ levels (2026-08-15). Level A = NO rule — the default renders byte-identical to a build without the feature. Levels apply `zoom` to `#segment-content`, `#segment-navbar`, `#segment-breadcrumb` and `#segment-footer` as siblings (standardized in CSS Viewport; scales the publisher-generated tables' INLINE px font sizes too and reflows; only the header band keeps its fitted layout); print resets to 100 %. Colors are palette variables only; hover shares the chrome convention (§8). **REMOVAL is one commit:** this block, `assets/js/font-size-control.js`, and the `.ig-fontsize` block in `includes/fragment-header.html`. Guarded by `scripts/font-size-control.test.mjs` |
| Back-to-top button (§8) | `.ig-back-to-top` | new classes | Fixed bottom-right jump-to-top after one viewport of scrolling (2026-08-16); solid light ground so it stays visible over the slate footer; reduced-motion-aware; outside the zoom regions. **REMOVAL is one commit:** this block, `assets/js/back-to-top.js` and the header markup block. Guarded by `scripts/back-to-top.test.mjs` |

`template-base.css` is linked after the base stylesheets
(`includes/fragment-css.html`), so none of these needs `!important`. The
content-image block is the only place where a base rule is deliberately
countermanded; if the base ever changes its image handling, that block is the
first thing to re-check. (A navbar-typography override — 19px bold links to
reach the WCAG large-text bar on the coral navbar — shipped briefly in v1.1.0
and was reverted on TF-KDS review: the enlarged menu did not fit visually.
The navbar keeps the base's default typography; the contrast consequence is a
recorded limitation, §7.)

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
  `netzwerk-universitaetsmedizin.de` (before the MII link because NUM-DIZ
  takes over IG maintenance — rendered in both brand designs),
  `medizininformatik-initiative.de` (bare domains as anchor text are
  language-neutral) plus the imprint — the NUM-DIZ legal pages, `de` →
  `/impressum`, otherwise → `/en/legal-notice`.
- **"MII" naming policy** (funding ends 2026; NUM-DIZ takes over — every MII
  mention will be re-evaluated): "MII" appears only in **proper names and
  identifiers** — the *MII Core Dataset / MII-Kerndatensatz* (the dataset's
  name), the *MII Broad Consent*, the `MII_*` artifact-naming conventions,
  package ids / canonical URLs / org and site links — and in **past-tense
  provenance** ("was created within…"). Statements about ongoing processes,
  scope or governance are phrased **time-robustly** instead: "KDS-wide", "the
  Meta module", "the governance bodies of the core-dataset process", "the
  overarching data protection concept". Do not write MII as the acting
  institution of a present-tense sentence.
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
- The HL7 trademark attribution in the footer stays **English on every
  language's pages**: it is HL7's prescribed legal formula, not translatable
  UI text (rendered because the header shows the FHIR flame on every page —
  guard-tested in `scripts/brand-switch.test.mjs`; the community-use
  permission request remains a maintainer action, [open-tasks](open-tasks.md)).

## 7. Recorded limitations (do not fix by workaround)

- **Publisher name in the © line stays English on `/de/`.** The base's
  `fragment-pageend.html` renders the single global IG publisher on every
  language's pages; per-language data does not exist, and kerndatensatz-basis
  ships the same limitation live. An override was tried and reverted (§1). The
  durable fix is upstream: a translatable publisher label in
  `HL7/ig-template-base2`. The publisher **link** is language-neutral
  (`https://www.netzwerk-universitaetsmedizin.de` — NUM-DIZ is the publisher
  since 2026-08-14, §10).
- **The NUM-DIZ navbar's resting contrast is 3.58:1** (white on coral
  `#ea5167`) — below the 4.5:1 the rest of the template keeps (§8). A TF-KDS
  decision (2026-08-14): the menu carries the site's own nav coral, and the
  WCAG *large-text* variant (19px bold links, which would make 3:1 the
  applicable bar) was rejected on review because the enlarged menu did not fit
  visually. Accepted as corporate-design-over-1.4.3 for the navbar's resting
  state only — hover and active states hold 8.12:1 / 5.21:1, dropdown items
  never sit on coral, and `scripts/brand-switch.test.mjs` still enforces a
  3:1 floor so the surface cannot silently regress further. Revisit if an
  accessibility review (BITV/EN 301 549) requires strict 1.4.3 conformance.
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
every meaningful non-text edge ≥ 3:1 (1.4.11) — **in both brand designs**
(the NUM-DIZ ratios are in §10). Current measured MII values — keep
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

### Back-to-top button

IG pages get very long; the fixed bottom-right button appears after about
one viewport of scrolling and jumps back, moving focus to the page-top
anchor so keyboard users land where they jumped. Written as an own asset
(`assets/js/back-to-top.js`) instead of wiring the base's dormant
`topofpage.js`, which fades in at 50px, fires a tooltip on load and ignores
`prefers-reduced-motion` — ours scrolls smoothly only without that
preference. Rendered inside `#segment-header`, outside the `data-fontsize`
zoom regions, so it never scales with A+/A++. Colors are the font-size
control's inactive pair on a SOLID light ground (`--ig-header-container-color`
— white in both palettes — with slate border/glyph, slate fill on hover): a
slate-filled button was the same variable value as the footer and vanished
when the two crossed. **REMOVAL is one commit:** the js asset, the
`template-base.css` block and the header markup block — guarded by
`scripts/back-to-top.test.mjs`.

### Widget semantics — the vendored Bootstrap-3 accessibility patch

The publisher's pages run on Bootstrap 3, whose components are semantically
thin (tab-only dropdowns, no ARIA tabs pattern). The template vendors the
**PayPal Bootstrap Accessibility Plugin v1.0.7** (pinned byte-exact by
`scripts/bootstrap-accessibility.test.mjs`) as a runtime patch over the
markup the publisher generates: navbar dropdowns gain ARIA menu semantics
and arrow-key navigation, tab panels (the `structure-tabs` include) the full
ARIA tabs pattern with arrow keys, alerts live-region announcements; the
small CSS adds focus outlines and alert-contrast fixes and loads before
`template-base.css` so the template can override. Upstream is
feature-complete/minimally maintained — coherent against the frozen
Bootstrap 3; the Swiss federal `admin-ch` fork was evaluated and rejected
(151 commits behind upstream; its six own commits are site-specific tab
tweaks). REMOVAL is one commit: both vendored assets, the `fragment-css`
link and the `fragment-header` script tag.

### Text resize (WCAG 1.4.4)

Browser zoom remains the primary resize mechanism (the layout is responsive
to 200 %). The A/A+/A++ control (§5a) is an *additional* reader aid at +12.5 %
and +25 % on the content region — chosen because the publisher-generated
artifact tables carry inline `font-size: 11px` styles that user stylesheets
and inherited font sizes cannot reach, while `zoom` scales them. Level A is
always the untouched default.

## 9. How to review a branding change

1. Build the preview — push a branch and CI comments the URL, or run the IG
   Publisher locally on any IG whose `ig.ini` says
   `template = #<folder-holding-a-copy-of-this-repo>` (the leading `#` marks a
   local folder).
2. Compare the rendered header/footer/navbar against
   <https://www.medizininformatik-initiative.de/> and a kerndatensatz-basis
   build.
3. To change a value, edit the hex in `mii.css` (MII design) or `num-diz.css`
   (NUM-DIZ design) or the assets in `content/assets/images/` — no other file
   needs to change. Re-check §8's/§10's ratios for any color you touch.
4. When the change touches a brand-switched surface (CSS variables, header
   logo, footer), build **twice** — once without `input/data/brand.json`
   (the NUM-DIZ default) and once with `{ "design": "mii" }` (the MII
   design) — and review both; `scripts/brand-switch.test.mjs` guards the
   switch's invariants offline.

## 10. The brand switch: NUM-DIZ corporate design

NUM-DIZ (Netzwerk Universitätsmedizin — Datenintegrationszentren) takes over
IG development and maintenance when MII funding ends (end-2026). The template
therefore carries the NUM-DIZ corporate design — and renders it **by
default**: a module that does nothing gets the NUM-DIZ design. The MII design
stays fully available as the switchable second brand.

### The switch

The default needs no file at all. To render the **MII** design instead, one
file in the consuming IG, set once:

```json
// input/data/brand.json
{ "design": "mii" }
```

The base template's pre-process copies `input/data/` into Jekyll's `_data`
(`fhir2.base.template` `config.json`, `pre-process` block), so the fragments
read the value as `site.data.brand.design`. This is a **designed** module-side
surface — no template file is overridden, and the doctrine of §1 is untouched.
The switch keeps the exact-match doctrine, now anchored on `'mii'`: every
branch tests `site.data.brand.design == 'mii'` exactly, and **only** that
value selects the MII design — a missing file, an empty file, or any unknown
value falls through to the NUM-DIZ default. Recipe:
[switch-brand-to-mii.md](recipes/switch-brand-to-mii.md).

The switch covers exactly three surfaces:

| Surface | NUM-DIZ (default) | MII (`{ "design": "mii" }`) |
| --- | --- | --- |
| Palette | `num-diz.css` — the **only** palette linked (after the brand-independent `template-base.css`) | `mii.css` — the **only** palette linked; both declare the same variable set |
| Header logo (per language) | `logo-num-diz-de.svg` / `logo-num-diz-en.svg` → the [NUM-DIZ page](https://www.netzwerk-universitaetsmedizin.de/forschung/num-diz) | `logo-de.svg` / `logo-en.svg` → medizininformatik-initiative.de |
| Brand-named text | the logo `alt` texts (the only brand-named chrome text) | ditto, MII wording |

Deliberately **not** switched: the footer's link row (the NUM-DIZ link renders
in both designs, the MII links stay — the modules remain MII content), the
highlight-box class names and the `--ig-table-*` variable names (API names,
not display text), and the favicon (its `<link>` lives in the base's
`fragment-pagebegin.html`, which §1 forbids overriding — a recorded limitation
of the NUM-DIZ design).

### NUM-DIZ color palette

Measured from <https://www.netzwerk-universitaetsmedizin.de> (theme
`styles.css`, stock Bootstrap values excluded) and the vendored logo SVGs,
retrieved 2026-08-13. Use these tokens and no others.

| Role | Hex | Use for | Never for |
| --- | --- | --- | --- |
| NUM-DIZ slate | `#485156` | menu hover, footer, IG title/status text, breadcrumb/table text, link hover | — |
| NUM-DIZ slate-blue | `#5c6f7e` | body links, menu active, gradients (combo-logo wordmark fill) | — |
| NUM-DIZ coral | `#ea5167` | **navbar** (TF-KDS 2026-08-14; white links at 3.58:1 — recorded limitation, §7), the top stripe (stripe and navbar merge into one coral band), the red highlight-box border (§3), decorative accents | body text and any other text surface (3.58:1 — below the 4.5:1 bar the template keeps everywhere but the navbar) |
| NUM-DIZ teal | `#42d1b8` | logo artwork only; reserved | text (1.90:1 on white) |
| NUM yellow | `#ffcc00` | logo artwork only; reserved | text surfaces |
| Mid grey | `#706f6f` | narrative-table borders | menu surfaces (read muddy on the coral navbar; dropped 2026-08-14) |
| Light grey | `#ecedee` | breadcrumb, narrative-table headers | — |

The same design decisions as the MII palette apply: one uniform footer grey
(no two-tone seam), consistently white header chrome, and the base's
IG-Publisher semantic signals (publish box, STU note, …) are left alone.

### NUM-DIZ contrast (WCAG 2.1)

| Surface | Colors | Ratio |
| --- | --- | --- |
| Navbar resting | `#ffffff` on `#ea5167` | 3.58:1 (**recorded limitation** — TF-KDS decision, §7) |
| Menu hover / footer | `#ffffff` on `#485156` | 8.12:1 (AAA) |
| Menu active / gradient end | `#ffffff` on `#5c6f7e` | 5.21:1 |
| Body links | `#5c6f7e` on `#ffffff` | 5.21:1 |
| Link hover / IG title/status | `#485156` on `#ffffff` | 8.12:1 |
| Breadcrumb, table headers | `#485156` on `#ecedee` | 6.93:1 |
| Narrative-table border | `#706f6f` on `#ffffff` / `#ecedee` | 5.01:1 / 4.27:1 |

Derived conventions: the navbar carries the site's own nav coral since
2026-08-14 (TF-KDS feedback: the grey menu did not complement the coral header
stripe) at the base template's default link typography — its 3.58:1 resting
contrast is a **recorded limitation** (§7), with a 3:1 floor still enforced by
`scripts/brand-switch.test.mjs`. Everywhere else coral and teal
stay decorative-only, and the site's own body-link coral
(`a { color: #EA5167 }` in its stylesheet, 3.58:1) is still **not** adopted —
the slate-blue from the official combo-logo wordmark is the closest sourced
value that holds AA for normal-size text.

### NUM-DIZ logos: provenance and approval

- `logo-num-diz-de.svg` — the official German combination logo
  (`NUM-DIZ-Kombilogo-POS-RGB.svg`), vendored **byte-identical** from the
  NUM-DIZ website on 2026-08-13 (only a provenance comment was added).
- `logo-num-diz-en.svg` — **derived, NOT an official asset**: NUM-DIZ
  publishes no English combination logo, so the file composes the German
  combo's DIZ portion with the official English NUM logo, scaled by the exact
  factor (1.06277) at which the German combo draws the shared NUM emblem
  artwork and aligned on the combo's shared subtitle baseline (y = 287.19).
  Since 2026-08-14 (TF-KDS feedback) the DIZ portion's outlined **German text
  is replaced by English SVG text**: "MEDICAL / INFORMATICS / INITIATIVE" and
  the tri-color "DATA INTEGRATION CENTER" (the MII's official English terms) —
  exactly the 51 German glyph elements were removed; DIZ wordmark, emblem and
  NUM part are untouched, and baselines / center axis / cap heights / run
  widths are measured from the removed German clusters (pinned via
  `textLength`). The typeface is a system-sans approximation, as the original
  condensed corporate face is licensed and cannot be embedded — the file is
  therefore doubly unofficial (composition AND typeface). The full derivation
  is in the file's own header comment and the introducing PRs.
- **Approval status: pending — and urgent.** The NUM/NUM-DIZ logos are
  third-party brand assets fetched from the NUM website; shipping them
  requires NUM-DIZ consent, and the derived English combo additionally needs
  their approval as a new brand asset. Since NUM-DIZ became the **default**
  design, every rendering that does not opt back to MII ships these logos —
  the consent and approval are no longer gating an opt-in extra but the
  out-of-the-box output. Tracked in [open-tasks.md](open-tasks.md); replace
  the derived file the day an official English combo exists.
