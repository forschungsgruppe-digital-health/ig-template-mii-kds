# Recipe: show an artifact's structure as tabs in a page

**Goal.** Render one artifact's structure inside a narrative page as four tabs —
*Structure (snapshot)*, *Differential*, *XML*, *JSON* — the way the official FHIR
specification presents a resource, instead of pasting the generated fragments
underneath each other.

**Prerequisites.**

- The page is a narrative page of an IG that is built with this template
  (`input/pagecontent/<page>.md`, or its per-language mirror under
  `input/translations/<lang>/pagecontent/`).
- The artifact is a **StructureDefinition** — profile or extension. The IG
  Publisher generates the four fragments this include stitches together
  (`-snapshot`, `-diff`, `-xml-html`, `-json-html`) for StructureDefinitions.
  Other artifact types (ValueSet, CodeSystem, …) do not get all four.
- The artifact has been through at least one build, so the fragments exist.
  Bootstrap's tab JavaScript is already loaded by the base template, so nothing
  else has to be added to the page.

## Steps

1. Find the artifact's **file id** — the name the IG Publisher uses for its
   generated files, e.g. `StructureDefinition-mii-pr-dokument-dokument`. After a
   build it is the fragment prefix in `temp/pages/_includes/`:

   ```sh
   ls temp/pages/_includes/ | grep '^StructureDefinition-' | sed 's/-\(snapshot\|diff\|xml-html\|json-html\)\.xhtml$//' | sort -u
   ```

2. Put one include line in the page, on its own line and outside any comment:

   ```liquid
   {% include structure-tabs.html artifact="StructureDefinition-mii-pr-dokument-dokument" %}
   ```

3. Add the optional parameters if you need them:

   | Parameter | Required | What it does |
   | --- | --- | --- |
   | `artifact` | yes | The artifact's file id, without the `-snapshot` / `-diff` / `-xml-html` / `-json-html` suffix and without `.xhtml` |
   | `lang` | no | Localises the tab labels. `lang="de"` gives *Struktur (Snapshot)*; anything else (and the default) gives the English labels. Pass the language of the page variant the file belongs to — German mirrors pass `de` |
   | `id` | no | A unique suffix, needed only when the **same artifact is tabbed twice on one page**. Without it both tab groups generate the same element ids and clicking one switches the other |

4. Rebuild and open the page. Click through all four tabs.

## Expected result

The page shows one tab strip with four panes. The first pane (*Structure
(snapshot)*) is open; the other three switch without reloading the page. Wide
trees scroll horizontally inside the pane rather than stretching the column.

## Common errors & fixes

| Symptom | Cause | Fix |
| --- | --- | --- |
| **The whole build fails** with a Jekyll "Could not locate the included file" error | One of the four fragments does not exist — a typo in `artifact`, or an artifact type for which the publisher generates no snapshot/diff. A single missing include aborts the entire Jekyll run, not just this page | Re-check the id against `ls temp/pages/_includes/`. All four `<artifact>-snapshot`, `-diff`, `-xml-html`, `-json-html` fragments must be there before the include is used |
| Tabs render as a plain bullet list, nothing switches | The page is not being rendered by this template, or the base template's Bootstrap JS is not on the page | Confirm the IG's `ig.ini` points at this template; the include relies on the base's bundled Bootstrap tab JS |
| Clicking a tab switches a different block on the same page | The same artifact is included twice without `id` | Give at least one of them `id="…"` |
| The labels are English on a German page | `lang` was not passed | Add `lang="de"` in the German mirror of the page |
| Two identical structures below each other instead of tabs | The include line sits inside a fenced code block or an HTML comment | Move it to its own line in plain page content |

> **Use it sparingly.** An inline structure is worth it when the narrative
> genuinely has to discuss the elements in place. If the reader only needs to
> look the artifact up, a plain link to its artifact page is lighter, always
> correct, and cannot break the build.
