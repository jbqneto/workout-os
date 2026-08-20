import type { TrainerResponse } from './schemas';

export interface CurrentCatalogIds {
  equipmentIds: ReadonlySet<string>;
  exerciseIds: ReadonlySet<string>;
  environmentIds: ReadonlySet<string>;
  trainingPlanIds?: ReadonlySet<string>;
}

export interface SemanticIssue {
  code: string;
  path: string;
  message: string;
}

export function validateTrainerResponseReferences(
  response: TrainerResponse,
  current: CurrentCatalogIds,
): SemanticIssue[] {
  const issues: SemanticIssue[] = [];
  const patchExercises = response.payload.catalogPatch?.exercises ?? [];
  const patchExerciseIds = new Set(patchExercises.map((exercise) => exercise.id));
  const exerciseIds = new Set([...current.exerciseIds, ...patchExerciseIds]);

  for (const exercise of patchExercises) {
    if (current.exerciseIds.has(exercise.id)) {
      issues.push({
        code: 'exercise_id_collision',
        path: `catalogPatch.exercises.${exercise.id}.id`,
        message: `Catalog patch cannot overwrite existing exercise ${exercise.id}`,
      });
    }

    for (const equipmentId of [...exercise.requiredEquipmentIds, ...exercise.optionalEquipmentIds]) {
      if (!current.equipmentIds.has(equipmentId)) {
        issues.push({
          code: 'unknown_equipment',
          path: `catalogPatch.exercises.${exercise.id}.equipment`,
          message: `Exercise ${exercise.id} references unknown equipment ${equipmentId}`,
        });
      }
    }

    for (const substitutionId of exercise.substitutionExerciseIds) {
      if (!exerciseIds.has(substitutionId)) {
        issues.push({
          code: 'unknown_catalog_substitution',
          path: `catalogPatch.exercises.${exercise.id}.substitutionExerciseIds`,
          message: `Exercise ${exercise.id} references unknown substitution ${substitutionId}`,
        });
      }
    }
  }

  const plan = response.payload.trainingPlan;
  if (!plan) return issues;

  if (current.trainingPlanIds?.has(plan.id)) {
    issues.push({
      code: 'training_plan_id_collision',
      path: 'trainingPlan.id',
      message: `Training plan ${plan.id} already exists`,
    });
  }

  const workoutIds = new Set<string>();
  const globalPrescriptionIds = new Set<string>();
  const globalVariantIds = new Set<string>();

  for (const workout of plan.workouts) {
    if (workoutIds.has(workout.id)) {
      issues.push({ code: 'duplicate_workout_id', path: `trainingPlan.workouts.${workout.id}`, message: `Duplicate workout id ${workout.id}` });
    }
    workoutIds.add(workout.id);

    const prescriptionIds = new Set(workout.prescriptions.map((prescription) => prescription.id));

    for (const prescription of workout.prescriptions) {
      if (globalPrescriptionIds.has(prescription.id)) {
        issues.push({
          code: 'duplicate_prescription_id',
          path: `trainingPlan.workouts.${workout.id}.prescriptions.${prescription.id}`,
          message: `Prescription id ${prescription.id} is reused in the plan`,
        });
      }
      globalPrescriptionIds.add(prescription.id);

      if (!exerciseIds.has(prescription.exerciseId)) {
        issues.push({
          code: 'unknown_exercise',
          path: `trainingPlan.workouts.${workout.id}.prescriptions.${prescription.id}.exerciseId`,
          message: `Prescription ${prescription.id} references unknown exercise ${prescription.exerciseId}`,
        });
      }

      for (const substitution of prescription.substitutions) {
        if (!exerciseIds.has(substitution.exerciseId)) {
          issues.push({
            code: 'unknown_substitution_exercise',
            path: `trainingPlan.workouts.${workout.id}.prescriptions.${prescription.id}.substitutions`,
            message: `Substitution references unknown exercise ${substitution.exerciseId}`,
          });
        }
      }
    }

    const environmentDurationKeys = new Set<string>();
    for (const variant of workout.variants) {
      if (globalVariantIds.has(variant.id)) {
        issues.push({
          code: 'duplicate_variant_id',
          path: `trainingPlan.workouts.${workout.id}.variants.${variant.id}`,
          message: `Variant id ${variant.id} is reused in the plan`,
        });
      }
      globalVariantIds.add(variant.id);

      if (!current.environmentIds.has(variant.environmentId)) {
        issues.push({
          code: 'unknown_environment',
          path: `trainingPlan.workouts.${workout.id}.variants.${variant.id}.environmentId`,
          message: `Variant ${variant.id} references unknown environment ${variant.environmentId}`,
        });
      }

      const key = `${variant.environmentId}:${variant.targetDurationMinutes}`;
      if (environmentDurationKeys.has(key)) {
        issues.push({
          code: 'duplicate_environment_duration_variant',
          path: `trainingPlan.workouts.${workout.id}.variants.${variant.id}`,
          message: `Workout ${workout.id} has more than one variant for ${key}`,
        });
      }
      environmentDurationKeys.add(key);

      for (const prescriptionId of variant.prescriptionIds) {
        if (!prescriptionIds.has(prescriptionId)) {
          issues.push({
            code: 'unknown_prescription',
            path: `trainingPlan.workouts.${workout.id}.variants.${variant.id}.prescriptionIds`,
            message: `Variant ${variant.id} references unknown prescription ${prescriptionId}`,
          });
        }
      }
    }
  }

  return issues;
}
