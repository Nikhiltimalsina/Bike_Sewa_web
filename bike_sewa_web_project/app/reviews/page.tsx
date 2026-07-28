// PATH: app/reviews/page.tsx
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pastRentals = [
  { id: 1, bike: "Royal Enfield Classic 350", date: "Nov 2023", amount: "NPR 15,000", location: "Pokhara Valley Tour", reviewed: false, image: "/images/royal%20enfield.avif" },
  { id: 2, bike: "Yamaha MT-15", date: "Aug 2023", amount: "NPR 5,600", location: "Kathmandu City", reviewed: true, rating: 4, comment: "Great bike for city rides.", image: "/images/mt15.jpeg" },
];

export default function ReviewsPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0 || !comment.trim()) return;
    setSubmitted(true);
    setTimeout(() => { setSelected(null); setRating(0); setComment(""); setSubmitted(false); }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Your Ride Experience</h1>
          <p className="text-white/40 text-sm mt-1">Rate your last rides and help the community.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="font-bold text-lg">Rate your experience</h2>
            {pastRentals.map((rental) => (
              <div key={rental.id} className={`bg-[#161b27] rounded-2xl border p-5 transition-all ${selected === rental.id ? "border-blue-500/50" : "border-white/10"}`}>
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-12 rounded-xl bg-slate-800 overflow-hidden relative shrink-0">
                    <div className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url('${rental.image}')` }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{rental.bike}</h3>
                    <p className="text-white/40 text-xs">{rental.location} • {rental.date} • {rental.amount}</p>
                    {rental.reviewed ? (
                      <div className="mt-2">
                        <div className="text-yellow-400 text-sm">{"★".repeat(rental.rating!)}{"☆".repeat(5 - rental.rating!)}</div>
                        <p className="text-white/40 text-xs mt-1">{rental.comment}</p>
                      </div>
                    ) : (
                      <button onClick={() => setSelected(rental.id)}
                        className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30 transition-colors font-semibold">
                        + Write Review
                      </button>
                    )}
                  </div>
                </div>
                {selected === rental.id && !rental.reviewed && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-white/40 uppercase mb-2">Your Rating</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(star)}
                            className={`text-2xl transition-colors ${(hovered || rating) >= star ? "text-yellow-400" : "text-white/20"}`}>★</button>
                        ))}
                      </div>
                    </div>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience..." rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30 resize-none" />
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleSubmit} className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition-colors">
                        {submitted ? "✓ Submitted!" : "Submit Review"}
                      </button>
                      <button onClick={() => setSelected(null)} className="px-5 py-2 border border-white/10 rounded-xl text-sm text-white/50 hover:text-white transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-5xl font-black">4.8</div>
                  <div className="text-yellow-400 text-lg mt-1">★★★★★</div>
                  <div className="text-white/40 text-xs mt-1">Based on 2,341 reviews</div>
                </div>
              </div>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pcts: Record<number, number> = { 5: 78, 4: 14, 3: 5, 2: 2, 1: 1 };
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-xs text-white/40 w-4">{stars}</span>
                      <span className="text-yellow-400 text-xs">★</span>
                      <div className="flex-1 bg-white/10 rounded-full h-1.5">
                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pcts[stars]}%` }} />
                      </div>
                      <span className="text-xs text-white/40 w-8">{pcts[stars]}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#161b27] rounded-2xl border border-white/10 p-6">
              <h3 className="font-bold mb-4">Community Ratings</h3>
              <div className="space-y-3">
                {[["Overall", 4.8], ["Bike Quality", 4.9], ["Service", 4.7], ["Value", 4.6]].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-white/60">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-white/10 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(Number(val) / 5) * 100}%` }} />
                      </div>
                      <span className="text-sm font-bold">{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}