import { useCallback, useState } from 'react';
import { saveWorkout } from '../../lib/kettlebell/storage';
import type { GeneratedWorkout, SavedWorkout } from '../../types/kettlebell';
import RestTimer from './RestTimer';
import WorkoutBlock from './WorkoutBlock';

interface Props {
  workout: GeneratedWorkout;
  onNewWorkout: () => void;
  onSaved: () => void;
}

export default function WorkoutDisplay({
  workout,
  onNewWorkout,
  onSaved,
}: Props) {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saved, setSaved] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{
    restSeconds: number;
    blockName: string;
  } | null>(null);

  const handleSave = useCallback(() => {
    if (!saveName.trim()) return;
    saveWorkout(workout, saveName.trim());
    setSaved(true);
    setShowSaveModal(false);
    onSaved();
  }, [saveName, workout, onSaved]);

  const handleStartTimer = useCallback(
    (restSeconds: number, blockName: string) => {
      setActiveTimer({ restSeconds, blockName });
    },
    [],
  );

  const handleTimerDone = useCallback(() => {
    setActiveTimer(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-1">{workout.title}</h2>
        <p className="text-base-content/70">{workout.subtitle}</p>

        {/* Stats badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <div className="badge badge-lg">
            <span className="material-symbols-outlined text-sm mr-1">
              timer
            </span>
            {workout.durationMinutes} min
          </div>
          <div className="badge badge-lg">
            <span className="material-symbols-outlined text-sm mr-1">
              fitness_center
            </span>
            {workout.totalExercises} ejercicios
          </div>
          <div className="badge badge-lg">
            <span className="material-symbols-outlined text-sm mr-1">
              local_fire_department
            </span>
            ~{workout.estimatedCalories} kcal
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={onNewWorkout}
        >
          <span className="material-symbols-outlined">refresh</span>
          Nuevo Entrenamiento
        </button>

        {!saved ? (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowSaveModal(true)}
          >
            <span className="material-symbols-outlined">bookmark_add</span>
            Guardar
          </button>
        ) : (
          <span className="btn btn-sm btn-success cursor-default">
            <span className="material-symbols-outlined">check</span>
            Guardado
          </span>
        )}
      </div>

      {/* Warmup */}
      {workout.warmup.exercises.length > 0 && (
        <WorkoutBlock
          name="🔥 Calentamiento"
          type="complex"
          exercises={workout.warmup.exercises}
          rounds={1}
          restSeconds={0}
          onRestNeeded={handleStartTimer}
        />
      )}

      {/* Main Blocks */}
      {workout.blocks.map((block, i) => (
        <WorkoutBlock
          key={`${block.name}-${i}`}
          name={block.name}
          type={block.type}
          exercises={block.exercises}
          rounds={block.rounds}
          restSeconds={block.restSeconds}
          notes={block.notes}
          onRestNeeded={handleStartTimer}
        />
      ))}

      {/* Cooldown */}
      {workout.cooldown.length > 0 && (
        <WorkoutBlock
          name="🧘 Enfriamiento"
          type="complex"
          exercises={workout.cooldown}
          rounds={1}
          restSeconds={0}
          onRestNeeded={handleStartTimer}
        />
      )}

      {/* Rest Timer Modal */}
      {activeTimer && (
        <RestTimer
          initialSeconds={activeTimer.restSeconds}
          blockName={activeTimer.blockName}
          onDone={handleTimerDone}
        />
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Guardar Entrenamiento</h3>
            <div className="form-control mb-4">
              <label className="label" htmlFor="workout-name">
                <span className="label-text">Nombre del entrenamiento</span>
              </label>
              <input
                id="workout-name"
                type="text"
                className="input w-full"
                placeholder="Ej: Mi Rutina de Empuje Favorita"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                autoFocus
              />
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowSaveModal(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!saveName.trim()}
              >
                Guardar
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowSaveModal(false);
            }}
            onClick={() => setShowSaveModal(false)}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
          />
        </dialog>
      )}
    </div>
  );
}
