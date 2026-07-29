export default function HomeLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] animate-pulse">
      {/* Navbar */}
      <div className="h-14 bg-white/5 border-b border-white/10" />

      {/* Hero skeleton */}
      <div className="relative min-h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1117]/60 to-[#0d1117]" />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <div className="h-6 w-48 bg-white/5 rounded-full mx-auto mb-6" />
          <div className="h-16 w-3/4 bg-white/10 rounded-lg mx-auto mb-4" />
          <div className="h-4 w-1/2 bg-white/5 rounded-lg mx-auto mb-8" />
          <div className="flex gap-3 justify-center">
            <div className="h-12 w-40 bg-white/10 rounded-xl" />
            <div className="h-12 w-36 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Featured bikes skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="h-8 w-56 bg-white/10 rounded-lg mb-4" />
        <div className="h-4 w-80 bg-white/5 rounded-lg mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#161b27] rounded-2xl overflow-hidden border border-white/10">
              <div className="h-48 bg-white/5" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-20 bg-white/10 rounded" />
                <div className="h-5 w-40 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

