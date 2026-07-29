"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type IconKey = "check" | "clock" | "tag" | "shield" | "lock";

const notifications = [
  { id: 1, type: "booking", icon: "check" as IconKey, title: "Booking Confirmed", message: "Your rental for Royal Enfield Himalayan has been confirmed for tomorrow at 8:00 AM.", time: "2 min ago", read: false, color: "green" },
  { id: 2, type: "reminder", icon: "clock" as IconKey, title: "Return Reminder", message: "Friendly reminder: your Honda CB500X is due for return in 2 hours. Please return to Thamel Hub.", time: "1 hr ago", read: false, color: "yellow" },
  { id: 3, type: "offer", icon: "tag" as IconKey, title: "Weekend Special: 25% OFF", message: "Planning a trip this weekend? Book any Honda DRP500 and get 25% off. Use code WEEKEND25.", time: "3 hrs ago", read: false, color: "blue" },
  { id: 4, type: "system", icon: "shield" as IconKey, title: "Profile Verified", message: "Your profile has been verified. You can now book high-capacity motorcycles.", time: "Yesterday", read: true, color: "purple" },
  { id: 5, type: "security", icon: "lock" as IconKey, title: "New Login Detected", message: "A new login was detected on Chrome on Windows. Wasn't you? Secure my account.", time: "Yesterday", read: true, color: "red" },
];

const colorMap: Record<string, string> = {
  green: "bg-green-500/10 border-green-500/20 text-green-400",
  yellow: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  red: "bg-red-500/10 border-red-500/20 text-red-400",
};

// Simple line-style SVG icons — no external icon library required, and no emoji.
function NotifIcon({ icon }: { icon: IconKey }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (icon) {
    case "check":
      return <svg {...common}><path d="M20 6 9 17l-5-5" /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>;
    case "tag":
      return <svg {...common}><path d="M12.59 2.59 3 12.17V21h8.83l9.58-9.59a2 2 0 0 0 0-2.82l-6-6a2 2 0 0 0-2.82 0Z" /><circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" /></svg>;
    case "shield":
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "lock":
      return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>;
  }
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState("all");
  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const markRead = (id: number) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));

  const filtered = notifs.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "booking") return n.type === "booking" || n.type === "reminder";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10 w-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black">Notifications</h1>
            <p className="text-white/40 text-sm mt-1">Stay updated with your booking activity and exclusive offers.</p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white transition-colors">
                Mark all read
              </button>
            )}
            <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 font-bold">
              {unreadCount} unread
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {["all", "unread", "booking"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-white/5 text-white/50 hover:text-white border border-white/10"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((notif) => (
            <div key={notif.id} onClick={() => markRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${notif.read ? "bg-[#161b27] border-white/10 opacity-70" : "bg-[#1a2030] border-white/10 hover:border-white/20"}`}>
              <div className="flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${colorMap[notif.color]}`}>
                  <NotifIcon icon={notif.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-bold text-sm ${notif.read ? "text-white/70" : "text-white"}`}>{notif.title}</h3>
                    <span className="text-xs text-white/30 shrink-0 ml-2">{notif.time}</span>
                  </div>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">{notif.message}</p>
                  {!notif.read && <span className="text-xs text-blue-400 font-semibold mt-2 inline-block">View Details &rarr;</span>}
                </div>
                {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}