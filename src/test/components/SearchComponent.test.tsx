import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SearchComponent from '../../components/SearchComponent';

describe('SearchComponent', () => {
  beforeEach(() => {
    // Mock window.location with proper initial state
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'http://localhost:3000/',
        pathname: '/',
        search: '',
        assign: vi.fn()
      },
    });
  });

  it('should render the search icon initially', () => {
    render(<SearchComponent />);
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/buscar/i)).not.toBeInTheDocument();
  });

  it('should show the search input when the icon is clicked', () => {
    render(<SearchComponent />);
    const searchIcon = screen.getByTestId('search-icon');
    fireEvent.click(searchIcon);
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
  });

  it('should update the input value when typing', () => {
    render(<SearchComponent />);
    const searchIcon = screen.getByTestId('search-icon');
    fireEvent.click(searchIcon);
    const searchInput = screen.getByPlaceholderText(/buscar/i) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput.value).toBe('test query');
  });

  it('should redirect to the search page on form submission', () => {
    render(<SearchComponent />);
    const searchIcon = screen.getByTestId('search-icon');
    fireEvent.click(searchIcon);
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    const form = searchInput.closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(window.location.href).toBe('/search?q=test%20query');
  });

  it('should clear the search input when the clear button is clicked', () => {
    render(<SearchComponent />);
    const searchIcon = screen.getByTestId('search-icon');
    fireEvent.click(searchIcon);
    const searchInput = screen.getByPlaceholderText(/buscar/i) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'test query' } });

    const clearButton = screen.getByTitle(/limpiar/i);
    fireEvent.click(clearButton);

    expect(searchInput.value).toBe('');
  });

  it('should hide the search input when the Escape key is pressed', () => {
    render(<SearchComponent />);
    const searchIcon = screen.getByTestId('search-icon');
    fireEvent.click(searchIcon);
    const searchInput = screen.getByPlaceholderText(/buscar/i);

    fireEvent.keyDown(searchInput, { key: 'Escape' });

    expect(screen.queryByPlaceholderText(/buscar/i)).not.toBeInTheDocument();
  });
});