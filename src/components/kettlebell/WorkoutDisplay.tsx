import { useCallback, useState } from 'react';
import { exportWorkoutAsText } from '../../lib/kettlebell/export';
import { saveWorkout } from '../../lib/kettlebell/storage';
import type { GeneratedWorkout } from '../../types/kettlebell';
import CompactWorkoutView from './CompactWorkoutView';
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
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [copied, setCopied] = useState(false);
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

  const handleCopyText = useCallback(async () => {
    try {
      const text = exportWorkoutAsText(workout);
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  }, [workout]);

  const handlePrint = useCallback(() => {
    setViewMode('compact');
    setTimeout(() => {
      window.print();
    }, 150);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center no-print">
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

      {/* Control Bar: View Switcher & Export Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-base-200/80 rounded-xl border border-base-300 no-print">
        {/* View Mode Toggle */}
        <div className="join bg-base-300 p-0.5 rounded-lg">
          <button
            type="button"
            className={`join-item btn btn-xs sm:btn-sm gap-1.5 ${
              viewMode === 'detailed' ? 'btn-primary shadow-sm' : 'btn-ghost'
            }`}
            onClick={() => setViewMode('detailed')}
            aria-label="Vista detallada interactiva"
          >
            <span className="material-symbols-outlined text-sm">
              format_list_bulleted
            </span>
            <span>Detallada</span>
          </button>
          <button
            type="button"
            className={`join-item btn btn-xs sm:btn-sm gap-1.5 ${
              viewMode === 'compact' ? 'btn-primary shadow-sm' : 'btn-ghost'
            }`}
            onClick={() => setViewMode('compact')}
            aria-label="Vista resumida compacta para gimnasio o exportar"
          >
            <span className="material-symbols-outlined text-sm">
              table_rows
            </span>
            <span>Modo Gimnasio (Resumida)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy as text */}
          <button
            type="button"
            className={`btn btn-sm gap-1.5 ${
              copied ? 'btn-success' : 'btn-outline'
            }`}
            onClick={handleCopyText}
            title="Copiar rutina como texto para WhatsApp, Notas o Telegram"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          {/* Print / PDF */}
          <button
            type="button"
            className="btn btn-outline btn-sm gap-1.5"
            onClick={handlePrint}
            title="Imprimir o guardar en PDF"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Imprimir / PDF</span>
          </button>

          {/* Save Workout */}
          {!saved ? (
            <button
              type="button"
              className="btn btn-primary btn-sm gap-1.5"
              onClick={() => setShowSaveModal(true)}
            >
              <span className="material-symbols-outlined text-sm">
                bookmark_add
              </span>
              <span>Guardar</span>
            </button>
          ) : (
            <span className="btn btn-sm btn-success cursor-default gap-1.5">
              <span className="material-symbols-outlined text-sm">check</span>
              <span>Guardado</span>
            </span>
          )}

          {/* New Workout */}
          <button
            type="button"
            className="btn btn-ghost btn-sm gap-1.5"
            onClick={onNewWorkout}
            title="Generar nueva rutina"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Nueva</span>
          </button>
        </div>
      </div>

      {/* Main Content: Compact vs Detailed */}
      {viewMode === 'compact' ? (
        <CompactWorkoutView workout={workout} />
      ) : (
        <div className="space-y-6">
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
        </div>
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
