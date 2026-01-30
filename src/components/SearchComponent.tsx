import type React from 'react';
import { useEffect, useRef, useState } from 'react';

const SearchComponent: React.FC = () => {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const controlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get current search query from URL if we're on the search page
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q') || '';
      setSearchQuery(query);

      // Show search input if there's a query or we're on search page
      if (query || window.location.pathname === '/search') {
        setToggleSearch(true);
      }
    }
  }, []);

  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    setToggleSearch(!toggleSearch);
    if (controlRef.current) {
      controlRef.current.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setToggleSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="leading-none inline-block">
      {!toggleSearch && (
        <span className="inline-block mr-2">
          <button
            type="button"
            data-testid="search-icon"
            className="material-symbols-outlined text-zinc-400 cursor-pointer hover:text-white"
            onClick={handleToggle}
            title="Buscar"
          >
            terminal
          </button>
        </span>
      )}

      {toggleSearch && (
        <div className="inline-block">
          <div className="relative">
            <input
              ref={controlRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar..."
              className="bg-[#111114] border border-[#1e1e24] text-white px-3 py-2 rounded-lg w-full lg:w-48 focus:outline-none focus:ring-1 focus:ring-[var(--accent-neon)]"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  if (controlRef.current) {
                    controlRef.current.focus();
                  }
                }}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                title="Limpiar búsqueda"
              >
                ×
              </button>
            )}

            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
              title="Buscar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchComponent;
