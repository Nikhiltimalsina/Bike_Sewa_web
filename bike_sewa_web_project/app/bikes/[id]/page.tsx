"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBikeByIdApi, Bike } from "@/api/bike.api";

export default function BikeDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = params instanceof Promise ? React.use(params) : params;
  const bikeId = resolvedParams?.id;

  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!bikeId) return;

    const loadBike = async () => {
      try {
        setLoading(true);
        const response = await getBikeByIdApi(bikeId);
        if (!response?.bike) {
          setLoadError(true);
        } else {
          setBike(response.bike);
        }
      } catch {
        setLoadError(true);
        setBike(null);
      } finally {
        setLoading(false);
      }
    };

    loadBike();
  }, [bikeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white/60">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-medium">Loading bike details...</p>
        </div>
      </div>
    );
  }

  if (loadError || !bike) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md bg-[#161b27] border border-white/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-black mb-2">Bike Not Found</h2>
            <p className="text-white/50 text-sm mb-6">
              The bike you are looking for could not be found or is no longer available.
            </p>
            <Link
              href="/bikes"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm transition-colors"
            >
              Browse Available Bikes
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-6">
          <Link href="/" className="hover:text-white">Home</Link> /
          <Link href="/bikes" className="hover:text-white">Bikes</Link> /
          <span className="text-white">{bike.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — Bike Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-72 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-white/10">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{ backgroundImage: bike.imageUrl ? `url('${bike.imageUrl}')` : "url('/images/duke390.webp')" }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-blue-600/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                  {bike.model || "BIKE"}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur ${
                    bike.isAvailable ? "bg-green-500/80" : "bg-red-500/80"
                  }`}
                >
                  {bike.isAvailable ? "Available" : "Booked"}
                </span>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold mb-4">Technical Specifications</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {[["411cc", "Engine"], ["30 km/l", "Mileage"], ["5-Speed", "Gearbox"], ["195kg", "Weight"], ["21\"", "Chassis"]].map(([v, l]) => (
                  <div key={l} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-white font-bold text-sm">{v}</div>
                    <div className="text-white/40 text-xs mt-1">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold mb-3">Description</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                The {bike.name} is built for adventure and exploration. With high performance features, reliable engine, and sturdy handling, it's the perfect choice for navigating city roads or country tracks across Nepal.
              </p>
            </div>

            {/* Details */}
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold mb-3">Bike Details</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-white/60">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/35">Location</p>
                  <p className="mt-1 font-semibold text-white">{bike.location || "Available on request"}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-white/35">Price</p>
                  <p className="mt-1 font-semibold text-white">NPR {Number(bike.pricePerHour || 0).toLocaleString()} / hour</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Summary + Book Now */}
          <div>
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6 sticky top-20 space-y-5">
              <div>
                <h2 className="text-xl font-black mb-1">{bike.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-400 text-sm">★★★★★</span>
                  <span className="text-white/40 text-xs">(verified bike)</span>
                </div>
                <div>
                  <span className="text-3xl font-black">NPR {Number(bike.pricePerHour || 0).toLocaleString()}</span>
                  <span className="text-white/40 text-sm">/hour</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Location</span>
                  <span className="font-semibold">{bike.location || "Kathmandu"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Status</span>
                  <span className={bike.isAvailable ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                    {bike.isAvailable ? "Available" : "Booked"}
                  </span>
                </div>
              </div>

              <Link
                href={`/booking/${bikeId}`}
                className="block w-full py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm text-center transition-all shadow-lg shadow-blue-600/20"
              >
                Book Now →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}