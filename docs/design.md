# DESIGN — MII branding for `de.medizininformatikinitiative.template`

> **This is the design of record.** The logo, palette and layout below are the
> MII corporate design this template ships. Follow-ups on the logo assets — an
> official SVG, trademark permission — are tracked in
> [open-tasks.md](open-tasks.md).

This document records every branding decision of this template, each with its
rationale and its exact upstream source. Nothing here is invented: every color,
asset, and structural choice traces to a file that MII or HL7 publishes.

---

## 1. Why `fhir2.base.template` (verification of the base-template claim)

The template declares `fhir2.base.template` (pinned `0.1.0`) as its base — not
`fhir.base.template` and not `hl7.fhir.template`. Claim verified against the
live sources on 2026-07-22:

| Fact | Evidence |
| --- | --- |
| Both MII reference repos use `fhir2.base.template` | `medizininformatik-initiative/kerndatensatz-basis` `ig.ini` (main @ `310ad1e`, 2026-07-21): `template = fhir2.base.template#current`. Same in `medizininformatik-initiative/mii-kds-sample-ig-inoffiziell` `ig.ini`. |
| `fhir.base.template` is avoided because of reported security issues | Recorded verbatim in the sample IG's `ig.ini`: `# Template: fhir2.base.template (fhir.base.template wegen gemeldeter Security-Issues nicht genutzt).` |
| `hl7.fhir.template` is inappropriate for MII | Its repo `HL7/ig-template-fhir` describes itself as "Template used for most HL7-defined FHIR implementation guides … **Adds HL7 logos**" — HL7 branding on an MII guide would be wrong. |
| `fhir2.base.template` is the language-aware base | Its `package.json` description: "FHIR IG **Translated** Base Template — foundational for use by anyone"; it declares `multilanguage-format: true` (in `config.json`) and ships per-language `translations/stringsBase-<lang>.po` / `stringsArtifacts-<lang>.po` catalogs. Required for the bilingual setup: the guide leads in English with a German translation (as kerndatensatz-basis), so the German rendering needs the base's German UI strings. **Caveat — the pinned `0.1.0` ships NO German catalog** (only `ar`, `es`, `fr`, `nl`, `pt`, `ru`; verified 2026-07-22 by extracting `packages.simplifier.net/fhir2.base.template/0.1.0`). German UI-string catalogs were added upstream (`HL7/ig-template-base2` `main`) only *after* `0.1.0` was cut, so they are not in the pinned build — consequence in §6. |
| The `0.1.0` pin resolves | FHIR package registry `packages.fhir.org/fhir2.base.template`: single published version `0.1.0`, dist-tag `latest`. Note: the GitHub repo `HL7/ig-template-base2` has **no git tags** — `0.1.0` exists only as the published template package; its `main` (`4c20cf6`, studied for this design) also declares `"version": "0.1.0"`. |

> **Why this matters here:** the branding below only works because the base is
> the *language-aware* template — all overridden fragments receive
> `include.lang` and can stay language-neutral (§6 below).

---

## 2. The base template's extension points (what we override)

Studied at `HL7/ig-template-base2` `main` @ `4c20cf667e3119d4cb2a18c61a71c544f262d7c9`:

| Base file | What the base ships | Where it is included |
| --- | --- | --- |
| `includes/fragment-header.html` | Single comment: `<!-- Placeholder for child template header declarations -->` (60 bytes) | `fragment-pagebegin.html` line 65, inside `#segment-header > .container`, before the `#ig-status` title block |
| `includes/fragment-css.html` | Single comment: `<!-- Placeholder for child template CSS declarations -->` (56 bytes, no trailing newline) | `fragment-pagebegin.html` line 29, in `<head>` **after** all base stylesheets (so a child stylesheet wins the cascade) |
| `includes/fragment-footer.html` | **Not a placeholder** — real content: `Links: Table of Contents \| QA Report [\| feedback dashboards]`, driven by `stringsBase[include.lang]` | `fragment-pageend.html` line 59, inside `<span style="color: var(--footer-highlight-text-color)">` in the footer inner-wrapper |

