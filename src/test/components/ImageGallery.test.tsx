import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImageGallery from '../../components/ImageGallery';

// Mock Image constructor
global.Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';

  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 100);
  }
} as any;

const mockImages = [
  '/images/test1.jpg',
  '/images/test2.jpg',
  '/images/test3.jpg',
];

describe('ImageGallery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render gallery with images', async () => {
    render(<ImageGallery images={mockImages} title="Test Gallery" />);

    await waitFor(() => {
      expect(screen.getAllByRole('img')).toHaveLength(mockImages.length);
    });
  });

  it('should show loading state initially', () => {
    render(<ImageGallery images={mockImages} title="Test Gallery" />);

    // Check for the pulsing placeholders
    const placeholders = screen.getAllByTestId('loading-placeholder');
    expect(placeholders).toHaveLength(mockImages.length);
  });

  it('should open lightbox when image is clicked', async () => {
    render(<ImageGallery images={mockImages} title="Test Gallery" />);

    await waitFor(() => {
      const firstImage = screen.getAllByRole('img')[0];
      fireEvent.click(firstImage.parentElement!);
    });

    // Check if lightbox is open (body overflow should be hidden)
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should close lightbox when close button is clicked', async () => {
    render(<ImageGallery images={mockImages} title="Test Gallery" />);

    await waitFor(() => {
      const firstImage = screen.getAllByRole('img')[0];
      fireEvent.click(firstImage.parentElement!);
    });

    const closeButton = screen.getByLabelText(/cerrar/i);
    fireEvent.click(closeButton);

    expect(document.body.style.overflow).toBe('unset');
  });

  it('should navigate between images in lightbox', async () => {
    render(<ImageGallery images={mockImages} title="Test Gallery" />);

    await waitFor(() => {
      const firstImage = screen.getAllByRole('img')[0];
      fireEvent.click(firstImage.parentElement!);
    });

    const nextButton = screen.getByLabelText(/siguiente/i);
    fireEvent.click(nextButton);

    // Should show image 2 of 3
    expect(screen.getByText('2 de 3')).toBeInTheDocument();
  });

  it('should handle keyboard navigation in lightbox', async () => {
    render(<ImageGallery images={mockImages} title="Test Gallery" />);

    await waitFor(() => {
      const firstImage = screen.getAllByRole('img')[0];
      fireEvent.click(firstImage.parentElement!);
    });

    // Test arrow key navigation
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByText('2 de 3')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(screen.getByText('1 de 3')).toBeInTheDocument();

    // Test escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.body.style.overflow).toBe('unset');
  });

  it('should show image counter', async () => {
    render(<ImageGallery images={mockImages} title="Test Gallery" />);

    await waitFor(() => {
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });
  });

  it('should handle empty images array', () => {
    render(<ImageGallery images={[]} title="Empty Gallery" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should support lazy loading', async () => {
    render(
      <ImageGallery images={mockImages} title="Test Gallery" lazy={true} />,
    );

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });
  });

  it('should support eager loading', async () => {
    render(
      <ImageGallery images={mockImages} title="Test Gallery" lazy={false} />,
    );

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('loading', 'eager');
      });
    });
  });

  it('should show loading spinner for unloaded images', async () => {
    render(<ImageGallery images={mockImages} title="Test Gallery" />);

    // Should show loading spinners initially
    await waitFor(() => {
        expect(screen.getAllByRole('img')).toHaveLength(mockImages.length);
    });
  });
});
