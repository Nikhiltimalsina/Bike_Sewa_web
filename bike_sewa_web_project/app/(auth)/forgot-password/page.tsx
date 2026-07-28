"use client";

import { useState } from "react";
import Link from "next/link";
import apiClient from "@/utils/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post("/api/v1/auth/forgot-password", { email });
      const data = response.data;
      setMessage({
        type: "success",
        text: data.message || "If an account with that email exists, a password reset link has been sent.",
      });

      // In development, show the reset token for testing
      if (data.resetToken) {
        setMessage({
          type: "success",
          text: `[DEV] ${data.message} Your reset token: ${data.resetToken}`,
        });
      }
    } catch (error: unknown) {
      const errMsg =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to send reset request. Please try again.";
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
              <div className="w-16 h-16 rounded-2xl bg-[#4169E1]/10 border border-[#4169E1]/20 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4169E1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className="text-white text-2xl font-black mb-1">
                Forgot password?
              </h1>
              <p className="text-white/40 text-sm">
                No worries. Enter your email and we&apos;ll send you a reset link.
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
                <span className="break-all">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl py-3 font-bold text-white bg-gradient-to-r from-[#4169E1] to-[#3558c9] hover:from-[#3558c9] hover:to-[#2a4ab0] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
              >
                {isLoading ? "Sending..." : "Send reset link"}
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
