#!/usr/bin/env bash
# Injects spec-graph project context at session start (Cursor IDE + CLI).
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

if [ ! -d ".spec-graph" ]; then
  exit 0
fi

if ! command -v spec-graph >/dev/null 2>&1; then
  exit 0
fi

CONTEXT="This project uses spec-graph (.spec-graph/). Skills live in .agents/skills/: spec-graph, spec-planner, spec-executor, spec-verifier. TOML entities are the source of truth — never edit graph.db. Before spec changes run: spec-graph impact <ID>. After edits run: spec-graph validate."

ACTIVE_PHASE=""
if command -v jq >/dev/null 2>&1; then
  ACTIVE_PHASE="$(spec-graph entity list --type phase --status active 2>/dev/null | jq -r '.entities[0].id // empty' || true)"
fi

if [ -n "$ACTIVE_PHASE" ]; then
  CONTEXT="$CONTEXT Active phase: ${ACTIVE_PHASE}. Scope: spec-graph query scope ${ACTIVE_PHASE}."
fi

ENTITY_COUNT="$(find .spec-graph/entities -name '*.toml' 2>/dev/null | wc -l | tr -d ' ')"
if [ "$ENTITY_COUNT" -gt 0 ]; then
  CONTEXT="$CONTEXT Registered entities: ${ENTITY_COUNT}."
fi

jq -n --arg context "$CONTEXT" '{ "additional_context": $context }'
