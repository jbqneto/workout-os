# Google Stitch reference screens

These screenshots are the visual source of truth for TASK-001. They are design references, not domain-data sources.

Expected refined screenshots:

- `home.png`
- `workout-preview.png`
- `active-workout.png`
- `exercise-details.png`
- `exercise-substitution.png`
- `workout-complete.png`

The GitHub connector used for the architectural bootstrap cannot upload local binary PNGs directly. Copy these six files from the latest Stitch export when working locally. Until then, `DESIGN.md`, `TASKS.md`, and the implemented React Native screens are the available references.

The React Native implementation should preserve the overall Stitch visual language while applying the product corrections documented in `TASKS.md` and `../DESIGN.md`.

Do not copy mock content into the domain model merely because it appears in a screenshot. Exercise relationships, muscle data, equipment and prescriptions must come from application data/contracts.
