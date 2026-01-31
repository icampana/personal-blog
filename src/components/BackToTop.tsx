import type React from 'react';
import { useEffect, useState } from 'react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      className={`fixed bottom-5 right-5 material-symbols-outlined text-base-content/70 hover:text-[var(--accent-neon)] cursor-pointer transition-colors text-2xl bg-[var(--bg-panel)] border border-[var(--border-panel)] rounded-full p-2 shadow-lg z-40 transition-all duration-300 hover:bg-[var(--accent-neon)] hover:text-black ${
        isVisible
          ? 'opacity-100'
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      {isVisible ? 'keyboard_double_arrow_up' : 'keyboard_double_arrow_down'}
    </button>
  );
};

export default BackToTop;
