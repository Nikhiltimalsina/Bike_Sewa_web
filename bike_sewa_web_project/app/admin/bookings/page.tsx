"use client";

import { useEffect, useState, useCallback } from "react";
import {
  adminGetAllBookingsApi,
  adminUpdateBookingStatusApi,
  AdminBooking,
} from "@/api/admin.api";

const STATUS_OPTIONS = ["confirmed", "ongoing", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminGetAllBookingsApi();
      setBookings(data.bookings || []);
    } catch {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await adminUpdateBookingStatusApi(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch {
      setError("Failed to update booking status");
    }
  };

  const filteredBookings = statusFilter
    ? bookings.filter((b) => b.status === statusFilter)
    : bookings;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Bookings</h1>
          <p className="text-white/40 text-sm mt-1">Manage all platform bookings</p>
        </div>
        <span className="text-sm text-slate-500 bg-[#0f172a] border border-slate-700/50 px-3 py-1.5 rounded-lg">{bookings.length} total</span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
          <button onClick={() => setError("")} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {/* Status filter */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setStatusFilter("")}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
            !statusFilter
              ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
              : "bg-[#0f172a] border-slate-700/50 text-slate-400 hover:text-slate-200"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-all ${
              statusFilter === status
                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                : "bg-[#0f172a] border-slate-700/50 text-slate-400 hover:text-slate-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 animate-pulse">
              <div className="h-4 w-48 bg-slate-700/50 rounded mb-2" />
              <div className="h-3 w-32 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {statusFilter ? `No bookings with status "${statusFilter}"` : "No bookings found"}
        </div>
      ) : (
        <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Bike</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Dates</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                          {booking.bikeImageUrl && (
                            <img src={booking.bikeImageUrl} alt={booking.bikeName} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-semibold text-sm">{booking.bikeName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/60">
                      {booking.user?.fullName || booking.userId?.slice(-8) || "—"}
                    </td>
                    <td className="px-5 py-4 text-sm text-white/60">
                      <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                      <div className="text-xs text-white/30">→ {new Date(booking.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-mono">NPR {Number(booking.totalPrice).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                          booking.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/20"
                            : booking.status === "ongoing"
                            ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                            : booking.status === "completed"
                            ? "bg-green-500/20 text-green-400 border-green-500/20"
                            : "bg-red-500/20 text-red-400 border-red-500/20"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="text-xs px-2 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white outline-none cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-[#161b27]">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

