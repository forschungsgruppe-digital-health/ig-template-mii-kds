# Recipe: change the brand colour

**Goal.** Change one of the template's brand colours (e.g. the navbar blue) and see
it in a rendered build.

**Prerequisites.** A clone of this repo and the ability to build the preview —
easiest via the [dev container](first-build-in-devcontainer.md).

## Steps

1. Open `content/assets/css/mii.css`. It overrides **only** the CSS custom
   properties (`--…`) that the base template declares — never full rules.
2. Find the variable for the surface you want. Examples (see the file's comments
   for the full list and the source of each value):
   - `--navbar-bg-color` — the top navigation bar background (currently the MII
     logo blue `#3473aa`).
   - `--stripe-bg-color` — the 8px decorative top stripe (MII accent green).
   - `--ig-status-text-color` — the IG title/status text (MII slate).
3. Change the hex value. **Only use a value you can justify** — this is MII
   branding; record where it comes from in a comment, exactly as the existing
   entries do.
4. **Check contrast.** If text sits on the surface you changed, keep it at WCAG AA
   (≥ 4.5:1 for normal text, ≥ 3:1 for large/bold). `docs/design.md` shows how the
   current values were computed.
5. Rebuild the preview (`sushi . && java -Xmx6g -jar publisher.jar -ig ig.ini`)
   or push a `feature/*` branch and open the CI preview. If you do not have
   `publisher.jar` yet, step 6 of the
   [dev-container recipe](first-build-in-devcontainer.md) downloads it.
6. Open `output/index.html` (or the preview URL) and confirm the colour.

## Expected result

The rebuilt preview IG shows your new colour on that surface, in both `/de/` and
`/en/`, with no other visual change.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Colour did not change | You edited a base rule instead of a `--variable`, or `mii.css` is not linked | Only change `--…` values; confirm `includes/fragment-css.html` links `mii.css` *after* the base CSS |
| A stylelint/contrast reviewer flags it | Text on the new colour drops below AA | Pick a darker/lighter value; recompute contrast (see `docs/design.md`) |
| Raw hex rejected in review | The project forbids un-sourced colours | Add a comment citing the MII source of the value |

> **Why only variables:** overriding the base template's CSS variables (not its
> rules) keeps a branding change a **one-file, one-line edit** and lets base-template
> updates keep working. See [design.md](../design.md).
