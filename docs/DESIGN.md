# DESIGN — MII branding for `de.medizininformatikinitiative.template`

> ## ⚠️ Gate B — derived suggestion
>
> **This entire design (logo + palette) is a DERIVED SUGGESTION, not a confirmed
> corporate design.** It was reverse-engineered on 2026-07-22 from the assets the
> MII itself publishes (see the source table below) so that a human can react to a
> concrete, rendered proposal instead of a blocking "go find the official assets"
> request. It may live on `dev` and in non-release previews.
> **TODO(human): confirm or replace logo + palette before any release.**

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
| Both MII reference repos use `fhir2.base.template` | `medizininformatik-initiative/kerndatensatz-basis` `ig.ini` (main @ `310ad1e`, 2026-07-21): `template = fhir2.base.template#current`. Same in `forschungsgruppe-digital-health/mii-kds-sample-ig-inoffiziell` `ig.ini`. |
| `fhir.base.template` is avoided because of reported security issues | Recorded verbatim in the sample IG's `ig.ini`: `# Template: fhir2.base.template (fhir.base.template wegen gemeldeter Security-Issues nicht genutzt).` |
| `hl7.fhir.template` is inappropriate for MII | Its repo `HL7/ig-template-fhir` describes itself as "Template used for most HL7-defined FHIR implementation guides … **Adds HL7 logos**" — HL7 branding on an MII guide would be wrong. |
| `fhir2.base.template` is the language-aware base | Its `package.json` description: "FHIR IG **Translated** Base Template — foundational for use by anyone"; it declares `multilanguage-format: true` (in `config.json`) and ships per-language `translations/stringsBase-<lang>.po` / `stringsArtifacts-<lang>.po` catalogs. Required for the German-default/English-second setup (spec §3.4). **Caveat — the pinned `0.1.0` ships NO German catalog** (only `ar`, `es`, `fr`, `nl`, `pt`, `ru`; verified 2026-07-22 by extracting `packages.simplifier.net/fhir2.base.template/0.1.0`). German UI-string catalogs were added upstream (`HL7/ig-template-base2` `main`) only *after* `0.1.0` was cut, so they are not in the pinned build — consequence in §6. |
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
> behavior (TOC/QA/feedback links), so our override **copies the base content
> byte-for-byte and only appends** — losing the TOC/QA links would break every
> rendered page's navigation and the QA workflow.

> **Why no `config.json`:** the IG Publisher **replaces** (does not merge) a
> child template's `config.json` over the base's. Shipping one would fork the
> whole base configuration (scripts, extraTemplates, path patterns) and silently
> detach us from base updates. We inherit the base `config.json` untouched
> (spec §3.2).

> **Why no `layouts/`, `liquid/`, `scripts/`, `translations/`:** same reasoning
> — inherit everything; every copied file is future drift. In particular
> `translations/stringsBase.json` is loaded per template directory, so a child
> copy would *replace* the base's string table (the `config.json` hazard again).
> This is also why we cannot add new `stringsBase` keys of our own (see §6).

---

## 3. Derived palette (Gate B suggestion)

**TODO(human): confirm or replace this palette before any release.**

Derivation order followed spec §6-B: (1) `kerndatensatz-basis` repo assets,
(2) the MII website as fallback. The basis repo carries **no CSS and no palette**
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
gradient incl. the legacy-IE `#AARRGGBB` alpha variants), 13–14 (links), 25–26
(footer link/highlight), 27–28 (breadcrumb). **Not** overridden (kept as
IG-Publisher semantic signals, not brand surfaces): publish box (15–16), TOC box
(17–18), STU note (19–20), header backgrounds (21–22, stay white/neutral like the
MII site header), footer-nav strip (23), footer text (24, already white),
dragon (29–30), translation box (31–32).

> **Why variables-only:** spec §3.3 — the base exposes its palette as CSS custom
> properties precisely so children re-color without touching rules; a later
> human override (Gate B outcome) is then a one-file change with no cascade
> surprises.

---

## 4. Logo & favicon (Gate B suggestion)

**TODO(human): confirm or replace logo + palette before any release.**

| Shipped file | Source (retrieved 2026-07-22) | SHA-256 |
| --- | --- | --- |
| `content/assets/images/mii-logo.png` (450×270, RGBA) | `https://www.medizininformatik-initiative.de/themes/custom/mii/assets/img/Logo_MII_270px_Hoehe_de.png` — the logo the MII homepage header itself displays | `d316838e392595c726e635202f2605eb794f9d61157743ee3300ef385141ce04` |
| `content/assets/images/mii-logo-en.png` (466×270, RGB) | `…/assets/img/Logo_MII_270px_Hoehe_en.png` — the logo the English MII homepage displays (wordmark "MEDICAL INFORMATICS INITIATIVE GERMANY") | `f205ba1b4d489208a70c30dd953b9f64c26eb9bb3c8cd8713878befcad15a6ac` |
| `content/assets/ico/favicon.png` (48×48, converted from the 48px layer of the official `favicon.ico`) | `https://www.medizininformatik-initiative.de/themes/custom/mii/assets/favicon/favicon.ico` (`f6351d085694a766ae799f73fdb7dd11bf89329d78484312364ee737ef6c0d62`) | `1c470d08136c6c243990d8574b9b73951379fe0d131b727fe311d3d485652667` |

