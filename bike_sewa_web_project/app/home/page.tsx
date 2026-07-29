"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBikesApi, Bike } from "@/api/bike.api";
import dynamic from "next/dynamic";

const BikeMap = dynamic(() => import("@/components/BikeMap"), { ssr: false });

const HOME_MAP_CENTER: [number, number] = [27.7172, 85.324];

export default function HomePage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBikesApi()
      .then((data) => setBikes((data.bikes || []).slice(0, 3)))
      .catch(() => setBikes([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden py-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1117]/60 to-[#0d1117]" />
        <div className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600&q=80')" }} />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 border border-blue-500/30 px-3 py-1 rounded-full">
            DISTRIBUTED IN KATHMANDU
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Ride the Peak of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Performance</span>
          </h1>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Premium motorcycles available across Nepal. Find your perfect ride and explore the Himalayas on two wheels.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/bikes" className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all text-sm">Explore Bikes →</Link>
            <Link href="/find-bikes" className="px-8 py-3.5 border border-white/20 hover:border-white/40 rounded-xl font-semibold text-white/70 hover:text-white transition-all text-sm">Find Near Me</Link>
          </div>
          <div className="flex justify-center gap-8 mt-8">
            {[ ["500+", "Bikes Available"], ["12", "Pickup Locations"], ["24/7", "Support"] ].map(([val, label]) => (
              <div key={String(label)} className="text-center">
                <div className="text-2xl font-black">{val}</div>
                <div className="text-white/40 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="w-full max-w-xl mx-auto mt-5">
            <div className="bg-[#161b27]/90 backdrop-blur border border-white/10 rounded-xl p-2.5 flex flex-col sm:flex-row gap-2">
              <input type="text" placeholder="🔍  Search by bike name or category..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 placeholder:text-white/30" />
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/60 outline-none">
                <option>All Types</option>
                <option>Sport</option>
                <option>Adventure</option>
                <option>Cruiser</option>
                <option>Scooter</option>
              </select>
              <Link href="/bikes" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-colors text-center">Search</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BIKES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black">Featured Motorcycles</h2>
            <p className="text-white/40 text-sm mt-1">Hand-picked premium rides for your journey</p>
          </div>
          <Link href="/bikes" className="text-sm text-blue-400 hover:text-blue-300">View All →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-white/40 py-10">Loading featured bikes...</div>
          ) : bikes.length === 0 ? (
            <div className="col-span-full text-center text-white/40 py-10">No bikes available right now.</div>
          ) : (bikes.map((bike) => (
            <div key={bike.id} className="group bg-[#161b27] rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all">
              <Link href={`/bikes/${bike.id}`} className="block relative h-48 bg-gradient-to-br from-blue-900/20 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: bike.imageUrl ? `url('${bike.imageUrl}')` : undefined }} />
                <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Popular
                </span>
              </Link>
              <div className="p-4">
                <div className="text-xs text-blue-400 font-semibold mb-1">{bike.model || "Bike"}</div>
                <Link href={`/bikes/${bike.id}`} className="block font-bold mb-2 hover:text-blue-400 transition-colors">{bike.name}</Link>
                <div className="flex items-center justify-between">
                  <div><span className="font-black">NPR {Number(bike.pricePerHour || 0).toLocaleString()}</span><span className="text-white/40 text-xs">/hour</span></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href={`/booking/${bike.id}`} className="flex-1 py-2 text-center rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-semibold border border-blue-500/20 transition-colors">Book Now</Link>
                  <Link href={`/bikes/${bike.id}`} className="flex-1 py-2 text-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 text-xs font-semibold border border-white/10 transition-colors">Details</Link>
                </div>
              </div>
            </div>
          )))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-[#0a0f1a] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black">The Bike Sewa Experience</h2>
            <p className="text-white/40 text-sm mt-2">Everything you need for the perfect ride</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-[#161b27] rounded-2xl border border-white/10 h-64 overflow-hidden">
              <BikeMap bikes={bikes} center={HOME_MAP_CENTER} zoom={12} height="256px" />
            </div>
            <div className="space-y-4">
              {[
                { icon: "📍", title: "Find Bikes Near You", desc: "Locate available motorcycles across Kathmandu and Pokhara in real-time." },
                { icon: "🔒", title: "Secure Booking", desc: "Book instantly with secure payment. Confirmed within seconds." },
                { icon: "🛡️", title: "Fully Insured Rides", desc: "Every rental includes comprehensive insurance coverage." },
                { icon: "⚡", title: "24/7 Roadside Assistance", desc: "We're always here if you need help on the road." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 bg-[#161b27] rounded-xl border border-white/10 hover:border-blue-500/20 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{item.title}</div>
                    <div className="text-white/40 text-xs mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}