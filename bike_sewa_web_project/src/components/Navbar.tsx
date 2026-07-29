
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = Cookies.get("auth_token");
    setIsLoggedIn(!!token);

    // Check if user has admin role from user_info cookie
    if (token) {
      try {
        const userInfo = Cookies.get("user_info");
        if (userInfo) {
          const parsed = JSON.parse(userInfo);
          setIsAdmin(parsed.role === "admin");
        }
      } catch {
        setIsAdmin(false);
      }
    }

    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/bikes", label: "Bikes" },
    { href: "/find-bikes", label: "Find" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const handleLogout = () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_info");
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0d1117]/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <Link href="/home" className="flex items-center gap-2 font-black text-white text-lg">
          <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-sm">🚲</span>
          Bike<span className="text-green-400">Sewa</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className={`text-sm transition-colors ${pathname === l.href ? "text-white font-semibold" : "text-white/50 hover:text-white"}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!mounted ? (
            <span className="text-sm text-white/30">Loading...</span>
          ) : isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="text-white/50 hover:text-white text-sm font-semibold">Admin</Link>
              )}
              <Link href="/notifications" className="text-white/50 hover:text-white text-sm">Notifications</Link>
              <Link href="/my-account" className="text-white/50 hover:text-white text-sm">My Account</Link>
              <button onClick={handleLogout} className="text-xs px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:border-red-500/40 hover:text-red-400 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">Sign In</Link>
              <Link href="/register" className="text-sm px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors">Join Free</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-white/60" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0d1117] border-t border-white/10 px-6 py-4 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          <hr className="border-white/10" />
          {isLoggedIn
            ? <button onClick={handleLogout} className="text-sm text-red-400 text-left">Logout</button>
            : <Link href="/login" className="text-sm text-blue-400" onClick={() => setMenuOpen(false)}>Sign In</Link>
          }
        </div>
      )}
    </nav>
  );
}