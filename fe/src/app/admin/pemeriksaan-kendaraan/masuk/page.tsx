"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckInReturnPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin");
    }, 1000);
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Link href="/admin" className="hover:text-slate-700">
              Dashboard
            </Link>{" "}
            &rsaquo;
            <span>Pemeriksaan</span> &rsaquo;
            <span className="text-slate-800 font-bold">Catat Pengembalian (Check-In)</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pemeriksaan Masuk & Pengembalian Armada
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Periksa kembali kondisi fisik unit yang baru kembali dari penyewa, hitung keterlambatan, dan verifikasi BBM.
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Unit & Penyewa */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">assignment_turned_in</span>
            Verifikasi Unit Masuk Pool
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Pilih Unit / Nopol Kembali</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600">
                <option value="brio">Honda Brio RS (D 2091 AGH) - Bpk Rizky</option>
                <option value="zenix">Toyota Innova Zenix (B 1928 TYA) - Bpk Agus (Telat)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kilometer Akhir (Odometer)</label>
              <input
                type="text"
                placeholder="Contoh: 49200 km"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kondisi BBM Saat Masuk</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600">
                <option value="sesuai">Sesuai dengan saat Keluar (Bar-to-Bar)</option>
                <option value="kurang">Kurang (Perlu Penalti BBM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pengecekan Denda / Kerusakan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">receipt_long</span>
            Perhitungan Denda & Status Selesai
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Keterlambatan (Overtime)</label>
              <input
                type="text"
                defaultValue="0 Jam (Tepat Waktu)"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Biaya Denda / Kerusakan (Rp)</label>
              <input
                type="text"
                defaultValue="0"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Status Pengembalian Deposit</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600">
                <option value="full">Dikembalikan 100% (Tanpa Kendala)</option>
                <option value="potong">Dipotong Biaya Denda / BBM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin"
            className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                <span>Konfirmasi Unit Kembali & Selesai</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
