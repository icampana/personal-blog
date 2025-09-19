# Test Suite

This directory contains the comprehensive test suite for the Astro blog migration.

## Test Structure

### Unit Tests
- `utils.test.ts` - Tests for utility functions (date formatting, URL generation, etc.)
- `imageUtils.test.ts` - Tests for image optimization utilities

### Component Tests
- `components/SearchComponent.test.tsx` - Tests for the search React component
- `components/ImageGallery.test.tsx` - Tests for the image gallery React component

### Integration Tests
- `integration/content.test.ts` - Tests for content collection processing
- `integration/routes.test.ts` - Tests for URL compatibility and routing
- `integration/search.test.ts` - Tests for search functionality

## Running Tests

```bash
# Run all tests
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Configuration

- **Framework**: Vitest
- **Environment**: jsdom (for React component testing)
- **Testing Library**: @testing-library/react for component tests
- **Mocking**: Built-in Vitest mocking capabilities

## Coverage Goals

- **Utility Functions**: 100% coverage
- **React Components**: 90%+ coverage
- **Integration Tests**: Cover all major user flows
- **URL Compatibility**: Test all legacy URL redirects

## Adding New Tests

1. Create test files with `.test.ts` or `.test.tsx` extension
2. Place unit tests in the appropriate category folder
3. Use descriptive test names and group related tests with `describe` blocks
4. Mock external dependencies appropriately
5. Test both happy path and error scenarios

## Mocking Guidelines

- Mock Astro globals in `setup.ts`
- Mock external libraries (theme-change, reading-time, etc.)
- Use realistic mock data that matches production data structure
- Keep mocks simple and focused on the test requirements