# Recipe: replace the logo

**Goal.** Replace the MII logo image the header shows.

**Prerequisites.** The replacement logo file(s), and the ability to build the
self-test.

## Steps

1. The logo assets live in `content/assets/images/`:
   - `mii-logo.png` — shown on German (default-language) pages.
   - `mii-logo-en.png` — shown on English pages (the wordmark differs).
   The favicon is `content/assets/ico/favicon.png`.
2. Replace the file(s) **keeping the same file names**, or, if you use new names,
   update the `<img src="…">` in `includes/fragment-header.html` to match.
3. Prefer an **SVG** if you have one (crisp at any size) — none of the official MII
   main logo exists as SVG publicly today, so PNG is shipped; if you obtain an SVG,
   add it and point the header at it.
4. Keep the `alt` text meaningful (it is in `fragment-header.html`).
5. Rebuild the self-test or push a `feature/*` branch and open the preview; check
   the logo on both `/de/` and `/en/` pages.

## Expected result

The header shows your logo in both languages; the browser tab shows your favicon.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Broken image icon | File name changed but `fragment-header.html` still points at the old name | Match the `src` to the actual file name |
| Logo huge/tiny | No width constraint | The header fragment/CSS sizes the logo; keep the image's aspect ratio, or adjust the sizing rule in `mii.css` |
| Wrong logo on `/en/` | Only replaced `mii-logo.png` | Replace `mii-logo-en.png` too |

> **Licensing note:** the MII logo is a trademark. Shipping it in this CC0 repo
> relies on MII permission (there is precedent — `kerndatensatz-basis` ships MII
> logos). Confirm redistribution rights before a release. See `docs/DESIGN.md`.
