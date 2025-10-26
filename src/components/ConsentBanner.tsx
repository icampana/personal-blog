import { useEffect, useState } from 'react';

interface ConsentPreferences {
  analytics: boolean;
  timestamp: number;
}

const CONSENT_KEY = 'gdpr-consent-preferences';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      // Apply saved preferences
      applyConsent(JSON.parse(savedConsent));
    }
  }, []);

  const applyConsent = (preferences: ConsentPreferences) => {
    if (preferences.analytics) {
      loadGoogleAnalytics();
    }
  };

  const loadGoogleAnalytics = () => {
    // Load Google Analytics
    if (!window.dataLayer) {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=UA-275823-1';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          window.dataLayer.push(args);
        }
        gtag('js', new Date());
        gtag('config', 'UA-275823-1', {
          anonymize_ip: true,
          cookie_flags: 'SameSite=None;Secure',
        });
      };
    }
  };

  const saveConsent = (analytics: boolean) => {
    const preferences: ConsentPreferences = {
      analytics,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(preferences));
    applyConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    saveConsent(true);
  };

  const rejectAll = () => {
    saveConsent(false);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-base-200 shadow-lg border-t border-base-300">
      <div className="container mx-auto max-w-6xl">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">
                🍪 Cookies y Privacidad
              </h3>
              <p className="text-sm">
                Utilizamos cookies para mejorar tu experiencia. Las cookies
                analíticas nos ayudan a entender cómo se usa el sitio. Puedes
                elegir qué cookies aceptar.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={openSettings}
                className="btn btn-sm btn-ghost"
              >
                Configurar
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="btn btn-sm btn-outline"
              >
                Rechazar todo
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="btn btn-sm btn-primary"
              >
                Aceptar todo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Configuración de Cookies</h3>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-start cursor-pointer gap-4 p-2">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="checkbox checkbox-primary"
                />
                <div className="flex-1">
                  <span className="font-bold">Cookies Esenciales</span>
                  <p className="text-xs text-base-content/70 mt-1">
                    Necesarias para el funcionamiento básico del sitio. No se
                    pueden desactivar.
                  </p>
                </div>
              </label>

              <label className="flex items-start cursor-pointer gap-4 p-2">
                <input
                  type="checkbox"
                  id="analytics-checkbox"
                  defaultChecked={false}
                  className="checkbox checkbox-primary"
                />
                <div className="flex-1">
                  <span className="font-bold">Cookies Analíticas</span>
                  <p className="text-xs text-base-content/70 mt-1">
                    Nos ayudan a entender cómo los visitantes interactúan con el
                    sitio (Google Analytics).
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={rejectAll}
                className="btn btn-sm btn-outline"
              >
                Rechazar todo
              </button>
              <button
                type="button"
                onClick={() => {
                  const analyticsCheckbox = document.getElementById(
                    'analytics-checkbox',
                  ) as HTMLInputElement;
                  saveConsent(analyticsCheckbox?.checked || false);
                }}
                className="btn btn-sm btn-primary"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export function to revoke consent (can be used from settings page)
export function revokeConsent() {
  localStorage.removeItem(CONSENT_KEY);
  window.location.reload();
}

// Export function to get current consent status
export function getConsentStatus(): ConsentPreferences | null {
  const saved = localStorage.getItem(CONSENT_KEY);
  return saved ? JSON.parse(saved) : null;
}
