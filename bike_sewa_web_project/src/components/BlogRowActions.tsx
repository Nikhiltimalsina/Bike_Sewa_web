"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteBlogApi } from "@/api/blog.api";

export default function BlogRowActions({ blogId }: { blogId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Delete this blog? This cannot be undone.")) return;
    setDeleting(true);
    setError("");
    try {
      await deleteBlogApi(blogId);
      router.refresh();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete blog";
      setError(message);
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/blogs/${blogId}`}
        className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/15 transition-colors"
      >
        View
      </Link>
      <Link
        href={`/admin/blogs/${blogId}/edit`}
        className="text-xs px-3 py-1 rounded-md bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs px-3 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
      >
        {deleting ? "..." : "Delete"}
      </button>
      {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
    </div>
  );
}