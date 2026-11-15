"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckOutInspectionPage() {
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
            <span className="text-slate-800 font-bold">Pemeriksaan Keluar (Check-Out)</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ceklis Fisik & Serah Terima Unit Keluar Pool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pastikan kondisi bensin, kilometer, serta kelengkapan fisik mobil sesuai standar sebelum diserahkan ke
            penyewa.
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
        {/* Info Unit & Booking */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">directions_car</span>
            Identitas Unit & Penugasan
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Pilih Kode Booking / Transaksi</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white">
                <option value="#CRH-2410-091">#CRH-2410-091 - Toyota Avanza (PT Surya Logistik)</option>
                <option value="#CRH-2410-094">#CRH-2410-094 - Toyota Innova Zenix (Ibu Maya)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kilometer Awal (Odometer)</label>
              <input
                type="text"
                placeholder="Contoh: 34120 km"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Indikator BBM Saat Keluar</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white">
                <option value="full">Full (Penuh / F)</option>
                <option value="3-4">3/4 Tangki</option>
                <option value="1-2">1/2 Tangki</option>
                <option value="1-4">1/4 Tangki</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ceklis Fisik & Kelengkapan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">checklist</span>
            Inspeksi Kondisi Fisik & Aksesoris
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              "Kondisi Cat & Bodi Luar",
              "Kebersihan Interior Kabin",
              "Fungsi AC & Audio",
              "Ban Serep & Dongkrak",
              "STNK Asli di dalam Mobil",
              "Kunci Kontak & Remote",
              "Segel / Kartu e-Toll",
              "P3K & Segitiga Pengaman",
            ].map((item, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500" />
                <span className="text-xs font-bold text-slate-800">{item}</span>
              </label>
            ))}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-700">Catatan Kondisi / Lecet Fisik Tambahan</label>
            <textarea
              rows={3}
              placeholder="Tuliskan catatan jika ada baret halus di bemper atau kaca depan..."
              className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"></textarea>
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
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">key</span>
                <span>Selesaikan & Serahkan Kunci</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
