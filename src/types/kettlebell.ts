// Kettlebell Trainer - Type Definitions

// --- Positions (Transition Matrix) ---
export type BellPosition = 'floor' | 'hang' | 'rack' | 'overhead';

// --- Movement Patterns ---
export type MovementPattern = 'hinge' | 'squat' | 'push' | 'pull' | 'hybrid';

// --- Exercise Modality ---
export type ExerciseModality = 'ballistic' | 'grind';

// --- Equipment Types ---
export type EquipmentType = 'kettlebell' | 'dumbbell';

// --- Body Parts / Focus Zones ---
export type BodyPart =
  | 'full_body'
  | 'push' // chest, shoulders, triceps
  | 'pull' // back, biceps
  | 'legs' // quads, glutes
  | 'core' // abs, obliques
  | 'posterior'; // hamstrings, lower back, glutes

// --- Workout Difficulty ---
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// --- Workout Type ---
export type WorkoutType = 'complex' | 'chain' | 'flow';

// --- Weight Level ---
export type WeightLevel = 'light' | 'medium' | 'heavy' | 'bodyweight';

// --- Exercise ---
export interface Exercise {
  id: string;
  name: string; // English canonical name (used as ID key)
  nameEs: string; // Spanish display name
  description: string; // Spanish description
  equipment: EquipmentType;
  modality: ExerciseModality;
  pattern: MovementPattern;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  bodyParts: BodyPart[];
  complexity: 1 | 2 | 3 | 4 | 5;
  startingPosition: BellPosition;
  endingPosition: BellPosition;
  validNextExercises: string[]; // exercise IDs that can follow this one
  weightLevel: WeightLevel[];
  videoId: string; // YouTube video ID (placeholder for now)
  tips: string; // Spanish coaching tip
}

// --- Equipment Profile (user's inventory) ---
export interface EquipmentProfile {
  kettlebells: {
    light: number; // kg
    medium: number; // kg
    heavy: number; // kg
  };
  dumbbells: {
    set1: number; // kg (per dumbbell)
    set2: number; // kg (per dumbbell)
  };
}

// --- Exercise in a Workout ---
export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  reps: number;
  sets?: number; // only used in complexes
  weightLevel: WeightLevel;
  weightKg: number; // actual kg to use
  weightLabel: string; // e.g., "12 kg (media)"
  side?: 'left' | 'right' | 'both';
}

// --- Workout Block ---
export interface WorkoutBlock {
  type: WorkoutType;
  name: string; // Spanish block name
  exercises: WorkoutExercise[];
  rounds: number;
  restSeconds: number;
  notes?: string; // Spanish coaching notes
}

// --- Warmup Block ---
export interface WarmupBlock {
  exercises: WorkoutExercise[];
  durationSeconds: number;
}

// --- Complete Generated Workout ---
export interface GeneratedWorkout {
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  durationMinutes: number;
  bodyParts: BodyPart[];
  equipment: EquipmentProfile;
  warmup: WarmupBlock;
  blocks: WorkoutBlock[];
  cooldown: WorkoutExercise[];
  totalExercises: number;
  estimatedCalories: number;
}

// --- Saved Workout (persisted to localStorage) ---
export interface SavedWorkout {
  id: string;
  name: string; // User-defined custom name
  createdAt: string; // ISO date string
  workout: GeneratedWorkout;
  timesCompleted: number;
  lastCompletedAt?: string;
}

// --- Generator Parameters ---
export interface WorkoutParams {
  equipment: EquipmentProfile;
  bodyParts: BodyPart[];
  difficulty: Difficulty;
  durationMinutes: number;
  workoutType: WorkoutType;
}

// --- Storage Keys ---
export const STORAGE_KEYS = {
  EQUIPMENT: 'kb-trainer-equipment',
  SAVED_WORKOUTS: 'kb-trainer-saved-workouts',
  LAST_PARAMS: 'kb-trainer-last-params',
} as const;
// Re-export EXERCISE_MAP for hydration

// --- Default Equipment ---
export const DEFAULT_EQUIPMENT: EquipmentProfile = {
  kettlebells: { light: 8, medium: 12, heavy: 16 },
  dumbbells: { set1: 0, set2: 0 },
};

// --- Body Part Labels (Spanish) ---
export const BODY_PART_LABELS: Record<
  BodyPart,
  { label: string; description: string; icon: string }
> = {
  full_body: {
    label: 'Todo el Cuerpo',
    description: 'Entrenamiento completo con ejercicios compuestos',
    icon: 'fitness_center',
  },
  push: {
    label: 'Empuje',
    description: 'Pecho, hombros y tríceps',
    icon: 'arrow_upward',
  },
  pull: {
    label: 'Tracción',
    description: 'Espalda y bíceps',
    icon: 'arrow_downward',
  },
  legs: {
    label: 'Piernas',
    description: 'Cuádriceps, glúteos y aductores',
    icon: 'directions_walk',
  },
  core: {
    label: 'Core',
    description: 'Abdominales, oblicuos y estabilizadores',
    icon: 'accessibility_new',
  },
  posterior: {
    label: 'Cadena Posterior',
    description: 'Isquiotibiales, glúteos y espalda baja',
    icon: 'back_hand',
  },
};

// --- Difficulty Labels (Spanish) ---
export const DIFFICULTY_LABELS: Record<
  Difficulty,
  { label: string; description: string }
> = {
  beginner: {
    label: 'Principiante',
    description: 'Ejercicios básicos con técnica enfocada',
  },
  intermediate: {
    label: 'Intermedio',
    description: 'Mayor complejidad y volumen',
  },
  advanced: {
    label: 'Avanzado',
    description: 'Flujos complejos y alta intensidad',
  },
};

// --- Workout Type Labels (Spanish) ---
export const WORKOUT_TYPE_LABELS: Record<
  WorkoutType,
  { label: string; description: string }
> = {
  complex: {
    label: 'Complejo',
    description:
      'Series de ejercicios completando todas las reps antes de cambiar',
  },
  chain: {
    label: 'Cadena',
    description: 'Una repetición de cada ejercicio en secuencia, por rondas',
  },
  flow: {
    label: 'Flujo',
    description:
      'Transiciones fluidas entre ejercicios cruzando planos de movimiento',
  },
};
