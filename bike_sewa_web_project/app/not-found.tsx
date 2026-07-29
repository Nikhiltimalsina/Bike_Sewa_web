import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white px-4">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">🚲</div>
        <h1 className="text-3xl font-black mb-2">Page Not Found</h1>
        <p className="text-white/50 text-sm mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/home"
          className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-semibold transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

