import { useState } from 'react';
import type { EquipmentProfile } from '../../types/kettlebell';

interface Props {
  initial: EquipmentProfile;
  onSave: (equipment: EquipmentProfile) => void;
}

export default function EquipmentSetup({ initial, onSave }: Props) {
  const [kb, setKb] = useState({ ...initial.kettlebells });
  const [db, setDb] = useState({ ...initial.dumbbells });

  const handleSave = () => {
    onSave({ kettlebells: kb, dumbbells: db });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-1">Configurar Equipamiento</h2>
        <p className="text-base-content/70">
          Ingresa los pesos de tus pesas rusas y mancuernas
        </p>
      </div>

      {/* Kettlebells */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">
            <span className="material-symbols-outlined">fitness_center</span>
            Pesas Rusas (3 pesas)
          </h3>
          <p className="text-sm text-base-content/60 mb-4">
            Selecciona el peso de cada pesa rusa. La ligera para ejercicios de
            técnica, la media como peso de trabajo, y la pesada para fuerza.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="kb-light">
                <span className="label-text font-medium">🎯 Ligera</span>
              </label>
              <div className="join">
                <input
                  id="kb-light"
                  type="number"
                  className="input join-item w-full"
                  min={2}
                  max={48}
                  step={2}
                  value={kb.light}
                  onChange={(e) =>
                    setKb({ ...kb, light: Number(e.target.value) })
                  }
                />
                <span className="join-item flex items-center px-3 bg-base-300 text-sm">
                  kg
                </span>
              </div>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="kb-medium">
                <span className="label-text font-medium">💪 Media</span>
              </label>
              <div className="join">
                <input
                  id="kb-medium"
                  type="number"
                  className="input join-item w-full"
                  min={4}
                  max={56}
                  step={2}
                  value={kb.medium}
                  onChange={(e) =>
                    setKb({ ...kb, medium: Number(e.target.value) })
                  }
                />
                <span className="join-item flex items-center px-3 bg-base-300 text-sm">
                  kg
                </span>
              </div>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="kb-heavy">
                <span className="label-text font-medium">🏋️ Pesada</span>
              </label>
              <div className="join">
                <input
                  id="kb-heavy"
                  type="number"
                  className="input join-item w-full"
                  min={6}
                  max={64}
                  step={2}
                  value={kb.heavy}
                  onChange={(e) =>
                    setKb({ ...kb, heavy: Number(e.target.value) })
                  }
                />
                <span className="join-item flex items-center px-3 bg-base-300 text-sm">
                  kg
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dumbbells */}
      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">
            <span className="material-symbols-outlined">
              signal_cellular_alt
            </span>
            Mancuernas (2 pares, opcional)
          </h3>
          <p className="text-sm text-base-content/60 mb-4">
            Las mancuernas complementan el trabajo para pecho, brazos y
            pantorrillas. Déjalas en 0 si no tienes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label" htmlFor="db-set1">
                <span className="label-text font-medium">Par 1 (ligero)</span>
              </label>
              <div className="join">
                <input
                  id="db-set1"
                  type="number"
                  className="input join-item w-full"
                  min={0}
                  max={50}
                  step={1}
                  value={db.set1}
                  onChange={(e) =>
                    setDb({ ...db, set1: Number(e.target.value) })
                  }
                  placeholder="0"
                />
                <span className="join-item flex items-center px-3 bg-base-300 text-sm">
                  kg c/u
                </span>
              </div>
            </div>

            <div className="form-control">
              <label className="label" htmlFor="db-set2">
                <span className="label-text font-medium">Par 2 (pesado)</span>
              </label>
              <div className="join">
                <input
                  id="db-set2"
                  type="number"
                  className="input join-item w-full"
                  min={0}
                  max={50}
                  step={1}
                  value={db.set2}
                  onChange={(e) =>
                    setDb({ ...db, set2: Number(e.target.value) })
                  }
                  placeholder="0"
                />
                <span className="join-item flex items-center px-3 bg-base-300 text-sm">
                  kg c/u
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary & Save */}
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="font-semibold mb-2">Resumen de tu equipamiento:</h3>
          <div className="flex flex-wrap gap-2">
            <div className="badge badge-lg">🎯 Ligera: {kb.light} kg</div>
            <div className="badge badge-lg">💪 Media: {kb.medium} kg</div>
            <div className="badge badge-lg">🏋️ Pesada: {kb.heavy} kg</div>
            {db.set1 > 0 && (
              <div className="badge badge-lg badge-outline">
                🔩 Mancuernas: {db.set1} kg /{' '}
                {db.set2 > 0 ? `${db.set2} kg` : '—'}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={handleSave}
          disabled={kb.light >= kb.medium || kb.medium >= kb.heavy}
        >
          Continuar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      {/* Validation hint */}
      {(kb.light >= kb.medium || kb.medium >= kb.heavy) && (
        <div className="alert alert-warning">
          <span className="material-symbols-outlined">warning</span>
          <span>
            La pesa ligera debe ser menor que la media, y la media menor que la
            pesada.
          </span>
        </div>
      )}
    </div>
  );
}
