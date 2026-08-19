export const migration001 = {
  version: 1,
  name: 'initial_schema',
  sql: `
CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, applied_at TEXT NOT NULL);
CREATE TABLE equipment (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, category TEXT NOT NULL, notes TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE environments (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, kind TEXT, notes TEXT, is_primary INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE environment_equipment (environment_id TEXT NOT NULL REFERENCES environments(id) ON DELETE CASCADE, equipment_id TEXT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE, details_json TEXT, PRIMARY KEY (environment_id, equipment_id));
CREATE TABLE exercises (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, movement_pattern TEXT, is_unilateral INTEGER NOT NULL DEFAULT 0, instructions TEXT, execution_notes_json TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE exercise_aliases (exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, alias TEXT NOT NULL, PRIMARY KEY (exercise_id, alias));
CREATE TABLE exercise_muscles (exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, muscle TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('primary','secondary')), PRIMARY KEY (exercise_id, muscle, role));
CREATE TABLE exercise_equipment (exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, equipment_id TEXT NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT, requirement TEXT NOT NULL CHECK(requirement IN ('required','optional')), PRIMARY KEY (exercise_id, equipment_id, requirement));
CREATE TABLE exercise_media (id TEXT PRIMARY KEY NOT NULL, exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, type TEXT NOT NULL, url TEXT NOT NULL, label TEXT, sort_order INTEGER NOT NULL DEFAULT 0);
CREATE TABLE exercise_substitutions (source_exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, target_exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, relationship TEXT NOT NULL DEFAULT 'catalog_alternative', notes TEXT, PRIMARY KEY (source_exercise_id, target_exercise_id));
CREATE TABLE training_plans (id TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('draft','active','archived')), valid_from TEXT NOT NULL, valid_until TEXT, notes_json TEXT NOT NULL DEFAULT '[]', source_document_id TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE UNIQUE INDEX one_active_training_plan ON training_plans(status) WHERE status='active';
CREATE TABLE workouts (id TEXT PRIMARY KEY NOT NULL, training_plan_id TEXT NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE, name TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0, notes_json TEXT NOT NULL DEFAULT '[]');
CREATE TABLE exercise_prescriptions (id TEXT PRIMARY KEY NOT NULL, workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE, exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT, sets INTEGER NOT NULL, reps_min INTEGER NOT NULL, reps_max INTEGER NOT NULL, rir_min INTEGER, rir_max INTEGER, rest_seconds INTEGER NOT NULL, notes_json TEXT NOT NULL DEFAULT '[]', sort_order INTEGER NOT NULL DEFAULT 0);
CREATE TABLE prescription_substitutions (prescription_id TEXT NOT NULL REFERENCES exercise_prescriptions(id) ON DELETE CASCADE, exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT, override_json TEXT, sort_order INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (prescription_id, exercise_id));
CREATE TABLE workout_variants (id TEXT PRIMARY KEY NOT NULL, workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE, environment_id TEXT NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, target_duration_minutes INTEGER NOT NULL, name TEXT);
CREATE TABLE variant_prescriptions (variant_id TEXT NOT NULL REFERENCES workout_variants(id) ON DELETE CASCADE, prescription_id TEXT NOT NULL REFERENCES exercise_prescriptions(id) ON DELETE CASCADE, sort_order INTEGER NOT NULL, PRIMARY KEY (variant_id, prescription_id));
CREATE TABLE training_sessions (id TEXT PRIMARY KEY NOT NULL, plan_id TEXT REFERENCES training_plans(id) ON DELETE SET NULL, workout_id TEXT NOT NULL, variant_id TEXT, environment_id TEXT NOT NULL REFERENCES environments(id) ON DELETE RESTRICT, started_at TEXT NOT NULL, ended_at TEXT, status TEXT NOT NULL CHECK(status IN ('in_progress','completed','abandoned')), notes TEXT);
CREATE INDEX training_sessions_started_at_idx ON training_sessions(started_at DESC);
CREATE TABLE exercise_sessions (id TEXT PRIMARY KEY NOT NULL, training_session_id TEXT NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE, prescription_id TEXT, exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT, sort_order INTEGER NOT NULL, substitution_original_exercise_id TEXT REFERENCES exercises(id) ON DELETE SET NULL, substitution_reason TEXT, notes TEXT);
CREATE TABLE set_logs (id TEXT PRIMARY KEY NOT NULL, exercise_session_id TEXT NOT NULL REFERENCES exercise_sessions(id) ON DELETE CASCADE, set_number INTEGER NOT NULL, set_type TEXT NOT NULL DEFAULT 'working', resistance_json TEXT, reps INTEGER, rir INTEGER, rest_after_seconds INTEGER, completed_at TEXT, notes TEXT, UNIQUE(exercise_session_id, set_number));
CREATE TABLE trainer_reviews (id TEXT PRIMARY KEY NOT NULL, plan_id TEXT REFERENCES training_plans(id) ON DELETE SET NULL, based_on_request_id TEXT NOT NULL, summary TEXT, observations_json TEXT NOT NULL DEFAULT '[]', recommendations_json TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL);
CREATE TABLE settings (key TEXT PRIMARY KEY NOT NULL, value_json TEXT NOT NULL);
`,
} as const;
