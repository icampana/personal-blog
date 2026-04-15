import type {
  BodyPart,
  Difficulty,
  EquipmentProfile,
  Exercise,
  GeneratedWorkout,
  WarmupBlock,
  WeightLevel,
  WorkoutBlock,
  WorkoutExercise,
  WorkoutParams,
  WorkoutType,
} from '../../types/kettlebell';
import { EXERCISES } from './exercises';
import { buildValidSequence } from './transition-matrix';

// --- Rep/Rest Presets by Difficulty ---
const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { repsMultiplier: number; restSeconds: number; maxComplexity: number }
> = {
  beginner: { repsMultiplier: 0.7, restSeconds: 90, maxComplexity: 2 },
  intermediate: { repsMultiplier: 1.0, restSeconds: 60, maxComplexity: 3 },
  advanced: { repsMultiplier: 1.3, restSeconds: 45, maxComplexity: 5 },
};

// --- Duration to Blocks Mapping ---
const DURATION_BLOCKS: Record<
  number,
  { warmupExercises: number; mainBlocks: number; exercisesPerBlock: number }
> = {
  15: { warmupExercises: 2, mainBlocks: 1, exercisesPerBlock: 3 },
  30: { warmupExercises: 3, mainBlocks: 2, exercisesPerBlock: 4 },
  45: { warmupExercises: 3, mainBlocks: 3, exercisesPerBlock: 4 },
};

// --- Base reps per exercise by modality ---
const BASE_REPS: Record<string, { min: number; max: number }> = {
  ballistic: { min: 8, max: 15 },
  grind: { min: 5, max: 8 },
};

// --- Filter exercises by body parts and equipment ---
function filterExercises(
  bodyParts: BodyPart[],
  equipment: EquipmentProfile,
  difficulty: Difficulty,
  equipmentType?: 'kettlebell' | 'dumbbell',
): Exercise[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  const hasDB = equipment.dumbbells.set1 > 0 || equipment.dumbbells.set2 > 0;

  return EXERCISES.filter((ex) => {
    // Equipment filter
    if (equipmentType && ex.equipment !== equipmentType) return false;
    if (ex.equipment === 'dumbbell' && !hasDB) return false;

    // Complexity filter
    if (ex.complexity > config.maxComplexity) return false;

    // Body part filter
    if (bodyParts.includes('full_body' as BodyPart)) return true;
    return ex.bodyParts.some((bp) => bodyParts.includes(bp));
  });
}

// --- Resolve weight for an exercise ---
function resolveWeight(
  exercise: Exercise,
  equipment: EquipmentProfile,
): { weightLevel: WeightLevel; weightKg: number; weightLabel: string } {
  if (exercise.equipment === 'dumbbell') {
    // Use the lighter DB set for isolation, heavier for compounds
    const isCompound =
      exercise.pattern === 'push' || exercise.pattern === 'pull';
    const dbWeight = isCompound
      ? Math.max(equipment.dumbbells.set1, equipment.dumbbells.set2)
      : Math.min(
          equipment.dumbbells.set1 || equipment.dumbbells.set2,
          equipment.dumbbells.set2 || equipment.dumbbells.set1,
        );

    return {
      weightLevel: 'medium',
      weightKg: dbWeight,
      weightLabel: `${dbWeight} kg (mancuerna)`,
    };
  }

  // KB weight assignment based on the exercise's weightLevel field
  const kb = equipment.kettlebells;
  const level = exercise.weightLevel[0]; // primary weight level

  const weightMap: Record<string, { kg: number; label: string }> = {
    light: { kg: kb.light, label: `${kb.light} kg (ligera)` },
    medium: { kg: kb.medium, label: `${kb.medium} kg (media)` },
    heavy: { kg: kb.heavy, label: `${kb.heavy} kg (pesada)` },
    bodyweight: { kg: 0, label: 'Peso corporal' },
  };

  const resolved = weightMap[level] ?? weightMap.medium;
  return {
    weightLevel: level === 'bodyweight' ? 'bodyweight' : (level as WeightLevel),
    weightKg: resolved.kg,
    weightLabel: resolved.label,
  };
}

