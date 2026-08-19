# AGENTS.md — Instructions for Codex and coding agents

Read this file before editing the project.

## Mission

Build a local-first workout execution and history app. The app is intentionally deterministic. An external trainer/AI agent performs training reasoning through versioned JSON exchange.

## Non-negotiable product invariants

### 1. No progression engine

Do not add logic that decides:

- next load;
- whether the user should increase/decrease weight;
- deload timing;
- optimal volume;
- recovery/readiness;
- exercise ranking or similarity percentage;
- automatic periodization.

Objective calculations are allowed (duration, counts, historical values). Prescriptive conclusions are external.

### 2. Explicit workout variants

A workout may have variants such as:

- Gym / 45 min
- Gym / 60 min
- Home / 45 min
- Home / 60 min

The agent prescribes these variants. The app selects an existing variant. It does not autonomously remove exercises to fit time.

### 3. Stable semantic IDs

References use stable IDs (`ex_hammer_curl`, `env_home`, `eq_dumbbells`). Never join/import by translated/display names.

### 4. Import is strict and transactional

Trainer JSON is untrusted input.

Pipeline:

1. parse JSON;
2. structural Zod validation;
3. schema-version support check;
4. semantic reference validation;
5. produce import preview;
6. explicit user commit;
7. one SQLite transaction;
8. rollback everything on failure.

Never silently create unknown equipment or silently map exercises by fuzzy name.

### 5. Local first

No backend, auth, cloud database, analytics SDK, account system or network dependency unless a later product decision explicitly changes scope.

Instructional videos may be external URLs.

## Architecture

Use dependency direction:

```text
UI / Routes
   -> Application use cases
      -> Domain
         <- Infrastructure implementations
```

Practical rules:

- `app/`: routing only.
- `src/domain`: no imports from Expo, React Native or SQLite.
- `src/core/db`: SQLite implementation and migrations.
- `src/integrations/trainer`: external JSON boundary.
- `src/features`: feature UI/application orchestration.

Avoid adding a framework or repository abstraction unless it reduces real complexity. This is a personal-use app, not an enterprise backend.

## UI source of truth

Use screenshots in `docs/design/reference/` and tokens in `docs/design/DESIGN.md`.

First implementation work must satisfy TASK-001 before extending the UI broadly.

Important corrections already decided:

- Active Workout: continuous vertical exercise list; no large empty area.
- Remove duplicated previous-performance sentence; set rows already contain PREV.
- Rest timer identifies the exercise that started it.
- Exercise Details: no duplicated exercise title; media is compact; no embedded fake UI inside media.
- Exercise Details: no global `Log Set` action.
- Home: settings icon, not profile/bodybuilder imagery.
- Workout Complete: `exercises`, `working sets`, set-level load×reps; footer must not cover notes.
- No meaningless progress bars, scores or percentages.

## UI implementation rules

- One-handed gym usage is primary.
- Minimum touch target ~48dp for critical controls.
- Numeric data should be scan-friendly and tabular.
- Prefer direct numeric input; steppers are optional helpers, not mandatory.
- Do not add decorative metrics.
- Bottom navigation is hidden while an active workout is running.
- Respect Android safe areas and keyboard behavior.

## Data rules

- Timestamps use ISO 8601.
- Store resistance as a typed structure, not only `loadKg`.
- Preserve set-level resistance/reps relationship.
- Record prescribed exercise and actual substituted exercise separately.
- Archive old plans; do not overwrite historical plans.
- Historical sessions should remain interpretable after catalog/plan changes.

## JSON contracts

Zod schemas under `src/integrations/trainer/schemas` are the operational source of truth.

Run:

```bash
npm run schema:export
```

to refresh public JSON Schema files under `schemas/`.

If a breaking contract change is necessary, do not mutate `1.0.0` semantics silently. Introduce an explicit version and migration strategy.

## Database migrations

Never edit an already-released migration after it has been used. Add the next numbered migration.

All migrations must be idempotently tracked via `schema_migrations`.

## Testing priorities

Highest-value tests:

1. trainer request/response validation;
2. semantic import validation;
3. database migrations;
4. transaction rollback on failed import;
5. rest timer deadline calculations;
6. workout session persistence.

Do not spend early effort on snapshot-testing every presentational component.

## Scope discipline

Before adding a package, ask whether React Native/Expo/standard TypeScript already solves the problem.

Do not introduce:

- Redux by default;
- an ORM by default;
- server-state libraries without a server;
- a dependency-injection container;
- a backend “for future use”.

Start simple and extract only after concrete duplication appears.