> **Why the override set is exactly these three fragments + one CSS file + logo
> assets:** header and CSS fragments are the base's *designed* child-template
> extension points (empty placeholders). The footer fragment carries base
> behavior (TOC/QA/feedback links), so our override **preserves the base's link
> structure verbatim and appends to it** — losing the TOC/QA links would break
> every rendered page's navigation and the QA workflow. It is **not** a
> byte-for-byte copy: the base's three label lookups (`Links`,
> `TableOfContents`, `QAReport`) are replaced by hard-coded
> `include.lang`-branched labels, because the same branch has to supply the
> `Impressum` / `Legal notice` label, for which the base ships no `stringsBase`
> key and a child template cannot add one (§6). When re-syncing against a bumped
> base, port structural changes only — do not restore the `stringsBase` lookups.

> **Why no `config.json`:** the IG Publisher **replaces** (does not merge) a
> child template's `config.json` over the base's. Shipping one would fork the
> whole base configuration (scripts, extraTemplates, path patterns) and silently
> detach us from base updates. We inherit the base `config.json` untouched.

> **Why no `layouts/`, `liquid/`, `scripts/`, `translations/`:** same reasoning
> — inherit everything; every copied file is future drift. In particular
> `translations/stringsBase.json` is loaded per template directory, so a child
> copy would *replace* the base's string table (the `config.json` hazard again).
> This is also why we cannot add new `stringsBase` keys of our own (see §6).

---

## 3. Palette (CONFIRMED 2026-07-24)

Derivation order: (1) `kerndatensatz-basis` repo assets, (2) the MII website as
fallback. The basis repo carries **no CSS and no palette**
— its only branding assets are the two logo JPGs (`input/images/MII_Logo_rgb.jpg`,
`MII_Logo_engl_rgb.jpg`, Photoshop 2017) and an IG-level `fragment-header.html`
that displays them. So the colors below come from the MII **logo the site ships
today** and the MII **website theme CSS** (retrieved 2026-07-22):

- **logo-png** — dominant opaque pixel colors of the official current MII logo
  `https://www.medizininformatik-initiative.de/themes/custom/mii/assets/img/Logo_MII_270px_Hoehe_de.png`
  (450×270 RGBA; pixel counts from a full decode: `#7a8495` ×8216 (wordmark),
  `#71b800` ×4781, `#3473aa` ×3679, `#74a86f` ×2080, `#528a94` ×1351)
- **site-css** — `https://www.medizininformatik-initiative.de/themes/custom/mii/css/base.css`
  and `…/component.css`
- **logo-svg** — embedded `<style>` fills of the only SVG logo the site publishes,
  `…/assets/img/Logo_MII_second.svg` (the "10 Jahre MII" anniversary variant):
  `#94c11a`, `#6ea45f`, `#6a7484`, `#408997`, `#1e6fa8` (corroborating source only)

| Suggested role | Hex | Exact source |
| --- | --- | --- |
| MII slate (wordmark / footer band) | `#7a8495` | logo-png dominant color (wordmark pixels) **and** site-css `component.css` `.footer__navigation { background-color: #7a8495 }` |
| MII slate-dark | `#6a7484` | site-css `component.css` main-menu link color (`.menu-block-mainnavigation > .menu--top a { color: #6a7484 }`); also the wordmark fill of logo-svg |
| MII blue | `#3473aa` | logo-png blue dots (×3679) |
| MII link/button blue | `#5773a2` | site-css `base.css` `a { color: #5773a2 }` and `input[type=submit] { background-color: #5773a2 }` |
| MII accent green | `#9abc31` | site-css `component.css` section borders/titles (e.g. `.view-events { border-top: … #9abc31 }`, `.page--type-news .page-title { background-color: #9abc31 }`) |
| MII vivid green (logo dots) | `#71b800` | logo-png green dots (×4781) — **not used on text surfaces** (2.45:1 on white) |
| MII teal (logo dots) | `#528a94` | logo-png teal dots (×1351) — reserved; not mapped (white on it is only 3.87:1) |
| Body text | `#333333` | site-css `base.css`/`component.css` body text color |
| Light background | `#ebedef` | site-css `component.css` light background blocks |

### Mapping to base CSS variables

`content/assets/css/mii.css` overrides **only** variables that
`fhir2.base.template` declares in `content/assets/css/project.css` (`:root`,
numbered 1–32 upstream) — no hard rule overrides, so a human can re-theme by
editing one file. Overridden: 1 (`--ig-status-text-color`), 2 (`--navbar-bg-color`),
3–4 (footer bands), 5 (`--stripe-bg-color`), 6–8 (menu buttons), 9–12 (menu
gradient incl. the legacy-IE `#AARRGGBB` alpha variants), 13–14 (links), 21–22
(header sides + container, both forced to `#ffffff`), 25–26 (footer
link/highlight), 27–28 (breadcrumb). **Not** overridden (kept as IG-Publisher
semantic signals, not brand surfaces): publish box (15–16), TOC box (17–18),
STU note (19–20), footer-nav strip (23), footer text (24, already white),
dragon (29–30), translation box (31–32).

