import apiClient from "@/utils/axios";

export type Blog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogPaginationResponse = {
  blogs: Blog[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
};

export type BlogResponse = {
  blog: Blog;
};

export const getBlogsApi = async (
  page: number = 1,
  size: number = 10,
  search?: string
): Promise<BlogPaginationResponse> => {
  const response = await apiClient.get<BlogPaginationResponse>("/api/v1/blogs", {
    params: { page, size, ...(search ? { search } : {}) },
  });
  return response.data;
};

export const getBlogByIdApi = async (id: string): Promise<Blog> => {
  const response = await apiClient.get<BlogResponse>(`/api/v1/blogs/${id}`);
  return response.data.blog;
};

export const createBlogApi = async (data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags?: string;
  isPublished?: boolean;
}): Promise<Blog> => {
  const response = await apiClient.post<Blog>("/api/v1/blogs", data);
  return response.data;
};

export const updateBlogApi = async (
  id: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    tags?: string;
    isPublished?: boolean;
  }
): Promise<Blog> => {
  const response = await apiClient.put<Blog>(`/api/v1/blogs/${id}`, data);
  return response.data;
};

export const deleteBlogApi = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/api/v1/blogs/${id}`);
  return response.data;
};