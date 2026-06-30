"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { registerSchema, RegisterFormData } from "@/schemas/auth.schema";
import { registerAction } from "@/actions/auth.action";

type FieldErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    if (!agreed) {
      setServerError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    // Zod validation
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterFormData;
        if (!errors[field]) errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    const response = await registerAction({
      fullName: result.data.fullName,
      email: result.data.email,
      phone: result.data.phone,
      password: result.data.password,
    });
    setIsLoading(false);

    if (response.success) {
      router.push("/login");
    } else {
      setServerError(response.message);
    }
  };

  const inputBase =
    "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500/60 transition-all placeholder:text-white/30";
  const inputErrorClass =
    "w-full bg-red-500/5 border border-red-500/40 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder:text-white/30";

  const getInputClass = (field: keyof RegisterFormData) =>
    fieldErrors[field] ? inputErrorClass : inputBase;

  return (
    <div className="min-h-screen flex flex-col bg-[#161b27]">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4169E1] rounded-lg flex items-center justify-center">
            🚲
          </div>
          <span className="text-white font-bold">
            Bike<span className="text-green-500">Sewa</span>
          </span>
        </Link>
        <Link
          href="/login"
          className="text-xs px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:border-white/40 transition-colors"
        >
          Sign in
        </Link>
      </header>

      {/* MAIN */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">

          {/* LEFT SIDE */}
          <div className="hidden lg:block relative overflow-hidden">
            <Image
              src="/images/register-bg.webp"
              alt="Register Background"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center bg-[#111] px-6 py-10 overflow-y-auto">
            <div className="w-full max-w-md">

              <div className="mb-5">
                <h1 className="text-white text-2xl font-black mb-1">
                  Create your account
                </h1>
                <p className="text-white/40 text-sm">
                  Join Bike Sewa and start your adventure today
                </p>
              </div>

              {/* Server error */}
              {serverError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">

                {/* FULL NAME */}
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={getInputClass("fullName")}
                  />
                  {fieldErrors.fullName && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={getInputClass("email")}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>
                  )}
                </div>

                {/* PHONE */}
                <div>
                  <input
                    type="tel"
                    placeholder="Phone (10 digits)"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={getInputClass("phone")}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password (min 8 chars, 1 uppercase, 1 number)"
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      className={`${getInputClass("password")} pr-10`}
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

                {/* CONFIRM PASSWORD */}
                <div>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      className={`${getInputClass("confirmPassword")} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showConfirm ? "🙈" : "👁"}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                {/* TERMS */}
                <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="accent-green-500"
                  />
                  I agree to Terms &amp; Privacy Policy
                </label>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 disabled:opacity-50 transition-all"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="text-center text-xs mt-4 text-white/30">
                Already have an account?{" "}
                <Link href="/login" className="text-green-500 hover:text-green-400 font-semibold">
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
