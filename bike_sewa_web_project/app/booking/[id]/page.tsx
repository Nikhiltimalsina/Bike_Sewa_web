"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createBookingApi } from "@/api/booking.api";
import { getBikeByIdApi, Bike } from "@/api/bike.api";

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();

  // Unwrap params safely for Next.js 14 & Next.js 15
  const resolvedParams = params instanceof Promise ? React.use(params) : params;
  const bikeId = resolvedParams?.id;

  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tokenMissing, setTokenMissing] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form State
  const [pickupLocation, setPickupLocation] = useState("Thamel, Kathmandu");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Check authentication status on page load
  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (!token) {
      setTokenMissing(true);
    }
  }, []);

  // Calculate total price based on dates/hours
  const calculateTotal = () => {
    if (!startDate || !endDate || !bike?.pricePerHour) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return 0;

    // Minimum 1 hour duration calculation
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    return hours * bike.pricePerHour;
  };

  // Load bike details
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

  const handleSubmit = async () => {
    // 1. Check if the auth cookie exists (this is what the whole app uses)
    const token = Cookies.get("auth_token");

    if (!token) {
      setMessage({
        type: "error",
        text: "You are not logged in. Redirecting to login page...",
      });
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    // 2. Validate inputs
    if (!startDate || !endDate) {
      setMessage({
        type: "error",
        text: "Please select both start date/time and end date/time.",
      });
      return;
    }

    const totalAmount = calculateTotal();
    if (totalAmount <= 0) {
      setMessage({
        type: "error",
        text: "End date/time must be after start date/time.",
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await createBookingApi({
        bikeId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        pickupLocation,
        paymentMethod,
      });

      const successText =
        paymentMethod === "esewa" || paymentMethod === "khalti"
          ? `Booking confirmed! Pay NPR ${totalAmount.toLocaleString()} via ${
              paymentMethod === "esewa" ? "eSewa" : "Khalti"
            }.`
          : response.message || "Booking created successfully!";

      setMessage({ type: "success", text: successText });

      // Redirect to user bookings after 2 seconds
      setTimeout(() => {
        router.push("/my-account");
      }, 2000);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create booking";

      // If token is invalid or expired, redirect user to login
      if (
        errorMsg.toLowerCase().includes("token") ||
        errorMsg.toLowerCase().includes("unauthorized") ||
        error?.response?.status === 401
      ) {
        setMessage({
          type: "error",
          text: "Session expired or invalid token. Please log in again.",
        });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage({ type: "error", text: errorMsg });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60 font-medium">Loading bike details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loadError || !bike) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md bg-[#161b27] border border-white/10 p-8 rounded-2xl">
            <div className="text-6xl mb-4">🚲</div>
            <h2 className="text-2xl font-black mb-2">Bike Not Found</h2>
            <p className="text-white/50 text-sm mb-6">
              The bike you are trying to book could not be found or is no longer available.
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

      <div className="max-w-6xl mx-auto px-6 py-10 w-full">
        {/* Token Missing Banner */}
        {tokenMissing && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center justify-between text-sm">
            <span>⚠️ You are not logged in. Please log in before creating a booking.</span>
            <Link
              href="/login"
              className="px-4 py-1.5 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400"
            >
              Log In Now
            </Link>
          </div>
        )}

        {/* Header & Steps */}
        <div className="mb-8">
          <h1 className="text-3xl font-black">Complete Your Booking</h1>
          <div className="flex items-center gap-4 mt-4">
            {["Schedule", "Add-ons", "Payment"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= 1 ? "bg-blue-600 text-white" : "bg-white/10 text-white/40"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-sm ${
                    i <= 1 ? "text-white font-semibold" : "text-white/40"
                  }`}
                >
                  {step}
                </span>
                {i < 2 && <span className="text-white/20 mx-1">—</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Schedule Section */}
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>📅</span> Schedule & Pickup Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase mb-1 block">
                    Pickup Location
                  </label>
                  <input
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Thamel, Kathmandu"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase mb-1 block">
                    Drop Location
                  </label>
                  <input
                    value={pickupLocation}
                    readOnly
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/50 outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase mb-1 block">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/40 uppercase mb-1 block">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span>🔒</span> Select Payment Method
              </h2>

              <div className="flex gap-3 mb-5">
                {[
                  { id: "card", label: "Credit / Debit Card" },
                  { id: "esewa", label: "eSewa" },
                  { id: "khalti", label: "Khalti" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                      paymentMethod === m.id
                        ? "border-blue-500/50 bg-blue-600/10 text-blue-400"
                        : "border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-white/40 uppercase mb-1 block">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ram Bahadur Thapa"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/40 uppercase mb-1 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• ••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-white/40 uppercase mb-1 block">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-white/40 uppercase mb-1 block">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="•••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30"
                      />
                    </div>
                  </div>
                </div>
              ) : paymentMethod === "esewa" ? (
                <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                  <div className="text-4xl mb-2">🟢</div>
                  <h3 className="font-bold text-lg text-green-400">eSewa Mobile Wallet</h3>
                  <p className="text-white/40 text-xs mt-1 mb-4">
                    Enter your registered eSewa number
                  </p>
                  <input
                    type="text"
                    placeholder="98XXXXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-green-500/50 placeholder:text-white/30 text-center max-w-sm mx-auto"
                  />
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
                  <div className="text-4xl mb-2">🟣</div>
                  <h3 className="font-bold text-lg text-purple-400">Khalti Digital Wallet</h3>
                  <p className="text-white/40 text-xs mt-1 mb-4">
                    Enter your registered Khalti number
                  </p>
                  <input
                    type="text"
                    placeholder="98XXXXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500/50 placeholder:text-white/30 text-center max-w-sm mx-auto"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Summary & Confirmation */}
          <div>
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6 sticky top-20">
              <h3 className="font-bold text-lg mb-4">{bike?.name || "Selected Bike"}</h3>

              {bike?.imageUrl && (
                <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-slate-800 border border-white/10">
                  <img
                    src={bike.imageUrl}
                    alt={bike.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-white/50">Hourly Rate</span>
                  <span className="font-semibold">
                    NPR {Number(bike?.pricePerHour || 0).toLocaleString()}
                  </span>
                </div>

                {startDate && endDate && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-white/50">Start</span>
                      <span className="text-xs">{new Date(startDate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">End</span>
                      <span className="text-xs">{new Date(endDate).toLocaleString()}</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between font-black text-lg border-t border-white/10 pt-3 mt-2">
                  <span>Total Amount</span>
                  <span className="text-green-400">
                    NPR {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status/Error Messages */}
              {message && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${
                    message.type === "success"
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting || loading || !startDate || !endDate}
                className="w-full py-3.5 mt-5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing Booking..." : "Confirm & Pay →"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}