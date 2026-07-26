# Recipe: replace the logo

**Goal.** Replace the MII logo image the header shows.

**Prerequisites.** The replacement logo file(s), and the ability to build the
preview.

## Steps

1. The logo assets live in `content/assets/images/`:
   - `logo-en.svg` — shown on English (default-language) pages.
   - `logo-de.svg` — shown on German pages (the wordmark differs).
   The favicon is `content/assets/ico/favicon.png`.
2. Replace the file(s) **keeping the same file names**, or, if you use new names,
   update the `<img src="…">` in `includes/fragment-header.html` to match.
3. The shipped files are **SVG traced from the official PNGs** (`scripts/trace-logo.sh`),
   because the MII publishes no official SVG. If you get an official SVG, drop it
   in and delete the trace. If you only have a new PNG, re-run the trace script —
   the exact commands are in [`../design.md`](../design.md) §4.
4. Keep the `alt` text meaningful (it is in `fragment-header.html`).
5. Rebuild the preview or push a `feature/*` branch and open the preview; check
   the logo on both `/de/` and `/en/` pages.

## Expected result

The header shows your logo in both languages; the browser tab shows your favicon.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Broken image icon | File name changed but `fragment-header.html` still points at the old name | Match the `src` to the actual file name |
| Logo huge/tiny | No width constraint | The header fragment/CSS sizes the logo; keep the image's aspect ratio, or adjust the sizing rule in `mii.css` |
| Wrong logo on `/en/` | Only replaced `logo-de.svg` | Replace `logo-en.svg` too |

> **Licensing note:** the MII logo is a trademark. Shipping it in this CC0 repo
> relies on MII permission (there is precedent — `kerndatensatz-basis` ships MII
> logos). Confirm redistribution rights before a release. See `docs/design.md`.
