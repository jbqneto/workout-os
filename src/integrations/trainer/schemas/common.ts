import { z } from 'zod';

export const SCHEMA_VERSION = '1.0.0' as const;
export const EntityIdSchema = z.string().min(1).regex(/^[a-z][a-z0-9_:-]*$/);
export const IsoDateTimeSchema = z.iso.datetime({ offset: true });
export const IsoDateSchema = z.iso.date();

function addDuplicateIssues(values: readonly string[], ctx: z.RefinementCtx, label: string) {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    if (seen.has(value)) {
      ctx.addIssue({ code: 'custom', path: [index], message: `duplicate ${label}: ${value}` });
    }
    seen.add(value);
  });
}

const UniqueEntityIdArraySchema = z.array(EntityIdSchema).superRefine((values, ctx) => {
  addDuplicateIssues(values, ctx, 'id');
});

export const EquipmentSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  category: z.enum(['machine', 'barbell', 'dumbbell', 'bench', 'cable', 'bodyweight', 'band', 'other']),
  notes: z.string().optional(),
}).strict();

export const EnvironmentSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  equipmentIds: UniqueEntityIdArraySchema,
  notes: z.string().optional(),
}).strict();

export const ExerciseMediaSchema = z.object({
  id: EntityIdSchema,
  type: z.enum(['youtube', 'video_url', 'image_url']),
  url: z.url(),
  label: z.string().optional(),
}).strict();

export const ExerciseSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  movementPattern: z.string().optional(),
  primaryMuscles: z.array(z.string()),
  secondaryMuscles: z.array(z.string()),
  requiredEquipmentIds: UniqueEntityIdArraySchema,
  optionalEquipmentIds: UniqueEntityIdArraySchema.default([]),
  instructions: z.string().optional(),
  executionNotes: z.array(z.string()).default([]),
  media: z.array(ExerciseMediaSchema).default([]),
  substitutionExerciseIds: UniqueEntityIdArraySchema.default([]),
  isUnilateral: z.boolean().default(false),
}).strict().superRefine((exercise, ctx) => {
  const required = new Set(exercise.requiredEquipmentIds);
  exercise.optionalEquipmentIds.forEach((equipmentId, index) => {
    if (required.has(equipmentId)) {
      ctx.addIssue({
        code: 'custom',
        path: ['optionalEquipmentIds', index],
        message: `equipment cannot be both required and optional: ${equipmentId}`,
      });
    }
  });

  addDuplicateIssues(exercise.media.map((item) => item.id), ctx, 'media id');
});

export const ResistanceSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('weight'), value: z.number().nonnegative(), unit: z.enum(['kg', 'lb']) }).strict(),
  z.object({ type: z.literal('bodyweight'), additionalWeightKg: z.number().nonnegative().optional() }).strict(),
  z.object({ type: z.literal('assisted_bodyweight'), assistanceKg: z.number().nonnegative() }).strict(),
  z.object({ type: z.literal('machine_level'), level: z.number().nonnegative() }).strict(),
  z.object({ type: z.literal('band'), label: z.string().optional() }).strict(),
]);

export const RepRangeSchema = z.object({
  min: z.number().int().positive(),
  max: z.number().int().positive(),
}).refine((value) => value.min <= value.max, 'min must be <= max');

export const RirRangeSchema = z.object({
  min: z.number().int().min(0).max(10),
  max: z.number().int().min(0).max(10),
}).refine((value) => value.min <= value.max, 'min must be <= max');

export const PrescriptionSubstitutionSchema = z.object({
  exerciseId: EntityIdSchema,
  override: z.object({
    sets: z.number().int().positive().optional(),
    reps: RepRangeSchema.optional(),
    targetRir: RirRangeSchema.optional(),
    restSeconds: z.number().int().nonnegative().optional(),
  }).strict().optional(),
}).strict();

export const ExercisePrescriptionSchema = z.object({
  id: EntityIdSchema,
  exerciseId: EntityIdSchema,
  sets: z.number().int().positive(),
  reps: RepRangeSchema,
  targetRir: RirRangeSchema.optional(),
  restSeconds: z.number().int().nonnegative(),
  notes: z.array(z.string()).default([]),
  substitutions: z.array(PrescriptionSubstitutionSchema).default([]),
}).strict().superRefine((prescription, ctx) => {
  addDuplicateIssues(prescription.substitutions.map((item) => item.exerciseId), ctx, 'substitution exercise id');
});

export const WorkoutVariantSchema = z.object({
  id: EntityIdSchema,
  environmentId: EntityIdSchema,
  targetDurationMinutes: z.number().int().positive(),
  prescriptionIds: UniqueEntityIdArraySchema.min(1),
}).strict();

