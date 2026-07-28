import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: 'a',
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: 'img',
}));

// Mock js-cookie
vi.mock('js-cookie', () => {
  const mockStore: Record<string, string> = {};
  return {
    default: {
      get: vi.fn((key: string) => mockStore[key] || null),
      set: vi.fn((key: string, value: string) => { mockStore[key] = value; }),
      remove: vi.fn((key: string) => { delete mockStore[key]; }),
    },
    get: vi.fn((key: string) => mockStore[key] || null),
    set: vi.fn((key: string, value: string) => { mockStore[key] = value; }),
    remove: vi.fn((key: string) => { delete mockStore[key]; }),
  };
});

