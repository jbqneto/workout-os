export const migration002 = {
  version: 2,
  name: 'integrity_hardening',
  sql: `
CREATE INDEX IF NOT EXISTS workouts_training_plan_id_idx ON workouts(training_plan_id);
CREATE INDEX IF NOT EXISTS exercise_prescriptions_workout_id_idx ON exercise_prescriptions(workout_id);
CREATE INDEX IF NOT EXISTS exercise_prescriptions_exercise_id_idx ON exercise_prescriptions(exercise_id);
CREATE INDEX IF NOT EXISTS workout_variants_workout_id_idx ON workout_variants(workout_id);
CREATE INDEX IF NOT EXISTS workout_variants_environment_id_idx ON workout_variants(environment_id);
CREATE INDEX IF NOT EXISTS variant_prescriptions_variant_id_idx ON variant_prescriptions(variant_id);
CREATE INDEX IF NOT EXISTS exercise_sessions_training_session_id_idx ON exercise_sessions(training_session_id);
CREATE INDEX IF NOT EXISTS exercise_sessions_exercise_id_idx ON exercise_sessions(exercise_id);
CREATE INDEX IF NOT EXISTS set_logs_exercise_session_id_idx ON set_logs(exercise_session_id);

CREATE TRIGGER IF NOT EXISTS exercise_prescriptions_validate_insert
BEFORE INSERT ON exercise_prescriptions
BEGIN
  SELECT CASE WHEN NEW.sets <= 0 THEN RAISE(ABORT, 'exercise_prescriptions.sets must be > 0') END;
  SELECT CASE WHEN NEW.reps_min <= 0 THEN RAISE(ABORT, 'exercise_prescriptions.reps_min must be > 0') END;
  SELECT CASE WHEN NEW.reps_max < NEW.reps_min THEN RAISE(ABORT, 'exercise_prescriptions.reps_max must be >= reps_min') END;
  SELECT CASE WHEN NEW.rir_min IS NOT NULL AND (NEW.rir_min < 0 OR NEW.rir_min > 10) THEN RAISE(ABORT, 'exercise_prescriptions.rir_min out of range') END;
  SELECT CASE WHEN NEW.rir_max IS NOT NULL AND (NEW.rir_max < 0 OR NEW.rir_max > 10) THEN RAISE(ABORT, 'exercise_prescriptions.rir_max out of range') END;
  SELECT CASE WHEN NEW.rir_min IS NOT NULL AND NEW.rir_max IS NOT NULL AND NEW.rir_max < NEW.rir_min THEN RAISE(ABORT, 'exercise_prescriptions.rir_max must be >= rir_min') END;
  SELECT CASE WHEN NEW.rest_seconds < 0 THEN RAISE(ABORT, 'exercise_prescriptions.rest_seconds must be >= 0') END;
END;

CREATE TRIGGER IF NOT EXISTS exercise_prescriptions_validate_update
BEFORE UPDATE ON exercise_prescriptions
BEGIN
  SELECT CASE WHEN NEW.sets <= 0 THEN RAISE(ABORT, 'exercise_prescriptions.sets must be > 0') END;
  SELECT CASE WHEN NEW.reps_min <= 0 THEN RAISE(ABORT, 'exercise_prescriptions.reps_min must be > 0') END;
  SELECT CASE WHEN NEW.reps_max < NEW.reps_min THEN RAISE(ABORT, 'exercise_prescriptions.reps_max must be >= reps_min') END;
  SELECT CASE WHEN NEW.rir_min IS NOT NULL AND (NEW.rir_min < 0 OR NEW.rir_min > 10) THEN RAISE(ABORT, 'exercise_prescriptions.rir_min out of range') END;
  SELECT CASE WHEN NEW.rir_max IS NOT NULL AND (NEW.rir_max < 0 OR NEW.rir_max > 10) THEN RAISE(ABORT, 'exercise_prescriptions.rir_max out of range') END;
  SELECT CASE WHEN NEW.rir_min IS NOT NULL AND NEW.rir_max IS NOT NULL AND NEW.rir_max < NEW.rir_min THEN RAISE(ABORT, 'exercise_prescriptions.rir_max must be >= rir_min') END;
  SELECT CASE WHEN NEW.rest_seconds < 0 THEN RAISE(ABORT, 'exercise_prescriptions.rest_seconds must be >= 0') END;
END;

CREATE TRIGGER IF NOT EXISTS workout_variants_validate_insert
BEFORE INSERT ON workout_variants
BEGIN
  SELECT CASE WHEN NEW.target_duration_minutes <= 0 THEN RAISE(ABORT, 'workout_variants.target_duration_minutes must be > 0') END;
END;

CREATE TRIGGER IF NOT EXISTS workout_variants_validate_update
BEFORE UPDATE ON workout_variants
BEGIN
  SELECT CASE WHEN NEW.target_duration_minutes <= 0 THEN RAISE(ABORT, 'workout_variants.target_duration_minutes must be > 0') END;
END;

CREATE TRIGGER IF NOT EXISTS training_sessions_reference_validate_insert
BEFORE INSERT ON training_sessions
BEGIN
  SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM workouts WHERE id = NEW.workout_id) THEN RAISE(ABORT, 'training_sessions.workout_id references unknown workout') END;
  SELECT CASE WHEN NEW.variant_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM workout_variants WHERE id = NEW.variant_id) THEN RAISE(ABORT, 'training_sessions.variant_id references unknown variant') END;
END;

CREATE TRIGGER IF NOT EXISTS training_sessions_reference_validate_update
BEFORE UPDATE OF workout_id, variant_id ON training_sessions
BEGIN
  SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM workouts WHERE id = NEW.workout_id) THEN RAISE(ABORT, 'training_sessions.workout_id references unknown workout') END;
  SELECT CASE WHEN NEW.variant_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM workout_variants WHERE id = NEW.variant_id) THEN RAISE(ABORT, 'training_sessions.variant_id references unknown variant') END;
END;

CREATE TRIGGER IF NOT EXISTS exercise_sessions_reference_validate_insert
BEFORE INSERT ON exercise_sessions
BEGIN
  SELECT CASE WHEN NEW.prescription_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM exercise_prescriptions WHERE id = NEW.prescription_id) THEN RAISE(ABORT, 'exercise_sessions.prescription_id references unknown prescription') END;
END;

CREATE TRIGGER IF NOT EXISTS exercise_sessions_reference_validate_update
BEFORE UPDATE OF prescription_id ON exercise_sessions
BEGIN
  SELECT CASE WHEN NEW.prescription_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM exercise_prescriptions WHERE id = NEW.prescription_id) THEN RAISE(ABORT, 'exercise_sessions.prescription_id references unknown prescription') END;
END;

CREATE TRIGGER IF NOT EXISTS set_logs_validate_insert
BEFORE INSERT ON set_logs
BEGIN
  SELECT CASE WHEN NEW.set_number <= 0 THEN RAISE(ABORT, 'set_logs.set_number must be > 0') END;
  SELECT CASE WHEN NEW.reps IS NOT NULL AND NEW.reps < 0 THEN RAISE(ABORT, 'set_logs.reps must be >= 0') END;
  SELECT CASE WHEN NEW.rir IS NOT NULL AND (NEW.rir < 0 OR NEW.rir > 10) THEN RAISE(ABORT, 'set_logs.rir out of range') END;
  SELECT CASE WHEN NEW.rest_after_seconds IS NOT NULL AND NEW.rest_after_seconds < 0 THEN RAISE(ABORT, 'set_logs.rest_after_seconds must be >= 0') END;
END;

CREATE TRIGGER IF NOT EXISTS set_logs_validate_update
BEFORE UPDATE ON set_logs
BEGIN
  SELECT CASE WHEN NEW.set_number <= 0 THEN RAISE(ABORT, 'set_logs.set_number must be > 0') END;
  SELECT CASE WHEN NEW.reps IS NOT NULL AND NEW.reps < 0 THEN RAISE(ABORT, 'set_logs.reps must be >= 0') END;
  SELECT CASE WHEN NEW.rir IS NOT NULL AND (NEW.rir < 0 OR NEW.rir > 10) THEN RAISE(ABORT, 'set_logs.rir out of range') END;
  SELECT CASE WHEN NEW.rest_after_seconds IS NOT NULL AND NEW.rest_after_seconds < 0 THEN RAISE(ABORT, 'set_logs.rest_after_seconds must be >= 0') END;
END;
`,
} as const;
