// Guards the terminology step's stated safety property: the preview build
// never hard-fails for lack of an SU-TermServ credential — including a
// PARTIAL credential. Deleting the three secrets one at a time is a
// documented operation (docs/secrets.md, "Rotating or revoking"), so a guard
// that tests only SU_TERMSERV_CLIENT_CERT would decrypt an empty key and
// abort the build under `set -euo pipefail`.
//
// The same block lives in the module template's three build workflows; there
// it is asserted by scripts/publication-url-consistency.template-test.mjs.
// The copies are hand-maintained, so each repository asserts its own.
//
// Run with:  node --test scripts/terminology-fallback.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const WORKFLOW = fileURLToPath(
  new URL("../.github/workflows/ig-preview.yml", import.meta.url),
);

// The `id: tx` step, from its `- name:` line to the next step at the same
// indentation. Everything asserted below must live inside that step.
function terminologyStep() {
  const steps = readFileSync(WORKFLOW, "utf8").split(/^      - name: /m);
  const step = steps.find((s) => /^\s*id: tx$/m.test(s));
  assert.ok(step, "ig-preview.yml has no terminology step with `id: tx`");
  return step;
}

const SECRETS = [
  "SU_TERMSERV_CLIENT_CERT",
  "SU_TERMSERV_CLIENT_KEY",
  "SU_TERMSERV_CLIENT_PASSWORD",
];

test("the terminology step reads all three SU-TermServ secrets", () => {
  const step = terminologyStep();
  for (const name of SECRETS) {
    assert.match(
      step,
      new RegExp(`^\\s+${name}: \\$\\{\\{ secrets\\.${name} \\}\\}$`, "m"),
      `${name} is not wired into the step's env:`,
    );
  }
});

test("the proxy branch is guarded on all three secrets, not just the cert", () => {
  const guard = terminologyStep().match(/^\s*if \[.*\]; then$/m);
  assert.ok(guard, "the terminology step has no `if [ … ]; then` guard");
  for (const name of SECRETS) {
    assert.ok(
      guard[0].includes(`\${${name}:-}`),
      `the guard does not test ${name}, so a partial secret set would run ` +
        `the proxy path and fail the build instead of falling back`,
    );
  }
});

test("the else branch falls back to tx.fhir.org with a notice", () => {
  const step = terminologyStep();
  const fallback = step.slice(step.search(/^\s*else$/m));
  assert.match(fallback, /tx=https:\/\/tx\.fhir\.org/);
  assert.match(fallback, /::notice::.*tx\.fhir\.org/);
});
