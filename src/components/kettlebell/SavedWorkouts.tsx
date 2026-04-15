import { useState } from 'react';
import {
  deleteSavedWorkout,
  markWorkoutCompleted,
} from '../../lib/kettlebell/storage';
import type { SavedWorkout } from '../../types/kettlebell';
import { BODY_PART_LABELS, DIFFICULTY_LABELS } from '../../types/kettlebell';

interface Props {
  workouts: SavedWorkout[];
  onLoad: (workout: import('../../types/kettlebell').GeneratedWorkout) => void;
  onDelete: () => void;
}

export default function SavedWorkouts({ workouts, onLoad, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteSavedWorkout(id);
    setConfirmDelete(null);
    onDelete();
  };

  const handleComplete = (id: string) => {
    markWorkoutCompleted(id);
    onDelete(); // refresh list
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-6xl text-base-content/20 mb-4 block">
          bookmark_border
        </span>
        <h2 className="text-2xl font-bold mb-2">Mis Entrenamientos</h2>
        <p className="text-base-content/70">
          Aún no has guardado ningún entrenamiento.
        </p>
        <p className="text-base-content/50 text-sm mt-1">
          Genera un entrenamiento y guárdalo para reutilizarlo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">Mis Entrenamientos</h2>
        <p className="text-base-content/70">
          {workouts.length} entrenamiento{workouts.length !== 1 ? 's' : ''}{' '}
          guardado{workouts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-4">
        {workouts.map((sw) => (
          <div key={sw.id} className="card bg-base-200">
            <div className="card-body p-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{sw.name}</h3>
                  <p className="text-sm text-base-content/70 mt-0.5">
                    {sw.workout.title}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs btn-circle"
                    onClick={() => onLoad(sw.workout)}
                    aria-label={`Cargar ${sw.name}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      play_arrow
                    </span>
                  </button>
                  {confirmDelete === sw.id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-error btn-xs"
                        onClick={() => handleDelete(sw.id)}
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => setConfirmDelete(null)}
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs btn-circle text-error"
                      onClick={() => setConfirmDelete(sw.id)}
                      aria-label={`Eliminar ${sw.name}`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        delete
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge badge-sm">
                  {sw.workout.durationMinutes} min
                </span>
                <span className="badge badge-sm badge-outline">
                  {DIFFICULTY_LABELS[sw.workout.difficulty].label}
                </span>
                <span className="badge badge-sm badge-outline">
                  {sw.workout.totalExercises} ejercicios
                </span>
                {sw.workout.bodyParts
                  .filter((bp) => bp !== 'full_body')
                  .slice(0, 3)
                  .map((bp) => (
                    <span key={bp} className="badge badge-sm badge-primary">
                      {BODY_PART_LABELS[bp].label}
                    </span>
                  ))}
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 mt-2 text-xs text-base-content/50">
                <span>Creado: {formatDate(sw.createdAt)}</span>
                {sw.timesCompleted > 0 && (
                  <span>
                    Completado {sw.timesCompleted} vez
                    {sw.timesCompleted !== 1 ? 'es' : ''}
                  </span>
                )}
                {sw.lastCompletedAt && (
                  <span>Último: {formatDate(sw.lastCompletedAt)}</span>
                )}
              </div>

              {/* Complete button */}
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-success btn-xs"
                  onClick={() => handleComplete(sw.id)}
                >
                  <span className="material-symbols-outlined text-xs">
                    check
                  </span>
                  Marcar como Completado
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
