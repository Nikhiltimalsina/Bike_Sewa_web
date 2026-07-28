export default function FindBikesLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] animate-pulse">
      {/* Navbar */}
      <div className="h-14 bg-white/5 border-b border-white/10" />

      <div className="max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-6">
          <div className="h-8 w-56 bg-white/10 rounded-lg mb-2" />
          <div className="h-4 w-48 bg-white/5 rounded-lg" />
        </div>

        {/* Search / filter bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 h-10 bg-[#161b27] border border-white/10 rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-20 bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map skeleton */}
          <div className="bg-[#161b27] rounded-2xl border border-white/10" style={{ minHeight: "480px" }} />

          {/* List skeleton */}
          <div className="space-y-3" style={{ maxHeight: "480px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#161b27] rounded-xl border border-white/10 p-4 flex gap-4">
                <div className="w-24 h-20 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-white/10 rounded" />
                  <div className="h-3 w-24 bg-white/5 rounded" />
                  <div className="h-3 w-16 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

