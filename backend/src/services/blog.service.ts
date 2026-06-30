import blogRepository from "../repositories/blog.repository";
import { NotFoundException, BadRequestException } from "../exceptions/http-exception";
import { IBlogInput, IBlogPagination } from "../types/blog.type";

class BlogService {
  async getAllBlogs(
    page: number = 1,
    size: number = 10,
    search?: string
  ): Promise<IBlogPagination> {
    const { blogs, total, totalPages } = await blogRepository.findAll(
      page,
      size,
      search
    );

    return {
      blogs: blogs.map((blog) => ({
        _id: blog._id.toString(),
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        author: blog.author,
        tags: blog.tags,
        isPublished: blog.isPublished,
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
      })),
      total,
      page,
      size,
      totalPages,
    };
  }

  async getBlogById(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new NotFoundException("Blog not found");
    }
    return {
      _id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      tags: blog.tags,
      isPublished: blog.isPublished,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }

  async createBlog(data: IBlogInput) {
    const existing = await blogRepository.findBySlug(data.slug);
    if (existing) {
      throw new BadRequestException("A blog with this slug already exists");
    }
    const blog = await blogRepository.create(data);
    return {
      _id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      tags: blog.tags,
      isPublished: blog.isPublished,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }

  async updateBlog(id: string, data: Partial<IBlogInput>) {
    const blog = await blogRepository.update(id, data);
    if (!blog) {
      throw new NotFoundException("Blog not found");
    }
    return {
      _id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      author: blog.author,
      tags: blog.tags,
      isPublished: blog.isPublished,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }

  async deleteBlog(id: string) {
    const success = await blogRepository.delete(id);
    if (!success) {
      throw new NotFoundException("Blog not found");
    }
    return { message: "Blog deleted successfully" };
  }
}

export default new BlogService();