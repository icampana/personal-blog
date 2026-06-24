import { useCallback, useState } from 'react';
import { loadEquipment, loadSavedWorkouts } from '../../lib/kettlebell/storage';
import { generateWorkout } from '../../lib/kettlebell/workout-generator';
import type {
  BodyPart,
  Difficulty,
  EquipmentProfile,
  GeneratedWorkout,
  SavedWorkout,
  WorkoutType,
} from '../../types/kettlebell';
import { DEFAULT_EQUIPMENT } from '../../types/kettlebell';
import BodyPartSelector from './BodyPartSelector';
import EquipmentSetup from './EquipmentSetup';
import SavedWorkouts from './SavedWorkouts';
import WorkoutConfigurator from './WorkoutConfigurator';
import WorkoutDisplay from './WorkoutDisplay';

type Step = 'equipment' | 'bodyparts' | 'configure' | 'workout' | 'saved';

export default function KettlebellTrainer() {
  const [step, setStep] = useState<Step>('equipment');
  const [equipment, setEquipment] = useState<EquipmentProfile>(
    loadEquipment() ?? { ...DEFAULT_EQUIPMENT },
  );
  const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [duration, setDuration] = useState<number>(30);
  const [workoutType, setWorkoutType] = useState<WorkoutType>('complex');
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>(
    loadSavedWorkouts(),
  );

  const handleEquipmentSave = useCallback((eq: EquipmentProfile) => {
    setEquipment(eq);
    setStep('bodyparts');
  }, []);

  const handleBodyPartsNext = useCallback(() => {
    setStep('configure');
  }, []);

  const handleGenerate = useCallback(() => {
    const generated = generateWorkout({
      equipment,
      bodyParts: bodyParts.length > 0 ? bodyParts : ['full_body' as BodyPart],
      difficulty,
      durationMinutes: duration,
      workoutType,
    });
    setWorkout(generated);
    setStep('workout');
  }, [equipment, bodyParts, difficulty, duration, workoutType]);

  const handleBack = useCallback(() => {
    const steps: Step[] = [
      'equipment',
      'bodyparts',
      'configure',
      'workout',
      'saved',
    ];
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]!);
  }, [step]);

  const handleNewWorkout = useCallback(() => {
    setWorkout(null);
    setStep('bodyparts');
  }, []);

  const handleShowSaved = useCallback(() => {
    setSavedWorkouts(loadSavedWorkouts());
    setStep('saved');
  }, []);

  const handleLoadWorkout = useCallback((w: GeneratedWorkout) => {
    setWorkout(w);
    setStep('workout');
  }, []);

  const handleDeleteSaved = useCallback(() => {
    setSavedWorkouts(loadSavedWorkouts());
  }, []);

  const handleWorkoutSaved = useCallback(() => {
    setSavedWorkouts(loadSavedWorkouts());
  }, []);

  const steps: { key: Step; label: string; icon: string }[] = [
    { key: 'equipment', label: 'Equipamiento', icon: 'fitness_center' },
    { key: 'bodyparts', label: 'Zonas', icon: 'accessibility_new' },
    { key: 'configure', label: 'Configurar', icon: 'tune' },
    { key: 'workout', label: 'Entrenamiento', icon: 'directions_run' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          🏋️ Entrenador de Pesas Rusas
        </h1>
        <p className="text-base-content/70 text-lg">
          Genera entrenamientos personalizados con pesas rusas y mancuernas
        </p>
      </div>

      {/* Navigation Tabs (visible when not on saved page) */}
      {step !== 'saved' && (
        <div className="flex items-center justify-between mb-6 bg-base-200 rounded-lg p-2">
          {steps.map((s) => {
            const isActive = s.key === step;
            const isPast =
              steps.indexOf(steps.find((x) => x.key === step)!) >
              steps.indexOf(s);
            return (
              <button
                key={s.key}
                type="button"
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-content'
                    : isPast
                      ? 'text-primary cursor-pointer hover:bg-base-300'
                      : 'text-base-content/50'
                }`}
                onClick={() => {
                  if (isPast) setStep(s.key);
                }}
              >
                <span className="material-symbols-outlined text-lg">
                  {s.icon}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mb-6">
        {step !== 'equipment' && step !== 'saved' && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={handleBack}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Atrás
          </button>
        )}
        {step !== 'saved' && (
          <button
            type="button"
            className="btn btn-ghost btn-sm ml-auto"
            onClick={handleShowSaved}
          >
            <span className="material-symbols-outlined">bookmark</span>
            Mis Entrenamientos
            {savedWorkouts.length > 0 && (
              <span className="badge badge-primary badge-sm">
                {savedWorkouts.length}
              </span>
            )}
          </button>
        )}
        {step === 'saved' && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setStep(workout ? 'workout' : 'equipment')}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Volver
          </button>
        )}
      </div>

      {/* Step Content */}
      {step === 'equipment' && (
        <EquipmentSetup initial={equipment} onSave={handleEquipmentSave} />
      )}

      {step === 'bodyparts' && (
        <BodyPartSelector
          selected={bodyParts}
          onChange={setBodyParts}
          onNext={handleBodyPartsNext}
        />
      )}

      {step === 'configure' && (
        <WorkoutConfigurator
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          duration={duration}
          onDurationChange={setDuration}
          workoutType={workoutType}
          onWorkoutTypeChange={setWorkoutType}
          onGenerate={handleGenerate}
        />
      )}

      {step === 'workout' && workout && (
        <WorkoutDisplay
          workout={workout}
          onNewWorkout={handleNewWorkout}
          onSaved={handleWorkoutSaved}
        />
      )}

      {step === 'saved' && (
        <SavedWorkouts
          workouts={savedWorkouts}
          onLoad={handleLoadWorkout}
          onDelete={handleDeleteSaved}
        />
      )}
    </div>
  );
}