- **TODO(human): provide an official SVG of the main MII logo.** Only PNG is
  obtainable: the sole SVG logo on the MII website
  (`Logo_MII_second.svg`) is the **"10 Jahre MII" anniversary logo** (verified by
  rendering it), not the brand logo, and `kerndatensatz-basis` ships only JPGs
  from 2017. Per the fallback rule, we ship `mii-logo.png` (the current official
  PNG) instead of a fabricated vector redraw.
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
- **Licensing note — TODO(human): confirm MII permission to redistribute the
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

> **Why bare-URL link labels:** the base offers no `stringsBase` key for
> "Imprint"/"Impressum", and a child template cannot add keys (§6). A URL is
> language-neutral by nature, so the labels are the URLs themselves (scheme
> stripped via Liquid `remove`). If translated labels are preferred,
> **TODO(human): decide whether an `include.lang`-branched label pair
> ("Impressum"/"Legal notice") is acceptable** — it would hard-code visible
> strings per language, which this design avoids.

---

## 6. Language neutrality (spec §3.4)

- All base-provided visible strings in the overridden footer come from the
  base's own mechanism `{{site.data.stringsBase[include.lang]['<Key>']}}`
  (`Links`, `TableOfContents`, `QAReport`) — resolved by the base's own string
  catalogs, no re-implementation. This override adds **no** UI strings of its
  own, so it is correct in every language the base supports.
- **Finding — the pinned base ships no German UI-string catalog (i18n gap).**
  `fhir2.base.template#0.1.0` (the pinned base) contains `stringsBase-<lang>.po`
  catalogs for `ar`/`es`/`fr`/`nl`/`pt`/`ru` only — **not** `de` (verified
  2026-07-22; German was added to `HL7/ig-template-base2` `main` after `0.1.0`).
  The master `stringsBase.json` carries only the English values, so
  `site.data.stringsBase['de']` is **empty**. **Consequence (observed in the
  self-test build, PR #10 preview):** every base UI string this footer resolves
  through `{{site.data.stringsBase['de']['<Key>']}}` returns **nothing on the
  `/de/` pages** — the footer's `Links` label is blank and its "Table of
  Contents"/"QA Report" links render as empty, textless links to `toc.html` /
  `qa.html`. (The IG Publisher's Java-generated breadcrumb resolves the same key
  differently and shows the English fallback "Table of Contents".) The `/en/`
  footer is fully correct. So on the **default** language the base chrome labels
  are missing — worse than an English fallback. It is still **non-fatal**: the
  build stays green (QA errors = 0) and only base-provided labels are affected,
  not this template's own additions (the MII imprint links, which are
  language-neutral bare URLs, render correctly in both languages) or the module's
  translated content.
  > **Why we do not fix it by shipping the German `.po` here:** a child template
  > cannot add `translations/` without the fork hazard of §2 (the `.json` string
  > table is replaced, not merged). The clean fix is upstream: bump the base to a
  > release that carries the German catalog. The scheduled dependency checker
  > already watches `fhir2.base.template`, so that bump arrives as a reviewable
  > PR. **TODO(human):** decide whether to (a) wait for a base release with
  > German, or (b) vendor `stringsBase-de.po` + `stringsArtifacts-de.po` (CC0,
  > from `HL7/ig-template-base2`) into a template `translations/` override —
  > verifying first that a `.po`-only add does not replace the base `.json`
  > table. The same over-optimistic "German included" wording also appears in
  > `skills/ig-translate/SKILL.md` (obligation 2) and should be corrected there.
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

## 7. Accessibility & contrast (spec §3.3)

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
| IG title/status | `#6a7484` on `#f5f5f5` | 4.33:1 | AA (large — the base renders it 12 pt bold); below AA for normal text |
| Breadcrumb | `#333333` on `#ebedef` | 10.77:1 | AAA |
| Top stripe, green accents | `#9abc31` | n/a | decorative only — never under text (white on it would be 2.18:1) |

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
  underline }`), which this variables-only design forbids. **TODO(human): decide
  at Gate B whether to accept this (site-faithful) or allow one rule override
  for underlined footer links.**
- **Language selector legibility:** the base language dropdown reads
  `var(--btn-text-color)` on `var(--navbar-bg-color)` → white on `#3473aa`,
  5.03:1 (AA) — improved over the base default pairing (4.03:1).
- The logo PNGs sit on the base's white header container (`#ffffff`, kept):
  the DE PNG is transparent (RGBA); the EN PNG has a white matte (RGB) and is
  seamless on white — another reason not to re-color the header background.

---

## 8. How to review this design (Gate B)

1. Wait for the self-test build (task A4: `ig.ini` + CI + `dev` Pages preview)
   or run the IG Publisher locally on any IG with `ig.ini` →
   `template = <path-to-this-repo>` (vendored path).
2. Compare the rendered header/footer/navbar against
   `https://www.medizininformatik-initiative.de/` and against a
   `kerndatensatz-basis` build.
3. Then either **confirm** logo + palette (remove the Gate B banners here, in
   `mii.css`, and in the three fragments) or **replace** the hex values in
   `mii.css` / the PNGs in `content/assets/images/` — no other file needs to
   change.

**Open TODO(human) items (all Gate B):**

1. Confirm or replace logo + palette before any release.
2. Provide an official SVG of the main MII logo (only PNG obtainable; the site's only SVG is the anniversary logo).
3. Confirm MII permission to redistribute the logo files in this CC0 repo.
4. Decide whether translated imprint-link labels (lang-branched strings) are preferred over the language-neutral bare-URL labels.
5. Decide whether to accept footer links being the same white as the surrounding footer text (site-faithful, but WCAG 1.4.1-relevant) or allow one underline rule override.
