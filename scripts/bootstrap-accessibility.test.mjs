// Guards the vendored PayPal Bootstrap Accessibility Plugin (v1.0.7):
// byte-exact pins (any silent change to a vendored third-party asset must
// fail loudly), and the three wiring points staying in step. Provenance:
// vendored 2026-08-16 from paypal/bootstrap-accessibility-plugin @ v1.0.7;
// the admin-ch fork was evaluated and rejected (151 commits behind upstream;
// its 6 own commits are site-specific tab/dropdown tweaks, two mutually
// reverting). Run with:  node --test scripts/bootstrap-accessibility.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const sha256 = (p) => createHash("sha256").update(readFileSync(repo(p))).digest("hex");

test("vendored plugin assets are byte-identical to the pinned v1.0.7 files", () => {
  assert.equal(sha256("content/assets/js/bootstrap-accessibility.min.js"),
    "a4e20eeadff48aad469fd9a1455bf46991d6914e5dda57c9a8b7a1676614174c");
  assert.equal(sha256("content/assets/css/bootstrap-accessibility.css"),
    "2c5dc7b54d1d0bbaa036ab989aa4a411896e93713383a1b0c2ffbad5604a52e0");
});

test("the three wiring points stay in step", () => {
  const css = readFileSync(repo("includes/fragment-css.html"), "utf8");
  const header = readFileSync(repo("includes/fragment-header.html"), "utf8");
  const baseAt = css.indexOf("template-base.css");
  const pluginAt = css.indexOf("bootstrap-accessibility.css");
  assert.ok(pluginAt > -1 && baseAt > -1 && pluginAt < baseAt,
    "plugin css loads BEFORE template-base.css so the template can override");
  assert.match(header, /bootstrap-accessibility\.min\.js" defer/,
    "plugin js loads deferred (executes after the parser-inserted bootstrap.min.js)");
});
