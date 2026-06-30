import BlogModel, { IBlogDocument } from "../models/blog.model";
import { IBlogInput } from "../types/blog.type";

class BlogRepository {
  async findAll(
    page: number,
    size: number,
    search?: string
  ): Promise<{ blogs: IBlogDocument[]; total: number; totalPages: number }> {
    const skip = (page - 1) * size;

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [blogs, total] = await Promise.all([
      BlogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(size),
      BlogModel.countDocuments(query),
    ]);

    return { blogs, total, totalPages: Math.ceil(total / size) };
  }

  async findById(id: string): Promise<IBlogDocument | null> {
    return BlogModel.findById(id);
  }

  async findBySlug(slug: string): Promise<IBlogDocument | null> {
    return BlogModel.findOne({ slug });
  }

  async create(data: IBlogInput): Promise<IBlogDocument> {
    const blog = new BlogModel(data);
    return blog.save();
  }

  async update(id: string, data: Partial<IBlogInput> & { publishedAt?: Date }): Promise<IBlogDocument | null> {
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    return BlogModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await BlogModel.findByIdAndDelete(id);
    return !!result;
  }
}

export default new BlogRepository();