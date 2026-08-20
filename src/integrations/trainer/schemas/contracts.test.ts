import { describe, expect, it } from 'vitest';
import request from '../../../../examples/json/trainer-request.example.json';
import response from '../../../../examples/json/trainer-response.example.json';
import { ExerciseSessionSchema, TrainingPlanSchema } from './common';
import { TrainerRequestSchema } from './trainerRequest';
import { TrainerResponseSchema } from './trainerResponse';

describe('trainer contracts', () => {
  it('accepts canonical trainer request fixture', () => {
    expect(TrainerRequestSchema.safeParse(request).success).toBe(true);
  });

  it('accepts canonical trainer response fixture', () => {
    expect(TrainerResponseSchema.safeParse(response).success).toBe(true);
  });

  it('rejects a plan whose validUntil precedes validFrom', () => {
    const result = TrainingPlanSchema.safeParse({
      id: 'plan_invalid',
      name: 'Invalid',
      validFrom: '2026-09-10',
      validUntil: '2026-09-01',
      workouts: [{ id: 'workout_a', name: 'A', prescriptions: [], variants: [] }],
      notes: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects duplicate set numbers inside one exercise session', () => {
    const result = ExerciseSessionSchema.safeParse({
      id: 'exercise_session_a',
      exerciseId: 'ex_hammer_curl',
      order: 0,
      sets: [
        { number: 1, type: 'working' },
        { number: 1, type: 'working' },
      ],
    });
    expect(result.success).toBe(false);
  });
});
