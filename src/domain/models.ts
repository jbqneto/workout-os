export type EntityId = string;
export type IsoDateTime = string;
export type EquipmentCategory = 'machine'|'barbell'|'dumbbell'|'bench'|'cable'|'bodyweight'|'band'|'other';
export interface Equipment { id:EntityId; name:string; category:EquipmentCategory; notes?:string; }
export interface Environment { id:EntityId; name:string; equipmentIds:EntityId[]; notes?:string; }
export interface ExerciseMedia { id:EntityId; type:'youtube'|'video_url'|'image_url'; url:string; label?:string; }
export interface Exercise { id:EntityId; name:string; aliases:string[]; movementPattern?:string; primaryMuscles:string[]; secondaryMuscles:string[]; requiredEquipmentIds:EntityId[]; optionalEquipmentIds:EntityId[]; instructions?:string; executionNotes:string[]; media:ExerciseMedia[]; substitutionExerciseIds:EntityId[]; isUnilateral:boolean; }
export type Resistance = {type:'weight';value:number;unit:'kg'|'lb'}|{type:'bodyweight';additionalWeightKg?:number}|{type:'assisted_bodyweight';assistanceKg:number}|{type:'machine_level';level:number}|{type:'band';label?:string};
export interface RepRange { min:number; max:number }
export interface RirRange { min:number; max:number }
export interface ExercisePrescription { id:EntityId; exerciseId:EntityId; sets:number; reps:RepRange; targetRir?:RirRange; restSeconds:number; notes:string[]; }
export interface WorkoutVariant { id:EntityId; environmentId:EntityId; targetDurationMinutes:number; prescriptionIds:EntityId[]; }
export interface Workout { id:EntityId; name:string; prescriptions:ExercisePrescription[]; variants:WorkoutVariant[]; }
export interface TrainingPlan { id:EntityId; name:string; validFrom:string; validUntil?:string; workouts:Workout[]; notes:string[]; }
