"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBlogApi } from "@/api/blog.api";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  tags: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    tags: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const updateField = (field: keyof BlogFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitMessage(null);
    setErrors({});

    const result = blogSchema.safeParse(form);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof BlogFormData;
        if (field) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await createBlogApi({
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt,
        tags: form.tags,
      });
      setSubmitMessage({ type: "success", text: "Blog created successfully!" });
      setTimeout(() => router.push("/admin/blogs"), 1500);
    } catch (error: unknown) {
      let message = "Failed to create blog";
      if (typeof error === "object" && error !== null) {
        const err = error as { response?: { data?: { message?: string } } };
        message = err.response?.data?.message || message;
      }
      setSubmitMessage({ type: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-green-500/50";

  return (
    <div className="min-h-screen bg-[#161b27] text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create New Blog</h1>
          <Link href="/admin/blogs" className="text-sm text-white/40 hover:text-white/70">
            ← Back to blogs
          </Link>
        </header>

        {submitMessage && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg ${
              submitMessage.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className={inputClass}
              required
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1.5">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value.toLowerCase())}
              placeholder="e.g., my-first-blog"
              className={inputClass}
              required
            />
            {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1.5">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1.5">Content</label>
            <textarea
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              rows={8}
              className={inputClass}
              required
            />
            {errors.content && <p className="mt-1 text-xs text-red-400">{errors.content}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="tag1, tag2, tag3"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}