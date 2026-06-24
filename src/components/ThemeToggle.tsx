import type React from 'react';
import { useEffect, useState } from 'react';
import { themeConfig } from '../config/theme';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia(
      '(prefers-color-scheme: light)',
    ).matches;

    let initialTheme: string = themeConfig.dark; // default to dark

    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (systemPrefersLight) {
      initialTheme = themeConfig.light;
    }

    setIsDark(initialTheme === themeConfig.dark);
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? themeConfig.dark : themeConfig.light;
        setIsDark(e.matches);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? themeConfig.light : themeConfig.dark;
    const newIsDark = !isDark;

    setIsDark(newIsDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    // Add a smooth transition effect
    document.documentElement.style.transition =
      'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.documentElement.style.transition = '';
    }, 300);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <span className="material-symbols-outlined text-base-content/70">
        dark_mode
      </span>
    );
  }

  return (
    <span
      className="material-symbols-outlined text-base-content/70 cursor-pointer hover:text-base-content transition-colors"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {isDark ? 'dark_mode' : 'light_mode'}
    </span>
  );
};

export default ThemeToggle;
