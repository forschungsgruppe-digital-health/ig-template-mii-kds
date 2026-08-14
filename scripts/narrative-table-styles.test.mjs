// Holds the narrative-table styling to the one thing that makes it safe: it
// must never apply to a table the IG Publisher generated.
//
// The Publisher renders profile snapshot/differential trees as tables that
// carry NO class — only presentation attributes:
//
//   <table border="0" fhir="generated-heirarchy" cellpadding="0"
//          cellspacing="0" style="..." id="..." data-fhir="...">
//
// Their inline `style` is on the <table>, so it does not stop a stylesheet rule
// from bordering their <td>s, which boxes every cell of the tree. The first
// version of this styling used `table:not([class])` and did exactly that to 34
// generated tables. What actually separates the two kinds is that a markdown
// table has no attributes at all, while every generated one carries at least
// `style`.
//
// So this test does not check the selector's spelling — it SIMULATES the
// selector against fixtures taken verbatim from both built sites, which is the
// check that would have caught the original mistake.
//
// Rationale: docs/styleguide.md §5.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  fileURLToPath(new URL("../content/assets/css/template-base.css", import.meta.url)),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, ""); // strip comments so prose cannot trip us

// The rules live in template-base.css; the colour values live in the palette
// files (one loaded per build). The MII values are asserted against mii.css;
// num-diz.css is covered by the palette-equality test in brand-switch.test.mjs.
const miiPalette = readFileSync(
  fileURLToPath(new URL("../content/assets/css/mii.css", import.meta.url)),
  "utf8",
).replace(/\/\*[\s\S]*?\*\//g, "");

/** Every table selector the stylesheet applies to narrative tables. */
const tableSelectors = css
  .split("}")
  .map((block) => block.split("{")[0].trim())
  .filter(Boolean)
  .flatMap((sel) => sel.split(",").map((s) => s.trim()))
  .filter((sel) => /(^|\s)table\b/.test(sel));

/** The attribute names each selector excludes via :not([attr]). */
function excludedAttrs(selector) {
  return [...selector.matchAll(/:not\(\[([a-zA-Z-]+)\]\)/g)].map((m) => m[1]);
}

/** Would `selector` match a <table> carrying these attributes? */
function selectorMatches(selector, attrString) {
  return !excludedAttrs(selector).some((a) =>
    new RegExp(`\\b${a}\\s*=`).test(attrString),
  );
}

// Verbatim from the built sites. Attribute strings only — that is all the
// selector can discriminate on.
const MARKDOWN_TABLES = [
  "", // kramdown emits a bare <table> with no attributes
];
const GENERATED_TABLES = [
  ' border="0" fhir="generated-heirarchy" cellpadding="0" cellspacing="0" style="border: 0px #F0F0F0 solid; font-size: 11px; font-family: verdana; vertical-align: top;" id="example-patientD" data-fhir="generated-heirarchy"',
  ' border="0" cellpadding="0" cellspacing="0" style="border: 0px #F0F0F0 solid;"',
  ' style="width:100%"',
  ' class="binding grid"',
  ' class="list presentation" data-fhir="generated-heirarchy"',
  ' class="colsi"',
  ' class="grid"',
  ' class="codes"',
  ' class="dict"',
  ' class="fhir-conformance-list grid"',
];

test("the styling reaches markdown tables", () => {
  assert.ok(tableSelectors.length > 0, "expected table selectors in template-base.css");
  for (const sel of tableSelectors) {
    for (const attrs of MARKDOWN_TABLES) {
      assert.ok(
        selectorMatches(sel, attrs),
        `"${sel}" would NOT match a markdown table (<table${attrs}>)`,
      );
    }
  }
});

test("the styling never reaches a publisher-generated table", () => {
  for (const sel of tableSelectors) {
    for (const attrs of GENERATED_TABLES) {
      assert.ok(
        !selectorMatches(sel, attrs),
        `"${sel}" WOULD match a generated table (<table${attrs}>). ` +
          `Bordering its cells breaks the profile tree — see docs/styleguide.md §5.`,
      );
    }
  }
});

test("a border and a header background are actually defined", () => {
  assert.match(miiPalette, /--ig-table-border-color:\s*#[0-9a-f]{6}/i);
  assert.match(miiPalette, /--ig-table-header-bg-color:\s*#[0-9a-f]{6}/i);
  assert.match(css, /border:\s*1px solid var\(--ig-table-border-color\)/);
  assert.match(
    css,
    /background-color:\s*var\(--ig-table-header-bg-color\)/,
  );
});

test("the table colours come from the documented MII palette", () => {
  const design = readFileSync(
    fileURLToPath(new URL("../docs/styleguide.md", import.meta.url)),
    "utf8",
  );
  for (const [name, value] of [
    ["--ig-table-header-bg-color", "#ebedef"],
    ["--ig-table-border-color", "#7a8495"],
    ["--ig-table-header-text-color", "#333333"],
  ]) {
    assert.match(miiPalette, new RegExp(`${name}:\\s*${value}`, "i"));
    assert.ok(
      design.includes(value),
      `${value} is not recorded in docs/styleguide.md — every colour needs a source`,
    );
  }
});
