import type { BodyPart } from '../../types/kettlebell';
import { BODY_PART_LABELS } from '../../types/kettlebell';

interface Props {
  selected: BodyPart[];
  onChange: (parts: BodyPart[]) => void;
  onNext: () => void;
}

const ALL_BODY_PARTS: BodyPart[] = [
  'full_body',
  'push',
  'pull',
  'legs',
  'core',
  'posterior',
];

export default function BodyPartSelector({
  selected,
  onChange,
  onNext,
}: Props) {
  const toggle = (bp: BodyPart) => {
    if (bp === 'full_body') {
      // Toggle full body on = deselect everything else
      onChange(selected.includes('full_body') ? [] : ['full_body']);
      return;
    }

    // Remove full_body if selecting specific parts
    const without = selected.filter((s) => s !== 'full_body' && s !== bp);
    const isAdding = !selected.includes(bp);
    onChange(isAdding ? [...without, bp] : without);
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">
          Seleccionar Zonas a Trabajar
        </h2>
        <p className="text-base-content/70">
          Elige las zonas musculares que quieres enfocar en tu entrenamiento
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_BODY_PARTS.map((bp) => {
          const info = BODY_PART_LABELS[bp];
          const isSelected = selected.includes(bp);

          return (
            <button
              key={bp}
              type="button"
              className={`card transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary text-primary-content shadow-lg scale-[1.02]'
                  : 'bg-base-200 hover:bg-base-300'
              }`}
              onClick={() => toggle(bp)}
            >
              <div className="card-body items-center text-center p-5">
                <span
                  className={`material-symbols-outlined text-4xl mb-2 ${
                    isSelected ? 'text-primary-content' : 'text-primary'
                  }`}
                >
                  {info.icon}
                </span>
                <h3 className="font-bold text-lg">{info.label}</h3>
                <p
                  className={`text-sm ${
                    isSelected
                      ? 'text-primary-content/80'
                      : 'text-base-content/60'
                  }`}
                >
                  {info.description}
                </p>
                {isSelected && (
                  <span className="material-symbols-outlined text-primary-content mt-1">
                    check_circle
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection summary */}
      {hasSelection && (
        <div className="alert bg-primary/10 border border-primary/20">
          <span className="material-symbols-outlined text-primary">info</span>
          <span>
            <strong>Zonas seleccionadas:</strong>{' '}
            {selected.map((bp) => BODY_PART_LABELS[bp].label).join(', ')}
          </span>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={onNext}
          disabled={!hasSelection}
        >
          Configurar Entrenamiento
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
