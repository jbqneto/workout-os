import { describe, expect, it } from 'vitest';
import { TrainerResponseSchema } from './schemas';
import { validateTrainerResponseReferences } from './semanticValidation';

const current = {
  equipmentIds: new Set(['eq_dumbbell']),
  exerciseIds: new Set(['ex_hammer_curl']),
  environmentIds: new Set(['env_gym']),
  trainingPlanIds: new Set(['plan_existing']),
};

function parseResponse(payload: unknown) {
  return TrainerResponseSchema.parse({
    schemaVersion: '1.0.0',
    documentType: 'trainer-response',
    documentId: 'resp_test',
    createdAt: '2026-08-20T16:00:00Z',
    payload,
  });
}

describe('validateTrainerResponseReferences', () => {
  it('rejects an exercise patch that invents equipment', () => {
    const response = parseResponse({
      basedOnRequestId: 'req_test',
      catalogPatch: {
        exercises: [{
          id: 'ex_new',
          name: 'New Exercise',
          aliases: [],
          primaryMuscles: [],
          secondaryMuscles: [],
          requiredEquipmentIds: ['eq_magic_machine'],
          optionalEquipmentIds: [],
          executionNotes: [],
          media: [],
          substitutionExerciseIds: [],
          isUnilateral: false,
        }],
      },
    });

    expect(validateTrainerResponseReferences(response, current).map((issue) => issue.code)).toContain('unknown_equipment');
  });

  it('rejects catalog patches that overwrite an existing exercise id', () => {
    const response = parseResponse({
      basedOnRequestId: 'req_test',
      catalogPatch: {
        exercises: [{
          id: 'ex_hammer_curl',
          name: 'Hammer Curl',
          aliases: [],
          primaryMuscles: [],
          secondaryMuscles: [],
          requiredEquipmentIds: ['eq_dumbbell'],
          optionalEquipmentIds: [],
          executionNotes: [],
          media: [],
          substitutionExerciseIds: [],
          isUnilateral: false,
        }],
      },
    });

    expect(validateTrainerResponseReferences(response, current).map((issue) => issue.code)).toContain('exercise_id_collision');
  });

  it('accepts a new exercise that only references known equipment', () => {
    const response = parseResponse({
      basedOnRequestId: 'req_test',
      catalogPatch: {
        exercises: [{
          id: 'ex_new',
          name: 'New Exercise',
          aliases: [],
          primaryMuscles: [],
          secondaryMuscles: [],
          requiredEquipmentIds: ['eq_dumbbell'],
          optionalEquipmentIds: [],
          executionNotes: [],
          media: [],
          substitutionExerciseIds: ['ex_hammer_curl'],
          isUnilateral: false,
        }],
      },
    });

    expect(validateTrainerResponseReferences(response, current)).toEqual([]);
  });

  it('rejects plans that reference unknown environments or prescriptions', () => {
    const response = parseResponse({
      basedOnRequestId: 'req_test',
      trainingPlan: {
        id: 'plan_new',
        name: 'New Plan',
        validFrom: '2026-09-01',
        notes: [],
        workouts: [{
          id: 'workout_pull',
          name: 'Pull',
          prescriptions: [{
            id: 'presc_pull',
            exerciseId: 'ex_hammer_curl',
            sets: 3,
            reps: { min: 8, max: 12 },
            restSeconds: 90,
            notes: [],
            substitutions: [],
          }],
          variants: [{
            id: 'variant_pull',
            environmentId: 'env_unknown',
            targetDurationMinutes: 45,
            prescriptionIds: ['presc_missing'],
          }],
        }],
      },
    });

    const codes = validateTrainerResponseReferences(response, current).map((issue) => issue.code);
    expect(codes).toContain('unknown_environment');
    expect(codes).toContain('unknown_prescription');
  });
});
