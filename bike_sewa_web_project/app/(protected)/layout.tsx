"use client";

import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161b27]">
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}