export default function BikesLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117]">
      <div className="animate-pulse">
        {/* Navbar placeholder */}
        <div className="h-14 bg-white/5 border-b border-white/10" />

        <div className="max-w-7xl mx-auto px-6 py-10 w-full">
          {/* Title */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-white/10 rounded-lg mb-2" />
            <div className="h-4 w-72 bg-white/5 rounded-lg" />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar skeleton */}
            <aside className="lg:w-56 shrink-0">
              <div className="bg-[#161b27] rounded-2xl border border-white/10 p-5 space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 bg-white/10 rounded" />
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-3/4 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            </aside>

            {/* Grid skeleton */}
            <div className="flex-1">
              <div className="h-4 w-32 bg-white/5 rounded mb-5" />
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-[#161b27] rounded-2xl overflow-hidden border border-white/10">
                    <div className="h-40 bg-white/5" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 w-24 bg-white/10 rounded" />
                      <div className="h-4 w-32 bg-white/10 rounded" />
                      <div className="h-4 w-20 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

