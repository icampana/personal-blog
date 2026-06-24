import type {
  EquipmentProfile,
  GeneratedWorkout,
  SavedWorkout,
  WorkoutExercise,
} from '../../types/kettlebell';

import { STORAGE_KEYS } from '../../types/kettlebell';
import { EXERCISE_MAP } from './exercises';

export { STORAGE_KEYS } from '../../types/kettlebell';

// --- Equipment ---

export function loadEquipment(): EquipmentProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveEquipment(profile: EquipmentProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(profile));
}

// --- Saved Workouts ---

/**
 * Hydrate a workout by replacing stale exercise data with current definitions
 * from EXERCISE_MAP. This ensures saved workouts always use the latest exercise
 * info (e.g., updated videoIds, descriptions, tips) rather than the data that
 * was serialized at save time.
 */
function hydrateWorkout(workout: GeneratedWorkout): GeneratedWorkout {
  const hydrateExercise = (we: WorkoutExercise): WorkoutExercise => {
    const current = EXERCISE_MAP[we.exerciseId];
    return current ? { ...we, exercise: current } : we; // fallback to stored data if exercise was removed
  };

  return {
    ...workout,
    warmup: workout.warmup
      ? {
          ...workout.warmup,
          exercises: workout.warmup.exercises.map(hydrateExercise),
        }
      : workout.warmup,
    blocks: workout.blocks.map((block) => ({
      ...block,
      exercises: block.exercises.map(hydrateExercise),
    })),
    cooldown: workout.cooldown
      ? workout.cooldown.map(hydrateExercise)
      : workout.cooldown,
  };
}

export function loadSavedWorkouts(): SavedWorkout[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_WORKOUTS);
    const saved: SavedWorkout[] = raw ? JSON.parse(raw) : [];
    // Hydrate each workout to use current exercise definitions
    return saved.map((sw) => ({
      ...sw,
      workout: hydrateWorkout(sw.workout),
    }));
  } catch {
    return [];
  }
}

export function saveWorkout(
  workout: GeneratedWorkout,
  name: string,
): SavedWorkout {
  const saved: SavedWorkout = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    workout,
    timesCompleted: 0,
  };

  const existing = loadSavedWorkouts();
  existing.unshift(saved); // newest first
  localStorage.setItem(STORAGE_KEYS.SAVED_WORKOUTS, JSON.stringify(existing));

  return saved;
}

export function deleteSavedWorkout(id: string): void {
  const existing = loadSavedWorkouts().filter((w) => w.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED_WORKOUTS, JSON.stringify(existing));
}

export function markWorkoutCompleted(id: string): void {
  const existing = loadSavedWorkouts();
  const idx = existing.findIndex((w) => w.id === id);
  if (idx >= 0) {
    existing[idx].timesCompleted += 1;
    existing[idx].lastCompletedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.SAVED_WORKOUTS, JSON.stringify(existing));
  }
}
