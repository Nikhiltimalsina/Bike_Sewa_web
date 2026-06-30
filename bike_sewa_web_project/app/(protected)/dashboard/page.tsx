"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
          <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
          <Link href="/" className="hover:text-white transition-colors">Browse Bikes</Link>
          <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
        </nav>

        <button
          onClick={logout}
          className="text-xs px-4 py-1.5 rounded-full border border-white/15 text-white/60 hover:border-red-400/50 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* HERO / WELCOME BANNER */}
      <section className="relative px-6 py-12 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4169E1]/20 via-transparent to-green-500/10 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/uploads/avatars/${user.avatar}`}
                  alt="avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-white/15 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/15 flex items-center justify-center text-3xl">
                  🙂
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0a0e14]" />
            </div>

            <div>
              <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-black">
                {user?.fullName || "Rider"} 👋
              </h1>
              <p className="text-white/40 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>

          <Link
            href="/profile"
            className="px-5 py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#3558c9] text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
          >
            Edit Profile
          </Link>
        </div>
      </section>

      {/* QUICK STATS / INFO CARDS */}
      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Account Role</p>
            <p className="text-lg font-bold capitalize">{user?.role || "user"}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Phone</p>
            <p className="text-lg font-bold">{user?.phone || "—"}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Status</p>
            <p className="text-lg font-bold text-green-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400" /> Active
            </p>
          </div>
        </div>

        {/* ACTION CARDS */}
        <h2 className="text-sm font-bold uppercase tracking-wide text-white/40 mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/profile"
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/40 hover:bg-white/[0.07] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-lg mb-4">
              👤
            </div>
            <p className="font-bold mb-1">Manage Profile</p>
            <p className="text-white/40 text-sm">Update your name, phone, and photo</p>
            <span className="inline-block mt-3 text-green-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Go to profile →
            </span>
          </Link>

          <Link
            href="/"
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-white/[0.07] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg mb-4">
              🏍️
            </div>
            <p className="font-bold mb-1">Browse Bikes</p>
            <p className="text-white/40 text-sm">Find your next ride from our fleet</p>
            <span className="inline-block mt-3 text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Explore now →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}