// --- Calculate reps for an exercise ---
function calculateReps(
  exercise: Exercise,
  difficulty: Difficulty,
  workoutType: WorkoutType,
): number {
  const base = BASE_REPS[exercise.modality];
  const multiplier = DIFFICULTY_CONFIG[difficulty].repsMultiplier;

  let reps = Math.round(((base.min + base.max) / 2) * multiplier);

  // Chains and flows use fewer reps per exercise
  if (workoutType === 'chain') reps = Math.max(1, Math.round(reps * 0.5));
  if (workoutType === 'flow') reps = Math.max(3, Math.round(reps * 0.7));

  // High complexity exercises get fewer reps
  if (exercise.complexity >= 4) reps = Math.max(3, reps - 2);

  return reps;
}

// --- Build warmup block ---
function buildWarmup(
  bodyParts: BodyPart[],
  equipment: EquipmentProfile,
  difficulty: Difficulty,
): WarmupBlock {
  const config = DURATION_BLOCKS[15]; // warmup is always short
  const warmupExercises = filterExercises(
    ['full_body' as BodyPart, ...bodyParts],
    equipment,
    difficulty,
    'kettlebell',
  ).filter((e) => e.complexity <= 2 && e.modality === 'ballistic');

  const selected = warmupExercises.slice(0, config.warmupExercises);

  const exercises: WorkoutExercise[] = selected.map((ex) => {
    const weight = resolveWeight(ex, equipment);
    return {
      exerciseId: ex.id,
      exercise: ex,
      reps: 10,
      sets: 1,
      weightLevel: weight.weightLevel,
      weightKg: weight.weightKg,
      weightLabel: weight.weightLabel,
      side: ex.bodyParts.includes('core') ? 'both' : undefined,
    };
  });

  return {
    exercises,
    durationSeconds: selected.length * 45, // ~45s per warmup exercise
  };
}

// --- Build a single workout block ---
function buildBlock(
  bodyParts: BodyPart[],
  equipment: EquipmentProfile,
  difficulty: Difficulty,
  workoutType: WorkoutType,
  blockIndex: number,
  exercisesPerBlock: number,
  excludeIds: string[],
): WorkoutBlock {
  const config = DIFFICULTY_CONFIG[difficulty];
  const pool = filterExercises(bodyParts, equipment, difficulty, 'kettlebell');

  // Try to build a valid sequence respecting transitions
  const sequence = buildValidSequence(
    pool,
    exercisesPerBlock,
    config.maxComplexity,
  );

  // If sequence is too short, fill with exercises that don't need transitions
  const finalExercises =
    sequence.length >= exercisesPerBlock
      ? sequence
      : [
          ...sequence,
          ...pool
            .filter((e) => !sequence.some((s) => s.id === e.id))
            .slice(0, exercisesPerBlock - sequence.length),
        ];

  const workoutExercises: WorkoutExercise[] = finalExercises.map((ex) => {
    const weight = resolveWeight(ex, equipment);
    return {
      exerciseId: ex.id,
      exercise: ex,
      reps: calculateReps(ex, difficulty, workoutType),
      sets: workoutType === 'complex' ? 3 : undefined,
      weightLevel: weight.weightLevel,
      weightKg: weight.weightKg,
      weightLabel: weight.weightLabel,
      side: ex.bodyParts.includes('core') ? 'both' : undefined,
    };
  });

  // Block naming in Spanish
  const blockNames = [
    'Bloque Principal',
    'Bloque de Fuerza',
    'Bloque Metabólico',
  ];

  const rounds = workoutType === 'flow' ? 3 : workoutType === 'chain' ? 4 : 3;

  return {
    type: workoutType,
    name: blockNames[blockIndex] ?? `Bloque ${blockIndex + 1}`,
    exercises: workoutExercises,
    rounds,
    restSeconds: config.restSeconds,
    notes:
      workoutType === 'flow'
        ? 'Mantén un ritmo fluido entre ejercicios. Descansa al final de cada ronda.'
        : undefined,
  };
}

// --- Add dumbbell supplementation for missing muscles ---
function addDBSupplementation(
  bodyParts: BodyPart[],
  equipment: EquipmentProfile,
  difficulty: Difficulty,
): WorkoutExercise[] {
  if (!equipment.dumbbells.set1 && !equipment.dumbbells.set2) return [];

  const dbExercises = filterExercises(
    bodyParts,
    equipment,
    difficulty,
    'dumbbell',
  );

  // Pick 1-2 DB exercises as accessories
  const selected = dbExercises.slice(0, Math.min(2, dbExercises.length));

  return selected.map((ex) => {
    const weight = resolveWeight(ex, equipment);
    return {
      exerciseId: ex.id,
      exercise: ex,
      reps: 12,
      sets: 3,
      weightLevel: weight.weightLevel,
      weightKg: weight.weightKg,
      weightLabel: weight.weightLabel,
    };
  });
}

