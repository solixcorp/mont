#!/usr/bin/env bash
# Runs spec-graph validate after .spec-graph entity TOML edits.
set -euo pipefail

INPUT="$(cat)"
FILE_PATH="$(echo "$INPUT" | jq -r '.file_path // .path // empty' 2>/dev/null || true)"

if [[ "$FILE_PATH" != *".spec-graph/entities/"* ]] || [[ "$FILE_PATH" != *.toml ]]; then
  exit 0
fi

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

if ! command -v spec-graph >/dev/null 2>&1; then
  exit 0
fi

RESULT="$(spec-graph validate 2>&1 || true)"
STATUS="$(echo "$RESULT" | jq -r '.valid // .status // "unknown"' 2>/dev/null || echo "unknown")"

if [ "$STATUS" = "true" ] || [ "$STATUS" = "ok" ]; then
  jq -n --arg msg "spec-graph validate passed after editing ${FILE_PATH}." \
    '{ "additional_context": $msg }'
  exit 0
fi

ISSUES="$(echo "$RESULT" | jq -r '[.issues[]? | "\(.check // .layer // "issue"): \(.message // .detail // .)" ] | join("; ")' 2>/dev/null || echo "$RESULT")"

jq -n --arg msg "spec-graph validate found issues after editing ${FILE_PATH}: ${ISSUES}. Fix before committing .spec-graph/ changes." \
  '{ "additional_context": $msg }'
