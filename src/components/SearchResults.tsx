import React, { useEffect, useState } from 'react';
import Fuse, { type FuseIndex } from 'fuse.js';
import { formatDate } from '../utils';

type SearchResult = {
  title: string;
  url: string;
  type: string;
  date: string;
  summary: string;
  tags?: string[];
};

const fuseOptions = {
  keys: ['title', 'summary', 'content'],
  minMatchCharLength: 2,
  threshold: 0.3,
};

const SearchResults: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [posts, setPosts] = useState<SearchResult[]>([]);
  const [articlesIndex, setArticlesIndex] = useState<FuseIndex<SearchResult>>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);

    async function fetchSearchIndex() {
      try {
        const response = await fetch('/search-index.json');
        const data = await response.json();
        const articlesIndex: FuseIndex<SearchResult> = Fuse.parseIndex(data);
        setArticlesIndex(articlesIndex);
      } catch (error) {
        console.error('Error loading search index:', error);
      }
    }

    async function fetchPosts() {
      try {
        const response = await fetch('/search-posts.json');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    }

    Promise.all([fetchSearchIndex(), fetchPosts()]).then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded || !articlesIndex) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="loading loading-spinner loading-lg"></div>
        <span className="ml-2">Cargando índice de búsqueda...</span>
      </div>
    );
  }

  // Initialize Fuse with the index
  const fuse = new Fuse(posts, fuseOptions, articlesIndex);
  const searchResults = searchQuery ? fuse.search(searchQuery) : [];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post': return 'Artículo';
      case 'page': return 'Página';
      case 'project': return 'Proyecto';
      default: return type;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClass = "badge badge-sm";
    switch (type) {
      case 'post': return `${baseClass} badge-primary`;
      case 'page': return `${baseClass} badge-secondary`;
      case 'project': return `${baseClass} badge-accent`;
      default: return `${baseClass} badge-outline`;
    }
  };

  return (
    <div className="mx-auto">
      {!searchQuery && (
        <div className="text-center py-8">
          <p className="text-lg text-base-content/70">
            Por favor escribe el texto a buscar en la barra de navegación
          </p>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-base-content/70 mb-4">
            No se encontró ningún resultado para "<strong>{searchQuery}</strong>"
          </p>
          <p className="text-sm text-base-content/60">
            Intenta con términos diferentes o más generales
          </p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-base-content/70">
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "<strong>{searchQuery}</strong>"
            </p>
          </div>

          <div className="space-y-4">
            {searchResults.map(({ item }, idx) => {
              const result = item as SearchResult;
              return (
                <div key={`${result.url}-${idx}`} className="card bg-base-100 shadow-sm border border-base-300">
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="card-title text-lg mb-2">
                          <a href={result.url} className="link link-primary hover:link-hover">
                            {result.title}
                          </a>
                        </h3>

                        <p className="text-sm text-base-content/70 mb-3">
                          {result.summary}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-base-content/60">
                          <span className={getTypeBadge(result.type)}>
                            {getTypeLabel(result.type)}
                          </span>

                          <time className="capitalize">
                            {formatDate(new Date(result.date))}
                          </time>

                          {result.tags && result.tags.length > 0 && (
                            <div className="flex gap-1">
                              {result.tags.slice(0, 3).map((tag, tagIdx) => (
                                <span key={tagIdx} className="badge badge-outline badge-xs">
                                  {tag}
                                </span>
                              ))}
                              {result.tags.length > 3 && (
                                <span className="text-xs text-base-content/50">
                                  +{result.tags.length - 3} más
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;