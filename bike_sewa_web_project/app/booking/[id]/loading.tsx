export default function BookingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white/60">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm">Loading booking details...</p>
      </div>
    </div>
  );
}

