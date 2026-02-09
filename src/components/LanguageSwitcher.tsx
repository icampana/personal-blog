import { useEffect, useState } from 'react';
import type { Locale } from '../utils/i18n';

interface LanguageSwitcherProps {
  availableLanguages?: Locale[];
  currentLocale?: Locale;
}

export default function LanguageSwitcher({
  availableLanguages = ['es', 'en', 'pt'],
  currentLocale,
}: LanguageSwitcherProps) {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/(en|pt)\//);
    setLocale((match?.[1] as Locale) || 'es');
  }, []);

  const switchLanguage = (targetLocale: Locale) => {
    const path = window.location.pathname;
    let newPath: string;

    // Remove current locale prefix if present
    const pathWithoutLocale = path.replace(/^\/(en|pt)/, '');

    if (targetLocale === 'es') {
      newPath = pathWithoutLocale || '/';
    } else {
      newPath = `/${targetLocale}${pathWithoutLocale}`;
    }

    window.location.href = newPath;
  };

  return (
    <div className="flex items-center space-x-1">
      {availableLanguages.map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          className={`btn btn-ghost btn-sm mono font-medium text-xs px-2 py-1 ${
            locale === lang ? 'btn-active' : ''
          }`}
          title={
            lang === 'en' ? 'English' : lang === 'pt' ? 'Português' : 'Español'
          }
          type="button"
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
