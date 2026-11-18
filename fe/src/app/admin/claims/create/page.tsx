"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface VehicleOption {
  id: string;
  name: string;
  plateNumber: string;
  status: string;
}

export default function CreateClaimPage() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);

  // Form states
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [reporter, setReporter] = useState("");
  const [status, setStatus] = useState("Dalam Perbaikan");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [issue, setIssue] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Ambil daftar unit armada dari database
  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await api.get("/admin/vehicles");
        const list = res.data?.vehicles || [];
        const mapped = list.map((v: any) => ({
          id: String(v.id),
          name: v.full_name || `${v.brand || ""} ${v.model || ""}`.trim() || "Armada Kendaraan",
          plateNumber: v.plate_number || "-",
          status: v.status || "available",
        }));
        setVehicles(mapped);
        if (mapped.length > 0) {
          setSelectedVehicleId(mapped[0].id);
        }
      } catch (err) {
        console.error("Gagal memuat armada:", err);
      } finally {
        setIsLoadingVehicles(false);
      }
    }
    loadVehicles();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast("error", "Ukuran foto maksimal 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedVehicleId) {
      showToast("error", "Mohon pilih salah satu unit armada.");
      return;
    }

    if (!issue.trim()) {
      showToast("error", "Mohon jelaskan detail kerusakan atau kendala kendaraan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        vehicle_id: selectedVehicleId,
        reporter: reporter.trim() || "Petugas Pool Lapangan",
        status: status,
        estimated_cost: estimatedCost ? parseInt(estimatedCost.replace(/[^0-9]/g, ""), 10) : 0,
        issue: issue.trim(),
        photo: photo,
      };

      await api.post("/admin/claims", payload);
      showToast("success", "Laporan kerusakan armada berhasil dicatat ke sistem!");

      setTimeout(() => {
        router.push("/admin/claims");
      }, 1200);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Gagal menyimpan laporan kerusakan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Toast Notifikasi */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border text-sm font-bold transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-700"
              : "bg-rose-600 text-white border-rose-700"
          }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Link href="/admin/claims" className="hover:text-slate-700">
              Kerusakan & Klaim
            </Link>{" "}
            &rsaquo;
            <span className="text-slate-800 font-bold">Buat Laporan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Formulir Laporan Kerusakan & Klaim
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Catat kendala teknis armada di lapangan, baret bodi, atau jadwal perbaikan bengkel mitra.
          </p>
        </div>
        <Link
          href="/admin/claims"
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">report_problem</span>
            Detail Armada Kendaraan & Kerusakan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pilih Armada */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Unit Armada <span className="text-rose-500">*</span>
              </label>
              {isLoadingVehicles ? (
                <div className="h-11 rounded-xl bg-slate-100 animate-pulse" />
              ) : (
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer">
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.plateNumber}) - Status: {v.status}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Pelapor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Pelapor / Sumber Informasi</label>
              <input
                type="text"
                value={reporter}
                onChange={(e) => setReporter(e.target.value)}
                placeholder="Contoh: Petugas Pool / Driver Asep / Pelanggan"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Status Penanganan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Status Penanganan</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer">
                <option value="Pending">Pending (Menunggu Antrian Bengkel)</option>
                <option value="Dalam Perbaikan">Dalam Perbaikan (Sedang di Bengkel)</option>
                <option value="Selesai">Selesai (Sudah Diperbaiki / Tersedia)</option>
              </select>
            </div>

            {/* Estimasi Biaya */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Estimasi Biaya Perbaikan (Rp)</label>
              <input
                type="text"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                placeholder="Contoh: 350000"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Unggah Foto Kerusakan */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Foto Bukti Kerusakan</label>
              <div className="flex items-center gap-3">
                <label className="h-11 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors shrink-0">
                  <span className="material-symbols-outlined text-lg">add_a_photo</span>
                  <span>{photo ? "Ganti Foto" : "Unggah Foto Bukti"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
                {photo && (
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <img src={photo} alt="Bukti" className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="text-[11px] text-slate-400">
                  {photo ? "Foto berhasil dipilih." : "Format JPG/PNG maks 8MB"}
                </span>
              </div>
            </div>

            {/* Deskripsi Kerusakan */}
            <div className="space-y-1.5 sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700">
                Deskripsi Kerusakan / Keluhan Fisik <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Jelaskan detail kendala, contoh: Baret bemper kiri depan terkena trotoar, perlu cat ulang dan poles..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"></textarea>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/claims"
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
            <span className="material-symbols-outlined text-[18px]">
              {isSubmitting ? "hourglass_top" : "save"}
            </span>
            <span>{isSubmitting ? "Menyimpan..." : "Kirim Laporan Kerusakan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
