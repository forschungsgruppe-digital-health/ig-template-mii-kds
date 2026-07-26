#!/usr/bin/env bash
# check-language-model.sh — fail if the abandoned "German is the default IG
# language" model reappears anywhere in the repository.
#
# WHY THIS EXISTS
#   This IG is English-default with a German translation
#   (`i18n-default-lang: en`, `i18n-lang: [de]`,
#   `translation-sources: [input/translations/de]`) — the same model as
#   kerndatensatz-basis. The repo used to describe the opposite model, and the
#   prose survived the commit that flipped the config: comments, skills and
#   recipes kept calling German the default language and kept pointing at an
#   `input/translations/en/` folder that has never existed. This check makes
#   that class of drift a build failure instead of an audit finding.
#
# WHAT IT CHECKS
#   Every tracked text file is grepped for a short list of assertions that are
#   only true under the old model (see PATTERNS). The patterns match the WRONG
#   claim, not the language pair — "English default, German translation" and
#   "the German /de/ pages" are correct statements and must not match.
#   The check is line-based: a claim broken across a line break (as one comment
#   in includes/fragment-footer.html once was) slips through, so a reviewer is
#   still the second line of defence.
#
# WHEN IT FIRES
#   Fix the wording. If a hit is genuinely legitimate, add it to the explicit
#   exception list below with a one-line reason — never loosen a pattern.
#
# USAGE
#   bash tools/check-language-model.sh          # from anywhere in the checkout
#   Runs in CI on every pull request into `dev`, where changes land
#   (.github/workflows/security-scan.yml).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

# Assertions that only hold under the abandoned German-default model. POSIX ERE
# only — `\b` is a GNU extension and does not match on BSD/macOS.
PATTERNS=(
  'german[ -](default|leading|led|source|original)'
  'german( is| stays| remains| as)( the)? (default|leading|authoritative|binding|source|original)'
  'german is the [^.]{0,12}(default|leading) language'
  'de-default'
  'german \((the )?default'
  '\(german, the default'
  'language \(german\)'
  '(default|leading) (ig |content )?language (is|=) german'
  'falls back to german'
  'leave it german'
  'german by default'
  'deutsch \(standardsprache\)'
  'german (—|-) the (source|original)'
  'translations/en[^a-z]'
  'translations/en$'
)

# Explicit exceptions: paths that may contain the patterns above.
#   - this script, because it defines them.
# Add a path here only with a reason; do not loosen a pattern instead.
EXCLUDES=(
  ':(exclude)tools/check-language-model.sh'
)

args=()
for pattern in "${PATTERNS[@]}"; do
  args+=(-e "$pattern")
done

# git grep exits 0 on a hit, 1 on no hit, and >1 on an error. The error case
# must not be mistaken for a clean tree, so the status is handled explicitly.
set +e
hits="$(git grep -n -I -i -E "${args[@]}" -- . "${EXCLUDES[@]}")"
status=$?
set -e

case "$status" in
  1)
    echo "Language model: no German-default residue found."
    ;;
  0)
    printf '%s\n' "$hits" >&2
    cat >&2 <<'EOF'

ERROR: the IG is English-default with a German translation, but the lines above
claim German is the default/leading/source language, or point at an
input/translations/en/ folder that does not exist.

  input/pagecontent/**        English source pages
  input/translations/de/**    German translation (renders under /de/)
  input/includes/menu.xml     English source menu

An untranslated page falls back to English. See docs/recipes/add-translation.md.
EOF
    exit 1
    ;;
  *)
    echo "ERROR: git grep failed (exit $status)." >&2
    exit "$status"
    ;;
esac
