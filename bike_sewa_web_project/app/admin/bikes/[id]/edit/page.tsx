"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBikeByIdApi } from "@/api/bike.api";
import { adminUpdateBikeApi } from "@/api/admin.api";

export default function EditBikePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    modelName: "",
    location: "",
    latitude: "",
    longitude: "",
    pricePerHour: "",
    imageUrl: "",
    isAvailable: true,
  });

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const data = await getBikeByIdApi(id);
        if (data.bike) {
          setForm({
            name: data.bike.name || "",
            modelName: data.bike.model || "",
            location: data.bike.location || "",
            latitude: data.bike.latitude?.toString() || "",
            longitude: data.bike.longitude?.toString() || "",
            pricePerHour: data.bike.pricePerHour?.toString() || "",
            imageUrl: data.bike.imageUrl || "",
            isAvailable: data.bike.isAvailable ?? true,
          });
        }
      } catch {
        setError("Failed to load bike");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      await adminUpdateBikeApi(id, {
        name: form.name || undefined,
        modelName: form.modelName || undefined,
        location: form.location || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        pricePerHour: form.pricePerHour ? parseInt(form.pricePerHour, 10) : undefined,
        imageUrl: form.imageUrl || undefined,
        isAvailable: form.isAvailable,
      });
      router.push("/admin/bikes");
    } catch {
      setError("Failed to update bike");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/10 rounded" />
          <div className="h-96 bg-[#161b27] border border-white/10 rounded-xl p-6">
            <div className="h-4 w-full bg-white/10 rounded mb-4" />
            <div className="h-4 w-3/4 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const inputBase =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Edit Bike</h1>
        <p className="text-white/40 text-sm mt-1">Update bike details</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#161b27] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Bike Name</label>
            <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Model</label>
            <input type="text" value={form.modelName} onChange={(e) => updateField("modelName", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Location</label>
            <input type="text" value={form.location} onChange={(e) => updateField("location", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Price per Hour (NPR)</label>
            <input type="number" value={form.pricePerHour} onChange={(e) => updateField("pricePerHour", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Latitude</label>
            <input type="text" value={form.latitude} onChange={(e) => updateField("latitude", e.target.value)} className={inputBase} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Longitude</label>
            <input type="text" value={form.longitude} onChange={(e) => updateField("longitude", e.target.value)} className={inputBase} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase text-white/40">Image URL</label>
          <input type="text" value={form.imageUrl} onChange={(e) => updateField("imageUrl", e.target.value)} className={inputBase} />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isAvailable"
            checked={form.isAvailable}
            onChange={(e) => updateField("isAvailable", e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5"
          />
          <label htmlFor="isAvailable" className="text-sm text-white/60">Bike is available for rent</label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
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

