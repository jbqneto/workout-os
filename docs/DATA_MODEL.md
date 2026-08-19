# Data Model

The initial physical schema is in `src/core/db/migrations/001_initial.ts`.

## Catalog

### equipment
Canonical equipment definitions.

### environments
Training locations such as Gym or Home.

### environment_equipment
Many-to-many availability of equipment in environments.

### exercises
Canonical exercise record.

### exercise_aliases
Display/search aliases only. Never use aliases as foreign keys.

### exercise_muscles
Primary/secondary muscle associations.

### exercise_equipment
Required/optional equipment associations.

### exercise_media
Instructional video/image links.

### exercise_substitutions
Catalog-level relationships, not trainer ranking scores.

## Plans

### training_plans
Cycle/version such as `plan_2026_09`.

### workouts
Logical workout within a plan, e.g. Pull.

### exercise_prescriptions
How an exercise is prescribed inside a workout.

### prescription_substitutions
Trainer-prescribed substitutions for that specific prescription.

### workout_variants
Explicit environment + duration variant.

### variant_prescriptions
Ordered prescription set selected by a variant.

## Execution

### training_sessions
A concrete workout execution.

### exercise_sessions
Concrete exercise execution. Keeps actual exercise and original prescribed exercise when substituted.

### set_logs
Set-level resistance/reps/RIR/rest data.

## Trainer review

### trainer_reviews
Optional imported human-readable review associated with plan/request.

## Settings

### settings
Small local key/value JSON settings.
