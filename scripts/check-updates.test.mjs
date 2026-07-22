// Unit tests for the PURE parsing/compare functions of check-updates.mjs.
// Offline by design: no network, no filesystem reads beyond the import.
// Run with:  node --test scripts/check-updates.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  normalizeVersion,
  compareVersions,
  parsePackageJsonPin,
  parseWorkflowEnvPin,
  parseSushiDependencies,
  latestFromPackageList,
  statusFor,
  escapeCell,
  buildTable,
  hasUpdates,
} from "./check-updates.mjs";

// --- normalizeVersion -------------------------------------------------------

test("normalizeVersion strips a leading v and whitespace", () => {
  assert.equal(normalizeVersion("v2.2.11"), "2.2.11");
  assert.equal(normalizeVersion("2.2.11 "), "2.2.11");
  assert.equal(normalizeVersion("0.1.0"), "0.1.0");
});

// --- compareVersions --------------------------------------------------------

test("compareVersions compares numerically per segment", () => {
  assert.equal(compareVersions("0.9.0", "0.10.0"), -1); // string sort would say 1
  assert.equal(compareVersions("0.10.0", "0.9.0"), 1);
  assert.equal(compareVersions("1.0.0", "1.0.0"), 0);
  assert.equal(compareVersions("v1.2.3", "1.2.3"), 0);
  assert.equal(compareVersions("1.0", "1.0.1"), -1); // missing segment = 0
});

// --- parsePackageJsonPin ----------------------------------------------------

test("parsePackageJsonPin reads a dependency pin", () => {
  const json = JSON.stringify({
    name: "de.medizininformatikinitiative.template",
    type: "fhir.template",
    dependencies: { "fhir2.base.template": "0.1.0" },
  });
  assert.equal(parsePackageJsonPin(json, "fhir2.base.template"), "0.1.0");
});

test("parsePackageJsonPin returns null for absent dep or broken JSON", () => {
  assert.equal(parsePackageJsonPin("{}", "fhir2.base.template"), null);
  assert.equal(
    parsePackageJsonPin('{"dependencies":{}}', "fhir2.base.template"),
    null,
  );
  assert.equal(parsePackageJsonPin("not json {", "fhir2.base.template"), null);
  // non-string values (e.g. objects) are rejected, not returned
  assert.equal(
    parsePackageJsonPin(
      '{"dependencies":{"fhir2.base.template":{"v":"0.1.0"}}}',
      "fhir2.base.template",
    ),
    null,
  );
});

// --- parseWorkflowEnvPin ----------------------------------------------------

const workflowYaml = `
name: Build IG
env:
  PUBLISHER_VERSION: "2.2.11"
  SUSHI_VERSION: 3.20.0
  # JEKYLL_VERSION: "9.9.9"   (commented out on purpose)
jobs:
  build:
    runs-on: ubuntu-latest
`;

test("parseWorkflowEnvPin reads quoted and unquoted env pins", () => {
  assert.equal(parseWorkflowEnvPin(workflowYaml, "PUBLISHER_VERSION"), "2.2.11");
  assert.equal(parseWorkflowEnvPin(workflowYaml, "SUSHI_VERSION"), "3.20.0");
});

test("parseWorkflowEnvPin ignores commented lines and missing keys", () => {
  assert.equal(parseWorkflowEnvPin(workflowYaml, "JEKYLL_VERSION"), null);
  assert.equal(parseWorkflowEnvPin(workflowYaml, "NOT_THERE_VERSION"), null);
});

// --- parseSushiDependencies -------------------------------------------------

const sushiYaml = `
id: example
dependencies:
  de.basisprofil.r4: 1.5.4
  de.medizininformatikinitiative.kerndatensatz.meta: 2026.0.0
  # hl7.fhir.uv.crmi: 1.0.0     (commented out — must be skipped)
  hl7.fhir.uv.xver-r5.r4: 0.2.0 # trailing comment must not leak into version
  some.floating.dep: current
menu:
  Home: index.html
`;

test("parseSushiDependencies reads pinned, non-commented deps only", () => {
  const deps = parseSushiDependencies(sushiYaml);
  assert.deepEqual(deps, {
    "de.basisprofil.r4": "1.5.4",
    "de.medizininformatikinitiative.kerndatensatz.meta": "2026.0.0",
    "hl7.fhir.uv.xver-r5.r4": "0.2.0",
  });
  // "current" is not a pin (does not start with a digit) — excluded
  assert.equal("some.floating.dep" in deps, false);
});

test("parseSushiDependencies stops at the end of the block", () => {
  const deps = parseSushiDependencies(sushiYaml);
  assert.equal("Home" in deps, false);
});

test("parseSushiDependencies handles text without a dependencies block", () => {
  assert.deepEqual(parseSushiDependencies("id: x\nname: y\n"), {});
});

// --- latestFromPackageList --------------------------------------------------

// Shape mirrors the real HL7/ig-template-base2 package-list.json (verified):
// a "current" ci-build entry plus dated "release" entries.
const packageList = {
  "package-id": "fhir2.base.template",
  list: [
    { version: "current", status: "ci-build", current: true },
    { version: "0.1.0", status: "release", date: "2025-07-06" },
    { version: "0.0.1", status: "release", date: "2020-07-03" },
  ],
};

test("latestFromPackageList picks the newest release, ignoring ci-build", () => {
  assert.equal(latestFromPackageList(packageList), "0.1.0");
});

test("latestFromPackageList sorts numerically (0.10.0 beats 0.9.0)", () => {
  const pl = {
    list: [
      { version: "0.9.0", status: "release" },
      { version: "0.10.0", status: "release" },
    ],
  };
  assert.equal(latestFromPackageList(pl), "0.10.0");
});

test("latestFromPackageList returns null when no release entry exists", () => {
  assert.equal(latestFromPackageList({ list: [] }), null);
  assert.equal(latestFromPackageList({}), null);
  assert.equal(latestFromPackageList(null), null);
});

// --- statusFor --------------------------------------------------------------

test("statusFor classifies the four row states", () => {
  assert.equal(statusFor("2.2.11", "2.2.11"), "ok");
  assert.equal(statusFor("2.2.11", "v2.2.11"), "ok"); // v-prefix is cosmetic
  assert.equal(statusFor("2.2.10", "2.2.11"), "update available");
  assert.equal(statusFor(null, "2.2.11"), "pin not found");
  assert.equal(statusFor("2.2.11", null), "lookup failed");
});

// --- escapeCell / buildTable / hasUpdates -----------------------------------

test("escapeCell escapes pipes and newlines", () => {
  assert.equal(escapeCell("a|b"), "a\\|b");
  assert.equal(escapeCell("a\nb"), "a b");
  assert.equal(escapeCell(null), "?");
});

test("buildTable renders one Markdown row per artifact", () => {
  const table = buildTable([
    {
      artifact: "IG Publisher",
      pinned: "2.2.10",
      latest: "2.2.11",
      status: "update available",
      link: "https://github.com/HL7/fhir-ig-publisher/releases",
    },
  ]);
  const lines = table.split("\n");
  assert.equal(lines.length, 3); // header + separator + 1 row
  assert.match(lines[0], /^\| Artifact \| Pinned \| Latest \| Status \|/);
  assert.match(
    lines[2],
    /^\| IG Publisher \| 2\.2\.10 \| 2\.2\.11 \| update available \| https:/,
  );
});

test("hasUpdates is true only when a row proposes an update", () => {
  assert.equal(hasUpdates([{ status: "ok" }, { status: "pin not found" }]), false);
  assert.equal(hasUpdates([{ status: "ok" }, { status: "update available" }]), true);
});
