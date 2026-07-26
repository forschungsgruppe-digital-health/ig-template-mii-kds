#!/usr/bin/env node
// check-updates.mjs — compares this repo's pinned versions against the latest
// available upstream and prints a Markdown drift report.
//
// Design rules (see docs/maintenance.md):
// - Pins are read from the REAL repo files (package/package.json, the CI
//   workflow env) so this checker never becomes a second source of truth.
// - Every row links the upstream changelog / release notes so a reviewer can
//   judge the risk of a bump.
// - The script NEVER updates anything itself and ALWAYS exits 0 — drift is
//   reported in the output, not via the exit code (the workflow decides what
//   to do with the report).
// - Zero npm dependencies; Node 22 built-ins only (fetch, node:fs).
// - Network errors are tolerated per row ("lookup failed"), never fatal.
//
// Usage:  node scripts/check-updates.mjs [--format=markdown]
// Tests:  node --test scripts/check-updates.test.mjs   (offline, pure functions)

import { readFileSync, readdirSync, existsSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// ---------------------------------------------------------------------------
// Pure functions (unit-tested in check-updates.test.mjs — keep them offline)
// ---------------------------------------------------------------------------

/** Strip a leading "v" so "v2.2.11" and "2.2.11" compare equal. */
export function normalizeVersion(v) {
  if (typeof v !== "string") return v;
  return v.replace(/^v/, "").trim();
}

/**
 * Compare two dotted numeric versions segment by segment (numeric, so
 * "0.10.0" > "0.9.0" — a plain string sort gets this wrong).
 * Returns -1, 0 or 1. Non-numeric segments fall back to string compare.
 */
export function compareVersions(a, b) {
  const as = normalizeVersion(a).split(".");
  const bs = normalizeVersion(b).split(".");
  const len = Math.max(as.length, bs.length);
  for (let i = 0; i < len; i++) {
    const x = as[i] ?? "0";
    const y = bs[i] ?? "0";
    const nx = Number(x);
    const ny = Number(y);
    if (Number.isFinite(nx) && Number.isFinite(ny)) {
      if (nx !== ny) return nx < ny ? -1 : 1;
    } else if (x !== y) {
      return x < y ? -1 : 1;
    }
  }
  return 0;
}

/**
 * Read one dependency pin out of a FHIR template/IG package.json text
 * (e.g. package/package.json -> dependencies["fhir2.base.template"]).
 * Returns the pinned version string, or null if the file content is not
 * parseable or the dependency is absent.
 */
export function parsePackageJsonPin(jsonText, depId) {
  try {
    const pkg = JSON.parse(jsonText);
    const v = pkg?.dependencies?.[depId];
    return typeof v === "string" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Extract tool version pins from a GitHub workflow YAML text by env-var name,
 * e.g. `PUBLISHER_VERSION: "2.2.11"` -> "2.2.11". Quoted or unquoted values;
 * commented-out lines are ignored. Returns null when the key is not present.
 */
export function parseWorkflowEnvPin(yamlText, key) {
  const re = new RegExp(`^\\s*${key}:\\s*["']?([^"'\\s#]+)["']?`, "m");
  for (const line of yamlText.split("\n")) {
    if (line.trimStart().startsWith("#")) continue;
    const m = line.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Parse the `dependencies:` block of a sushi-config.yaml into { id: version }.
 * Taken over from the FGDH sample IG's tools/check-updates.py: only pinned
 * (version starts with a digit), non-commented entries count; the block ends
 * at the first non-indented line. Repo A ships no sushi-config.yaml — this
 * exists so the checker also works unchanged in a module repo.
 */
export function parseSushiDependencies(yamlText) {
  const deps = {};
  let inBlock = false;
  for (const line of yamlText.split("\n")) {
    if (/^dependencies:/.test(line)) {
      inBlock = true;
      continue;
    }
    if (!inBlock) continue;
    if (/^\S/.test(line)) break; // end of the dependencies block
    if (line.trimStart().startsWith("#")) continue;
    const m = line.match(/^\s+([a-z0-9.\-]+):\s*([0-9][^\s#]*)/);
    if (m) deps[m[1]] = m[2];
  }
  return deps;
}

/**
 * Pick the newest *released* version from a FHIR package-list.json object
 * (HL7/ig-template-base2 publishes releases ONLY there — the repo has no
 * GitHub releases or tags). Entries with status "ci-build" (the floating
 * "current") are ignored. Returns null when no release entry exists.
 */
export function latestFromPackageList(packageList) {
  const releases = (packageList?.list ?? [])
    .filter((e) => e.status === "release" && typeof e.version === "string")
    .map((e) => e.version);
  if (releases.length === 0) return null;
  return releases.sort(compareVersions).pop();
}

/** Row status: ok | update available | pin not found | lookup failed. */
export function statusFor(pinned, latest) {
  if (pinned == null) return "pin not found";
  if (latest == null) return "lookup failed";
  return normalizeVersion(pinned) === normalizeVersion(latest)
    ? "ok"
    : "update available";
}

/** Escape a value for use inside a Markdown table cell. */
export function escapeCell(value) {
  return String(value ?? "?").replaceAll("|", "\\|").replaceAll("\n", " ");
}

/**
 * Render rows [{artifact, pinned, latest, status, link}] as a Markdown table.
 */
export function buildTable(rows) {
  const header =
    "| Artifact | Pinned | Latest | Status | Changelog / release notes |\n" +
    "|---|---|---|---|---|";
  const body = rows
    .map(
      (r) =>
        `| ${escapeCell(r.artifact)} | ${escapeCell(r.pinned ?? "—")} | ` +
        `${escapeCell(r.latest ?? "—")} | ${escapeCell(r.status)} | ${r.link} |`,
    )
    .join("\n");
  return `${header}\n${body}`;
}

/** True when at least one row proposes an update. */
export function hasUpdates(rows) {
  return rows.some((r) => r.status === "update available");
}

// ---------------------------------------------------------------------------
// Network lookups (main only — tests never reach these)
// ---------------------------------------------------------------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? "";

async function fetchJson(url, { github = false } = {}) {
  const headers = { "user-agent": "mii-ig-template-update-check" };
  if (github && GITHUB_TOKEN) {
    // Authenticated GitHub API calls avoid the anonymous rate limit
    // (lesson from the FGDH sample IG checker).
    headers.authorization = `Bearer ${GITHUB_TOKEN}`;
    headers.accept = "application/vnd.github+json";
  }
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

const LINKS = {
  igPublisher: "https://github.com/HL7/fhir-ig-publisher/releases",
  sushi: "https://github.com/FHIR/sushi/releases",
  jekyll: "https://github.com/jekyll/jekyll/releases",
  base2: "https://github.com/HL7/ig-template-base2/blob/main/package-list.json",
  fhirPkg: (id) => `https://simplifier.net/packages/${id}`,
};

const upstream = {
  igPublisher: async () =>
    normalizeVersion(
      (
        await fetchJson(
          "https://api.github.com/repos/HL7/fhir-ig-publisher/releases/latest",
          { github: true },
        )
      ).tag_name,
    ),
  sushi: async () =>
    (await fetchJson("https://registry.npmjs.org/fsh-sushi/latest")).version,
  jekyll: async () =>
    (await fetchJson("https://rubygems.org/api/v1/gems/jekyll.json")).version,
  base2: async () =>
    latestFromPackageList(
      await fetchJson(
        "https://raw.githubusercontent.com/HL7/ig-template-base2/main/package-list.json",
      ),
    ),
  fhirPkg: async (id) => {
    const meta = await fetchJson(`https://packages.fhir.org/${id}`);
    return (
      meta?.["dist-tags"]?.latest ??
      Object.keys(meta?.versions ?? {}).sort(compareVersions).pop() ??
      null
    );
  },
};

// ---------------------------------------------------------------------------
// Pin discovery — read the REAL pins from the repo (defensively: parallel
// tasks may not have landed the pin files yet; report "pin not found" rows
// instead of crashing).
// ---------------------------------------------------------------------------

function readFileIfExists(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : null;
}

/** fhir2.base.template pin lives in package/package.json (dependencies). */
function readBaseTemplatePin() {
  const text = readFileIfExists("package/package.json");
  if (text == null) return null; // file lands in a parallel task — report, don't crash
  return parsePackageJsonPin(text, "fhir2.base.template");
}

/**
 * Tool pins (IG Publisher, SUSHI, Jekyll) live as env vars in the CI build
 * workflow. Scan every workflow file for the conventional names; an explicit
 * process.env value (set by the calling workflow) wins.
 */
function readToolPin(envKey, workflowTexts) {
  if (process.env[envKey]) return process.env[envKey];
  for (const text of workflowTexts) {
    const v = parseWorkflowEnvPin(text, envKey);
    if (v != null) return v;
  }
  return null;
}

function readWorkflowTexts() {
  const dir = ".github/workflows";
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"))
    .map((f) => readFileSync(path.join(dir, f), "utf8"));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function lookup(get) {
  try {
    return (await get()) ?? null;
  } catch {
    return null;
  }
}

export async function collectRows() {
  const workflowTexts = readWorkflowTexts();
  const rows = [];

  // Tool pins from the CI workflow env (land with the build workflow task).
  const tools = [
    { artifact: "IG Publisher", envKey: "PUBLISHER_VERSION", get: upstream.igPublisher, link: LINKS.igPublisher },
    { artifact: "SUSHI (fsh-sushi)", envKey: "SUSHI_VERSION", get: upstream.sushi, link: LINKS.sushi },
    { artifact: "Jekyll", envKey: "JEKYLL_VERSION", get: upstream.jekyll, link: LINKS.jekyll },
  ];
  for (const tool of tools) {
    const pinned = readToolPin(tool.envKey, workflowTexts);
    const latest = pinned == null ? null : await lookup(tool.get);
    rows.push({
      artifact: tool.artifact,
      pinned: pinned ?? `pin not found (\`${tool.envKey}\` not set in any workflow env)`,
      latest,
      status: statusFor(pinned, latest),
      link: tool.link,
    });
  }

  // The base template pin — the highest-value pin to watch for this repo.
  const basePinned = readBaseTemplatePin();
  const baseLatest = await lookup(upstream.base2);
  rows.push({
    artifact: "fhir2.base.template",
    pinned:
      basePinned ??
      (existsSync("package/package.json")
        ? "pin not found (no `dependencies[\"fhir2.base.template\"]` entry)"
        : "pin file not found (`package/package.json` missing)"),
    latest: baseLatest,
    status: statusFor(basePinned, baseLatest),
    link: LINKS.base2,
  });

  // FHIR package dependencies from sushi-config.yaml, when present (module
  // repos; Repo A itself ships none — the block then contributes no rows).
  const sushiConfig = readFileIfExists("sushi-config.yaml");
  if (sushiConfig != null) {
    for (const [id, pinned] of Object.entries(parseSushiDependencies(sushiConfig))) {
      const latest = await lookup(() => upstream.fhirPkg(id));
      rows.push({
        artifact: `\`${id}\``,
        pinned,
        latest,
        status: statusFor(pinned, latest),
        link: LINKS.fhirPkg(id),
      });
    }
  }

  return rows;
}

export function renderReport(rows) {
  return [
    "### Dependency status",
    "",
    buildTable(rows),
    "",
    "> Bumps are **proposed only** — never auto-merged, never auto-floated.",
    "> Review the linked changelog, update the pin in its real location, and —",
    "> for an IG Publisher bump — recompute the jar's SHA-256 next to the new",
    "> version. Steps: `docs/recipes/review-a-dependency-update.md`.",
    "",
    "> `pin not found` rows are expected until the file/workflow that carries",
    "> the pin has landed; they are a reminder, not an error.",
    "",
  ].join("\n");
}

async function main() {
  // Only --format=markdown is supported; the flag exists so the workflow
  // invocation stays explicit and future formats stay possible.
  const rows = await collectRows();
  process.stdout.write(renderReport(rows));
  if (process.env.GITHUB_OUTPUT) {
    // Machine-readable signal for the workflow (sample-IG lesson).
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `has_updates=${hasUpdates(rows) ? "true" : "false"}\n`,
    );
  }
  process.exitCode = 0; // drift is data, not an error
}

const invokedDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  await main();
}
