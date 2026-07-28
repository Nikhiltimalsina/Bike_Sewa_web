import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

import { getBlogsApi, getBlogByIdApi, createBlogApi, updateBlogApi, deleteBlogApi } from '../blog.api';

describe('blog.api', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getBlogsApi returns a promise', () => {
    expect(getBlogsApi()).toBeInstanceOf(Promise);
  });

  it('getBlogByIdApi returns a promise', () => {
    expect(getBlogByIdApi('123')).toBeInstanceOf(Promise);
  });

  it('createBlogApi returns a promise', () => {
    expect(createBlogApi({ title: 'Test', slug: 'test', content: 'Content' })).toBeInstanceOf(Promise);
  });

  it('updateBlogApi returns a promise', () => {
    expect(updateBlogApi('123', { title: 'Updated' })).toBeInstanceOf(Promise);
  });

  it('deleteBlogApi returns a promise', () => {
    expect(deleteBlogApi('123')).toBeInstanceOf(Promise);
  });
});
