import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../repositories/blog.repository', () => ({
  default: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import blogService from '../blog.service';
import blogRepository from '../../repositories/blog.repository';

const mockBlog = {
  _id: { toString: () => 'blog1' },
  title: 'Test Blog',
  slug: 'test-blog',
  content: 'Blog content here',
  excerpt: 'Short excerpt',
  author: 'Admin',
  tags: ['bike', 'tips'],
  isPublished: true,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BlogService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBlogs', () => {
    it('should return paginated blogs', async () => {
      vi.mocked(blogRepository.findAll).mockResolvedValue({
        blogs: [mockBlog],
        total: 1,
        totalPages: 1,
      } as any);
      const result = await blogService.getAllBlogs(1, 10);
      expect(result.blogs).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('getBlogById', () => {
    it('should return blog by id', async () => {
      vi.mocked(blogRepository.findById).mockResolvedValue(mockBlog as any);
      const blog = await blogService.getBlogById('blog1');
      expect(blog.title).toBe('Test Blog');
    });
  });

  describe('createBlog', () => {
    it('should create a blog', async () => {
      vi.mocked(blogRepository.findBySlug).mockResolvedValue(null);
      vi.mocked(blogRepository.create).mockResolvedValue(mockBlog as any);
      const blog = await blogService.createBlog({
        title: 'Test Blog',
        slug: 'test-blog',
        content: 'Content',
        excerpt: 'Excerpt',
        author: 'Admin',
        tags: ['bike'],
      });
      expect(blog.title).toBe('Test Blog');
    });
  });

  describe('updateBlog', () => {
    it('should update a blog', async () => {
      vi.mocked(blogRepository.update).mockResolvedValue({ ...mockBlog, title: 'Updated' } as any);
      const blog = await blogService.updateBlog('blog1', { title: 'Updated' });
      expect(blog.title).toBe('Updated');
    });
  });

  describe('deleteBlog', () => {
    it('should delete a blog', async () => {
      vi.mocked(blogRepository.delete).mockResolvedValue(true);
      const result = await blogService.deleteBlog('blog1');
      expect(result.message).toBe('Blog deleted successfully');
    });
  });
});

