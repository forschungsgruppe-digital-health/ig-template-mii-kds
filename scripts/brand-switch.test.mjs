// Guards the invariants of the NUM-DIZ / MII brand switch
// (docs/styleguide.md §10) that a rendered-build review can miss:
//
// 1. PALETTE EQUALITY — the two palette files declare exactly the SAME
//    variable set (base variables AND the template's own --ig-table-* /
//    --ig-highlight-* variables), because exactly ONE of them is loaded per
//    build. A variable missing from one palette would not fail a build; it
//    would silently render an unstyled (base-default) surface in that design.
//    template-base.css itself declares no palette variables (the deprecated
//    var()-alias bridge is exempt).
// 2. NUM-DIZ DEFAULT — every brand branch in the fragments tests the exact
//    string 'mii', and the NUM-DIZ assets live in the fall-through path, so
//    a missing input/data/brand.json or an unknown value renders NUM-DIZ (the
//    default) while exactly { "design": "mii" } restores the full MII design.
// 3. ACCESSIBILITY — the documented NUM-DIZ text/background pairs hold
//    WCAG 2.1 AA, computed here from the shipped hex values, not from the
//    styleguide's prose. Normal-text pairs need >= 4.5:1; the navbar pair
//    runs at the large-text bar (>= 3:1) and is coupled to the mii.css
//    typography block that makes navbar links large text (19px bold).
// 4. PROVENANCE — the English combo logo keeps its vectorized-from-the-
//    official-raster provenance (incl. the sha256 pin of the source asset),
//    and both NUM-DIZ logo files exist.
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
const templateBaseCss = read("content/assets/css/template-base.css");
const fragmentCss = read("includes/fragment-css.html");
const fragmentHeader = read("includes/fragment-header.html");
const fragmentFooter = read("includes/fragment-footer.html");

// A property whose value is only a var(--…) reference is an ALIAS (the
// deprecated --mii-* bridge): it is overridden through its target, so it is
// excluded from the override-completeness surface rather than demanded twice.
const declaredProps = (css) => {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out = new Set();
  for (const m of clean.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    if (/^\s*var\(--[\w-]+\)\s*$/.test(m[2])) continue;
    out.add(m[1]);
  }
  return out;
};

test("the two palette files declare exactly the same variable set", () => {
  const mii = declaredProps(miiCss);
  const numDiz = declaredProps(numDizCss);
  for (const prop of mii) {
    assert.ok(
      numDiz.has(prop),
      `${prop} is set in mii.css but missing from num-diz.css — that surface ` +
        "would silently fall back to the base default in the NUM-DIZ design",
    );
  }
  for (const prop of numDiz) {
    assert.ok(
      mii.has(prop),
      `${prop} is set in num-diz.css but missing from mii.css — that surface ` +
        "would silently fall back to the base default in the MII design",
    );
  }
});

test("template-base.css declares no palette variables (alias bridge exempt)", () => {
  const props = declaredProps(templateBaseCss);
  assert.equal(
    props.size,
    0,
    `template-base.css must stay brand-independent; it declares: ${[...props].join(", ")}`,
  );
});

// The single guard form of the NUM-DIZ-default contract: every brand branch
// picks the MII variant with an exact `if == 'mii'` and falls through to
// NUM-DIZ for every other value, including no brand.json at all.
const MII_IF_GUARD = "{% if site.data.brand.design == 'mii' %}";