export const WorkoutSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  prescriptions: z.array(ExercisePrescriptionSchema),
  variants: z.array(WorkoutVariantSchema),
}).strict().superRefine((workout, ctx) => {
  addDuplicateIssues(workout.prescriptions.map((item) => item.id), ctx, 'prescription id');
  addDuplicateIssues(workout.variants.map((item) => item.id), ctx, 'variant id');

  const variantKeys = new Set<string>();
  workout.variants.forEach((variant, index) => {
    const key = `${variant.environmentId}:${variant.targetDurationMinutes}`;
    if (variantKeys.has(key)) {
      ctx.addIssue({
        code: 'custom',
        path: ['variants', index],
        message: `duplicate environment/duration variant: ${key}`,
      });
    }
    variantKeys.add(key);
  });
});

export const TrainingPlanSchema = z.object({
  id: EntityIdSchema,
  name: z.string().min(1),
  validFrom: IsoDateSchema,
  validUntil: IsoDateSchema.optional(),
  workouts: z.array(WorkoutSchema).min(1),
  notes: z.array(z.string()).default([]),
}).strict().superRefine((plan, ctx) => {
  if (plan.validUntil && plan.validUntil < plan.validFrom) {
    ctx.addIssue({ code: 'custom', path: ['validUntil'], message: 'validUntil must be >= validFrom' });
  }

  addDuplicateIssues(plan.workouts.map((item) => item.id), ctx, 'workout id');
  addDuplicateIssues(plan.workouts.flatMap((item) => item.prescriptions.map((prescription) => prescription.id)), ctx, 'global prescription id');
  addDuplicateIssues(plan.workouts.flatMap((item) => item.variants.map((variant) => variant.id)), ctx, 'global variant id');
});

export const SetLogSchema = z.object({
  number: z.number().int().positive(),
  type: z.enum(['warmup', 'working', 'drop', 'backoff']).default('working'),
  resistance: ResistanceSchema.optional(),
  reps: z.number().int().nonnegative().optional(),
  rir: z.number().int().min(0).max(10).optional(),
  restAfterSeconds: z.number().int().nonnegative().optional(),
  completedAt: IsoDateTimeSchema.optional(),
  notes: z.string().optional(),
}).strict();

export const ExerciseSessionSchema = z.object({
  id: EntityIdSchema,
  exerciseId: EntityIdSchema,
  prescriptionId: EntityIdSchema.optional(),
  order: z.number().int().nonnegative(),
  substitution: z.object({
    originalExerciseId: EntityIdSchema,
    reason: z.enum(['equipment_unavailable', 'equipment_busy', 'discomfort', 'preference', 'other']),
  }).strict().optional(),
  sets: z.array(SetLogSchema),
  notes: z.string().optional(),
}).strict().superRefine((session, ctx) => {
  const numbers = session.sets.map((set) => String(set.number));
  addDuplicateIssues(numbers, ctx, 'set number');
});

export const TrainingSessionSchema = z.object({
  id: EntityIdSchema,
  planId: EntityIdSchema.optional(),
  workoutId: EntityIdSchema,
  variantId: EntityIdSchema.optional(),
  environmentId: EntityIdSchema,
  startedAt: IsoDateTimeSchema,
  endedAt: IsoDateTimeSchema.optional(),
  status: z.enum(['in_progress', 'completed', 'abandoned']),
  exercises: z.array(ExerciseSessionSchema),
  notes: z.string().optional(),
}).strict().superRefine((session, ctx) => {
  if (session.endedAt && Date.parse(session.endedAt) < Date.parse(session.startedAt)) {
    ctx.addIssue({ code: 'custom', path: ['endedAt'], message: 'endedAt must be >= startedAt' });
  }
  addDuplicateIssues(session.exercises.map((exercise) => exercise.id), ctx, 'exercise session id');
});

export const TrainingHistorySchema = z.object({
  from: IsoDateSchema,
  to: IsoDateSchema,
  sessions: z.array(TrainingSessionSchema),
}).strict().superRefine((history, ctx) => {
  if (history.to < history.from) {
    ctx.addIssue({ code: 'custom', path: ['to'], message: 'history.to must be >= history.from' });
  }
  addDuplicateIssues(history.sessions.map((session) => session.id), ctx, 'training session id');
});

export const TrainingProfileSchema = z.object({
  goals: z.array(z.string()),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  preferredUnits: z.enum(['metric', 'imperial']).default('metric'),
  constraints: z.array(z.object({
    id: EntityIdSchema,
    type: z.enum(['equipment', 'movement', 'exercise', 'schedule', 'other']),
    description: z.string().min(1),
  }).strict()).default([]),
  notes: z.string().optional(),
}).strict().superRefine((profile, ctx) => {
  addDuplicateIssues(profile.constraints.map((constraint) => constraint.id), ctx, 'constraint id');
});
