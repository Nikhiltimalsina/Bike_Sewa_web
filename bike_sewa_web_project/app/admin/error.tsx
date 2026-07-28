"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="text-3xl mb-3">🚲</div>
        <h2 className="text-lg font-bold mb-2">Dashboard Error</h2>
        <p className="text-white/50 text-sm mb-4">{error.message || "Something went wrong"}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

