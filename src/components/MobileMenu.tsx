import { useState } from 'react';

interface MobileMenuProps {
  menuItems: Array<{ url: string; title: string }>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      {/* Hamburger menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="material-symbols-outlined text-base-content/70 hover:text-[var(--accent-neon)] cursor-pointer transition-colors text-xl"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? 'close' : 'menu'}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 right-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Menu panel */}
          <div className="fixed top-16 left-0 right-0 w-full max-w-7xl mx-auto px-6 py-4">
            <div className="bg-[var(--bg-panel)] border border-[var(--border-panel)] rounded-lg p-4 shadow-xl space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  className="block mono text-sm font-medium text-base-content hover:text-[var(--accent-neon)] transition-colors px-4 py-3 hover:bg-[var(--bg-main)] rounded"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
