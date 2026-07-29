"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getMyBookingsApi, Booking } from "@/api/booking.api";

type PaymentMethodItem = {
  id: string;
  icon: string;
  name: string;
  type: "card" | "esewa" | "khalti" | "bank";
  last4?: string | null;
  accountName?: string;
  isDefault: boolean;
  enabled: boolean;
};

const initialSavedMethods: PaymentMethodItem[] = [
  { id: "1", icon: "💳", name: "Visa Card", type: "card", last4: "4242", isDefault: true, enabled: true },
  { id: "2", icon: "🟢", name: "eSewa Wallet", type: "esewa", accountName: "Rider eSewa (9800000000)", isDefault: false, enabled: true },
  { id: "3", icon: "🔵", name: "Khalti Wallet", type: "khalti", accountName: "Rider Khalti", isDefault: false, enabled: true },
  { id: "4", icon: "🏦", name: "Nabil Bank Direct", type: "bank", last4: "9102", isDefault: false, enabled: true },
];

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethodItem[]>(initialSavedMethods);
  const [activeTab, setActiveTab] = useState<"methods" | "history">("methods");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Add Method Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newType, setNewType] = useState<"card" | "esewa" | "khalti" | "bank">("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoadingBookings(true);
        const data = await getMyBookingsApi();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Failed to load booking payment history", err);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  const handleRemoveMethod = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddMethodSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let icon = "💳";
    let name = "Credit Card";
    let last4: string | null = null;
    let accountName: string | undefined = undefined;

    if (newType === "card") {
      icon = "💳";
      name = "Visa / MasterCard";
      last4 = cardNumber.slice(-4) || "4321";
    } else if (newType === "esewa") {
      icon = "🟢";
      name = "eSewa Wallet";
      accountName = accountNumber ? `eSewa (${accountNumber})` : "eSewa Account";
    } else if (newType === "khalti") {
      icon = "🔵";
      name = "Khalti Wallet";
      accountName = accountNumber ? `Khalti (${accountNumber})` : "Khalti Account";
    } else if (newType === "bank") {
      icon = "🏦";
      name = "Bank Deposit";
      accountName = accountNumber ? `Bank Account (${accountNumber})` : "Direct Transfer";
    }

    const newMethod: PaymentMethodItem = {
      id: Date.now().toString(),
      icon,
      name,
      type: newType,
      last4,
      accountName,
      isDefault: methods.length === 0,
      enabled: true,
    };

    setMethods((prev) => [...prev, newMethod]);
    setIsAddModalOpen(false);
    setCardHolder("");
    setCardNumber("");
    setAccountNumber("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black">💳 Payment Methods & History</h1>
            <p className="text-white/40 text-sm mt-1">
              Manage saved credit cards, digital wallets, and view payment receipts.
            </p>
          </div>

          <div className="flex gap-2 bg-[#0c1322] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab("methods")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "methods"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Saved Methods ({methods.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "history"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Payment History
            </button>
          </div>
        </div>

        {/* TAB 1: SAVED PAYMENT METHODS */}
        {activeTab === "methods" && (
          <div className="space-y-6">
            <div className="bg-[#0c1322] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-black text-lg text-white">Your Payment Options</h2>
                  <p className="text-white/40 text-xs mt-0.5">Primary method will be used for instant bookings</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
                >
                  + Add New Method
                </button>
              </div>

              {methods.length === 0 ? (
                <div className="text-center py-10 text-white/30 text-xs">
                  No payment methods saved yet. Click "+ Add New Method" to get started.
                </div>
              ) : (
                <div className="space-y-3">
                  {methods.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                        m.isDefault
                          ? "border-emerald-500/40 bg-emerald-500/10 shadow-lg shadow-emerald-500/5"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                          {m.icon}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white flex items-center gap-2">
                            {m.name}
                            {m.last4 && (
                              <span className="text-white/50 text-xs font-mono font-normal">
                                •••• {m.last4}
                              </span>
                            )}
                          </div>
                          <div className="text-white/40 text-xs mt-0.5 flex items-center gap-2">
                            {m.accountName && <span>{m.accountName}</span>}
                            {m.isDefault && (
                              <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30">
                                Default Method
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        {!m.isDefault && (
                          <button
                            onClick={() => handleSetDefault(m.id)}
                            className="text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-all font-semibold"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMethod(m.id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-white/5 rounded-2xl border border-white/5 p-4 text-center text-xs text-white/40">
              🔒 End-to-end payment encryption. We support eSewa, Khalti, SCT, Visa, Mastercard, and Direct Bank Transfers across Nepal.
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENT HISTORY */}
        {activeTab === "history" && (
          <div className="bg-[#0c1322] rounded-3xl border border-white/10 p-6 sm:p-7 shadow-xl">
            <div className="mb-6">
              <h2 className="font-black text-lg text-white">Payment Transaction Log</h2>
              <p className="text-white/40 text-xs mt-0.5">Records of payments made for bike bookings</p>
            </div>

            {loadingBookings ? (
              <div className="text-center py-10 text-white/40 text-xs">Loading transaction history...</div>
            ) : bookings.filter((b) => b.status !== "cancelled").length === 0 ? (
              <div className="text-center py-10 text-white/30 text-xs">No completed transactions found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-white/40 border-b border-white/10 uppercase tracking-wider font-semibold">
                      <th className="pb-3">Transaction</th>
                      <th className="pb-3">Bike Model</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings
                      .filter((b) => b.status !== "cancelled")
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 font-mono text-white/60">TXN-{item.id?.slice(-8).toUpperCase()}</td>
                          <td className="py-3.5 font-bold text-white">{item.bikeName}</td>
                          <td className="py-3.5 text-white/60">
                            {new Date(item.startDate).toLocaleDateString()}
                          </td>
                          <td className="py-3.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              SUCCESS
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-black text-white">
                            NPR {Number(item.totalPrice || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADD PAYMENT METHOD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0c1322] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-lg"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-white mb-1">Add Payment Method</h3>
            <p className="text-white/40 text-xs mb-6">Select payment channel and save details</p>

            <form onSubmit={handleAddMethodSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-white/50 mb-2">
                  Payment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "card", label: "Credit Card", icon: "💳" },
                    { id: "esewa", label: "eSewa", icon: "🟢" },
                    { id: "khalti", label: "Khalti", icon: "🔵" },
                    { id: "bank", label: "Bank Transfer", icon: "🏦" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setNewType(item.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                        newType === item.id
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {newType === "card" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-white/50 mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="e.g. Aashish Sharma"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-white/50 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-emerald-400"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold uppercase text-white/50 mb-1">
                    {newType === "esewa"
                      ? "eSewa ID / Mobile Number"
                      : newType === "khalti"
                      ? "Khalti Registered Number"
                      : "Account Number / ID"}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                Save Payment Method
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
