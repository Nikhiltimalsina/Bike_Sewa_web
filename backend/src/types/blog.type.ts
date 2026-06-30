export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  isPublished?: boolean;
}

export interface IBlogPagination {
  blogs: IBlog[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}