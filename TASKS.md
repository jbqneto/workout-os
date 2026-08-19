# Implementation Backlog

Tasks are ordered. Do not skip architectural prerequisites merely because a later screen is visually interesting.

## P0 — Foundation and core workout UX

### TASK-001 — Port and refine the six Stitch core screens

**Goal:** implement the current Stitch visual language in React Native, applying the final UX corrections already agreed.

Screens:

1. Home / Today's Workout
2. Workout Preview
3. Active Workout
4. Exercise Details
5. Exercise Substitution
6. Workout Complete

**Source:** `docs/design/reference/`.

**Required refinements:**

- Home: replace profile/bodybuilder imagery with Settings access.
- Active Workout:
  - exercise cards form one continuous vertical list;
  - remove duplicated `Previous: 40 kg × ...` sentence;
  - keep `PREV` as compact `40×12` in each row;
  - show meaningful `2 of 5 exercises` progress only if it maps to actual state;
  - sticky timer includes originating exercise (`REST · Lat Pulldown`);
  - no empty vertical dead space between card and timer;
  - bottom tabs absent during active workout.
- Exercise Details:
  - exercise name appears once;
  - compact 16:9-ish media area;
  - no fake `Exercise Details` text inside media;
  - no global `+ LOG SET`;
  - metadata `Dumbbells · Elbow Flexion` near title/media;
  - reference muscle fixture: Hammer Curl primary `Brachialis`, `Brachioradialis`; secondary `Biceps brachii`.
- Workout Complete:
  - use `5 exercises` and `15 working sets`;
  - set-level `load × reps`, never one load detached from all reps;
  - `SHOW 3 MORE` for collapsed results;
  - notes remain visible/editable above sticky footer and keyboard.
- No unexplained score, match %, progress bar or performance grade.

**Acceptance criteria:**

- visual comparison performed against each refined Stitch screenshot;
- works on a common Android phone viewport without overlap;
- critical controls >= 48dp touch target;
- active set row editable using numeric keyboard;
- no training recommendation language introduced;
- components use shared design tokens, not per-screen hard-coded palette forks.

---

### TASK-002 — Establish SQLite database and migrations

Implement `src/core/db` migration runner and initial schema.

Acceptance:

- database opens at app startup;
- foreign keys enabled;
- WAL enabled;
- migration tracked in `schema_migrations`;
- migration test verifies creation of core tables.

### TASK-003 — Seed deterministic demo data

Persist enough demo data to drive the six screens without hard-coding workout values directly inside components.

Include:

- Gym and Home environments;
- core equipment;
- sample exercises;
- active plan with Pull variant Gym/45 and Gym/60;
- previous session history.

Acceptance: deleting/reseeding produces the same IDs and screen state.

### TASK-004 — Implement workout session lifecycle

Use cases:

- start session from prescribed variant;
- edit resistance/reps/RIR;
- complete/uncomplete set;
- add set;
- substitute prescribed exercise;
- add exercise/session notes;
- finish session.

Persist incrementally to survive app interruption.

### TASK-005 — Rest timer

Implement deadline-based timer.

Requirements:

- starts on set completion using prescription rest seconds;
- stores absolute `endsAt` timestamp;
- foreground countdown derives from `endsAt - now`;
- +30s and Skip;
- local notification scheduled for deadline;
- notification channel intended for rest alerts;
- timer survives screen navigation/backgrounding as far as platform behavior permits.

Do not use a decrementing JS interval as the authoritative time source.

---

## P1 — Catalog, environments and history

### TASK-006 — Exercise Library

Search/filter by muscle, equipment and movement pattern. CRUD for personal catalog.

### TASK-007 — Environment & equipment management

Manage environments and available equipment. No workout recommendation logic.

### TASK-008 — Workouts / active cycle

Show active plan, workouts and explicit variants by environment/duration.

### TASK-009 — History

Chronological session history with exact set data, substitutions, notes and duration.

### TASK-010 — Exercise progress

Objective historical charts/list only. No “next target” recommendation.

---

## P1 — Trainer JSON protocol

### TASK-011 — Finalize JSON Schema v1.0.0

Review generated schemas with the product owner before freezing v1.0.0.

Focus:

- trainer-request;
- trainer-response;
- full-backup;
- resistance union;
- training plan/variants;
- history sessions;
- catalog patch.

### TASK-012 — Trainer request exporter

Exports:

- Plan & Context
- Monthly Review
- Custom History period

Do not export irrelevant full DB state for normal trainer requests.

### TASK-013 — Trainer response importer

Implement strict parse + structural + semantic validation + preview.

No database writes before explicit confirmation.

### TASK-014 — Transactional import commit

Catalog patch and plan import in one SQLite transaction.

Unknown references are errors unless explicitly supplied in a valid catalog patch.

### TASK-015 — Trainer Sync UI

Export buttons, import picker, validation preview and error display.

---

## P2 — Backup and quality

### TASK-016 — Full backup/restore

Versioned complete backup separate from trainer protocol.

### TASK-017 — Database integrity/diagnostics screen

Personal-use utilities: DB version, counts, export backup, reset demo data.

### TASK-018 — Accessibility pass

TalkBack labels, focus order, contrast, font scaling and touch targets.

### TASK-019 — Test hardening

Contract, DB, timer and import rollback coverage.

---

## Explicitly out of scope for v1

- backend;
- login/account;
- cloud sync;
- social feed;
- subscriptions;
- embedded ChatGPT/API integration;
- MCP integration;
- AI recommendations inside app;
- progression engine;
- readiness/recovery score;
- automatic workout generation.