> **Known consequence — the publish box's "Directory of published versions" link
> is dead in the preview.** Every rendered page carries that link, and in the
> preview it points at
> `https://github.com/medizininformatik-initiative/ig-template-mii-kds/history.html`,
> which 404s. The link is the IG's `canonical` with `history.html` appended
> (observed on both builds: this preview → the repo URL, the module template's
> `https://www.medizininformatik-initiative.de/fhir/modul-template` → …
> `/history.html`; the behaviour is not spelled out in the HL7 ig-guidance).
> Here the canonical *is* the GitHub repository URL — a deliberate decision,
> because the template package is not published to a registry
> ([project-status.md](project-status.md)) — and the preview IG is never
> published at all, so there is no version directory to point at. **Accepted as
> inert, preview-only chrome:** it is not a branding surface, a module IG's real
> canonical yields a working link, and pointing the preview's canonical at the
> GitHub Pages root would only make the dead link look plausible (that root has
> no `history.html` either).

> **Why variables-only:** the base exposes its palette as CSS custom properties
> precisely so children re-color without touching rules; a later human override
> is then a one-file change with no cascade surprises.

---

## 4. Logo & favicon (CONFIRMED 2026-07-24)

The logo ships as **SVG, traced from the official PNGs** (see below). The source
PNGs and their checksums are recorded for provenance.

| Shipped file | Traced from (retrieved 2026-07-22) | Source SHA-256 |
| --- | --- | --- |
| `content/assets/images/logo-de.svg` (viewBox 900×540) | `https://www.medizininformatik-initiative.de/themes/custom/mii/assets/img/Logo_MII_270px_Hoehe_de.png` — the logo the MII homepage header displays | `d316838e392595c726e635202f2605eb794f9d61157743ee3300ef385141ce04` |
| `content/assets/images/logo-en.svg` (viewBox 932×540) | `…/assets/img/Logo_MII_270px_Hoehe_en.png` — the English variant ("MEDICAL INFORMATICS INITIATIVE GERMANY") | `f205ba1b4d489208a70c30dd953b9f64c26eb9bb3c8cd8713878befcad15a6ac` |
| `content/assets/ico/favicon.png` (48×48, from the 48px layer of the official `favicon.ico`) | `…/assets/favicon/favicon.ico` (`f6351d085694a766ae799f73fdb7dd11bf89329d78484312364ee737ef6c0d62`) | `1c470d08136c6c243990d8574b9b73951379fe0d131b727fe311d3d485652667` |
| `content/assets/images/deu.svg` (16px flag) | the flag asset the IG Publisher itself emits at the output root | — |

> **Why the flag file is called `deu.svg` and must not be renamed:** the file name
> is not ours to choose. The IG Publisher derives it from the IG's `jurisdiction`
> (`urn:iso:std:iso:3166#DE`) and emits `<img src="assets/images/deu.svg">` —
> `DEU` is the **ISO 3166-1 alpha-3 code for Germany**, i.e. the official
> jurisdiction identifier already. Renaming the file would simply break the
> reference again. If the jurisdiction changes, the expected file name changes
> with it (e.g. `aut.svg` for Austria).

**Asset naming.** Language-specific assets use `<name>-<lang>.<ext>`
(`logo-de.svg`, `logo-en.svg`). Names dictated by another tool keep that tool's
spelling: `favicon.png` (browser convention) and `deu.svg` (IG Publisher).

### Why the logo is a trace, and how to reproduce it

The MII publishes its logo **only as PNG** — the sole SVG on the MII website
(`Logo_MII_second.svg`) is the **"10 Jahre MII" anniversary mark**, verified by
rendering it, not the brand logo. A vector is wanted so the logo stays crisp at
any size, so the PNGs are traced with `scripts/trace-logo.sh`
(ImageMagick + potrace). **This is a conversion, not an official asset** —
replace both files the day the MII publishes a real SVG.

The logo is flat colour, so it is separated into one layer per brand colour and
each layer traced. Layers are *segmented* on the colours present in the source
PNG but *painted* with the brand colours, so both language variants come out
identically branded — the published English PNG is a washed-out export whose
greys also split across two tones, which is why its wordmark colours are merged
into one layer.

