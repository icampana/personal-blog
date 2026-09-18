import type { GeneratedWorkout } from '../../types/kettlebell';
import { DIFFICULTY_LABELS, WORKOUT_TYPE_LABELS } from '../../types/kettlebell';

export function exportWorkoutAsText(workout: GeneratedWorkout): string {
  const lines: string[] = [];

  // Header
  lines.push(`🏋️ ${workout.title}`);
  if (workout.subtitle) {
    lines.push(workout.subtitle);
  }
  lines.push('');

  // Summary stats
  const difficultyName =
    DIFFICULTY_LABELS[workout.difficulty]?.label ?? workout.difficulty;
  lines.push(`⏱️ Duración: ${workout.durationMinutes} min`);
  lines.push(`🎯 Nivel: ${difficultyName}`);
  lines.push(`🔥 Calorías estimadas: ~${workout.estimatedCalories} kcal`);
  lines.push(`📋 Ejercicios totales: ${workout.totalExercises}`);

  // Equipment
  const kb = workout.equipment.kettlebells;
  const db = workout.equipment.dumbbells;
  const eqParts: string[] = [];
  if (kb.light || kb.medium || kb.heavy) {
    eqParts.push(
      `KB: ${kb.light} kg (ligera) / ${kb.medium} kg (media) / ${kb.heavy} kg (pesada)`,
    );
  }
  if (db.set1 > 0 || db.set2 > 0) {
    const dbParts: string[] = [];
    if (db.set1 > 0) dbParts.push(`${db.set1} kg`);
    if (db.set2 > 0) dbParts.push(`${db.set2} kg`);
    eqParts.push(`Mancuernas: ${dbParts.join(' / ')}`);
  }
  if (eqParts.length > 0) {
    lines.push(`🔩 Equipamiento: ${eqParts.join(' | ')}`);
  }
  lines.push('');

  // Warmup
  if (workout.warmup.exercises.length > 0) {
    lines.push('────────────────────────────────────────');
    lines.push('🔥 Calentamiento (1 ronda)');
    lines.push('────────────────────────────────────────');
    for (const ex of workout.warmup.exercises) {
      const sideText =
        ex.side && ex.side !== 'both'
          ? ` [lado ${ex.side}]`
          : ex.side === 'both'
            ? ' [ambos lados]'
            : '';
      lines.push(
        `• ${ex.exercise.nameEs}: ${ex.reps} reps · ${ex.weightLabel}${sideText}`,
      );
    }
    lines.push('');
  }

  // Main Blocks
  workout.blocks.forEach((block, idx) => {
    const typeLabel = WORKOUT_TYPE_LABELS[block.type]?.label ?? block.type;
    lines.push('────────────────────────────────────────');
    lines.push(`⚡ Bloque ${idx + 1}: ${block.name}`);
    lines.push(
      `Formato: ${typeLabel} · ${block.rounds} ${block.rounds === 1 ? 'ronda' : 'rondas'}${block.restSeconds > 0 ? ` · ${block.restSeconds}s descanso` : ''}`,
    );
    if (block.notes) {
      lines.push(`Nota: ${block.notes}`);
    }
    lines.push('────────────────────────────────────────');

    block.exercises.forEach((ex, exIdx) => {
      const setsText = ex.sets && ex.sets > 1 ? `${ex.sets} series × ` : '';
      const sideText =
        ex.side && ex.side !== 'both'
          ? ` (${ex.side === 'left' ? 'lado izq' : 'lado der'})`
          : ex.side === 'both'
            ? ' (ambos lados)'
            : '';
      lines.push(
        `${exIdx + 1}. ${ex.exercise.nameEs}: ${setsText}${ex.reps} reps · ${ex.weightLabel}${sideText}`,
      );
    });
    lines.push('');
  });

  // Cooldown
  if (workout.cooldown.length > 0) {
    lines.push('────────────────────────────────────────');
    lines.push('🧘 Enfriamiento (1 ronda)');
    lines.push('────────────────────────────────────────');
    for (const ex of workout.cooldown) {
      const sideText =
        ex.side && ex.side !== 'both' ? ` [lado ${ex.side}]` : '';
      lines.push(
        `• ${ex.exercise.nameEs}: ${ex.reps} reps · ${ex.weightLabel}${sideText}`,
      );
    }
    lines.push('');
  }

  lines.push('Generated with Kettlebell Trainer · Iván Campana');

  return lines.join('\n');
}
