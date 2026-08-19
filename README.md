# Workout OS

Local-first Android strength-training tracker built with React Native + Expo.

The app executes prescribed workout plans, records objective training history, manages exercises/equipment/environments, and exchanges versioned JSON documents with an external personal-trainer agent. **It does not decide progression.**

## Product boundary

The application owns:

- exercise/equipment/environment catalog;
- workout plans and explicit environment/time variants;
- workout execution;
- sets, resistance, reps, RIR, rest and notes;
- exercise substitutions and what was actually executed;
- local workout history;
- deterministic JSON validation/import/export;
- backup/restore;
- rest timer and local notification behavior.

The external trainer/agent owns:

- progression decisions;
- load recommendations;
- exercise selection rationale;
- periodization;
- deload decisions;
- volume/intensity adjustments;
- monthly review reasoning.

Do not add an automatic progression engine to this repository.

## Current status

This repository is the architectural bootstrap. The visual direction comes from the six refined Google Stitch screens used during product design.

The GitHub connector bootstrap contains the application code and design rules, but not the binary Stitch PNG assets. Before pixel-fidelity work on TASK-001, copy the reference assets from the original `workout-os-react-native-bootstrap.zip` into `docs/design/reference/` or provide them directly to the coding agent. See `docs/design/reference/README.md`.

The first Codex task is **TASK-001 — Core UI fidelity/refinement**, documented in `TASKS.md`.

## Stack

- Expo SDK 57
- React Native 0.86.2
- React 19.2
- TypeScript (strict)
- Expo Router
- SQLite (`expo-sqlite`), local only
- Zod 4 for runtime contracts and JSON Schema generation
- Expo FileSystem + DocumentPicker + Sharing for JSON workflows
- Expo Notifications for rest-timer alerts

No backend, account, cloud sync, Firebase, Supabase, remote database or AI API is part of v1.

## Getting started

Requirements:

- Node.js LTS
- Android Studio/emulator or Android device
- Expo development tooling

```bash
npm install
npx expo install --fix
npm run doctor
npm run typecheck
npm run start
```

For Android:

```bash
npm run android
```

For notification behavior, prefer a development build when moving beyond basic local notification testing.

## Repository map

```text
app/                         Expo Router routes only; keep them thin
src/
  core/                      shared UI, theme, DB and generic utilities
  domain/                    domain types independent of UI/infrastructure
  features/                  feature screens and use cases
  integrations/trainer/      JSON protocol, import/export and validation
  data/demo/                 temporary fixtures for UI implementation
schemas/                     generated/public JSON Schema contracts
examples/json/               canonical request/response examples
docs/
  design/reference/          Stitch reference instructions/assets when copied locally
  adr/                       architecture decision records
AGENTS.md                     non-negotiable instructions for coding agents
TASKS.md                      ordered implementation backlog
```

## Architecture rules

1. `app/` contains routing composition, not business logic.
2. Domain code must not import React Native, Expo or SQLite.
3. SQLite is the source of truth for local application state once persistence work begins.
4. Imported data is untrusted until Zod validation **and** semantic reference validation pass.
5. Trainer imports are transactional: validate everything, preview, then commit all-or-nothing.
6. JSON contracts are versioned and must remain backward-conscious.
7. Never identify exercises by display name. Use canonical semantic IDs such as `ex_hammer_curl`.
8. Workout variants are explicit prescriptions (`environment + duration`); the app must not invent a 45-minute workout by dropping exercises itself.
9. UI may display objective history but must not turn it into prescriptive advice.
10. Rest timer state is based on an absolute deadline timestamp, not on decrementing JS state as the source of truth.

Read `AGENTS.md` before making changes.

## JSON workflow

Current manual flow:

```text
Workout OS -> trainer-request.json -> ChatGPT/personal trainer
ChatGPT/personal trainer -> trainer-response.json -> Workout OS
```

Primary document types:

- `trainer-request`
- `trainer-response`
- `full-backup`

See `docs/JSON_PROTOCOL.md` and `schemas/`.

## Design

The UI direction is dark-first, technical, restrained and high-density. The active workout screen is the highest-priority interaction.

See:

- `docs/design/DESIGN.md`
- `docs/design/reference/README.md`

Do not treat text/content invented by Stitch as domain truth. Stitch is the visual source of truth only; the explicit corrections in `TASKS.md` and `AGENTS.md` take precedence over mock data or accidental UI details.

## Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run schema:export
npm run doctor
```

## Definition of done for a task

At minimum:

- acceptance criteria in `TASKS.md` satisfied;
- no architecture invariant violated;
- `npm run typecheck` passes;
- relevant tests added/updated;
- schema changes include versioning/migration consideration;
- screenshots compared when UI is involved;
- documentation changed when behavior or contracts change.
