# ADR-0002: Training reasoning remains outside the app

Status: Accepted

## Decision

Workout OS stores facts and prescriptions but does not determine progression.

## Rationale

Progression is contextual and is intentionally discussed with an external personal-trainer agent. Duplicating heuristic coaching inside the app would create conflicting sources of prescription truth.

## Consequences

- no progression engine;
- JSON exchange is a first-class feature;
- app UI must not imply automatic recommendation logic;
- future MCP/API integration is a transport evolution, not a domain rewrite.