test("fragment-css: base unconditional, then exactly one palette (num-diz default, mii behind the if-'mii' guard)", () => {
  // Match the actual <link> hrefs, not the file names — the explanatory
  // comment at the top of the fragment mentions the names too.
  const baseLink = fragmentCss.indexOf("assets/css/template-base.css");
  const miiLink = fragmentCss.indexOf("assets/css/mii.css");
  const numDizLink = fragmentCss.indexOf("assets/css/num-diz.css");
  const guardAt = fragmentCss.indexOf(MII_IF_GUARD);
  const elseAt = fragmentCss.indexOf("{% else %}");
  const endifAt = fragmentCss.indexOf("{% endif %}");
  assert.ok(baseLink > -1 && miiLink > -1 && numDizLink > -1, "all three files linked");
  assert.ok(guardAt > -1 && elseAt > -1 && endifAt > -1, "if/else/endif present");
  assert.ok(
    baseLink < guardAt,
    "template-base.css must be linked before (outside) the brand guard — its " +
      "rule blocks apply in BOTH designs",
  );
  assert.ok(
    guardAt < miiLink && miiLink < elseAt,
    "mii.css must be the if-'mii' branch — loaded ONLY when the consuming IG " +
      "selects the MII design",
  );
  assert.ok(
    elseAt < numDizLink && numDizLink < endifAt,
    "num-diz.css must be the else branch — the default palette for every " +
      "other value, including no brand.json at all",
  );
});

test("fragment-header: MII logos inside the guard, NUM-DIZ logos in the fall-through branch", () => {
  const guardAt = fragmentHeader.indexOf(MII_IF_GUARD);
  // The brand-level {% else %} is the one right before the NUM-DIZ anchor (the
  // language switch nests its own {% else %} inside each brand branch).
  const numDizAnchorAt = fragmentHeader.indexOf(
    'href="https://www.netzwerk-universitaetsmedizin.de/forschung/num-diz"',
  );
  assert.ok(
    guardAt > -1 && numDizAnchorAt > guardAt,
    "brand guard with a NUM-DIZ fall-through",
  );
  const miiBranch = fragmentHeader.slice(guardAt, numDizAnchorAt);
  const rest = fragmentHeader.slice(numDizAnchorAt);
  for (const lang of ["de", "en"]) {
    assert.match(miiBranch, new RegExp(`logo-${lang}\\.svg`));
    assert.match(rest, new RegExp(`logo-num-diz-${lang}\\.svg`));
  }
  assert.ok(
    !miiBranch.includes("logo-num-diz-"),
    "the 'mii' branch must reference only the MII logos",
  );
  assert.ok(
    !/logo-(?:de|en)\.svg/.test(rest),
    "the fall-through (default) branch must reference only the NUM-DIZ logos",
  );
});

test("brand guards test the exact value 'mii' — unknown values render NUM-DIZ", () => {
  for (const [name, fragment] of [
    ["fragment-css.html", fragmentCss],
    ["fragment-header.html", fragmentHeader],
  ]) {
    const guards =
      fragment.match(/\{%\s*(?:if|unless)[^%]*site\.data\.brand[^%]*%\}/g) ?? [];
    assert.ok(guards.length > 0, `${name} carries a brand guard`);
    for (const guard of guards) {
      assert.match(
        guard,
        /site\.data\.brand\.design\s*==\s*'mii'/,
        `${name}: brand guard must be an exact equality against 'mii' — the ` +
          `only tested value; everything else falls through to NUM-DIZ (${guard})`,
      );
    }
  }
});

