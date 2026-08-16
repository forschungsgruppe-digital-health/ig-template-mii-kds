// Guards the two reader-facing chrome features added 2026-08-15:
//
// 1. FONT-SIZE CONTROL (A/A+/A++) — three pieces that must stay in step
//    (js asset, header markup, template-base.css block), the LEVEL-A
//    INVARIANT (no data-fontsize attribute -> no rule fires -> the default
//    rendering is byte-identical to a build without the feature), zoom
//    scoped to exactly one ancestor (#segment-content), and a print reset.
// 2. LANGUAGE LABEL — the fragment-language override must read the
//    stringsBase catalog (with the English literal as fallback) instead of
//    the base's hardcoded "Language:", and the vendored German catalog must
//    keep the unit that makes it render "Sprache".
//
// Run with:  node --test scripts/font-size-control.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repo(p), "utf8");

const js = read("content/assets/js/font-size-control.js");
const css = read("content/assets/css/template-base.css");
const header = read("includes/fragment-header.html");
const language = read("includes/fragment-language.html");
const catalogDe = read("translations/stringsBase-de.po");

test("the three font-size pieces exist and carry the removal note", () => {
  for (const [name, text] of [["js", js], ["css", css], ["header", header]]) {
    assert.match(text, /REMOVAL/, `${name} names the one-commit removal`);
  }
  assert.match(js, /ig-fontsize/, "js wires the .ig-fontsize control");
  assert.match(js, /localStorage/, "the level persists per reader");
});

test("level A is the untouched default (per-reader revert)", () => {
  assert.ok(
    !/data-fontsize="0"|data-fontsize='0'|\[data-fontsize=.0.\]/.test(css),
    "no CSS rule may exist for level 0 — the default must render without the feature",
  );
  assert.match(js, /removeAttribute\("data-fontsize"\)/,
    "level A removes the attribute rather than setting a zero level");
});

test("zoom levels: two levels, content AND menu, print resets both", () => {
  const rules = [...css.matchAll(/html\[data-fontsize="(\d)"\][^{]*\{\s*zoom:\s*([\d.]+)/g)];
  assert.deepEqual(rules.map((r) => [r[1], r[2]]), [["1", "1.125"], ["2", "1.25"]],
    "exactly the two non-default levels");
  for (const lv of ["1", "2"]) {
    const sel = css.match(new RegExp(`html\\[data-fontsize="${lv}"\\][^{]*\\{`))[0];
    assert.ok(sel.includes("#segment-content") && sel.includes("#segment-navbar"),
      `level ${lv} scales the content and the menu (sibling regions, no factor multiplication)`);
  }
  assert.match(css, /@media print[\s\S]*?#segment-content,\s*#segment-navbar\s*\{\s*zoom:\s*1\s*!important/,
    "print renders both regions at 100 %");
});

test("the control styles from palette variables only (both brands inherit)", () => {
  const block = css.slice(css.indexOf("Font-size control"), css.indexOf("DEPRECATED aliases"));
  assert.ok(block.length > 0, "block found before the deprecated aliases");
  assert.ok(!/#[0-9a-fA-F]{3,6}\b/.test(block.replace(/\/\*[\s\S]*?\*\//g, "")),
    "no raw hex — colors come from the palette variables");
  for (const v of ["--ig-status-text-color", "--btn-text-color", "--link-color"]) {
    assert.ok(block.includes(`var(${v})`), `${v} used`);
  }
});

test("header: three buttons per language branch, defer-loaded script", () => {
  for (const lang of ["Schriftgröße", "Font size"]) {
    assert.ok(header.includes(`aria-label="${lang}`), `${lang} aria branch present`);
  }
  assert.equal((header.match(/data-level="0"/g) || []).length, 2, "level 0 in both branches");
  assert.equal((header.match(/data-level="[12]"/g) || []).length, 4, "levels 1+2 in both branches");
  assert.equal((header.match(/>A</g) || []).length, 6,
    "all buttons read plain A — the button's own size shows the level");
  assert.ok(!/>A\+/.test(header), "no + suffixes on the labels");
  assert.match(header, /font-size-control\.js" defer/, "script loads deferred");
});

test("Language label: catalog lookup with fallback; German unit intact", () => {
  assert.match(language, /stringsBase\[include\.lang\]\['Language'\]\s*\|\s*default:\s*'Language'/,
    "the override reads the catalog and falls back to the English literal");
  assert.ok(!/>Language:</.test(language),
    "the base's hardcoded literal must not survive in the override");
  assert.match(catalogDe, /msgid "Language"\nmsgstr "Sprache"/,
    "the vendored German catalog translates the unit");
});
