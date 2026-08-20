# Local bootstrap validation

Run this checklist on a development machine after pulling the current `main` branch.

## 1. Install and align dependencies

```bash
git pull
npm install
npx expo install --fix
```

The first `npm install` should create `package-lock.json`. Keep it; the repository intentionally needs a lockfile before feature work accelerates.

## 2. Run the engineering baseline

```bash
npm run doctor
npm run typecheck
npm run lint
npm run test
npm run schema:export
```

All commands must complete successfully before starting TASK-001/TASK-003 work.

## 3. Inspect generated changes

```bash
git status
git diff -- schemas/
```

Expected local changes after the first validated install:

- `package-lock.json` is new;
- `schemas/*.schema.json` may change because the repository previously contained bootstrap placeholder artifacts.

Review the generated schemas and commit the lockfile plus schema artifacts together.

After that commit, CI can be tightened to always use `npm ci` and to fail on JSON Schema drift.

## 4. Add the refined Stitch PNG references

Copy the six refined screenshots from the latest Stitch export into `docs/design/reference/` using these names:

```text
home.png
workout-preview.png
active-workout.png
exercise-details.png
exercise-substitution.png
workout-complete.png
```

The GitHub connector cannot transfer the local binary PNGs directly, so this is intentionally a local step.

## 5. Run the Android app

Prefer an Android emulator/device and run:

```bash
npm run android
```

Verify at minimum:

- the app shows the bootstrap/loading state briefly instead of rendering routes before SQLite is ready;
- Home opens normally after migrations;
- no database initialization error appears;
- Active Workout scrolls and numeric fields open the expected keyboards;
- navigating among the existing bootstrap screens does not crash.

## 6. Commit the local bootstrap artifacts

If all checks pass:

```bash
git add package-lock.json schemas/ docs/design/reference/
git commit -m "chore: finalize local bootstrap artifacts"
git push
```

Do not start changing training-domain semantics during this validation pass. Product/schema decisions are still reviewed separately before freezing JSON protocol `1.0.0`.
