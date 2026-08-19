# ADR-0003: Zod schemas as operational trainer-contract source

Status: Accepted

## Decision

Define trainer exchange contracts in Zod 4 and export JSON Schema artifacts from them.

## Rationale

The mobile importer requires runtime validation, TypeScript requires static types, and the external trainer benefits from standard JSON Schema. One operational definition reduces drift.

## Consequences

- Zod schemas live under `src/integrations/trainer/schemas`;
- `npm run schema:export` refreshes public schemas;
- semantic reference validation remains a separate step because JSON Schema cannot validate DB/catalog referential existence.
