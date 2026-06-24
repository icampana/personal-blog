import { useState } from 'react';
import type { WorkoutExercise, WorkoutType } from '../../types/kettlebell';
import ExerciseCard from './ExerciseCard';

interface Props {
  name: string;
  type: WorkoutType;
  exercises: WorkoutExercise[];
  rounds: number;
  restSeconds: number;
  notes?: string;
  onRestNeeded: (seconds: number, blockName: string) => void;
}

export default function WorkoutBlock({
  name,
  type,
  exercises,
  rounds,
  restSeconds,
  notes,
  onRestNeeded,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [currentRound, setCurrentRound] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set(),
  );

  const typeLabels: Record<WorkoutType, { label: string; icon: string }> = {
    complex: { label: 'Complejo', icon: 'format_list_numbered' },
    chain: { label: 'Cadena', icon: 'link' },
    flow: { label: 'Flujo', icon: 'water' },
  };

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allExercisesDone =
    exercises.length > 0 &&
    exercises.every((e) => completedExercises.has(e.exerciseId));

  const handleRoundDone = () => {
    if (currentRound < rounds - 1) {
      if (restSeconds > 0) {
        onRestNeeded(restSeconds, name);
      }
      setCurrentRound(currentRound + 1);
      setCompletedExercises(new Set());
    }
  };

  return (
    <div className="card bg-base-200">
      <div
        className="card-body cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded);
        }}
        role="button"
        tabIndex={0}
      >
        {/* Block Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="card-title text-lg">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-1">
              <span className="badge badge-sm badge-outline">
                <span className="material-symbols-outlined text-xs mr-1">
                  {typeLabels[type].icon}
                </span>
                {typeLabels[type].label}
              </span>
              <span>
                {rounds} {rounds === 1 ? 'ronda' : 'rondas'}
              </span>
              {restSeconds > 0 && <span>· {restSeconds}s descanso</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Round indicator */}
            {rounds > 1 && (
              <div className="flex gap-1">
                {Array.from({ length: rounds }, (_, i) => (
                  <div
                    key={`round-${i}`}
                    className={`w-2 h-2 rounded-full ${
                      i <= currentRound ? 'bg-primary' : 'bg-base-300'
                    }`}
                  />
                ))}
              </div>
            )}
            <span className="material-symbols-outlined">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </div>
        </div>
      </div>

      {/* Block Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {notes && (
            <div className="alert alert-info text-sm py-2">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>{notes}</span>
            </div>
          )}

          {rounds > 1 && (
            <div className="text-sm font-medium text-primary">
              Ronda {currentRound + 1} de {rounds}
            </div>
          )}

          {/* Exercise List */}
          {exercises.map((ex, i) => (
            <ExerciseCard
              key={`${ex.exerciseId}-${i}`}
              workoutExercise={ex}
              index={i + 1}
              completed={completedExercises.has(ex.exerciseId)}
              onToggle={() => toggleExercise(ex.exerciseId)}
            />
          ))}

          {/* Round completion */}
          {allExercisesDone && currentRound < rounds - 1 && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRoundDone();
                }}
              >
                <span className="material-symbols-outlined">skip_next</span>
                Siguiente Ronda ({currentRound + 2}/{rounds})
              </button>
            </div>
          )}

          {allExercisesDone && currentRound === rounds - 1 && (
            <div className="alert alert-success text-sm">
              <span className="material-symbols-outlined">check_circle</span>
              <span>¡Bloque completado! 💪</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
