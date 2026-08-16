// Guards the back-to-top button (2026-08-16): the three pieces in step, the
// reduced-motion respect that justified writing our own script over wiring
// the base's dormant topofpage.js, the outside-the-zoom placement, and the
// one-commit removal notes.  Run: node --test scripts/back-to-top.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repo(p), "utf8");

const js = read("content/assets/js/back-to-top.js");
const css = read("content/assets/css/template-base.css");
const header = read("includes/fragment-header.html");

test("three pieces exist and carry the removal note", () => {
  for (const [n, t] of [["js", js], ["header", header]]) assert.match(t, /REMOVAL/, n);
  assert.ok(css.includes("Back-to-top button"), "css block present");
});

test("reduced motion is respected; focus moves to the top anchor", () => {
  assert.match(js, /prefers-reduced-motion/, "media query consulted");
  assert.match(js, /behavior:\s*reduced\.matches\s*\?\s*"auto"\s*:\s*"smooth"/,
    "smooth scroll only without a reduced-motion preference");
  assert.match(js, /a\[name="top"\]/, "focus lands on the page-top anchor");
});

test("appears after one viewport, hidden state leaves the tab order", () => {
  assert.match(js, /window\.scrollY > window\.innerHeight/, "one-viewport threshold");
  assert.match(css, /\.ig-back-to-top\s*\{[^}]*display:\s*none/, "hidden by default (no tab stop)");
  assert.match(css, /@media print[\s\S]*\.ig-back-to-top\s*\{\s*display:\s*none/, "hidden in print");
});

test("palette variables only; both language aria labels; outside the zoom regions", () => {
  const block = css.slice(css.indexOf("Back-to-top button"), css.indexOf("DEPRECATED aliases"));
  assert.ok(!/#[0-9a-fA-F]{3,6}\b/.test(block.replace(/\/\*[\s\S]*?\*\//g, "")), "no raw hex");
  assert.match(block, /background:\s*var\(--ig-header-container-color\)/,
    "SOLID light ground - the slate fill matched the footer variable value and vanished on overlap");
  assert.match(block, /padding:\s*0/, "UA button padding reset (glyph centering)");
  assert.match(block, /:hover\s*\{[^}]*var\(--btn-hover-color\)/,
    "hover fills with the same variable as the font-size control (WCAG 3.2.4 consistency)");
  for (const l of ["Zurück zum Seitenanfang", "Back to top"]) {
    assert.ok(header.includes(`aria-label="${l}"`), l);
  }
  assert.match(header, /back-to-top\.js" defer/, "deferred script");
});
