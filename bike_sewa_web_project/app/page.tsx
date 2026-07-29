 "use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SplashScreenPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing BikeSewa...");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 5;
        if (next === 30) setStatusText("Loading rental services...");
        if (next === 70) setStatusText("Checking security credentials...");
        if (next === 90) setStatusText("Preparing your portal...");
        return next;
      });
    }, 60);

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        const token = Cookies.get("auth_token");
        if (token) {
          // Check user role from cookie for proper redirect
          const userInfo = Cookies.get("user_info");
          if (userInfo) {
            try {
              const parsed = JSON.parse(userInfo);
              if (parsed.role === "admin") {
                router.replace("/admin");
                return;
              }
            } catch (e) {
              // fall through
            }
          }
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      }, 400);
    }, 1600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1f3a] to-[#0a1628] text-white overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.12)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10)_0%,transparent_50%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.08)_0%,transparent_50%)]" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-emerald-400/40 rounded-full animate-[float_6s_ease-in-out_infinite]" style={{ top: "15%", left: "10%", animationDelay: "0s" }} />
        <div className="absolute w-3 h-3 bg-blue-400/30 rounded-full animate-[float_8s_ease-in-out_infinite]" style={{ top: "25%", right: "15%", animationDelay: "1s" }} />
        <div className="absolute w-1.5 h-1.5 bg-emerald-300/50 rounded-full animate-[float_7s_ease-in-out_infinite]" style={{ top: "60%", left: "8%", animationDelay: "2s" }} />
        <div className="absolute w-2.5 h-2.5 bg-blue-500/25 rounded-full animate-[float_9s_ease-in-out_infinite]" style={{ top: "70%", right: "10%", animationDelay: "0.5s" }} />
        <div className="absolute w-1 h-1 bg-emerald-500/60 rounded-full animate-[float_5s_ease-in-out_infinite]" style={{ top: "40%", left: "85%", animationDelay: "3s" }} />
        <div className="absolute w-2 h-2 bg-blue-400/35 rounded-full animate-[float_7.5s_ease-in-out_infinite]" style={{ top: "80%", left: "50%", animationDelay: "1.5s" }} />
        <div className="absolute w-1.5 h-1.5 bg-emerald-400/45 rounded-full animate-[float_6.5s_ease-in-out_infinite]" style={{ top: "10%", left: "70%", animationDelay: "2.5s" }} />
        <div className="absolute w-3 h-3 bg-blue-500/20 rounded-full animate-[float_10s_ease-in-out_infinite]" style={{ top: "50%", left: "30%", animationDelay: "4s" }} />
      </div>

      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[120px] animate-[pulse-slow_4s_ease-in-out_infinite]" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] animate-[pulse-slow_4s_ease-in-out_infinite]" style={{ animationDelay: "2s" }} />

      <div className={`relative z-10 flex flex-col items-center px-6 text-center max-w-md w-full transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"}`}>
        <div className="relative mb-8 group">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400 opacity-30 blur-lg animate-[gradient-shift_4s_ease-in-out_infinite]" />
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400 to-blue-600 opacity-50 blur-md animate-[spin-slow_8s_linear_infinite]" />
          <div className="relative w-28 h-28 rounded-3xl bg-[#0c1322] border border-white/15 flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-500">
            <span className="animate-[bike-bounce_2s_ease-in-out_infinite] inline-block">🚲</span>
          </div>
        </div>

        <span className="inline-block text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400 mb-3 border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 rounded-full animate-[fade-in-up_0.6s_ease-out_both]" style={{ animationDelay: "0.2s" }}>
          Nepal&apos;s Ride Hub
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2 animate-[fade-in-up_0.6s_ease-out_both]" style={{ animationDelay: "0.4s" }}>
          Bike<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Sewa</span>
        </h1>
        <p className="text-white/40 text-xs sm:text-sm font-medium tracking-wide mb-10 animate-[fade-in-up_0.6s_ease-out_both]" style={{ animationDelay: "0.6s" }}>
          Premium Motorcycle &amp; Scooter Rentals
        </p>

        <div className="w-full max-w-xs space-y-3 animate-[fade-in-up_0.6s_ease-out_both]" style={{ animationDelay: "0.8s" }}>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full transition-all duration-150 ease-out relative after:absolute after:inset-0 after:bg-white/20 after:animate-[shimmer_1.5s_linear_infinite]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-white/40">
            <span className="tracking-wide">{statusText}</span>
            <span className="font-mono text-emerald-400">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-center text-white/20 text-xs tracking-wider uppercase font-semibold animate-[fade-in-up_0.6s_ease-out_both]" style={{ animationDelay: "1s" }}>
        Kathmandu • Pokhara • Lalitpur
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.7; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.4; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.6; }
        }
        @keyframes bike-bounce {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes gradient-shift {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-[float_6s_ease-in-out_infinite] { animation: float 6s ease-in-out infinite; }
        .animate-[float_8s_ease-in-out_infinite] { animation: float 8s ease-in-out infinite; }
        .animate-[float_7s_ease-in-out_infinite] { animation: float 7s ease-in-out infinite; }
        .animate-[float_9s_ease-in-out_infinite] { animation: float 9s ease-in-out infinite; }
        .animate-[float_5s_ease-in-out_infinite] { animation: float 5s ease-in-out infinite; }
        .animate-[float_7.5s_ease-in-out_infinite] { animation: float 7.5s ease-in-out infinite; }
        .animate-[float_6.5s_ease-in-out_infinite] { animation: float 6.5s ease-in-out infinite; }
        .animate-[float_10s_ease-in-out_infinite] { animation: float 10s ease-in-out infinite; }
        .animate-[bike-bounce_2s_ease-in-out_infinite] { animation: bike-bounce 2s ease-in-out infinite; }
        .animate-[gradient-shift_4s_ease-in-out_infinite] { animation: gradient-shift 4s ease-in-out infinite; }
        .animate-[pulse-slow_4s_ease-in-out_infinite] { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-[spin-slow_8s_linear_infinite] { animation: spin-slow 8s linear infinite; }
        .animate-[shimmer_1.5s_linear_infinite] { animation: shimmer 1.5s linear infinite; }
      `}</style>
    </div>
  );
}