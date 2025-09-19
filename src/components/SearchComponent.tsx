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
      <span className="inline-block mr-2">
        <button
          type="button"
          className={`btn btn-square btn-ghost ${toggleSearch ? 'hidden' : 'block'}`}
          onClick={handleToggle}
          title="Buscar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>Search</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </span>

      <div className={`inline-block ${toggleSearch ? 'block' : 'hidden'}`}>
        <div className="relative">
          <input
            ref={controlRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar..."
            className="input input-bordered w-full lg:w-48 text-base-content pr-10"
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
              className="absolute right-8 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
              title="Limpiar búsqueda"
            >
              ×
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
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
    </form>
  );
};

export default SearchComponent;
