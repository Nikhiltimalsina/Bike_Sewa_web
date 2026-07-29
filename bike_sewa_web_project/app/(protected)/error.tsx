"use client";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white px-4">
      <div className="max-w-md text-center">
        <div className="text-4xl mb-4">🚲</div>
        <h1 className="text-2xl font-black mb-2">Something went wrong</h1>
        <p className="text-white/50 text-sm mb-6">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

