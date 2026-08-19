export const demoToday = { cycle:'August 2026 · Week 3', workoutId:'workout_pull', name:'Back + Biceps', environmentId:'env_fitness_hut', environmentName:'Fitness Hut', durationMinutes:45, exerciseCount:5, lastWorkout:{name:'Chest + Shoulders + Triceps',metadata:'16 Aug · 57 min · 6 exercises'} } as const;

export const demoPullExercises = [
  { id:'ex_lat_pulldown', name:'Lat Pulldown', equipment:'Cable Machine', prescription:'3 × 8–12', rir:'RIR 1–2', rest:'2:00' },
  { id:'ex_low_row', name:'Low Row', equipment:'Row Machine', prescription:'3 × 8–12', rir:'RIR 1–2', rest:'2:00' },
  { id:'ex_reverse_fly', name:'Reverse Fly', equipment:'Machine', prescription:'3 × 10–15', rir:'RIR 1–2', rest:'1:30' },
  { id:'ex_biceps_curl', name:'Biceps Curl', equipment:'Dumbbells', prescription:'3 × 8–12', rir:'RIR 1–2', rest:'1:30' },
  { id:'ex_hammer_curl', name:'Hammer Curl', equipment:'Dumbbells', prescription:'3 × 10–15', rir:'RIR 1–2', rest:'1:30' },
] as const;
