"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginSchema, LoginFormData } from "@/schemas/auth.schema";
import { loginAction } from "@/actions/auth.action";

type FieldErrors = Partial<Record<keyof LoginFormData, string>>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const updateField = (field: keyof LoginFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    // Zod validation
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginFormData;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    const response = await loginAction(result.data);
    setIsLoading(false);

    if (response.success) {
      router.push("/dashboard");
    } else {
      setServerError(response.message);
    }
  };

  const inputBase =
    "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500/60 focus:bg-white/8 transition-all placeholder:text-white/30";
  const inputError =
    "w-full bg-red-500/5 border border-red-500/40 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-white/30";

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
          href="/register"
          className="text-xs px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:border-white/40 transition-colors"
        >
          Create account
        </Link>
      </header>

      {/* MAIN */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">

          {/* LEFT SIDE */}
          <div className="hidden lg:block relative overflow-hidden">
            <Image
              src="/images/login-bg.png"
              alt="Login Background"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col justify-center bg-[#111] px-8 py-10">
            <div className="w-full max-w-md mx-auto">

              <div className="mb-6">
                <h1 className="text-white text-2xl font-black mb-1">
                  Welcome back
                </h1>
                <p className="text-white/40 text-sm">
                  Sign in to your Bike Sewa account
                </p>
              </div>

              {/* Server-level error */}
              {serverError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* EMAIL */}
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                    Email
                  </label>
                  <input
                    type="text"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    className={fieldErrors.email ? inputError : inputBase}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase text-white/50">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs text-green-500">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Enter your password"
                      className={`${fieldErrors.password ? inputError : inputBase} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.password}</p>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl py-3 font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-50 transition-all"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>

                {/* DIVIDER */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/30">or continue with</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* SOCIAL */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-colors"
                  >
                    Apple
                  </button>
                </div>
              </form>

              <p className="text-center text-xs mt-5 text-white/30">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-green-500 font-semibold hover:text-green-400">
                  Sign up for free
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
