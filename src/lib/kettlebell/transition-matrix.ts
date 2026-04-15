import type { BellPosition, Exercise } from '../../types/kettlebell';
import { EXERCISES } from './exercises';

/**
 * Transition Matrix for Kettlebell Exercise Flow.
 *
 * Key States: Floor → Hang → Rack → Overhead
 *
 * Rules:
 * - Floor: Deadlift, Hike Pass, One-Arm Row
 * - Hang (between legs): Swing, Clean, Snatch, High Pull
 * - Rack (chest): Press, Squat, Lunge, TGU, Carry
 * - Overhead: Windmill, Overhead Squat, Reverse Lunge
 *
 * Invalid transitions require intermediate states:
 * - Rack → Swing: must "Drop to Hang" first
 * - Hang → Press: must "Clean to Rack" first
 */

export const VALID_TRANSITIONS: Record<BellPosition, BellPosition[]> = {
  floor: ['hang'],
  hang: ['hang', 'rack', 'overhead'],
  rack: ['rack', 'overhead', 'hang'],
  overhead: ['rack', 'overhead'],
};

/**
 * Check if a transition from one exercise to another is valid.
 */
export function isValidTransition(from: Exercise, to: Exercise): boolean {
  // Dumbbell exercises don't follow KB transition rules
  if (from.equipment === 'dumbbell' || to.equipment === 'dumbbell') {
    return true;
  }

  const allowed = VALID_TRANSITIONS[from.endingPosition];
  return allowed.includes(to.startingPosition);
}

/**
 * Find exercises that can follow a given exercise, filtered by criteria.
 */
export function findValidNextExercises(
  currentExercise: Exercise,
  options?: {
    maxComplexity?: number;
    bodyParts?: string[];
    equipment?: 'kettlebell' | 'dumbbell';
    pattern?: string;
    exclude?: string[];
  },
): Exercise[] {
  const opts = options ?? {};
  const exclude = new Set(opts.exclude ?? []);

  return EXERCISES.filter((ex) => {
    if (exclude.has(ex.id)) return false;
    if (!isValidTransition(currentExercise, ex)) return false;
    if (opts.maxComplexity && ex.complexity > opts.maxComplexity) return false;
    if (opts.equipment && ex.equipment !== opts.equipment) return false;
    if (opts.pattern && ex.pattern !== opts.pattern) return false;
    if (
      opts.bodyParts &&
      !opts.bodyParts.some((bp) => ex.bodyParts.includes(bp as never))
    )
      return false;
    return true;
  });
}

/**
 * Build a valid exercise sequence from a pool of exercises,
 * respecting the Transition Matrix.
 */
export function buildValidSequence(
  pool: Exercise[],
  length: number,
  maxComplexity?: number,
): Exercise[] {
  if (pool.length === 0 || length <= 0) return [];

  const sequence: Exercise[] = [];
  const used = new Set<string>();
  const filteredPool = maxComplexity
    ? pool.filter((e) => e.complexity <= maxComplexity)
    : pool;

  if (filteredPool.length === 0) return [];

  // Start with an exercise that begins from floor or hang (natural start)
  const starters = filteredPool.filter(
    (e) => e.startingPosition === 'floor' || e.startingPosition === 'hang',
  );
  const first =
    starters.length > 0
      ? starters[Math.floor(Math.random() * starters.length)]
      : filteredPool[0];

  sequence.push(first);
  used.add(first.id);

  let current = first;
  for (let i = 1; i < length; i++) {
    const candidates = findValidNextExercises(current, {
      maxComplexity,
      exclude: [...used],
    });

    // If no valid transitions, try allowing repeats
    const fallback =
      candidates.length > 0
        ? candidates
        : findValidNextExercises(current, { maxComplexity });

    if (fallback.length === 0) break;

    const next = fallback[Math.floor(Math.random() * fallback.length)];
    sequence.push(next);
    used.add(next.id);
    current = next;
  }

  return sequence;
}
