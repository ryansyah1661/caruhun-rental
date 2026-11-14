"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ArrivalDetailPage() {
  const [odometerReturn, setOdometerReturn] = useState("12.980");
  const [fuelReturn, setFuelReturn] = useState("3/4");
  const [checkInChecklist, setCheckInChecklist] = useState({
    bodiAman: true,
    banUtuh: true,
    stnkAda: true,
    toolkitLengkap: true,
  });

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Operasional</span> &rsaquo; <span>Kedatangan</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">#BK-2024-1024</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Eksekusi Check-In Pengembalian Unit
            </h1>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Tiba di Pool (Perlu Inspeksi)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Jadwal Tiba: Hari Ini, 25 Okt 2026 • 16:00 WIB</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/arrivals"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Daftar</span>
          </Link>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN DESKTOP LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (FORM UTAMA: CEKLIS KONDISI AKHIR & FOTO) - 8 Kolom */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Checklist Fisik & Kilometer Akhir */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">assignment_returned</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Inspeksi Kondisi Pengembalian</h3>
                  <p className="text-xs text-slate-500">Pemeriksaan selisih odometer, BBM akhir, dan kelengkapan</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                Sesuai Standar
              </span>
            </div>

            {/* Input BBM & Odometer Akhir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Tingkat Bahan Bakar (BBM) Saat Kembali</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {["E", "1/4", "1/2", "3/4", "Full"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFuelReturn(lvl)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        fuelReturn === lvl
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Odometer Akhir (KM)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={odometerReturn}
                    onChange={(e) => setOdometerReturn(e.target.value)}
                    className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                </div>
                <p className="text-[11px] text-slate-500">Total pemakaian sewa: 530 km perjalanan.</p>
              </div>
            </div>

            {/* Checkboxes Kelengkapan Pengembalian */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Verifikasi Kelengkapan Kembali
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "bodiAman", label: "Bodi & Interior Tanpa Kerusakan Baru" },
                  { key: "banUtuh", label: "Ban & Velg Utuh Sesuai Berangkat" },
                  { key: "stnkAda", label: "STNK Asli Lengkap di Glovebox" },
                  { key: "toolkitLengkap", label: "Tool Kit & Dongkrak Dikembalikan" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={checkInChecklist[item.key as keyof typeof checkInChecklist]}
                      onChange={(e) => setCheckInChecklist({ ...checkInChecklist, [item.key]: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
                    />
                    <span className="text-xs font-bold text-slate-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Catatan Kerusakan / Klaim Baru (Jika Ada) */}
            <div className="p-3.5 bg-sky-50/60 border border-sky-200/80 rounded-xl flex items-start gap-3">
              <span className="material-symbols-outlined text-sky-600 text-[20px] shrink-0 mt-0.5">verified</span>
              <div className="text-xs text-sky-900">
                <strong className="block font-bold mb-0.5">Status Fisik Kendaraan</strong>
                Tidak ditemukan baret atau klaim kerusakan baru selama masa sewa berlangsung. Unit siap dimasukkan
                kembali ke status Tersedia.
              </div>
            </div>
          </div>

          {/* 2. Foto Inspeksi Pengembalian (5 Sisi Wajib) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Foto Dokumentasi Tiba (5 Sisi)</h3>
                  <p className="text-xs text-slate-500">Bukti visual kondisi fisik kendaraan saat masuk pool</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                5/5 Selesai
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["1. Depan & Plat", "2. Belakang", "3. Samping Kiri", "4. Samping Kanan", "5. Odometer & BBM Akhir"].map(
                (side, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-video flex flex-col items-center justify-center text-center p-2 hover:border-amber-500 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-slate-400 text-3xl mb-1 group-hover:scale-110 transition-transform">
                      add_a_photo
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">{side}</span>
                    <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (SUMMARY KENDARAAN, PENYEWA & SELESAI) - 4 Kolom */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          {/* Ringkasan Unit */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Kendaraan Dikembalikan
            </span>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white font-mono font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                ZNX
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Toyota Innova Zenix 2.0 V</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    B 2884 SSR
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">Pool Cilandak</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <div>
                Durasi Sewa: <strong className="text-slate-900">3 Hari (Selesai)</strong>
              </div>
              <div>
                Jenis Layanan: <strong className="text-slate-900">Lepas Kunci</strong>
              </div>
            </div>
          </div>

          {/* Informasi Penyewa */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Penyewa / Pemulang Unit
            </span>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-xs">
                  HW
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Hendro Wicaksono</h5>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">0812-9876-5432</p>
                </div>
              </div>
            </div>
          </div>

          {/* Konfirmasi & Tombol Selesai Check-In */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Penyelesaian Check-In
            </span>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 w-4 h-4 rounded text-amber-600 accent-amber-600"
              />
              <span>
                Seluruh pemeriksaan fisik kendaraan telah selesai dan unit dinyatakan kembali ke pool dengan aman.
              </span>
            </label>

            <button
              type="button"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>Selesaikan Check-In (Unit Tersedia)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
