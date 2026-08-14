// The toolchain pins (IG Publisher + its SHA-256, SUSHI, Jekyll) are declared
// once per build workflow, because a workflow cannot read another workflow's
// `env:` block. Nothing shares them — so this test makes the drift detectable
// instead: it fails the moment the blocks stop agreeing.
//
// It matters more than it looks here. scripts/check-updates.mjs reads the pins
// by scanning EVERY workflow file and taking the FIRST match, so two workflows
// pinning different IG Publisher versions would make the weekly dependency
// report describe a build that does not exist — and, worse, a release demo
// could be rendered with a different publisher than the branch previews it is
// compared against.
//
// docs/maintenance.md is the prose side of the same rule. The module template
// carries the identical test (scripts/toolchain-pins.test.mjs there).
//
// Run with:  node --test scripts/toolchain-pins.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { parseWorkflowEnvPin } from "./check-updates.mjs";

const repository = fileURLToPath(new URL("../", import.meta.url));

const WORKFLOWS = [".github/workflows/ig-preview.yml", ".github/workflows/release-demo.yml"];

const KEYS = ["PUBLISHER_VERSION", "PUBLISHER_SHA256", "SUSHI_VERSION", "JEKYLL_VERSION"];

function readIfPresent(relativePath) {
  const file = `${repository}${relativePath}`;
  return existsSync(file) ? readFileSync(file, "utf8") : null;
}

function presentWorkflows() {
  return WORKFLOWS.map((file) => ({ file, text: readIfPresent(file) })).filter((w) => w.text !== null);
}

for (const key of KEYS) {
  test(`${key} is identical in every build workflow`, () => {
    const present = presentWorkflows();
    assert.equal(present.length, WORKFLOWS.length, `missing build workflow: expected ${WORKFLOWS.join(", ")}`);

    const values = present.map(({ file, text }) => {
      const value = parseWorkflowEnvPin(text, key);
      assert.ok(value, `${file} has no ${key} env pin`);
      return { file, value };
    });

    const [first, ...rest] = values;
    for (const other of rest) {
      assert.equal(
        other.value,
        first.value,
        `${other.file} pins ${key}=${other.value}, ${first.file} pins ${first.value}`,
      );
    }
  });
}

// The Java, Node and Ruby runtimes are pinned by the setup-* actions rather
// than in env:, so compare them literally. A release demo rendered on a
// different JDK than the previews would be a silent difference in exactly the
// artifact this repository advertises as "the release".
for (const [label, pattern] of [
  ["java-version", /java-version:\s*"([^"]+)"/],
  ["node-version", /node-version:\s*"([^"]+)"/],
  ["ruby-version", /ruby-version:\s*"([^"]+)"/],
]) {
  test(`${label} is identical in every build workflow`, () => {
    const values = presentWorkflows().map(({ file, text }) => {
      const m = text.match(pattern);
      assert.ok(m, `${file} has no ${label}`);
      return { file, value: m[1] };
    });
    const [first, ...rest] = values;
    for (const other of rest) {
      assert.equal(other.value, first.value, `${other.file} uses ${label} ${other.value}, ${first.file} uses ${first.value}`);
    }
  });
}

// The release demo must write ONLY under demo/<tag>/ on gh-pages, and must not
// drop the .branch-name marker that makes a directory sweepable by
// cleanup-gh-pages.yml. Both are load-bearing for the "released demos are
// permanent" promise in the workflow header and in docs/workflows.md.
test("release-demo.yml publishes under demo/<tag>/ and stays out of branches/", () => {
  const text = readIfPresent(".github/workflows/release-demo.yml");
  assert.ok(text, "release-demo.yml is missing");
  assert.match(text, /demo_dir="gh-pages\/demo\/\$\{TAG\}"/, "the demo is not written to gh-pages/demo/<tag>/");
  assert.doesNotMatch(
    text,
    /^\s*(printf|echo)[^\n]*>\s*"?\$\{?demo_dir\}?\/\.branch-name/m,
    "release-demo.yml writes a .branch-name marker — a released demo must never be sweepable",
  );
  assert.doesNotMatch(text, /gh-pages\/branches\//, "release-demo.yml must not touch the preview surface");
});

test("release-demo.yml runs in its own lane WITH a gh-pages push retry", () => {
  // Changed 2026-08-14: in a SHARED group GitHub replaces a still-queued run
  // whenever a newer one arrives (cancel-in-progress: false only protects
  // running jobs) — the post-release dev resync evicted the queued demo on
  // three releases. The demo now serializes only against itself; branch-write
  // races against the other lanes are handled by a bounded rebase-retry push.
  const text = readIfPresent(".github/workflows/release-demo.yml");
  assert.match(
    text,
    /concurrency:\s*\n(?:\s*#[^\n]*\n)*\s*group:\s*release-demo/,
    "release-demo.yml must use its own concurrency lane (group: release-demo)",
  );
  assert.match(
    text,
    /git pull --rebase origin gh-pages/,
    "the gh-pages push must retry with a rebase pull — its lane no longer serializes with the other writers",
  );
});
