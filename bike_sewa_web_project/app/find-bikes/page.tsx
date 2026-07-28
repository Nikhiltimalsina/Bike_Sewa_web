"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import { getBikesApi, Bike } from "@/api/bike.api";

const BikeMap = dynamic(() => import("@/components/BikeMap"), { ssr: false });

const FIND_BIKES_MAP_CENTER: [number, number] = [28.3949, 84.1240];

export default function FindBikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getBikesApi();
        setBikes(data.bikes || []);
      } catch {
        setBikes([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = bikes.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
      (b.location || "").toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchesSearch;
    if (filter === "available") return matchesSearch && b.isAvailable;
    return matchesSearch && (b.model || "").toLowerCase() === filter;
  });

  const distance = (index: number) => `${(0.3 + index * 0.5).toFixed(1)} km`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-black">Find Bikes Near You</h1>
          <p className="text-white/40 text-sm mt-1">Explore available bikes across Kathmandu Valley</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" placeholder="🔍  Search location or bike name..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#161b27] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30" />
          <div className="flex gap-2">
            {["all", "available", "sport", "adventure"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-white/5 text-white/50 hover:text-white border border-white/10"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Real Map */}
          <div className="rounded-2xl overflow-hidden border border-white/10" style={{ minHeight: "480px" }}>
            {loading ? (
              <div className="w-full h-full min-h-[480px] bg-[#161b27] flex items-center justify-center text-white/40 text-sm">
                Loading map...
              </div>
            ) : (
              <BikeMap bikes={filtered} center={FIND_BIKES_MAP_CENTER} zoom={7} />
            )}
          </div>

          {/* List */}
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: "480px" }}>
            {loading && (
              <div className="text-center text-white/40 text-sm py-8">Loading bikes...</div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center text-white/40 text-sm py-8">No bikes match your search.</div>
            )}
            {filtered.map((bike, i) => (
              <div key={bike.id} className="bg-[#161b27] rounded-xl border border-white/10 hover:border-blue-500/30 transition-all p-4 flex gap-4">
                <div className="w-24 h-20 rounded-xl bg-slate-800 overflow-hidden shrink-0 relative">
                  <div className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: bike.imageUrl ? `url(${bike.imageUrl})` : "url('/images/duke390.webp')" }} />
                  {bike.isAvailable && (
                    <span className="absolute top-1 left-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded font-bold">✓</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-sm">{bike.name}</h3>
                    <span className="text-xs text-white/40 shrink-0 ml-2">📍 {distance(i)}</span>
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">{bike.location || "Kathmandu"}, Nepal</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-white/50">{(4 + (i % 10) * 0.1).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div><span className="font-black text-sm">NPR {bike.pricePerHour?.toLocaleString() || 0}</span><span className="text-white/40 text-xs">/hour</span></div>
                    <Link href={`/bikes/${bike.id}`}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${bike.isAvailable !== false ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-white/5 text-white/30 cursor-not-allowed"}`}>
                      {bike.isAvailable !== false ? "Book" : "Unavailable"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}