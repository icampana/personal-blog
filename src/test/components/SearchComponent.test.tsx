import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchComponent from '../../components/SearchComponent';

// Mock fetch
global.fetch = vi.fn();

const mockSearchData = [
  {
    title: 'Test Post 1',
    content: 'This is a test post about JavaScript',
    url: '/posts/test-post-1',
    tags: ['javascript', 'test'],
    date: '2023-01-15',
  },
  {
    title: 'Test Post 2',
    content: 'This is another test post about React',
    url: '/posts/test-post-2',
    tags: ['react', 'test'],
    date: '2023-01-10',
  },
];

describe('SearchComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockSearchData,
    });
  });

  it('should render search input', () => {
    render(<SearchComponent />);
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
  });

  it('should show loading state when searching', async () => {
    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'javascript' } });

    expect(screen.getByText(/buscando/i)).toBeInTheDocument();
  });

  it('should display search results', async () => {
    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'javascript' } });

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
  });

  it('should show no results message when no matches found', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(
        screen.getByText(/no se encontraron resultados/i),
      ).toBeInTheDocument();
    });
  });

  it('should handle search errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByText(/error al buscar/i)).toBeInTheDocument();
    });
  });

  it('should clear results when search is cleared', async () => {
    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);

    // First search
    fireEvent.change(searchInput, { target: { value: 'javascript' } });
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    await waitFor(() => {
      expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
    });
  });

  it('should debounce search input', async () => {
    render(<SearchComponent />);

    const searchInput = screen.getByPlaceholderText(/buscar/i);

    // Type quickly
    fireEvent.change(searchInput, { target: { value: 'j' } });
    fireEvent.change(searchInput, { target: { value: 'ja' } });
    fireEvent.change(searchInput, { target: { value: 'jav' } });
    fireEvent.change(searchInput, { target: { value: 'java' } });

    // Should only make one API call after debounce
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
