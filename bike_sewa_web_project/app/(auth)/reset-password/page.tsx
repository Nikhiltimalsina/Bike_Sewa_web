"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/utils/axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [form, setForm] = useState({
    token: tokenFromUrl,
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (form.password.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post("/api/v1/auth/reset-password", {
        token: form.token,
        password: form.password,
      });
      setMessage({
        type: "success",
        text: response.data.message || "Password reset successfully!",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: unknown) {
      const errMsg =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to reset password. Please try again.";
      setMessage({ type: "error", text: errMsg || "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4169E1]/60 focus:bg-white/8 transition-all placeholder:text-white/30";

  return (
    <div className="min-h-screen flex flex-col bg-[#161b27]">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#4169E1]">
            🚲
          </div>
          <span className="font-bold text-white">
            Bike<span className="text-green-500">Sewa</span>
          </span>
        </Link>
        <Link
          href="/login"
          className="text-xs px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:border-white/40 transition-colors"
        >
          Back to login
        </Link>
      </header>

      {/* MAIN */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-[#111] rounded-2xl p-8 shadow-2xl border border-white/5">
            <div className="mb-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h1 className="text-white text-2xl font-black mb-1">
                Reset password
              </h1>
              <p className="text-white/40 text-sm">
                Enter your new password below.
              </p>
            </div>

            {message && (
              <div
                className={`mb-5 px-4 py-3 rounded-xl text-sm border flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <span>{message.type === "success" ? "✓" : "⚠"}</span>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                  Reset token
                </label>
                <input
                  type="text"
                  value={form.token}
                  onChange={(e) => setForm((f) => ({ ...f, token: e.target.value }))}
                  placeholder="Paste your reset token here"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="Min 8 characters, 1 uppercase, 1 number"
                    className={`${inputClass} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Re-enter your new password"
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-3 font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-50 transition-all shadow-lg shadow-green-500/20"
              >
                {isLoading ? "Resetting..." : "Reset password"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-[#4169E1] hover:text-blue-400 transition-colors">
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
