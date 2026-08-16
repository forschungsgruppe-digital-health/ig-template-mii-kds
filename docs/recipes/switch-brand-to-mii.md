# Recipe: switch the brand to MII

**Goal.** Render an IG built with this template in the MII corporate design
(blue/green palette, MII logo) instead of the NUM-DIZ default.

**Prerequisites.** An IG that builds with this template — the preview IG in this
repo, or a consuming module ([consume-this-template-in-a-module.md](consume-this-template-in-a-module.md)).
Template version with NUM-DIZ as the default (> 0.7.0; between 0.6.1 and that
version the logic was inverted — MII was the default and `num-diz` the switch
value).

## Steps

1. In the IG project (the repo root for the preview; the module repo for a
   module), create `input/data/brand.json` with exactly:

   ```json
   { "design": "mii" }
   ```

   That is the whole switch. The base template pre-processes `input/data/`
   into Jekyll's `_data`, and the template's fragments read
   `site.data.brand.design` (see `docs/styleguide.md` §10). Only the exact
   value `mii` selects the MII design — anything else, including no
   `brand.json` at all, renders NUM-DIZ.
2. Rebuild (`sushi . && java -Xmx6g -jar publisher.jar -ig ig.ini`, or push a
   `feature/*` branch for the CI preview).
3. Open the rendered guide and check both languages (`/` and `/de/`).

## Expected result

- Header: the MII logo (German wordmark on `/de/`, English elsewhere), linking
  to medizininformatik-initiative.de.
- Palette: the MII blue navbar, accent-green top stripe, MII link blues —
  `mii.css` alone; `num-diz.css` is not linked.
- Footer: unchanged link row — the NUM-DIZ link renders in **both** designs
  (before the MII link), and the MII links stay (the modules remain MII
  content).
- Delete `brand.json` (or set any other value) and rebuild: the guide is back
  to the NUM-DIZ default — unset/unknown values render NUM-DIZ.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Still NUM-DIZ after adding the file | Value not exactly `mii`, file not at `input/data/brand.json`, or a stale build | Check spelling (the switch matches the exact string), path, then delete `output/`/`temp/` and rebuild |
| MII logo with NUM-DIZ colors (or vice versa) | A module overrides `input/includes/fragment-header.html` (or `fragment-css.html`) — an override replaces the fragment wholesale, including the brand switch | Re-add the brand branch to the module's override, or drop the override |
| Legal/branding review asks about the NUM-DIZ logos | The NUM/NUM-DIZ logos are third-party brand assets; the English combo is derived, not official — and as the default they now ship in every rendering that does not switch to MII | See `docs/styleguide.md` §10 — NUM-DIZ consent is pending, tracked in issues [#110](../../../../issues/110)/[#111](../../../../issues/111); switching to MII removes them from the build output |
