import { getBlogsApi, Blog } from "@/api/blog.api";
import Link from "next/link";

type SearchParams = {
  page?: string;
  size?: string;
  search?: string;
};

async function fetchBlogsAction(page: number, size: number, search?: string) {
  try {
    const data = await getBlogsApi(page, size, search);
    return { success: true, data };
  } catch (error: unknown) {
    let message = "Failed to fetch blogs";
    if (typeof error === "object" && error !== null) {
      const err = error as { response?: { data?: { message?: string } } };
      message = err.response?.data?.message || message;
    }
    return { success: false, message };
  }
}

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const size = parseInt(params.size || "10", 10);
  const search = params.search || undefined;

  const result = await fetchBlogsAction(page, size, search);

  if (!result.success || !result.data) {
    return (
      <div className="p-6">
        <p className="text-red-400">Error: {result.message}</p>
      </div>
    );
  }

  const { blogs, total, totalPages } = result.data;

  const buildPaginationUrl = (newPage: number) => {
    const url = new URLSearchParams();
    url.set("page", newPage.toString());
    url.set("size", size.toString());
    if (search) url.set("search", search);
    return `/admin/blogs?${url.toString()}`;
  };

  return (
    <div className="p-6 bg-[#161b27] min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Blogs</h1>
          <Link
            href="/admin/blogs/create"
            className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-colors"
          >
            Create New Blog
          </Link>
        </header>

        <form action="/admin/blogs" method="GET" className="mb-4 flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search blogs..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500/50"
          />
          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="size" value={size} />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
          >
            Search
          </button>
        </form>

        {blogs.length === 0 && (
          <p className="text-center text-white/40 py-10">No blogs found. Create your first blog!</p>
        )}

        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog: Blog) => (
                <tr key={blog._id} className="border-t border-white/10">
                  <td className="px-4 py-3">{blog.title}</td>
                  <td className="px-4 py-3">{blog.author}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        blog.isPublished ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/blogs/${blog._id}`}
                        className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/15 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="text-xs px-3 py-1 rounded-md bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-white/60">
            Total: {total} | Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildPaginationUrl(page - 1)}
                className="px-3 py-1 rounded-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildPaginationUrl(page + 1)}
                className="px-3 py-1 rounded-md bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}