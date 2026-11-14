"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateClaimPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/claims");
    }, 1000);
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
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
            Catat kendala teknis kendaraan atau kerusakan fisik akibat pemakaian di lapangan.
          </p>
        </div>
        <Link
          href="/admin/claims"
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">report_problem</span>
            Detail Unit & Keluhan Kerusakan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Pilih Unit Kendaraan</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600">
                <option value="">-- Pilih Armada --</option>
                <option value="pajero">Mitsubishi Pajero (E 5555 LJ)</option>
                <option value="brio">Honda Brio RS (D 2091 AGH)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Pelapor / Sumber Informasi</label>
              <input
                type="text"
                placeholder="Contoh: Asha (Penyewa) / Acep (Driver)"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Status Penanganan</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600">
                <option value="pending">Pending (Belum Ditangani)</option>
                <option value="bengkel">Dalam Perbaikan (Bengkel)</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700">Deskripsi Kerusakan / Kendala</label>
              <textarea
                rows={4}
                placeholder="Jelaskan detail kerusakan, misalnya: AC tidak dingin atau baret pada pintu sebelah kiri..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"></textarea>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/claims"
            className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
            {isSubmitting ? "Menyimpan..." : "Kirim Laporan Kerusakan"}
          </button>
        </div>
      </form>
    </div>
  );
}
