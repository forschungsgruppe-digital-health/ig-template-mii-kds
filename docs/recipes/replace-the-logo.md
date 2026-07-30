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
   these are the exact commands that produced the shipped files:

   ```sh
   scripts/trace-logo.sh mii-de.png logo-de.svg 200 4 0.4 "Medizininformatik-Initiative (MII)" \
     slate:#7a8495:#7a8495 blue:#3473aa:#3473aa teal:#548b9b:#548b9b \
     sage:#74a86f:#74a86f green:#72b802:#72b802 lime:#99cc4a:#99cc4a

   scripts/trace-logo.sh mii-en.png logo-en.svg 200 6 0.5 "Medical Informatics Initiative Germany (MII)" \
     "slate:#6d7887,#848c9a,#798693:#7a8495" "blue:#6a89ba:#3473aa" "teal:#93a5ad:#548b9b" \
     "sage:#9ebd89:#74a86f" "green:#afcf01,#a4c80d:#72b802"
   ```

   (Layer syntax and rationale: [`../styleguide.md`](../styleguide.md) §4.)
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
> logos). Confirm redistribution rights before a release. See `docs/styleguide.md`.
