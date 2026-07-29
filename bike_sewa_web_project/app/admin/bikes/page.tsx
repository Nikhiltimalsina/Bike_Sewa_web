"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getBikesApi, Bike } from "@/api/bike.api";
import { adminDeleteBikeApi } from "@/api/admin.api";

export default function AdminBikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBikes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBikesApi();
      setBikes(data.bikes || []);
    } catch {
      setError("Failed to load bikes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;
    setDeletingId(id);
    try {
      await adminDeleteBikeApi(id);
      setBikes((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setError("Failed to delete bike");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Bikes</h1>
          <p className="text-white/40 text-sm mt-1">Manage all bikes on the platform</p>
        </div>
        <Link
          href="/admin/bikes/create"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-cyan-500/20"
        >
          + Add Bike
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
          <button onClick={() => setError("")} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 animate-pulse">
              <div className="h-4 w-48 bg-slate-700/50 rounded mb-2" />
              <div className="h-3 w-32 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      ) : bikes.length === 0 ? (
        <div className="text-center py-12 text-white/30">No bikes found</div>
      ) : (
        <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Bike</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Model</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Location</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Price/hr</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {bikes.map((bike) => (
                  <tr key={bike.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                          {bike.imageUrl && (
                            <img src={bike.imageUrl} alt={bike.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="font-semibold text-sm">{bike.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/60">{bike.model || "—"}</td>
                    <td className="px-5 py-4 text-sm text-white/60">{bike.location || "—"}</td>
                    <td className="px-5 py-4 text-sm font-mono">NPR {bike.pricePerHour}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          bike.isAvailable
                            ? "bg-green-500/20 text-green-400 border border-green-500/20"
                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                        }`}
                      >
                        {bike.isAvailable ? "Available" : "Rented"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/bikes/${bike.id}/edit`}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(bike.id)}
                          disabled={deletingId === bike.id}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          {deletingId === bike.id ? "..." : "Delete"}
                        </button>
                      </div>
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

