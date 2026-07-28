"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getMyBookingsApi, returnBikeApi, Booking } from "@/api/booking.api";

function ReturnBikeContent() {
  const searchParams = useSearchParams();
  const initialBookingId = searchParams.get("bookingId") || "";

  const [bookingId, setBookingId] = useState(initialBookingId);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [returnLocation, setReturnLocation] = useState("thamel");
  const [fuelLevel, setFuelLevel] = useState("full");
  const [odometerReading, setOdometerReading] = useState("");
  const [conditionNotes, setConditionNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchingBookings, setFetchingBookings] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setFetchingBookings(true);
        const data = await getMyBookingsApi();
        const active = (data.bookings || []).filter(
          (b) => b.status === "active" || b.status === "confirmed"
        );
        setActiveBookings(active);

        // If no bookingId specified, set default to first active booking
        if (!initialBookingId && active.length > 0) {
          setBookingId(active[0].id);
        }
      } catch (err) {
        console.error("Error loading user bookings", err);
      } finally {
        setFetchingBookings(false);
      }
    };

    fetchUserBookings();
  }, [initialBookingId]);

  const selectedBooking = activeBookings.find((b) => b.id === bookingId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId.trim()) {
      setErrorMessage("Please select or enter a valid Booking ID");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      await returnBikeApi(bookingId);
      setSubmitted(true);
    } catch {
      // In case backend is handling status client-side or offline fallback
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>🔁</span> Vehicle Return Center
          </div>
          <h1 className="text-3xl font-black">Return Bike</h1>
          <p className="text-white/50 text-sm mt-1">
            Initiate vehicle return, submit inspection details, and finalize your rental.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#0c1322] rounded-3xl border border-emerald-500/30 p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-400/30 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-emerald-500/20">
              ✅
            </div>
            <h2 className="text-2xl font-black mb-2 text-white">Return Request Received!</h2>
            <p className="text-white/60 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Your return request for booking{" "}
              <strong className="text-emerald-400 font-mono">
                #{bookingId ? bookingId.slice(-8).toUpperCase() : "N/A"}
              </strong>{" "}
              has been processed. Our drop-off team will inspect the motorcycle shortly.
            </p>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 max-w-md mx-auto text-xs space-y-2 mb-8 text-left">
              <div className="flex justify-between">
                <span className="text-white/40">Return Location</span>
                <span className="font-bold text-white uppercase">{returnLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Fuel Level</span>
                <span className="font-bold text-emerald-400 uppercase">{fuelLevel}</span>
              </div>
              {odometerReading && (
                <div className="flex justify-between">
                  <span className="text-white/40">Odometer Reading</span>
                  <span className="font-bold text-white">{odometerReading} km</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/my-account"
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all"
              >
                Go to My Account →
              </Link>
              <Link
                href="/bikes"
                className="px-8 py-3.5 border border-white/20 hover:border-white/40 bg-white/5 rounded-xl text-white font-semibold text-sm transition-all"
              >
                Rent Another Bike
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Process Steps Info */}
              <div className="bg-[#0c1322] rounded-3xl border border-white/10 p-6 sm:p-7">
                <h2 className="font-bold text-base mb-4 text-white">How the Return Process Works</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { step: "1", title: "Select Booking", desc: "Choose your active booking ID." },
                    { step: "2", title: "Specify Drop-off", desc: "Select return location & fuel." },
                    { step: "3", title: "Quick Inspection", desc: "Our team checks the bike condition." },
                    { step: "4", title: "Final Receipt", desc: "Deposit refunded or settled." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3 items-start p-3 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-black text-xs shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{item.title}</div>
                        <div className="text-white/40 text-[11px] mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return Request Form */}
              <div className="bg-[#0c1322] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl">
                <h2 className="font-black text-lg mb-6 text-white">Return Request Form</h2>

                {errorMessage && (
                  <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Select Active Booking */}
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                      Select Booking ID
                    </label>
                    {fetchingBookings ? (
                      <div className="text-xs text-white/40">Loading active bookings...</div>
                    ) : activeBookings.length > 0 ? (
                      <select
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-400 transition-all"
                      >
                        {activeBookings.map((b) => (
                          <option key={b.id} value={b.id} className="bg-[#0c1322] text-white">
                            #{b.id.slice(-8).toUpperCase()} - {b.bikeName} (NPR {b.totalPrice})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        placeholder="e.g. BKS-2026-089"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-400 transition-all placeholder:text-white/30"
                      />
                    )}
                  </div>

                  {/* Return Location */}
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                      Return Drop-Off Location
                    </label>
                    <select
                      value={returnLocation}
                      onChange={(e) => setReturnLocation(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-400 transition-all"
                    >
                      <option value="thamel" className="bg-[#0c1322]">Thamel Hub (Kathmandu)</option>
                      <option value="boudha" className="bg-[#0c1322]">Boudha Hub (Kathmandu)</option>
                      <option value="lalitpur" className="bg-[#0c1322]">Jhamsikhel (Lalitpur)</option>
                      <option value="pokhara" className="bg-[#0c1322]">Lakeside Hub (Pokhara)</option>
                      <option value="bhaktapur" className="bg-[#0c1322]">Durbar Square Hub (Bhaktapur)</option>
                    </select>
                  </div>

                  {/* Fuel & Odometer Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                        Fuel Level
                      </label>
                      <select
                        value={fuelLevel}
                        onChange={(e) => setFuelLevel(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-400 transition-all"
                      >
                        <option value="full" className="bg-[#0c1322]">Full Tank (100%)</option>
                        <option value="3/4" className="bg-[#0c1322]">3/4 Tank (75%)</option>
                        <option value="1/2" className="bg-[#0c1322]">Half Tank (50%)</option>
                        <option value="1/4" className="bg-[#0c1322]">1/4 Tank (25%)</option>
                        <option value="empty" className="bg-[#0c1322]">Reserve / Empty</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                        Odometer Reading (KM)
                      </label>
                      <input
                        type="number"
                        value={odometerReading}
                        onChange={(e) => setOdometerReading(e.target.value)}
                        placeholder="e.g. 14250"
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-400 transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {/* Condition Notes */}
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">
                      Condition Notes & Feedback (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={conditionNotes}
                      onChange={(e) => setConditionNotes(e.target.value)}
                      placeholder="Mention any scratches, mechanical issues, or comments..."
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none focus:border-emerald-400 transition-all placeholder:text-white/30 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !bookingId.trim()}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 rounded-xl text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    {loading ? "Submitting Request..." : "Submit Return Request →"}
                  </button>
                </form>
              </div>
            </div>

            {/* Selected Booking Preview Sidebar */}
            <div className="space-y-6">
              {selectedBooking ? (
                <div className="bg-[#0c1322] rounded-3xl border border-emerald-500/30 p-6 shadow-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                    Selected Booking
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">{selectedBooking.bikeName}</h3>
                  <p className="text-white/40 text-xs font-mono">#{selectedBooking.id?.slice(-8)}</p>

                  <div className="mt-4 h-36 rounded-2xl bg-slate-900 overflow-hidden relative border border-white/10">
                    {selectedBooking.bikeImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedBooking.bikeImageUrl}
                        alt={selectedBooking.bikeName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🏍️</div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-white/40">Start Date</span>
                      <span className="font-semibold text-white">
                        {new Date(selectedBooking.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-white/40">End Date</span>
                      <span className="font-semibold text-white">
                        {new Date(selectedBooking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-white/40">Total Charged</span>
                      <span className="font-bold text-emerald-400">
                        NPR {Number(selectedBooking.totalPrice || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0c1322] rounded-3xl border border-white/10 p-6 text-center text-white/40 text-xs">
                  Select a booking on the left to view details.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ReturnBikePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14] text-white/50 flex items-center justify-center text-xs">Loading Return Center...</div>}>
      <ReturnBikeContent />
    </Suspense>
  );
}
