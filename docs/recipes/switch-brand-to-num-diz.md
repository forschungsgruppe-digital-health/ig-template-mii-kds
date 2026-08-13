# Recipe: switch the brand to NUM-DIZ

**Goal.** Render an IG built with this template in the NUM-DIZ corporate design
(slate/coral palette, NUM-DIZ combination logo) instead of the MII default.

**Prerequisites.** An IG that builds with this template — the preview IG in this
repo, or a consuming module ([consume-this-template-in-a-module.md](consume-this-template-in-a-module.md)).
Template version with the brand switch (> 0.6.1).

## Steps

1. In the IG project (the repo root for the preview; the module repo for a
   module), create `input/data/brand.json` with exactly:

   ```json
   { "design": "num-diz" }
   ```

   That is the whole switch. The base template pre-processes `input/data/`
   into Jekyll's `_data`, and the template's fragments read
   `site.data.brand.design` (see `docs/styleguide.md` §10).
2. Rebuild (`sushi . && java -Xmx6g -jar publisher.jar -ig ig.ini`, or push a
   `feature/*` branch for the CI preview).
3. Open the rendered guide and check both languages (`/` and `/de/`).

## Expected result

- Header: the NUM-DIZ combination logo (German on `/de/`, the derived English
  combo elsewhere), linking to the NUM-DIZ page.
- Palette: slate navbar and footer, coral top stripe, slate-blue links
  (`num-diz.css` overrides the `mii.css` variables).
- Footer: unchanged link row — the NUM-DIZ link renders in **both** designs,
  and the MII links stay (the modules remain MII content).
- Delete `brand.json` (or set any other value) and rebuild: the guide is back
  to the exact MII default — unset/unknown values degrade safely to MII.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Still MII after adding the file | Value not exactly `num-diz`, file not at `input/data/brand.json`, or a stale build | Check spelling (the switch matches the exact string), path, then delete `output/`/`temp/` and rebuild |
| MII logo with NUM-DIZ colors (or vice versa) | A module overrides `input/includes/fragment-header.html` (or `fragment-css.html`) — an override replaces the fragment wholesale, including the brand switch | Re-add the brand branch to the module's override, or drop the override |
| Legal/branding review asks about the logos | The NUM/NUM-DIZ logos are third-party brand assets; the English combo is derived, not official | See `docs/styleguide.md` §10 — NUM-DIZ consent is pending, tracked in `docs/open-tasks.md` |
