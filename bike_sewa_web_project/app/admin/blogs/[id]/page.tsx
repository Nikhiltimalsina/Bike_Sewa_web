import { getBlogByIdApi, Blog } from "@/api/blog.api";

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let blog: Blog;
  let error: string | null = null;

  try {
    blog = await getBlogByIdApi(id);
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : "Failed to fetch blog";
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#161b27] min-h-screen text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{blog!.title}</h1>
          <div className="flex gap-2">
            <a
              href={`/admin/blogs/${blog!._id}/edit`}
              className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            >
              Edit
            </a>
          </div>
        </div>

        <div className="flex gap-4 text-sm text-white/60 mb-4">
          <span>By: {blog!.author}</span>
          <span>•</span>
          <span>{blog!.isPublished ? "Published" : "Draft"}</span>
          {blog!.tags.length > 0 && (
            <>
              <span>•</span>
              <span>Tags: {blog!.tags.join(", ")}</span>
            </>
          )}
        </div>

        {blog!.excerpt && <p className="text-lg text-white/80 mb-4">{blog!.excerpt}</p>}

        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{blog!.content}</p>
        </div>
      </div>
    </div>
  );
}