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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0a0a0c]/95 backdrop-blur-md border-t border-[#1e1e24] shadow-lg">
      <div className="max-w-7xl mx-auto">
        {!showSettings ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="mono font-bold text-lg mb-2 text-[var(--accent-neon)]">
                🍪 COOKIES_SETTINGS
              </h3>
              <p className="text-sm text-zinc-400">
                We use cookies to improve your experience. Analytics cookies
                help us understand how visitors interact with the site (Google
                Analytics). You can choose which cookies to accept.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={openSettings}
                className="mono text-xs font-bold bg-[var(--bg-panel)] text-zinc-300 hover:text-[var(--accent-neon)] border border-[var(--border-panel)] px-4 py-2 rounded transition-colors"
              >
                SETTINGS
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="mono text-xs font-bold bg-[var(--bg-panel)] text-zinc-300 hover:text-white border border-[var(--border-panel)] px-4 py-2 rounded transition-colors"
              >
                REJECT_ALL
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="mono text-xs font-bold bg-[var(--accent-neon)] text-black hover:opacity-90 px-4 py-2 rounded transition-opacity"
              >
                ACCEPT_ALL
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="mono font-bold text-lg text-zinc-200">
                COOKIE_CONFIGURATION
              </h3>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="material-symbols-outlined text-zinc-400 hover:text-white cursor-pointer transition-colors"
              >
                close
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-start cursor-pointer gap-4 p-3 bg-[var(--bg-panel)] border border-[var(--border-panel)] rounded-lg hover:border-[var(--accent-neon)] transition-colors">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="sr-only"
                />
                <div className="flex-1">
                  <span className="mono font-bold text-white">
                    ESSENTIAL_COOKIES
                  </span>
                  <p className="text-xs text-zinc-400 mt-1">
                    Necessary for the basic site functionality. Cannot be
                    deactivated.
                  </p>
                </div>
              </label>

              <label className="flex items-start cursor-pointer gap-4 p-3 bg-[var(--bg-panel)] border border-[var(--border-panel)] rounded-lg hover:border-[var(--accent-neon)] transition-colors">
                <input
                  type="checkbox"
                  id="analytics-checkbox"
                  defaultChecked={false}
                  className="sr-only"
                />
                <div className="flex-1">
                  <span className="mono font-bold text-white">
                    ANALYTICS_COOKIES
                  </span>
                  <p className="text-xs text-zinc-400 mt-1">
                    Help us understand how visitors interact with the site
                    (Google Analytics).
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={rejectAll}
                className="mono text-xs font-bold bg-[var(--bg-panel)] text-zinc-300 hover:text-white border border-[var(--border-panel)] px-4 py-2 rounded transition-colors"
              >
                REJECT_ALL
              </button>
              <button
                type="button"
                onClick={() => {
                  const analyticsCheckbox = document.getElementById(
                    'analytics-checkbox',
                  ) as HTMLInputElement;
                  saveConsent(analyticsCheckbox?.checked || false);
                }}
                className="mono text-xs font-bold bg-[var(--accent-neon)] text-black hover:opacity-90 px-4 py-2 rounded transition-opacity"
              >
                SAVE_PREFERENCES
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