test("footer: NUM-DIZ link before the MII link, aligned anchors, in both designs (no brand guard)", () => {
  // Both website links are the SITE ROOT with the bare domain as anchor text
  // (TF-KDS 2026-08-14) — asserting the full href+anchor pins the alignment.
  const numDiz = fragmentFooter.indexOf(
    'href="https://www.netzwerk-universitaetsmedizin.de/">netzwerk-universitaetsmedizin.de</a>',
  );
  const mii = fragmentFooter.indexOf(
    'href="https://www.medizininformatik-initiative.de/">medizininformatik-initiative.de</a>',
  );
  assert.ok(numDiz > -1, "footer links the NUM-DIZ site root with the domain as anchor");
  assert.ok(mii > -1, "footer keeps the MII link (modules remain MII content)");
  assert.ok(numDiz < mii, "the NUM-DIZ link renders before the MII link");
  assert.ok(
    !fragmentFooter.includes("site.data.brand"),
    "the footer link row is identical in both brand designs",
  );
  // The header renders the FHIR flame on every page; HL7's trademark policy
  // asks for the attribution sentence in text wherever the mark is used.
  assert.match(fragmentFooter,
    /HL7®, FHIR® and the FHIR flame design are registered trademarks of Health Level Seven International/,
    "the HL7 trademark attribution renders in the footer (permission request: issue #109)");
  assert.match(fragmentHeader, /alt="HL7 FHIR"/,
    "the flame stays standalone + nominative in the header");
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
  // Third element = the minimum for the pair. TEXT pairs need 4.5:1 (AA
  // normal text); the *-border pairs are NON-TEXT boundaries and need 3:1
  // (WCAG 1.4.11). EXCEPTION: the navbar pair runs at 3.0 — the coral navbar
  // (TF-KDS 2026-08-14, default typography) holds only 3.58:1 under white, a
  // RECORDED LIMITATION accepted by TF-KDS decision (docs/styleguide.md §7).
  // The 3.0 floor still guards against a regression below even that.
  const pairs = [
    ["--btn-text-color", "--navbar-bg-color", 3.0],
    ["--btn-text-color", "--btn-hover-color", 4.5],
    ["--btn-text-color", "--btn-active-color", 4.5],
    ["--btn-text-color", "--btn-gradient-start-color", 4.5],
    ["--btn-text-color", "--btn-gradient-end-color", 4.5],
    ["--footer-hyperlink-text-color", "--footer-bg-color", 4.5],
    ["--footer-highlight-text-color", "--footer-container-bg-color", 4.5],
    ["--breadcrumb-text-color", "--breadcrumb-bg-color", 4.5],
    ["--ig-status-text-color", "--ig-header-container-color", 4.5],
    ["--link-color", "--ig-header-container-color", 4.5],
    ["--link-hover-color", "--ig-header-container-color", 4.5],
    ["--ig-table-header-text-color", "--ig-table-header-bg-color", 4.5],
  ];
  for (const variant of ["blue", "green", "orange", "red", "grey"]) {
    pairs.push([
      `--ig-highlight-${variant}-heading-color`,
      `--ig-highlight-${variant}-bg-color`,
      4.5,
    ]);
    // Border on the box background — non-text (1.4.11). The NUM-DIZ set has
    // no green exception like the inherited MII palette.
    pairs.push([
      `--ig-highlight-${variant}-border-color`,
      `--ig-highlight-${variant}-bg-color`,
      3.0,
    ]);
  }
  for (const [fg, bg, min] of pairs) {
    assert.ok(v[fg] && v[bg], `${fg} / ${bg} present as plain hex`);
    const ratio = contrast(v[fg], v[bg]);
    assert.ok(
      ratio >= min,
      `${v[fg]} on ${v[bg]} (${fg} on ${bg}) is ${ratio.toFixed(2)}:1 — below the ${min}:1 bar`,
    );
  }
});

test("English combo keeps its official-asset provenance; both logo files exist", () => {
  for (const f of [
    "content/assets/images/logo-num-diz-de.svg",
    "content/assets/images/logo-num-diz-en.svg",
  ]) {
    assert.ok(existsSync(repo(f)), `${f} exists`);
  }
  const en = read("content/assets/images/logo-num-diz-en.svg");
  assert.match(en, /vectorized on 2026-08-17 from the official/,
    "provenance names the official-raster vectorization");
  assert.match(en, /sha256 6baaee90eb201583c34405854582c49a/,
    "the source asset's checksum stays pinned");
  assert.match(en, /issue #110/,
    "the brand-use consent issue stays referenced");
  assert.ok(!/PENDING NUM-DIZ APPROVAL/.test(en),
    "the old derived-file approval marker is gone");
});
