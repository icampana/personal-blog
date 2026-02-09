import { useEffect, useState } from 'react';
import type { Locale } from '../utils/i18n';

interface LanguageSwitcherProps {
  availableLanguages?: Locale[];
  currentLocale?: Locale;
  translations?: Partial<Record<Locale, string>>;
}

const LANGUAGE_LABELS: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
};

const LANGUAGE_FLAGS: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇺🇸',
  pt: '🇵🇹',
};

export default function LanguageSwitcher({
  availableLanguages = ['es', 'en', 'pt'],
  currentLocale,
  translations,
}: LanguageSwitcherProps) {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    if (currentLocale) {
      setLocale(currentLocale);
      return;
    }
    const path = window.location.pathname;
    const match = path.match(/^\/(en|pt)\//);
    setLocale((match?.[1] as Locale) || 'es');
  }, [currentLocale]);

  const switchLanguage = (targetLocale: Locale) => {
    // If we have a specific translation for this page, use it
    if (translations && translations[targetLocale]) {
      window.location.href = translations[targetLocale]!;
      return;
    }

    // Fallback: Try to map the current path
    const path = window.location.pathname;
    let newPath: string;

    // Remove current locale prefix if present
    const pathWithoutLocale = path.replace(/^\/(en|pt)/, '');

    if (targetLocale === 'es') {
      newPath = pathWithoutLocale || '/';
    } else {
      // Ensure we don't double slash
      const cleanPath = pathWithoutLocale.startsWith('/')
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;
      newPath = `/${targetLocale}${cleanPath}`;
    }

    window.location.href = newPath;
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-sm mono font-medium text-xs px-2"
        title="Change Language"
      >
        <span className="mr-1 text-base">{LANGUAGE_FLAGS[locale]}</span>
        {locale.toUpperCase()}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-content/10"
      >
        {availableLanguages.map((lang) => (
          <li key={lang}>
            <button
              onClick={() => switchLanguage(lang)}
              className={`text-xs flex items-center ${locale === lang ? 'active font-bold' : ''}`}
              type="button"
            >
              <span className="mr-2 text-base">{LANGUAGE_FLAGS[lang]}</span>
              {LANGUAGE_LABELS[lang]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
