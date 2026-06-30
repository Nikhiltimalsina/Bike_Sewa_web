import { Request, Response, NextFunction } from "express";
import blogService from "../services/blog.service";
import { BadRequestException } from "../exceptions/http-exception";

const BlogController = {
  async getAllBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const size = parseInt(req.query.size as string) || 10;
      const search = req.query.search as string | undefined;

      const result = await blogService.getAllBlogs(page, size, search);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const blog = await blogService.getBlogById(req.params.id);
      res.status(200).json({ blog });
    } catch (error) {
      next(error);
    }
  },

  async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, slug, content, excerpt, tags, isPublished } = req.body;

      if (!title || !slug || !content) {
        throw new BadRequestException("Title, slug, and content are required");
      }

      const author = (req as { user?: { email?: string } }).user?.email || "admin";

      const blog = await blogService.createBlog({
        title,
        slug,
        content,
        excerpt,
        author,
        tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
        isPublished: isPublished === "true" || isPublished === true,
      });

      res.status(201).json(blog);
    } catch (error) {
      next(error);
    }
  },

  async updateBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, slug, content, excerpt, tags, isPublished } = req.body;

      const updateData: Record<string, unknown> = {};
      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (content !== undefined) updateData.content = content;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (tags !== undefined) {
        updateData.tags = tags.split(",").map((t: string) => t.trim());
      }
      if (isPublished !== undefined) {
        updateData.isPublished = isPublished === "true" || isPublished === true;
      }

      const blog = await blogService.updateBlog(req.params.id, updateData);
      res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  },

  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await blogService.deleteBlog(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default BlogController;