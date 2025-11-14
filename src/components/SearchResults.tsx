import { Document } from 'flexsearch';
import type React from 'react';
import { useEffect, useState } from 'react';
import { formatDate } from '../utils/client';

type SearchResult = {
  id: number;
  title: string;
  url: string;
  type: string;
  date: string;
  summary: string;
  tags?: string[];
};

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <div className="loading loading-spinner loading-lg"></div>
    <span className="ml-2">Cargando índice de búsqueda...</span>
  </div>
);

const SearchResults: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [posts, setPosts] = useState<SearchResult[]>([]);
  const [searchIndex, setSearchIndex] = useState<any>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);

    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);

    async function fetchSearchIndex() {
      try {
        const response = await fetch('/search-index.json');
        const data = await response.json();

        // Import FlexSearch index
        const index = new Document({
          document: {
            id: 'id',
            index: ['title', 'summary', 'content'],
            store: ['title', 'url', 'type', 'date', 'summary', 'tags'],
          },
          tokenize: 'forward',
          resolution: 9,
        });

        for (const key in data) {
          await index.import(key, data[key]);
        }
        setSearchIndex(index);
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <LoadingIndicator />;
  }

  if (!loaded || !searchIndex) {
    return <LoadingIndicator />;
  }

  // Perform search with FlexSearch
  const searchResults = searchQuery
    ? searchIndex.search(searchQuery, { enrich: true })
    : [];

  // Flatten and deduplicate results by id
  const allResults: any[] = searchResults.flatMap(
    ({ result }: { result: any[] }) => result || [],
  );
  const uniqueResults: any[] = Array.from(
    new Map(allResults.map((item: any) => [item.id, item])).values(),
  );

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post':
        return 'Artículo';
      case 'page':
        return 'Página';
      case 'project':
        return 'Proyecto';
      default:
        return type;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClass = 'badge badge-sm';
    switch (type) {
      case 'post':
        return `${baseClass} badge-primary`;
      case 'page':
        return `${baseClass} badge-secondary`;
      case 'project':
        return `${baseClass} badge-accent`;
      default:
        return `${baseClass} badge-outline`;
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

      {searchQuery && uniqueResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-base-content/70 mb-4">
            No se encontró ningún resultado para "<strong>{searchQuery}</strong>
            "
          </p>
          <p className="text-sm text-base-content/60">
            Intenta con términos diferentes o más generales
          </p>
        </div>
      )}

      {uniqueResults.length > 0 && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-base-content/70">
              {uniqueResults.length} resultado
              {uniqueResults.length !== 1 ? 's' : ''} para "
              <strong>{searchQuery}</strong>"
            </p>
          </div>

          <div className="space-y-4">
            {uniqueResults.map((item: any, idx: number) => {
              const postData = posts.find((p) => p.id === item.id);

              if (!postData) return null;

              return (
                <div
                  key={`${postData.url}-${idx}`}
                  className="card bg-base-100 shadow-sm border border-base-300"
                >
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="card-title text-lg mb-2">
                          <a
                            href={postData.url}
                            className="link link-primary hover:link-hover"
                          >
                            {postData.title}
                          </a>
                        </h3>

                        <p className="text-sm text-base-content/70 mb-3">
                          {postData.summary}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-base-content/60">
                          <span className={getTypeBadge(postData.type)}>
                            {getTypeLabel(postData.type)}
                          </span>

                          <time className="capitalize">
                            {formatDate(new Date(postData.date))}
                          </time>

                          {postData.tags && postData.tags.length > 0 && (
                            <div className="flex gap-1">
                              {postData.tags.slice(0, 3).map((tag, tagIdx) => (
                                <span
                                  key={tagIdx}
                                  className="badge badge-outline badge-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {postData.tags.length > 3 && (
                                <span className="text-xs text-base-content/50">
                                  +{postData.tags.length - 3} más
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