The exact commands that produced the shipped files:

```sh
scripts/trace-logo.sh mii-de.png logo-de.svg 200 4 0.4 "Medizininformatik-Initiative (MII)" \
  slate:#7a8495:#7a8495 blue:#3473aa:#3473aa teal:#548b9b:#548b9b \
  sage:#74a86f:#74a86f green:#72b802:#72b802 lime:#99cc4a:#99cc4a

scripts/trace-logo.sh mii-en.png logo-en.svg 200 6 0.5 "Medical Informatics Initiative Germany (MII)" \
  "slate:#6d7887,#848c9a,#798693:#7a8495" "blue:#6a89ba:#3473aa" "teal:#93a5ad:#548b9b" \
  "sage:#9ebd89:#74a86f" "green:#afcf01,#a4c80d:#72b802"
```

Verified by rendering the SVG next to the source PNG at logo size and at 3×
zoom: indistinguishable at display size, clean vector edges when enlarged.

- **Two language variants** because the wordmark differs materially
  (DE: "MEDIZIN INFORMATIK INITIATIVE"; EN: "MEDICAL INFORMATICS INITIATIVE
  GERMANY"). `fragment-header.html` switches on `include.lang == 'de'` — the
  exact pattern `kerndatensatz-basis` uses in its own
  `input/includes/fragment-header.html`. Non-`de` languages get the EN logo.
- **Favicon** overrides the base's FHIR-flame `content/assets/ico/favicon.png`
  (the base links `assets/ico/favicon.png` as `shortcut icon` on every page), so
  no fragment change is needed. The base's `rel="fhir-logo"` icon links are left
  untouched.
- **Header layout:** the logo sits in `#project-nav`/`#project-logo` — the base's
  own project-logo slot (`project.css`: floats `var(--ig-left)`, `line-height:
  50px`), rendered at `height="50"` like the basis repo's header. We deliberately
  do **not** add the FHIR-family logo on the right (basis does at IG level):
  the template stays minimal, and a module can add it via its own
  `input/includes/fragment-header.html`, which overrides ours per IG.
- **Licensing note — follow-up (non-blocking): confirm MII permission to redistribute the
  logo.** The logo and wordmark are marks of the Medizininformatik-Initiative
  (TMF e.V. coordination). This repo is CC0-1.0, but CC0 cannot and does not
  cover third-party trademarks; precedent: `kerndatensatz-basis` (CC-BY-4.0)
  already redistributes MII logo files in `input/images/`.

---

## 5. Footer links

The override appends to (never replaces) the base footer content:

1. `medizininformatik-initiative.de` → `https://www.medizininformatik-initiative.de/`
2. The MII imprint — target switches per language, both verified HTTP 200 on
   2026-07-22: `de` → `https://www.medizininformatik-initiative.de/de/impressum`,
   otherwise → `https://www.medizininformatik-initiative.de/en/legal-notice`
   (`/en/imprint` is 404; `/en/legal-notice` is what the MII site's own footer
   links).

> **Why language-branched labels (decision taken 2026-07-24):** the base offers
> no `stringsBase` key for "Imprint"/"Impressum", and a child template cannot add
> keys (§6). The footer therefore hard-codes an `include.lang`-branched label pair
> — `Impressum` on `/de/`, `Legal notice` on `/en/`. This deliberately accepts
> per-language visible strings in this one fragment, because the alternative
> (bare-URL labels) reads poorly and, more importantly, the base's own labels
> render **blank** on German pages (§6), so the fragment had to supply its own
> text anyway.

---

## 6. Language neutrality

- The overridden footer **supplies its own language-branched labels**
  (`Links`, `Inhaltsverzeichnis`/`Table of Contents`, `QA-Bericht`/`QA Report`,
  `Impressum`/`Legal notice`) rather than resolving them through the base
  mechanism `{{site.data.stringsBase[include.lang]['<Key>']}}`. This is a
  deliberate deviation: the pinned base ships no German catalog, so the base
  mechanism renders those labels **blank** on the German `/de/` pages (third
  bullet). Every visible footer string is therefore correct in both `de` and
  `en`; adding a third language means extending this fragment's label branch.
- **Known limit — the organisation name and link in the copyright line are the
  same in every language.** On `/de/` the footer reads `IG © 2026+ Medical
  Informatics Initiative (MII)`, linking to `…medizininformatik-initiative.de/en`,
  right next to the German `Impressum` link this fragment *does* branch. It
  cannot be branched here: the **base** emits that link in
  `fragment-pageend.html` —
  `<a href="{{site.data.fhir.ig.contact[0].telecom[0]}}">{{site.data.fhir.ig.publisher | escape}}</a>`
  — *before* it includes our `fragment-footer.html`, and both values come from
  the single-valued `publisher` block in `sushi-config.yaml` (SUSHI maps
  `publisher.url` onto `contact[0].telecom[0]`). **Accepted as-is:** that block
  is deliberately identical to `kerndatensatz-basis` and the module template, so
  all three name the same responsible organisation, and there is no
  language-neutral MII URL to switch to — the site root `301`s to `/de/start`,
  so changing it would only mirror the mismatch onto the English pages. Fixing
  it properly needs either per-language IG metadata (not available) or an
  override of `fragment-pageend.html`, which would fork base behaviour (§2).
- **The pinned base ships no German UI-string catalog.**
  `fhir2.base.template#0.1.0` carries `stringsBase-<lang>.po` for
  `ar`/`es`/`fr`/`nl`/`pt`/`ru` only, so anything resolved through
  `{{site.data.stringsBase['de']['<Key>']}}` renders **blank** on the `/de/`
  pages. Two consequences: the footer fragment hard-codes its own labels (§5),
  and this template vendors the base's own `stringsBase-de.po` and
  `stringsArtifacts-de.po` into `translations/` for the rest of the base chrome.
  Delete both once the pinned base ships `de` itself — see
  [`translations/README.md`](../translations/README.md) and
  [add-translation.md](recipes/add-translation.md) §1.
- **No new visible strings are hard-coded.** The only literal texts added are
  (a) bare URLs (not translated in any language) and (b) `alt` texts that quote
  the proper name/wordmark of the logo variant being shown
  ("Medizininformatik-Initiative (MII)" / "Medical Informatics Initiative
  (MII)") — descriptions of the image, switched in the same `include.lang`
  branch as the image itself.
- **Why we could not use `stringsBase` for the alt texts/labels:** the base's
  string table has 126 fixed keys (none fits: no "Visit …"/"Imprint" key), and a
  child template adding keys would have to ship `translations/stringsBase.json`
  — which *replaces* the base file wholesale (the `config.json` hazard, §2),
  forking all 126 keys × all languages. Not worth it for two alt texts.
- `{% if include.lang == 'de' %}` branches are used **only** to switch assets
  and link targets, never to inline translated copy — mirroring
  `kerndatensatz-basis`'s own header fragment.

---

## 7. Accessibility & contrast

WCAG 2.1 relative-luminance contrast ratios, computed for every text-bearing
override (AA: ≥ 4.5:1 normal text, ≥ 3:1 large/bold ≥ 18.66 px bold or 24 px):

| Surface | Colors | Ratio | Verdict |
| --- | --- | --- | --- |
| Navbar / menu buttons | `#ffffff` on `#3473aa` | 5.03:1 | AA (normal) |
| Menu hover | `#ffffff` on `#5773a2` | 4.80:1 | AA (normal) |
| Menu active | `#ffffff` on `#6a7484` | 4.73:1 | AA (normal) |
| Dropdown gradient (both ends) | `#ffffff` on `#5773a2`→`#3473aa` | ≥ 4.80:1 | AA (normal) |
| Body links | `#5773a2` on `#ffffff` | 4.80:1 | AA (normal) |
| Link hover | `#3473aa` on `#ffffff` | 5.03:1 | AA (normal) |
| Footer text + links | `#ffffff` on `#6a7484` | 4.73:1 | AA (normal) |
| IG title/status | `#6a7484` on `#ffffff` | 4.73:1 | AA (normal) |
| Breadcrumb | `#333333` on `#ebedef` | 10.77:1 | AAA |
| Top stripe, green accents | `#9abc31` | n/a | decorative only — never under text (white on it would be 2.18:1) |
| Narrative-table header | `#333333` on `#ebedef` | 10.77:1 | AAA |
| Narrative-table border | `#7a8495` on `#ffffff` / on `#ebedef` | 3.78:1 / 3.22:1 | AA non-text (WCAG 1.4.11, ≥ 3:1) |

The base's `#f5f5f5` (var 21) never sits under the status text: it paints the
header *sides*, while `#ig-status` renders inside `#segment-header > .container`,
whose background is var 22 — `#ffffff` in the base, and set to `#ffffff` here
together with var 21.

Notes and deliberate deviations:

- **Footer band vs. the MII site:** the site's own footer puts white text on
  `#7a8495` = **3.78:1 (fails AA normal)**. We therefore put the text-bearing
  footer *container* on the darker sourced slate `#6a7484` (4.73:1, AA) and use
  the site's `#7a8495` only for the outer, text-free band.
  > **Why:** accessibility-first when two "official" colors compete; both values
  > are MII-sourced, so the brand look is preserved.
- **Base's own defaults we improved:** base `--btn-text-color: #e6e6e6` would be
  4.03:1 on our navbar blue → raised to `#ffffff`.
- **Known limitation (WCAG 1.4.1, use of color):** footer links are white like
  the surrounding footer text (exactly like the MII site footer) and the base
  applies no underline to footer links; they are distinguishable only on hover.
  Fixing this would require a rule override (`#segment-footer a { text-decoration:
  underline }`), which this variables-only design forbids. **Decision (2026-07-24): accepted as-is** —
  the site-faithful appearance was confirmed. Revisit if an accessibility review
  requires underlined footer links (one rule override would be needed).
- **Language selector legibility:** the base language dropdown reads
  `var(--btn-text-color)` on `var(--navbar-bg-color)` → white on `#3473aa`,
  5.03:1 (AA) — improved over the base default pairing (4.03:1).
- The logo PNGs sit on the white header container (`#ffffff` — the base's value,
  set explicitly here together with the header sides):
  the DE PNG is transparent (RGBA); the EN PNG has a white matte (RGB) and is
  seamless on white — another reason not to re-color the header background.

---

## 7a. Narrative tables

The base template styles the tables the IG Publisher *generates* — profile
snapshot and differential trees, artifact indices, binding tables — but leaves
markdown tables in page content with no border and no header fill.
`kerndatensatz-basis` compensates per page with an inline `<style>` block; that
is why its
[`/en/metadata.html`](https://medizininformatik-initiative.github.io/kerndatensatz-basis/en/metadata.html)
has bordered tables while its profile pages do not. This template does it once,
in `content/assets/css/mii.css`, so a module inherits it through the
vendored mirror.

| Property | Value | Source |
| --- | --- | --- |
| Header background | `#ebedef` | MII light background (§3) — the same site value as the breadcrumb |
| Border | `1px solid #7a8495` | MII slate (§3) |
| Header text | `#333333` | MII body text (§3) |
| Padding | `6px 10px` | — |

> **Why the selector excludes four attributes, and why the short version is
> wrong:** it must match only what the markdown renderer emits.
> `table:not([class])` — the obvious form, and the one first shipped here — is
> **not** safe. The IG Publisher renders profile snapshot and differential trees
> as tables that carry no class at all, only presentation attributes:
>
> ```html
> <table border="0" fhir="generated-heirarchy" cellpadding="0" cellspacing="0"
>        style="border: 0px #F0F0F0 solid; ..." id="…" data-fhir="…">
> ```
>
> Their inline `style` sits on the `<table>`, so it does not prevent a
> stylesheet rule from bordering their `<td>`s — which draws a box around every
> cell of the hierarchy tree. What actually separates the two kinds is that a
> markdown table has **no attributes at all**, while every generated one carries
> at least `style`.
>
> Measured by simulating the selector against every page of both built sites:
> the chain matches **14 markdown tables and 0 generated tables**, where
> `:not([class])` alone would have hit **34 generated ones**.
> `scripts/narrative-table-styles.test.mjs` re-runs that simulation against
> fixtures taken verbatim from the built output, so the check is on behaviour
> rather than on the selector's spelling.

> **Why no `width: 100%`:** `kerndatensatz-basis` sets it; this template does
> not. Forcing full width stretches two-column tables across the page. Add it in
> a module if that module's tables want it.

## 8. How to review a branding change

1. Build the preview — push a branch and CI comments the URL, or run the IG
   Publisher locally on any IG whose `ig.ini` says
   `template = <path-to-this-repo>` (vendored path).
2. Compare the rendered header/footer/navbar against
   `https://www.medizininformatik-initiative.de/` and against a
   `kerndatensatz-basis` build.
3. To change a value, edit the hex in `mii.css` or the assets in
   `content/assets/images/` — no other file needs to change.