// --- Build cooldown ---
function buildCooldown(
  bodyParts: BodyPart[],
  equipment: EquipmentProfile,
): WorkoutExercise[] {
  // Light KB stretches / mobility work
  const cooldownPool = EXERCISES.filter(
    (e) =>
      e.complexity <= 2 &&
      (e.pattern === 'hybrid' || e.bodyParts.includes('core')) &&
      e.equipment === 'kettlebell',
  );

  return cooldownPool.slice(0, 2).map((ex) => {
    const weight = resolveWeight(ex, equipment);
    return {
      exerciseId: ex.id,
      exercise: ex,
      reps: 5,
      sets: 1,
      weightLevel: weight.weightLevel,
      weightKg: weight.weightKg,
      weightLabel: weight.weightLabel,
    };
  });
}

// --- Generate workout title in Spanish ---
function generateTitle(
  bodyParts: BodyPart[],
  difficulty: Difficulty,
  workoutType: WorkoutType,
): { title: string; subtitle: string } {
  const bodyPartNames: Record<string, string> = {
    full_body: 'Cuerpo Completo',
    push: 'Empuje',
    pull: 'Tracción',
    legs: 'Piernas',
    core: 'Core',
    posterior: 'Cadena Posterior',
  };

  const difficultyNames: Record<Difficulty, string> = {
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
  };

  const typeNames: Record<WorkoutType, string> = {
    complex: 'Complejo',
    chain: 'Cadena',
    flow: 'Flujo',
  };

  const parts = bodyParts.includes('full_body' as BodyPart)
    ? ['Cuerpo Completo']
    : bodyParts.map((bp) => bodyPartNames[bp] ?? bp);

  return {
    title: `Entrenamiento de ${parts.join(' + ')} - ${typeNames[workoutType]}`,
    subtitle: `Nivel ${difficultyNames[difficulty]} · ${typeNames[workoutType]}`,
  };
}

// --- Main Generator ---
export function generateWorkout(params: WorkoutParams): GeneratedWorkout {
  const { equipment, bodyParts, difficulty, durationMinutes, workoutType } =
    params;
  const durationConfig =
    DURATION_BLOCKS[durationMinutes] ?? DURATION_BLOCKS[30];

  // 1. Build warmup
  const warmup = buildWarmup(bodyParts, equipment, difficulty);

  // 2. Build main blocks
  const blocks: WorkoutBlock[] = [];
  const usedIds: string[] = [];

  for (let i = 0; i < durationConfig.mainBlocks; i++) {
    const block = buildBlock(
      bodyParts,
      equipment,
      difficulty,
      workoutType,
      i,
      durationConfig.exercisesPerBlock,
      usedIds,
    );
    blocks.push(block);
    for (const ex of block.exercises) {
      usedIds.push(ex.exerciseId);
    }
  }

  // 3. Add DB supplementation as accessory block
  const dbExercises = addDBSupplementation(bodyParts, equipment, difficulty);
  if (dbExercises.length > 0) {
    blocks.push({
      type: 'complex',
      name: 'Suplementación con Mancuernas',
      exercises: dbExercises,
      rounds: 3,
      restSeconds: DIFFICULTY_CONFIG[difficulty].restSeconds,
      notes:
        'Ejercicios accesorios para complementar el trabajo con pesas rusas.',
    });
  }

  // 4. Build cooldown
  const cooldown = buildCooldown(bodyParts, equipment);

  // 5. Generate title
  const { title, subtitle } = generateTitle(bodyParts, difficulty, workoutType);

  // 6. Count totals
  const totalExercises = blocks.reduce((sum, b) => sum + b.exercises.length, 0);

  // Rough calorie estimate: ~6-8 cal/min for KB training
  const calorieRate =
    difficulty === 'advanced' ? 8 : difficulty === 'intermediate' ? 7 : 6;
  const estimatedCalories = Math.round(durationMinutes * calorieRate);

  return {
    title,
    subtitle,
    difficulty,
    durationMinutes,
    bodyParts,
    equipment,
    warmup,
    blocks,
    cooldown,
    totalExercises,
    estimatedCalories,
  };
}
