
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d1117] border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-black text-white text-lg mb-3">
            <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-sm">🚲</span>
            Bike<span className="text-green-400">Sewa</span>
          </div>
          <p className="text-white/40 text-xs leading-relaxed">
            Premium motorcycle rentals across Nepal. Ride the peak of performance.
          </p>
          <div className="flex gap-3 mt-4">
            {["𝕏", "f", "in", "▶"].map((s, i) => (
              <button key={i} className="w-7 h-7 rounded-full border border-white/10 text-white/40 hover:border-white/30 hover:text-white text-xs transition-colors">{s}</button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold mb-3">Explore</h4>
          <div className="flex flex-col gap-2">
            {[["Bikes", "/bikes"], ["Find Bikes", "/find-bikes"], ["About Us", "/about"]].map(([l, h]) => (
              <Link key={h} href={h} className="text-white/40 text-xs hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold mb-3">Support</h4>
          <div className="flex flex-col gap-2">
            {[["Contact Us", "/contact"], ["Payment Methods", "/payment-methods"], ["Return Bike", "/return-bike"], ["Reviews", "/reviews"], ["Notifications", "/notifications"], ["My Account", "/my-account"], ["Profile", "/profile"]].map(([l, h]) => (
              <Link key={h} href={h} className="text-white/40 text-xs hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-bold mb-3">Newsletter</h4>
          <p className="text-white/40 text-xs mb-3">Get the latest bikes and offers.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="your@email.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500/50" />
            <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs text-white font-semibold transition-colors">→</button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-white/30 text-xs">© 2025 Bike Sewa. All rights reserved.</p>
        <div className="flex gap-4">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((t) => (
            <span key={t} className="text-white/30 text-xs hover:text-white cursor-pointer transition-colors">{t}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}