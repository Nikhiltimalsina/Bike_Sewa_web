"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { whoamiApi } from "@/api/user.api";

// Same icon set used on the dashboard page, for a consistent look.
function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function BikeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" stroke="none" />
      <path d="m12 17.5 3-7 3 3.5M5.5 17.5 9 8h4" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  );
}

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: <DashboardIcon /> },
  { href: "/admin/users", label: "Users", icon: <UsersIcon /> },
  { href: "/admin/bikes", label: "Bikes", icon: <BikeIcon /> },
  { href: "/admin/bookings", label: "Bookings", icon: <CalendarIcon /> },
  { href: "/admin/blogs", label: "Blogs", icon: <DocumentIcon /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAdmin = async () => {
      try {
        const token = Cookies.get("auth_token");
        if (!token) {
          setIsAdmin(false);
          router.replace("/login?redirect=/admin");
          return;
        }

        // First check from user_info cookie (fast)
        const userInfo = Cookies.get("user_info");
        if (userInfo) {
          try {
            const parsed = JSON.parse(userInfo);
            if (parsed.role === "admin") {
              setIsAdmin(true);
              return;
            }
          } catch { /* ignore parse error */ }
        }

        // Fallback: verify with whoami API
        try {
          const { user } = await whoamiApi();
          if (user?.role === "admin") {
            setIsAdmin(true);
            if (userInfo) {
              try {
                const parsed = JSON.parse(userInfo);
                parsed.role = "admin";
                Cookies.set("user_info", JSON.stringify(parsed), { expires: 7 });
              } catch { /* ignore */ }
            }
          } else {
            setIsAdmin(false);
            router.replace("/home");
          }
        } catch {
          setIsAdmin(false);
          router.replace("/login?redirect=/admin");
        }
      } catch {
        setIsAdmin(false);
        router.replace("/login?redirect=/admin");
      }
    };
    checkAdmin();
  }, [router]);

  if (!mounted || isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-white/40 text-sm">Verifying access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-red-400 text-sm">Access denied. Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-[#0f172a] to-[#1a2332] border-r border-slate-700/50 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-700/30">
          <Link href="/admin" className="flex items-center gap-2 font-black text-lg">
            <span className="w-8 h-8 bg-[#4169E1] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4169E1]/20"><BikeIcon /></span>
            <span className="text-white">Bike</span><span className="text-[#6b8cf0]">Sewa</span>
            <span className="text-[10px] text-slate-500 ml-auto font-semibold tracking-wider uppercase">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#4169E1]/15 text-[#6b8cf0] border border-[#4169E1]/25 shadow-sm shadow-[#4169E1]/5"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="p-4 border-t border-slate-700/30">
          <Link href="/home" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all duration-200">
            <span>←</span>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-700/30 bg-[#0f172a]">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 text-xl">☰</button>
          <span className="text-sm font-semibold text-slate-400">Admin Panel</span>
          <div className="w-8" />
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}