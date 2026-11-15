"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RentalDetailPage() {
  const params = useParams();
  const rentalId = params.id;

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header & Tombol Kembali */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Link href="/admin" className="hover:text-slate-700">
              Dashboard
            </Link>{" "}
            &rsaquo;
            <span>Detail Rental</span> &rsaquo;
            <span className="text-slate-800 font-bold">ID: #{rentalId}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Rincian Transaksi & Riwayat Sewa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Informasi lengkap status penyewaan unit, rincian pembayaran, dan kontak pelanggan.
          </p>
        </div>
        <Link
          href="/admin"
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Konten Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Unit & Penyewa */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">directions_car</span>
              Informasi Armada & Penyewa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Kendaraan</span>
                <p className="font-bold text-sm text-slate-900">Toyota Fortuner</p>
                <p className="font-mono text-slate-500">B 1966 SBB</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">Penyewa</span>
                <p className="font-bold text-sm text-slate-900">Deni</p>
                <p className="font-mono text-slate-500">085141610411</p>
              </div>
            </div>
          </div>

          {/* Jadwal & Waktu */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">schedule</span>
              Jadwal Keberangkatan & Pengembalian
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Waktu Berangkat (Pick-up):</span>
                <strong className="text-slate-900">12 Okt 2026, 12:00 WIB</strong>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500">Jadwal Kembali (Drop-off):</span>
                <strong className="text-slate-900">13 Okt 2026, 12:05 WIB</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Ringkasan Pembayaran */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4 h-fit">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">payments</span>
            Rincian Pembayaran
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Biaya Sewa:</span>
              <strong className="text-slate-900">Rp750.000</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status Pembayaran:</span>
              <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">Sewa Lunas</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Sisa Tagihan:</span>
              <strong className="text-emerald-700">Rp0</strong>
            </div>
          </div>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                const message = `Halo Kak Deni, terima kasih telah menyewa kendaraan di Caruhun Rental.`;
                window.open(`https://wa.me/085141610411?text=${encodeURIComponent(message)}`, "_blank");
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Hubungi Penyewa via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
