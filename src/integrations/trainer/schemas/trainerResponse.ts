import { z } from 'zod';
import { ExerciseSchema, SCHEMA_VERSION, TrainingPlanSchema } from './common';

const CatalogPatchSchema = z.object({
  exercises: z.array(ExerciseSchema).default([]),
}).strict().superRefine((patch, ctx) => {
  const seen = new Set<string>();
  patch.exercises.forEach((exercise, index) => {
    if (seen.has(exercise.id)) {
      ctx.addIssue({ code: 'custom', path: ['exercises', index, 'id'], message: `duplicate exercise id: ${exercise.id}` });
    }
    seen.add(exercise.id);
  });
});

export const TrainerResponseSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  documentType: z.literal('trainer-response'),
  documentId: z.string().min(1),
  createdAt: z.iso.datetime({ offset: true }),
  payload: z.object({
    basedOnRequestId: z.string().min(1),
    catalogPatch: CatalogPatchSchema.optional(),
    trainingPlan: TrainingPlanSchema.optional(),
    review: z.object({
      summary: z.string(),
      observations: z.array(z.string()).default([]),
      recommendations: z.array(z.string()).default([]),
    }).strict().optional(),
  }).strict().refine(
    (payload) => payload.catalogPatch !== undefined || payload.trainingPlan !== undefined || payload.review !== undefined,
    'response must contain at least one result',
  ),
}).strict();

export type TrainerResponse = z.infer<typeof TrainerResponseSchema>;
