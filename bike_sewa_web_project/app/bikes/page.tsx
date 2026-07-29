"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBikesApi, Bike } from "@/api/bike.api";

const categories = ["All", "Sport", "Naked", "Cruiser", "Adventure", "Commuter"];

export default function BikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    const loadBikes = async () => {
      try {
        setLoading(true);
        const data = await getBikesApi(showAvailable);
        setBikes(data.bikes || []);
      } catch {
        setBikes([]);
      } finally {
        setLoading(false);
      }
    };
    loadBikes();
  }, [showAvailable]);

  const filtered = useMemo(() => {
    return bikes.filter((bike) => {
      const category = bike.model?.toLowerCase() || "";
      const matchCategory = activeCategory === "All" || category.includes(activeCategory.toLowerCase());
      return matchCategory;
    });
  }, [activeCategory, bikes]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Explore Bikes</h1>
          <p className="text-white/40 text-sm mt-1">Find your perfect motorcycle for any adventure</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-5 space-y-6 sticky top-20">
              <div>
                <h3 className="text-xs font-bold uppercase text-white/40 mb-3">Category</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${activeCategory === cat ? "bg-blue-600/20 text-blue-400 font-semibold" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-white/40 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {["Under NPR 1,500", "NPR 1,500 - 3,000", "NPR 3,000 - 5,000", "Above NPR 5,000"].map((r) => (
                    <label key={r} className="flex items-center gap-2 text-sm text-white/50 hover:text-white cursor-pointer">
                      <input type="checkbox" className="accent-blue-500" /> {r}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-white/40 mb-3">Availability</h3>
                <label className="flex items-center gap-2 text-sm text-white/50 cursor-pointer">
                  <input type="checkbox" checked={showAvailable} onChange={() => setShowAvailable(!showAvailable)} className="accent-blue-500" />
                  Available only
                </label>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-white/40 mb-3">Rating</h3>
                {[4, 3, 2].map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm text-white/50 hover:text-white cursor-pointer mb-1">
                    <input type="checkbox" className="accent-blue-500" />
                    {"★".repeat(r)}{"☆".repeat(5 - r)} & up
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-white/40 text-sm mb-5">{loading ? "Loading bikes..." : `${filtered.length} bikes found`}</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {!loading && filtered.length === 0 && (
                <div className="col-span-full rounded-2xl border border-white/10 bg-[#161b27] p-8 text-center text-sm text-white/50">
                  No bikes match the current filters.
                </div>
              )}
              {filtered.map((bike) => (
                <div key={bike.id} className="group bg-[#161b27] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all">
                  <div className="relative h-40 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: bike.imageUrl ? `url(${bike.imageUrl})` : undefined }} />
                    <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${bike.isAvailable ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                      {bike.isAvailable ? "Available" : "Booked"}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-blue-400 font-semibold mb-1">{bike.model || bike.location || "Bike"}</div>
                    <h3 className="font-bold text-sm mb-2">{bike.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div><span className="font-black">NPR {Number(bike.pricePerHour || 0).toLocaleString()}</span><span className="text-white/40 text-xs">/hour</span></div>
                      <div className="text-xs text-white/40">{bike.location || "Location available"}</div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/booking/${bike.id}`} className="flex-1 py-2 text-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors">Book Now</Link>
                      <Link href={`/bikes/${bike.id}`} className="flex-1 py-2 text-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-semibold border border-white/10 transition-colors">View</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}