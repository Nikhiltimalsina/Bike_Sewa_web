"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getBikesApi, Bike } from "@/api/bike.api";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBikes = async () => {
      try {
        setLoading(true);
        const data = await getBikesApi(false);
        setBikes(data.bikes || []);
      } catch {
        setError("Failed to load bikes");
      } finally {
        setLoading(false);
      }
    };
    loadBikes();
  }, []);

  const totalBikes = bikes.length;
  const availableBikes = bikes.filter((b) => b.isAvailable).length;
  const bookedBikes = totalBikes - availableBikes;

  return (
    <div className="min-h-screen bg-[#0a0e14] text-white">
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
          <Link href="/bikes" className="hover:text-white transition-colors">Browse Bikes</Link>
          <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
        </nav>

        <button
          onClick={logout}
          className="text-xs px-4 py-1.5 rounded-full border border-white/15 text-white/60 hover:border-red-400/50 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </header>

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

      <section className="px-6 py-10 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Total Bikes</p>
            <p className="text-lg font-bold">{loading ? "..." : totalBikes}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Available</p>
            <p className="text-lg font-bold text-green-400">{loading ? "..." : availableBikes}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
            <p className="text-white/40 text-xs uppercase tracking-wide mb-2">Booked</p>
            <p className="text-lg font-bold text-red-400">{loading ? "..." : bookedBikes}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <h2 className="text-sm font-bold uppercase tracking-wide text-white/40 mb-4">
          Fleet Overview
        </h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-[#161b27] border border-white/10 p-5 animate-pulse">
                <div className="h-40 bg-slate-700/50 rounded-xl mb-4" />
                <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-700/50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bikes.map((bike) => (
              <Link
                key={bike.id}
                href={`/bikes/${bike.id}`}
                className="group bg-[#161b27] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all"
              >
                <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  {bike.imageUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${bike.imageUrl})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">🏍️</div>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${
                      bike.isAvailable
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {bike.isAvailable ? "Available" : "Booked"}
                  </span>
                </div>
                <div className="p-4">
                  <div className="text-xs text-blue-400 font-semibold mb-1">{bike.model || bike.location || "Bike"}</div>
                  <h3 className="font-bold text-sm mb-2">{bike.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-black">NPR {Number(bike.pricePerHour || 0).toLocaleString()}</span>
                      <span className="text-white/40 text-xs">/hour</span>
                    </div>
                    <div className="text-xs text-white/40">{bike.location || "—"}</div>
                  </div>
                </div>
              </Link>
            ))}
            {!loading && bikes.length === 0 && (
              <div className="col-span-full rounded-2xl border border-white/10 bg-[#161b27] p-8 text-center text-sm text-white/50">
                No bikes available at the moment.
              </div>
            )}
          </div>
        )}

        <h2 className="text-sm font-bold uppercase tracking-wide text-white/40 mt-10 mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/bikes"
            className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-white/[0.07] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-lg mb-4">
              🏍️
            </div>
            <p className="font-bold mb-1">Browse All Bikes</p>
            <p className="text-white/40 text-sm">Explore our full fleet</p>
            <span className="inline-block mt-3 text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Browse bikes →
            </span>
          </Link>

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
        </div>
      </section>
    </div>
  );
}