// Guards the invariants of the MII / NUM-DIZ brand switch
// (docs/styleguide.md §10) that a rendered-build review can miss:
//
// 1. COMPLETE PALETTE — every CSS custom property the MII palette sets is
//    also set by num-diz.css (base variables AND mii.css's own table
//    variables). A missing override would not fail a build; it would silently
//    render one MII-colored surface inside the NUM-DIZ design.
// 2. SAFE DEFAULT — every brand branch in the fragments tests the exact
//    string 'num-diz', and the MII assets live in the fall-through path, so
//    a missing input/data/brand.json or an unknown value degrades to MII.
// 3. ACCESSIBILITY — the documented NUM-DIZ text/background pairs hold
//    WCAG 2.1 AA (>= 4.5:1), computed here from the shipped hex values, not
//    from the styleguide's prose.
// 4. PROVENANCE — the derived English combo logo keeps its "not an official
//    asset / pending approval" marker, and both NUM-DIZ logo files exist.
//
// Run with:  node --test scripts/brand-switch.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repo = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p) => readFileSync(repo(p), "utf8");

const miiCss = read("content/assets/css/mii.css");
const numDizCss = read("content/assets/css/num-diz.css");
const fragmentCss = read("includes/fragment-css.html");
const fragmentHeader = read("includes/fragment-header.html");
const fragmentFooter = read("includes/fragment-footer.html");

const declaredProps = (css) =>
  new Set(
    [...css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/(--[\w-]+)\s*:/g)].map(
      (m) => m[1],
    ),
  );

test("num-diz.css overrides every custom property the MII palette sets", () => {
  const mii = declaredProps(miiCss);
  const numDiz = declaredProps(numDizCss);
  for (const prop of mii) {
    assert.ok(
      numDiz.has(prop),
      `${prop} is set in mii.css but not overridden in num-diz.css — ` +
        "that surface would silently stay MII-colored in the NUM-DIZ design",
    );
  }
});

test("num-diz.css sets no property the MII palette does not (variables-only re-theme)", () => {
  const mii = declaredProps(miiCss);
  for (const prop of declaredProps(numDizCss)) {
    assert.ok(
      mii.has(prop),
      `${prop} appears only in num-diz.css — the NUM-DIZ palette must stay ` +
        "a re-theme of the exact variable set the MII palette uses",
    );
  }
});

const BRAND_GUARD = "{% if site.data.brand.design == 'num-diz' %}";

test("fragment-css: mii.css unconditional, num-diz.css only behind the exact brand guard", () => {
  // Match the actual <link> hrefs, not the file names — the explanatory
  // comment at the top of the fragment mentions both names too.
  const miiLink = fragmentCss.indexOf("assets/css/mii.css");
  const numDizLink = fragmentCss.indexOf("assets/css/num-diz.css");
  const guardAt = fragmentCss.indexOf(BRAND_GUARD);
  assert.ok(miiLink > -1 && numDizLink > -1 && guardAt > -1);
  assert.ok(miiLink < guardAt, "mii.css must be linked before (outside) the brand guard");
  assert.ok(guardAt < numDizLink, "num-diz.css must be linked inside the brand guard");
});

test("fragment-header: NUM-DIZ logos inside the guard, MII logos in the fall-through branch", () => {
  const guardAt = fragmentHeader.indexOf(BRAND_GUARD);
  // The brand-level {% else %} is the one right before the MII anchor (the
  // language switch nests its own {% else %} inside each brand branch).
  const miiAnchorAt = fragmentHeader.indexOf(
    'href="https://www.medizininformatik-initiative.de/"',
  );
  assert.ok(guardAt > -1 && miiAnchorAt > guardAt, "brand guard with an MII fall-through");
  const numDizBranch = fragmentHeader.slice(guardAt, miiAnchorAt);
  const rest = fragmentHeader.slice(miiAnchorAt);
  for (const lang of ["de", "en"]) {
    assert.match(numDizBranch, new RegExp(`logo-num-diz-${lang}\\.svg`));
    assert.match(rest, new RegExp(`logo-${lang}\\.svg`));
  }
  assert.ok(
    !rest.includes("logo-num-diz-"),
    "the fall-through (default) branch must reference only the MII logos",
  );
});

test("brand guards test the exact value — unknown values degrade to MII", () => {
  for (const [name, fragment] of [
    ["fragment-css.html", fragmentCss],
    ["fragment-header.html", fragmentHeader],
  ]) {
    const guards = fragment.match(/\{%\s*if[^%]*site\.data\.brand[^%]*%\}/g) ?? [];
    assert.ok(guards.length > 0, `${name} carries a brand guard`);
    for (const guard of guards) {
      assert.match(
        guard,
        /site\.data\.brand\.design\s*==\s*'num-diz'/,
        `${name}: brand guard must be an exact equality against 'num-diz' (${guard})`,
      );
    }
  }
});

test("footer: NUM-DIZ link before the MII link, in both designs (no brand guard)", () => {
  const numDiz = fragmentFooter.indexOf("netzwerk-universitaetsmedizin.de/forschung/num-diz");
  const mii = fragmentFooter.indexOf('href="https://www.medizininformatik-initiative.de/"');
  assert.ok(numDiz > -1, "footer links the NUM-DIZ page");
  assert.ok(mii > -1, "footer keeps the MII link (modules remain MII content)");
  assert.ok(numDiz < mii, "the NUM-DIZ link renders before the MII link");
  assert.ok(
    !fragmentFooter.includes("site.data.brand"),
    "the footer link row is identical in both brand designs",
  );
});

// WCAG 2.1 relative luminance / contrast ratio.
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("NUM-DIZ text/background pairs hold WCAG AA (docs/styleguide.md §10)", () => {
  const v = Object.fromEntries(
    [...numDizCss.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)].map((m) => [
      m[1],
      m[2],
    ]),
  );
  const pairs = [
    ["--btn-text-color", "--navbar-bg-color"],
    ["--btn-text-color", "--btn-hover-color"],
    ["--btn-text-color", "--btn-active-color"],
    ["--btn-text-color", "--btn-gradient-start-color"],
    ["--btn-text-color", "--btn-gradient-end-color"],
    ["--footer-hyperlink-text-color", "--footer-bg-color"],
    ["--footer-highlight-text-color", "--footer-container-bg-color"],
    ["--breadcrumb-text-color", "--breadcrumb-bg-color"],
    ["--ig-status-text-color", "--ig-header-container-color"],
    ["--link-color", "--ig-header-container-color"],
    ["--link-hover-color", "--ig-header-container-color"],
    ["--mii-table-header-text-color", "--mii-table-header-bg-color"],
  ];
  for (const [fg, bg] of pairs) {
    assert.ok(v[fg] && v[bg], `${fg} / ${bg} present as plain hex`);
    const ratio = contrast(v[fg], v[bg]);
    assert.ok(
      ratio >= 4.5,
      `${v[fg]} on ${v[bg]} (${fg} on ${bg}) is ${ratio.toFixed(2)}:1 — below AA`,
    );
  }
});

test("derived English combo keeps its provenance marker; both logo files exist", () => {
  for (const f of [
    "content/assets/images/logo-num-diz-de.svg",
    "content/assets/images/logo-num-diz-en.svg",
  ]) {
    assert.ok(existsSync(repo(f)), `${f} exists`);
  }
  const derived = read("content/assets/images/logo-num-diz-en.svg");
  assert.match(derived, /DERIVED FILE - NOT AN OFFICIAL NUM\/NUM-DIZ ASSET/);
  assert.match(derived, /PENDING NUM-DIZ APPROVAL/);
});
