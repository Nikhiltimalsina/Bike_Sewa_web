
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  // Static server-rendered component - fast initial load
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
      <Navbar />

      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/images/royal enfield.avif')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3 block">DISTRIBUTED IN KATHMANDU</span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Redefining Mobility<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Across the Himalayas</span>
          </h1>
          <p className="text-white/60 text-base mt-4 max-w-xl">
            Bike Sewa's mission is to provide high-performance motorcycles and create a thriving community of riders.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-6 mb-16">
          {[["500+", "Bikes in Fleet", "bg-blue-600"], ["12", "Pickup Locations", "bg-indigo-500"], ["24/7", "Support Available", "bg-green-600"]].map(([v, l, c]) => (
            <div key={l} className={`${c} rounded-2xl p-6 text-center`}>
              <div className="text-4xl font-black text-white">{v}</div>
              <div className="text-white/70 text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-black mb-4">🚀 Our Mission</h2>
            <p className="text-white/50 leading-relaxed mb-4">
              Bike Sewa was founded with a simple vision — to give every adventurer access to premium motorcycles without the burden of ownership. We believe exploring Nepal should be accessible, exciting, and safe for everyone.
            </p>
            <p className="text-white/50 leading-relaxed">
              Our platform connects passionate riders with a curated fleet of motorcycles, from nimble city scooters to rugged adventure bikes built for the mountain passes of the Himalayas.
            </p>
          </div>
          <div className="relative h-72 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/images/duke390.webp')" }} />
          </div>
        </div>

        <div className="bg-[#161b27] rounded-2xl border border-white/10 p-8 mb-16">
          <h2 className="text-2xl font-black mb-2">Safety First. Performance Always.</h2>
          <p className="text-white/40 text-sm mb-8">Every bike in our fleet goes through rigorous safety checks before every rental.</p>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {[
                { icon: "🔧", title: "Rigorous Inspection", desc: "Every motorcycle undergoes a 50-point safety inspection before being available for rent." },
                { icon: "⛑️", title: "Premium Gear", desc: "We provide certified helmets and safety gear as part of every rental package." },
                { icon: "🚗", title: "Roadside Assistance", desc: "Our 24/7 roadside assistance ensures you're never stranded on your adventure." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-bold text-sm">{item.title}</div>
                    <div className="text-white/40 text-xs mt-0.5 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative h-60 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/r15v3.webp')" }} />
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black">Our Service Ecosystem</h2>
          <p className="text-white/40 text-sm mt-2">Designed for riders who demand the best from every mile.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: "📱", title: "Digital Booking", desc: "Book any motorcycle in under 2 minutes through our seamless app or website, 24/7." },
            { icon: "✔️", title: "Verified Fleet", desc: "Every bike is verified and performance-tested. We only list bikes we'd ride ourselves." },
            { icon: "📍", title: "Fleet Drop", desc: "We deliver the bike directly to your desired location within Kathmandu valley." },
          ].map((s) => (
            <div key={s.title} className="bg-[#161b27] rounded-2xl border border-white/10 p-6 hover:border-blue-500/20 transition-colors">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="font-bold mb-2">{s.title}</div>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-2xl border border-blue-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black">Ready to ride?</h3>
            <p className="text-white/40 text-sm mt-1">Experience the thrill of Nepal's roads on two wheels.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/bikes" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm transition-colors">Explore Bikes</Link>
            <Link href="/contact" className="px-6 py-3 border border-white/20 hover:border-white/40 rounded-xl text-white/70 font-semibold text-sm transition-colors">Contact Us</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}