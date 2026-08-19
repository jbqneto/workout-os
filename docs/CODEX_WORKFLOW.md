# Codex Workflow

1. Read `AGENTS.md`.
2. Pick the first incomplete task in `TASKS.md` unless explicitly instructed otherwise.
3. Inspect related Stitch references before UI work.
4. State which invariants are relevant.
5. Implement the smallest coherent slice.
6. Run typecheck/tests/lint relevant to the change.
7. Update `TASKS.md` with implementation notes or checked acceptance items.
8. Update ADR/docs only when a decision/contract changes.

## UI tasks

For each screen, compare implementation against the PNG reference and apply the explicit corrections from TASK-001 rather than blindly reproducing HTML.

## Contract tasks

Do not edit generated `schemas/*.json` by hand after the generator is working. Change Zod and regenerate.

## Database tasks

Add migrations; do not rewrite migrations already used on a device.
