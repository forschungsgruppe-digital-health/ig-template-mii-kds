// Holds the narrative-table styling to the one thing that makes it safe: it
// must never apply to a table the IG Publisher generated.
//
// The IG Publisher renders profile snapshot/differential trees as tables whose
// hierarchy lines are background images. Every table it generates carries a
// class (`grid`, `codes`, `dict`, `list`, `colsd`, `colsi`, `binding grid`,
// `fhir-conformance-list`, ...); markdown tables in page content carry none.
// `table:not([class])` is what keeps the two apart. Someone trying to fix a
// table that looks wrong is likely to reach for a bare `table { ... }` rule,
// which repaints the artifact pages — a regression that does not look like one
// in a diff. This test makes that a red build instead.
//
// Rationale and the measurement behind it: docs/design.md section 7a.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(
  fileURLToPath(new URL("../content/assets/css/mii.css", import.meta.url)),
  "utf8",
);

// Strip comments so prose about `table { ... }` cannot trip the assertions.
const rules = css.replace(/\/\*[\s\S]*?\*\//g, "");

test("narrative-table rules are scoped to unclassed tables", () => {
  const selectors = rules
    .split("}")
    .map((block) => block.split("{")[0].trim())
    .filter(Boolean)
    .flatMap((sel) => sel.split(",").map((s) => s.trim()))
    .filter((sel) => /(^|\s)table\b/.test(sel));

  assert.ok(selectors.length > 0, "expected at least one table selector");
  for (const sel of selectors) {
    assert.match(
      sel,
      /table:not\(\[class\]\)/,
      `"${sel}" would also match tables the IG Publisher generates. Keep the ` +
        `:not([class]) scope — see docs/design.md section 7a.`,
    );
  }
});

test("a border and a header background are actually defined", () => {
  assert.match(rules, /--mii-table-border-color:\s*#[0-9a-f]{6}/i);
  assert.match(rules, /--mii-table-header-bg-color:\s*#[0-9a-f]{6}/i);
  assert.match(
    rules,
    /table:not\(\[class\]\)\s+th\s*,\s*\n?\s*table:not\(\[class\]\)\s+td\s*\{[^}]*border:\s*1px solid var\(--mii-table-border-color\)/,
  );
  assert.match(
    rules,
    /table:not\(\[class\]\)\s+th\s*\{[^}]*background-color:\s*var\(--mii-table-header-bg-color\)/,
  );
});

test("the table colours come from the documented MII palette", () => {
  // docs/design.md section 3 is the source of truth for these values.
  const design = readFileSync(
    fileURLToPath(new URL("../docs/design.md", import.meta.url)),
    "utf8",
  );
  for (const [name, value] of [
    ["--mii-table-header-bg-color", "#ebedef"],
    ["--mii-table-border-color", "#7a8495"],
    ["--mii-table-header-text-color", "#333333"],
  ]) {
    assert.match(
      rules,
      new RegExp(`${name}:\\s*${value}`, "i"),
      `${name} should be ${value}`,
    );
    assert.ok(
      design.includes(value),
      `${value} is not recorded in docs/design.md — every colour needs a source`,
    );
  }
});
