import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  initialSeconds: number;
  blockName: string;
  onDone: () => void;
}

export default function RestTimer({
  initialSeconds,
  blockName,
  onDone,
}: Props) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(true);
  const [paused, setPaused] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio API beep
  const playBeep = useCallback((frequency = 880, duration = 0.3) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported - silent fallback
    }
  }, []);

  // Play 3-second warning beeps
  useEffect(() => {
    if (seconds === 3 && running) {
      playBeep(660, 0.15);
    }
    if (seconds === 2 && running) {
      playBeep(660, 0.15);
    }
    if (seconds === 1 && running) {
      playBeep(660, 0.15);
    }
  }, [seconds, running, playBeep]);

  // Timer logic
  useEffect(() => {
    if (!running || paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, paused]);

  // Handle timer completion
  useEffect(() => {
    if (seconds === 0 && running) {
      playBeep(880, 0.5);
      setTimeout(() => playBeep(1100, 0.5), 300);
      setTimeout(() => playBeep(1320, 0.8), 600);
      setRunning(false);
    }
  }, [seconds, running, playBeep]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = ((initialSeconds - seconds) / initialSeconds) * 100;
  const circumference = 2 * Math.PI * 54; // radius 54
  const dashOffset = circumference - (progress / 100) * circumference;

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-base-100 border-2 border-primary shadow-2xl rounded-2xl p-3 flex items-center gap-3 no-print">
        <div className="flex flex-col">
          <span className="text-xs text-base-content/70 font-medium">
            ⏱️ {blockName}
          </span>
          <span
            className={`text-xl font-mono font-bold ${
              seconds <= 5 ? 'text-error' : 'text-primary'
            }`}
          >
            {formatTime(seconds)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {seconds === 0 ? (
            <button
              type="button"
              className="btn btn-xs btn-primary"
              onClick={onDone}
            >
              Listo
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-xs btn-circle btn-ghost"
                onClick={() => setPaused(!paused)}
                aria-label={paused ? 'Reanudar' : 'Pausar'}
              >
                <span className="material-symbols-outlined text-sm">
                  {paused ? 'play_arrow' : 'pause'}
                </span>
              </button>
              <button
                type="button"
                className="btn btn-xs btn-circle btn-ghost"
                onClick={() => {
                  setSeconds(0);
                  setRunning(false);
                }}
                aria-label="Saltar descanso"
              >
                <span className="material-symbols-outlined text-sm">
                  skip_next
                </span>
              </button>
            </>
          )}
          <button
            type="button"
            className="btn btn-xs btn-circle btn-ghost"
            onClick={() => setMinimized(false)}
            aria-label="Maximizar temporizador"
            title="Maximizar temporizador"
          >
            <span className="material-symbols-outlined text-sm">
              open_in_full
            </span>
          </button>
          <button
            type="button"
            className="btn btn-xs btn-circle btn-ghost"
            onClick={onDone}
            aria-label="Cerrar temporizador"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 no-print">
      <div className="card bg-base-100 shadow-2xl w-80">
        <div className="card-body items-center text-center p-6">
          <h3 className="text-lg font-bold mb-1">⏱️ Descanso</h3>
          <p className="text-sm text-base-content/70 mb-4">{blockName}</p>

          {/* Circular Timer */}
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                className="stroke-base-300"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                className={`stroke-${seconds <= 5 ? 'error' : 'primary'}`}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-3xl font-mono font-bold ${
                  seconds <= 5 ? 'text-error' : ''
                }`}
              >
                {formatTime(seconds)}
              </span>
            </div>
          </div>

          {seconds === 0 ? (
            <div className="space-y-3">
              <p className="text-success font-bold text-lg">¡Tiempo! 💪</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onDone}
              >
                <span className="material-symbols-outlined">play_arrow</span>
                Continuar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-circle"
                onClick={() => setPaused(!paused)}
                aria-label={paused ? 'Reanudar' : 'Pausar'}
              >
                <span className="material-symbols-outlined">
                  {paused ? 'play_arrow' : 'pause'}
                </span>
              </button>
              <button
                type="button"
                className="btn btn-circle"
                onClick={() => {
                  setSeconds(0);
                  setRunning(false);
                }}
                aria-label="Saltar descanso"
              >
                <span className="material-symbols-outlined">skip_next</span>
              </button>
              <button
                type="button"
                className="btn btn-circle btn-ghost"
                onClick={() => setMinimized(true)}
                title="Minimizar (ver ejercicios)"
                aria-label="Minimizar temporizador"
              >
                <span className="material-symbols-outlined">
                  close_fullscreen
                </span>
              </button>
              <button
                type="button"
                className="btn btn-circle btn-ghost"
                onClick={onDone}
                aria-label="Cerrar temporizador"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          {/* Extra time buttons */}
          {seconds > 0 && running && (
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                className="btn btn-xs btn-ghost"
                onClick={() => setSeconds((s) => s + 15)}
              >
                +15s
              </button>
              <button
                type="button"
                className="btn btn-xs btn-ghost"
                onClick={() => setSeconds((s) => s + 30)}
              >
                +30s
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
