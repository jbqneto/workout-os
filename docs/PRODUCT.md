# Product Specification — Workout OS v1

## Problem

Repeatedly reconstructing the same context with a personal-trainer agent is inefficient: location, available machines, available time, current plan and previous loads are durable state and belong in an app.

## Product proposition

Workout OS is a local-first strength-training system that stores durable training context and makes workout execution fast. A separate human/AI trainer reasons over exported structured data and returns structured plans.

## Core loop

```text
PLAN -> EXECUTE -> TRACK -> REVIEW -> IMPORT NEXT PLAN
```

### Planning loop

```text
App exports trainer-request.json
        -> external trainer discusses/decides
        -> trainer-response.json
        -> app validates and imports
```

### Execution loop

```text
Select environment + prescribed duration variant
-> start workout
-> record each set
-> automatic rest timer
-> finish
-> immutable historical session
```

## Personas

v1 has one persona: the owner/operator of the app. There are no user accounts or multi-user workflows.

## Key domain concepts

- Exercise
- Equipment
- Environment
- Training Plan
- Workout
- Exercise Prescription
- Workout Variant
- Training Session
- Exercise Session
- Set Log
- Trainer Request/Response

## Functional requirements

### Catalog

- CRUD exercises.
- Link external instructional video(s).
- Store movement pattern, muscles and required equipment.
- Define catalog substitutions.

### Environments

- CRUD environments.
- Assign available equipment.

### Plans

- Maintain active and archived plans.
- Workouts contain reusable prescriptions.
- Variants explicitly select prescriptions for an environment + target duration.

### Execution

- Display previous set performance.
- Record resistance, reps and RIR.
- One-tap set completion.
- Rest timer automatically starts after completion when prescribed.
- Substitute an exercise and preserve both prescribed and actual exercise IDs.
- Notes at exercise/session level.

### History

- View sessions chronologically.
- View exercise history objectively.
- Preserve set-level details.

### Trainer exchange

- Export purpose-specific request documents.
- Import response documents.
- Validate schema and references.
- Preview changes.
- Commit atomically.

## Non-functional requirements

- Offline-first/local-only.
- Android-first.
- Fast numeric entry.
- Robust against app backgrounding during workout.
- JSON protocol backward-conscious.
- No silent data repair on import.

## Non-goals

See `TASKS.md` out-of-scope section. Most importantly, v1 is not an autonomous coach.
