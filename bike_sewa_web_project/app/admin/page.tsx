"use client";

import { useEffect, useState } from "react";
import { adminGetStatsApi, AdminStats } from "@/api/admin.api";

// Small inline SVG icons — no emoji, no external icon library required.
function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function BikeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
      <path d="m12 17.5 3-7 3 3.5M5.5 17.5 9 8h4" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminGetStatsApi();
        setStats(data);
      } catch {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: <UsersIcon /> },
    { label: "Total Bikes", value: stats?.totalBikes ?? 0, icon: <BikeIcon /> },
    { label: "Total Bookings", value: stats?.totalBookings ?? 0, icon: <CalendarIcon /> },
  ];

  const quickActions = [
    { label: "Manage Users", href: "/admin/users", icon: <UsersIcon /> },
    { label: "Manage Bikes", href: "/admin/bikes", icon: <BikeIcon /> },
    { label: "Manage Bookings", href: "/admin/bookings", icon: <CalendarIcon /> },
    { label: "Manage Blogs", href: "/admin/blogs", icon: <DocumentIcon /> },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Admin Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Overview of your Bike Sewa platform</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-[#0f172a] border border-slate-700/50 p-6 animate-pulse">
              <div className="h-4 w-24 bg-slate-700/50 rounded mb-4" />
              <div className="h-8 w-16 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-2xl bg-[#0f172a] border border-slate-700/50 p-6">
              <div className="w-10 h-10 rounded-xl bg-[#4169E1]/10 border border-[#4169E1]/20 text-[#4169E1] flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <p className="text-white/50 text-xs uppercase tracking-wider font-semibold">{card.label}</p>
              <p className="text-3xl font-black mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-[#0f172a] hover:border-[#4169E1]/40 hover:bg-[#4169E1]/5 p-4 transition-colors"
            >
              <span className="text-[#4169E1]">{action.icon}</span>
              <span className="text-sm font-semibold">{action.label}</span>
              <span className="ml-auto text-white/30 text-xs">&rarr;</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}