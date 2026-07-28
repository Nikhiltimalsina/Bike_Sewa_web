"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreateBikeApi } from "@/api/admin.api";

export default function CreateBikePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    modelName: "",
    location: "",
    latitude: "",
    longitude: "",
    pricePerHour: "",
    imageUrl: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.modelName || !form.location || !form.latitude || !form.longitude || !form.pricePerHour) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      await adminCreateBikeApi({
        name: form.name,
        modelName: form.modelName,
        location: form.location,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        pricePerHour: parseInt(form.pricePerHour, 10),
        imageUrl: form.imageUrl || undefined,
      });
      router.push("/admin/bikes");
    } catch {
      setError("Failed to create bike");
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Add New Bike</h1>
        <p className="text-white/40 text-sm mt-1">Add a new bike to the platform</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#161b27] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Bike Name *</label>
            <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Duke 250" className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Model *</label>
            <input type="text" value={form.modelName} onChange={(e) => updateField("modelName", e.target.value)} placeholder="e.g. 2024" className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Location *</label>
            <input type="text" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Kathmandu" className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Price per Hour (NPR) *</label>
            <input type="number" value={form.pricePerHour} onChange={(e) => updateField("pricePerHour", e.target.value)} placeholder="e.g. 500" className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Latitude *</label>
            <input type="text" value={form.latitude} onChange={(e) => updateField("latitude", e.target.value)} placeholder="e.g. 27.7172" className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Longitude *</label>
            <input type="text" value={form.longitude} onChange={(e) => updateField("longitude", e.target.value)} placeholder="e.g. 85.3240" className={inputBase} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Image URL (optional)</label>
          <input type="text" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} placeholder="https://example.com/bike.jpg" className={inputBase} />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Bike"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/bikes")}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

