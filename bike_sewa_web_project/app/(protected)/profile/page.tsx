"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { updateProfileApi } from "@/api/user.api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002";

type ProfileFormState = {
  fullName: string;
  phone: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function ProfilePage() {
  const { user, isLoading, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Profile update form state ---
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    fullName: "",
    phone: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // --- Password update form state ---
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  // Prefill the profile form once user details are loaded
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
      setAvatarPreview(user.avatar ? `${BACKEND_URL}/uploads/avatars/${user.avatar}` : "");
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileSubmitting(true);

    try {
      const result = await updateProfileApi({
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        avatar: avatarFile,
      });
      setProfileMessage({ type: "success", text: result.message || "Profile updated successfully" });
      setAvatarFile(null);
      await refreshUser();
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setProfileMessage({ type: "error", text: message || "Failed to update profile" });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    setPasswordSubmitting(true);
    try {
      // Reuses the same /api/v1/auth/update endpoint and updateProfileApi action,
      // just sending password fields instead of profile fields.
      const result = await updateProfileApi({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage({ type: "success", text: result.message || "Password updated successfully" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setPasswordMessage({ type: "error", text: message || "Failed to update password" });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#4169E1]/60 focus:bg-white/8 transition-all placeholder:text-white/30";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e14]">
        <p className="text-white/40 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
      {/* NAV */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d1117]/80 backdrop-blur sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#4169E1]">
            🚲
          </div>
          <span className="font-bold">
            Bike<span className="text-green-500">Sewa</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/" className="hover:text-white transition-colors">Browse Bikes</Link>
          <Link href="/profile" className="text-white font-medium">Profile</Link>
        </nav>

        <Link
          href="/dashboard"
          className="text-xs px-4 py-1.5 rounded-full border border-white/15 text-white/60 hover:border-white/30 hover:text-white transition-colors"
        >
          ← Dashboard
        </Link>
      </header>

      {/* PROFILE HERO */}
      <section className="relative px-6 py-10 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/15 via-transparent to-green-500/10 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black mb-1">Account Settings</h1>
          <p className="text-white/40 text-sm">Manage your personal details and security</p>
        </div>
      </section>

      <div className="px-6 py-10">
        <div className="max-w-3xl mx-auto">

          {/* TABS */}
          <div className="flex gap-2 mb-6 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-[#4169E1] text-white shadow-lg shadow-blue-500/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "password"
                  ? "bg-[#4169E1] text-white shadow-lg shadow-blue-500/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Password
            </button>
          </div>

          {/* PROFILE UPDATE FORM */}
          {activeTab === "profile" && (
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-1">Profile details</h2>
              <p className="text-white/40 text-sm mb-6">Update your photo and personal information</p>

              {profileMessage && (
                <div
                  className={`mb-5 px-4 py-3 rounded-xl text-sm border flex items-center gap-2 ${
                    profileMessage.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <span>{profileMessage.type === "success" ? "✓" : "⚠"}</span>
                  {profileMessage.text}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* AVATAR */}
                <div className="flex items-center gap-5 pb-5 border-b border-white/5">
                  <div
                    className="relative w-24 h-24 rounded-2xl bg-white/10 overflow-hidden border-2 border-white/15 cursor-pointer flex items-center justify-center shrink-0 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarPreview} alt="avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🙂</span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-medium transition-opacity">
                      Change
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/15 transition-colors font-medium"
                    >
                      Upload new photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <p className="text-white/30 text-xs mt-2">JPG, PNG, or WEBP. Max 5MB.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                      Full name
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm((f) => ({ ...f, fullName: e.target.value }))}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="10 digit phone number"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className={`${inputClass} opacity-50 cursor-not-allowed`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="w-full sm:w-auto px-8 rounded-xl py-3 font-bold text-white bg-[#4169E1] hover:bg-[#3558c9] disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                >
                  {profileSubmitting ? "Saving..." : "Save changes"}
                </button>
              </form>
            </section>
          )}

          {/* PASSWORD UPDATE FORM */}
          {activeTab === "password" && (
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-1">Change password</h2>
              <p className="text-white/40 text-sm mb-6">Use a strong password you don&apos;t use elsewhere</p>

              {passwordMessage && (
                <div
                  className={`mb-5 px-4 py-3 rounded-xl text-sm border flex items-center gap-2 ${
                    passwordMessage.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <span>{passwordMessage.type === "success" ? "✓" : "⚠"}</span>
                  {passwordMessage.text}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                    New password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                    placeholder="Min 8 characters, 1 uppercase, 1 number"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5 text-white/50">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, confirmNewPassword: e.target.value }))}
                    className={inputClass}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="w-full sm:w-auto px-8 rounded-xl py-3 font-bold text-white bg-white/10 border border-white/15 hover:bg-white/15 disabled:opacity-50 transition-all"
                >
                  {passwordSubmitting ? "Updating..." : "Update password"}
                </button>
              </form>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}