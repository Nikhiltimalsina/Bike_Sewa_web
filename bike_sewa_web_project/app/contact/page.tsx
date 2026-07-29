import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/components/LocationMap"), { ssr: false });

// Bike Sewa office — Thamel, Kathmandu, Nepal
const OFFICE_LOCATION: [number, number] = [27.7172, 85.3085];

const contactInfo = [
  { icon: "📞", title: "Phone Support", lines: ["+977-1-1234567", "Mon-Fri, 9am - 6pm"] },
  { icon: "✉️", title: "Email Address", lines: ["support@bikesewa.com.np", "We reply within 24 hours"] },
  { icon: "🏢", title: "Our Office", lines: ["Thamel, Kathmandu", "Bagmati Province, Nepal"] },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black">Get in Touch</h1>
          <p className="text-white/40 text-sm mt-3 max-w-md mx-auto">
            Have questions about renting or listing your bike? Our team in Kathmandu is ready to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-[#161b27] rounded-2xl border border-white/10 p-8">
            <ContactForm />
          </div>

          <div className="space-y-6">
            {contactInfo.map((info) => (
              <div key={info.title} className="flex gap-4 p-4 bg-[#161b27] rounded-xl border border-white/10 hover:border-blue-500/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-lg shrink-0">{info.icon}</div>
                <div>
                  <div className="font-bold text-sm">{info.title}</div>
                  {info.lines.map((line, i) => (
                    <p key={i} className="text-white/40 text-xs mt-0.5">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-[#161b27] rounded-2xl border border-white/10 overflow-hidden h-56">
              <LocationMap
                center={OFFICE_LOCATION}
                zoom={15}
                popupText="Bike Sewa Office — Thamel, Kathmandu, Nepal"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}