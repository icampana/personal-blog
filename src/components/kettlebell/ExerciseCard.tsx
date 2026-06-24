import { useState } from 'react';
import type { WorkoutExercise } from '../../types/kettlebell';

interface Props {
  workoutExercise: WorkoutExercise;
  index: number;
  completed: boolean;
  onToggle: () => void;
}

export default function ExerciseCard({
  workoutExercise,
  index,
  completed,
  onToggle,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const { exercise, reps, sets, weightLabel, side } = workoutExercise;

  const equipmentIcon = exercise.equipment === 'kettlebell' ? '🏋️' : '🔩';
  const modalityBadge =
    exercise.modality === 'ballistic'
      ? { label: 'Balístico', cls: 'badge-warning' }
      : { label: 'Fuerza', cls: 'badge-info' };

  const isPlaceholder = exercise.videoId.startsWith('PLACEHOLDER');
  const youtubeUrl = !isPlaceholder
    ? `https://www.youtube.com/watch?v=${exercise.videoId}`
    : null;
  const thumbnailUrl = !isPlaceholder
    ? `https://img.youtube.com/vi/${exercise.videoId}/mqdefault.jpg`
    : null;

  return (
    <div
      className={`card bg-base-100 border transition-all ${
        completed
          ? 'border-success/30 opacity-60'
          : 'border-base-300 hover:border-primary/30'
      }`}
    >
      <div className="card-body p-3">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            type="button"
            className={`btn btn-circle btn-sm ${
              completed ? 'btn-success' : 'btn-ghost'
            } mt-1`}
            onClick={onToggle}
            aria-label={
              completed
                ? `Desmarcar ${exercise.nameEs}`
                : `Marcar ${exercise.nameEs} como completado`
            }
          >
            <span className="material-symbols-outlined text-sm">
              {completed ? 'check' : 'radio_button_unchecked'}
            </span>
          </button>

          {/* Exercise Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-base-content/50">
                {index}.
              </span>
              <h4 className="font-semibold">
                {equipmentIcon} {exercise.nameEs}
              </h4>
              <span className={`badge badge-xs ${modalityBadge.cls}`}>
                {modalityBadge.label}
              </span>
            </div>

            {/* Sets/Reps/Weight */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {sets && (
                <span className="text-sm text-base-content/70">
                  {sets} series ×
                </span>
              )}
              <span className="text-sm font-medium">{reps} reps</span>
              <span className="text-sm text-base-content/50">·</span>
              <span className="text-sm text-primary font-medium">
                {weightLabel}
              </span>
              {side && (
                <span className="badge badge-xs badge-outline">
                  {side === 'both' ? 'ambos lados' : `lado ${side}`}
                </span>
              )}
            </div>

            {/* Primary Muscles */}
            <div className="flex flex-wrap gap-1 mt-1">
              {exercise.primaryMuscles.slice(0, 3).map((m) => (
                <span key={m} className="badge badge-xs badge-ghost">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Expand button */}
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle"
            onClick={() => setShowDetails(!showDetails)}
            aria-label={
              showDetails ? 'Ocultar detalles' : 'Ver detalles del ejercicio'
            }
          >
            <span className="material-symbols-outlined text-sm">
              {showDetails ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* Video Section — always visible */}
        {youtubeUrl && thumbnailUrl ? (
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-3 rounded-lg overflow-hidden border border-base-300 hover:border-primary transition-colors"
          >
            <div className="relative">
              <img
                src={thumbnailUrl}
                alt={`Video: ${exercise.nameEs}`}
                className="w-full h-auto"
                loading="lazy"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-white text-2xl">
                    play_arrow
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-base-200 text-xs text-base-content/70">
              <span className="material-symbols-outlined text-xs">
                play_circle
              </span>
              Ver en YouTube
            </div>
          </a>
        ) : (
          <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-base-200 rounded-lg text-xs text-base-content/50">
            <span className="material-symbols-outlined text-sm">
              videocam_off
            </span>
            <span>Video demostrativo próximamente</span>
          </div>
        )}

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-base-300 space-y-3">
            <p className="text-sm text-base-content/80">
              {exercise.description}
            </p>

            {/* Coaching Tip */}
            <div className="alert alert-warning py-2 text-sm">
              <span className="material-symbols-outlined text-sm">
                lightbulb
              </span>
              <span>{exercise.tips}</span>
            </div>

            {/* Complexity */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Complejidad:</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={`complexity-${i}`}
                    className={`w-3 h-3 rounded-sm ${
                      i < exercise.complexity ? 'bg-primary' : 'bg-base-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-base-content/50">
                ({exercise.complexity}/5)
              </span>
            </div>

            {/* Muscles */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Músculos principales:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {exercise.primaryMuscles.map((m) => (
                    <span key={m} className="badge badge-xs badge-primary">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Estabilizadores:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {exercise.secondaryMuscles.map((m) => (
                    <span key={m} className="badge badge-xs badge-ghost">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
