import type { Difficulty, WorkoutType } from '../../types/kettlebell';
import { DIFFICULTY_LABELS, WORKOUT_TYPE_LABELS } from '../../types/kettlebell';

interface Props {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  duration: number;
  onDurationChange: (d: number) => void;
  workoutType: WorkoutType;
  onWorkoutTypeChange: (t: WorkoutType) => void;
  onGenerate: () => void;
}

const DURATIONS = [15, 30, 45];
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
const WORKOUT_TYPES: WorkoutType[] = ['complex', 'chain', 'flow'];

export default function WorkoutConfigurator({
  difficulty,
  onDifficultyChange,
  duration,
  onDurationChange,
  workoutType,
  onWorkoutTypeChange,
  onGenerate,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">Configurar Entrenamiento</h2>
        <p className="text-base-content/70">
          Ajusta la dificultad, duración y tipo de entrenamiento
        </p>
      </div>

      {/* Duration */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">
            <span className="material-symbols-outlined">timer</span>
            Duración
          </h3>
          <div className="flex gap-3">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                className={`btn flex-1 ${
                  duration === d ? 'btn-primary' : 'btn-ghost bg-base-100'
                }`}
                onClick={() => onDurationChange(d)}
              >
                <span className="text-2xl font-bold">{d}</span>
                <span className="text-sm">min</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">
            <span className="material-symbols-outlined">speed</span>
            Dificultad
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DIFFICULTIES.map((d) => {
              const info = DIFFICULTY_LABELS[d];
              const isActive = difficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  className={`card transition-all ${
                    isActive
                      ? 'bg-primary text-primary-content shadow-lg'
                      : 'bg-base-100 hover:bg-base-300'
                  }`}
                  onClick={() => onDifficultyChange(d)}
                >
                  <div className="card-body items-center text-center p-4">
                    <h4 className="font-bold">{info.label}</h4>
                    <p
                      className={`text-xs ${
                        isActive
                          ? 'text-primary-content/80'
                          : 'text-base-content/60'
                      }`}
                    >
                      {info.description}
                    </p>
                    {isActive && (
                      <span className="material-symbols-outlined text-primary-content text-sm mt-1">
                        check_circle
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Workout Type */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">
            <span className="material-symbols-outlined">category</span>
            Tipo de Entrenamiento
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {WORKOUT_TYPES.map((t) => {
              const info = WORKOUT_TYPE_LABELS[t];
              const isActive = workoutType === t;
              const icons: Record<WorkoutType, string> = {
                complex: 'format_list_numbered',
                chain: 'link',
                flow: 'water',
              };
              return (
                <button
                  key={t}
                  type="button"
                  className={`card transition-all ${
                    isActive
                      ? 'bg-primary text-primary-content shadow-lg'
                      : 'bg-base-100 hover:bg-base-300'
                  }`}
                  onClick={() => onWorkoutTypeChange(t)}
                >
                  <div className="card-body items-center text-center p-4">
                    <span className="material-symbols-outlined text-3xl mb-1">
                      {icons[t]}
                    </span>
                    <h4 className="font-bold">{info.label}</h4>
                    <p
                      className={`text-xs ${
                        isActive
                          ? 'text-primary-content/80'
                          : 'text-base-content/60'
                      }`}
                    >
                      {info.description}
                    </p>
                    {isActive && (
                      <span className="material-symbols-outlined text-primary-content text-sm mt-1">
                        check_circle
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          type="button"
          className="btn btn-primary btn-lg gap-2 text-lg"
          onClick={onGenerate}
        >
          <span className="material-symbols-outlined">play_arrow</span>
          Generar Entrenamiento
        </button>
      </div>
    </div>
  );
}
