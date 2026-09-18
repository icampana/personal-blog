import { useState } from 'react';
import type { GeneratedWorkout } from '../../types/kettlebell';
import {
  BODY_PART_LABELS,
  DIFFICULTY_LABELS,
  WORKOUT_TYPE_LABELS,
} from '../../types/kettlebell';

interface Props {
  workout: GeneratedWorkout;
}

export default function CompactWorkoutView({ workout }: Props) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleExercise = (key: string) => {
    setCompleted((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const kb = workout.equipment.kettlebells;
  const db = workout.equipment.dumbbells;

  return (
    <div className="space-y-4 text-base-content print-clean">
      {/* Header Summary */}
      <div className="bg-base-200 p-4 rounded-xl border border-base-300 print:bg-white print:border-black print:p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {workout.title}
            </h2>
            <p className="text-xs sm:text-sm text-base-content/70 print:text-black">
              {workout.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="badge badge-neutral print:badge-outline">
              ⏱️ {workout.durationMinutes} min
            </span>
            <span className="badge badge-primary print:badge-outline">
              🎯 {DIFFICULTY_LABELS[workout.difficulty]?.label}
            </span>
            <span className="badge badge-secondary print:badge-outline">
              🔥 ~{workout.estimatedCalories} kcal
            </span>
          </div>
        </div>

        {/* Equipment summary */}
        <div className="mt-3 pt-3 border-t border-base-300 text-xs flex flex-wrap gap-3 text-base-content/80 print:text-black print:border-black">
          <span>
            <strong>Pesas Rusas:</strong> {kb.light} kg (ligera) · {kb.medium}{' '}
            kg (media) · {kb.heavy} kg (pesada)
          </span>
          {(db.set1 > 0 || db.set2 > 0) && (
            <span>
              <strong>Mancuernas:</strong>{' '}
              {[
                db.set1 > 0 ? `${db.set1} kg` : null,
                db.set2 > 0 ? `${db.set2} kg` : null,
              ]
                .filter(Boolean)
                .join(' / ')}
            </span>
          )}
          {workout.bodyParts.length > 0 && (
            <span>
              <strong>Zonas:</strong>{' '}
              {workout.bodyParts
                .map((bp) => BODY_PART_LABELS[bp]?.label ?? bp)
                .join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Warmup Section */}
      {workout.warmup.exercises.length > 0 && (
        <div className="card bg-base-200/60 border border-base-300 print:bg-white print:border-black">
          <div className="p-3 border-b border-base-300 bg-base-300/40 print:bg-gray-100 flex items-center justify-between">
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <span>🔥</span>
              <span>Calentamiento (1 ronda)</span>
            </div>
            <span className="text-xs text-base-content/60 print:text-black">
              {workout.warmup.exercises.length} ejercicios
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-xs sm:table-sm w-full">
              <thead>
                <tr className="text-xs text-base-content/70 print:text-black border-b border-base-300">
                  <th className="w-8 no-print">✓</th>
                  <th>Ejercicio</th>
                  <th>Series × Reps</th>
                  <th>Peso</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {workout.warmup.exercises.map((ex, idx) => {
                  const key = `warmup-${ex.exerciseId}-${idx}`;
                  const isDone = !!completed[key];
                  return (
                    <tr
                      key={key}
                      className={`hover:bg-base-200/50 transition-opacity ${
                        isDone ? 'opacity-40 line-through' : ''
                      }`}
                    >
                      <td className="no-print">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs checkbox-primary"
                          checked={isDone}
                          onChange={() => toggleExercise(key)}
                          aria-label={`Completar ${ex.exercise.nameEs}`}
                        />
                      </td>
                      <td className="font-medium text-xs sm:text-sm">
                        {ex.exercise.nameEs}
                      </td>
                      <td className="text-xs">{ex.reps} reps</td>
                      <td className="text-xs font-semibold text-primary print:text-black">
                        {ex.weightLabel}
                      </td>
                      <td className="text-xs text-base-content/70 print:text-black">
                        {ex.side && ex.side !== 'both'
                          ? `Lado ${ex.side}`
                          : ex.side === 'both'
                            ? 'Ambos lados'
                            : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Blocks */}
      {workout.blocks.map((block, bIdx) => (
        <div
          key={`block-${block.name}-${bIdx}`}
          className="card bg-base-200/60 border border-base-300 print:bg-white print:border-black page-break-inside-avoid"
        >
          <div className="p-3 border-b border-base-300 bg-base-300/40 print:bg-gray-100 flex flex-wrap items-center justify-between gap-1">
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <span>⚡</span>
              <span>
                Bloque {bIdx + 1}: {block.name}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="badge badge-outline badge-xs sm:badge-sm print:border-black">
                {WORKOUT_TYPE_LABELS[block.type]?.label ?? block.type}
              </span>
              <span className="font-medium">
                {block.rounds} {block.rounds === 1 ? 'ronda' : 'rondas'}
              </span>
              {block.restSeconds > 0 && (
                <span className="text-base-content/70 print:text-black">
                  · {block.restSeconds}s descanso
                </span>
              )}
            </div>
          </div>

          {block.notes && (
            <div className="px-3 py-1.5 bg-info/10 text-info text-xs border-b border-base-300 print:text-black">
              💡 {block.notes}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table table-xs sm:table-sm w-full">
              <thead>
                <tr className="text-xs text-base-content/70 print:text-black border-b border-base-300">
                  <th className="w-8 no-print">✓</th>
                  <th className="w-6">#</th>
                  <th>Ejercicio</th>
                  <th>Reps / Series</th>
                  <th>Peso</th>
                  <th>Lado / Notas</th>
                </tr>
              </thead>
              <tbody>
                {block.exercises.map((ex, exIdx) => {
                  const key = `b-${bIdx}-${ex.exerciseId}-${exIdx}`;
                  const isDone = !!completed[key];
                  return (
                    <tr
                      key={key}
                      className={`hover:bg-base-200/50 transition-opacity ${
                        isDone ? 'opacity-40 line-through' : ''
                      }`}
                    >
                      <td className="no-print">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs checkbox-primary"
                          checked={isDone}
                          onChange={() => toggleExercise(key)}
                          aria-label={`Completar ${ex.exercise.nameEs}`}
                        />
                      </td>
                      <td className="text-xs font-mono text-base-content/50 print:text-black">
                        {exIdx + 1}
                      </td>
                      <td className="font-medium text-xs sm:text-sm">
                        <span>{ex.exercise.nameEs}</span>
                      </td>
                      <td className="text-xs font-semibold">
                        {ex.sets && ex.sets > 1 ? `${ex.sets} × ` : ''}
                        {ex.reps} reps
                      </td>
                      <td className="text-xs font-semibold text-primary print:text-black">
                        {ex.weightLabel}
                      </td>
                      <td className="text-xs text-base-content/70 print:text-black">
                        {ex.side && ex.side !== 'both'
                          ? `Lado ${ex.side === 'left' ? 'izq' : 'der'}`
                          : ex.side === 'both'
                            ? 'Ambos lados'
                            : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Cooldown Section */}
      {workout.cooldown.length > 0 && (
        <div className="card bg-base-200/60 border border-base-300 print:bg-white print:border-black">
          <div className="p-3 border-b border-base-300 bg-base-300/40 print:bg-gray-100 flex items-center justify-between">
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <span>🧘</span>
              <span>Enfriamiento (1 ronda)</span>
            </div>
            <span className="text-xs text-base-content/60 print:text-black">
              {workout.cooldown.length} ejercicios
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-xs sm:table-sm w-full">
              <thead>
                <tr className="text-xs text-base-content/70 print:text-black border-b border-base-300">
                  <th className="w-8 no-print">✓</th>
                  <th>Ejercicio</th>
                  <th>Series × Reps</th>
                  <th>Peso</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {workout.cooldown.map((ex, idx) => {
                  const key = `cooldown-${ex.exerciseId}-${idx}`;
                  const isDone = !!completed[key];
                  return (
                    <tr
                      key={key}
                      className={`hover:bg-base-200/50 transition-opacity ${
                        isDone ? 'opacity-40 line-through' : ''
                      }`}
                    >
                      <td className="no-print">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs checkbox-primary"
                          checked={isDone}
                          onChange={() => toggleExercise(key)}
                          aria-label={`Completar ${ex.exercise.nameEs}`}
                        />
                      </td>
                      <td className="font-medium text-xs sm:text-sm">
                        {ex.exercise.nameEs}
                      </td>
                      <td className="text-xs">{ex.reps} reps</td>
                      <td className="text-xs text-primary print:text-black">
                        {ex.weightLabel}
                      </td>
                      <td className="text-xs text-base-content/70 print:text-black">
                        {ex.side && ex.side !== 'both'
                          ? `Lado ${ex.side}`
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Print footnote */}
      <div className="hidden print:block text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
        Entrenador de Pesas Rusas · Generado en ivancampana.com
      </div>
    </div>
  );
}
