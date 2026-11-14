"use client";

import React, { useState } from "react";
import Link from "next/link";

type RentalStatus = "Selesai" | "Aktif" | "Dibatalkan";

interface RentalHistoryItem {
  id: string;
  bookingCode: string;
  unitName: string;
  nopol: string;
  renterName: string;
  duration: string;
  totalCost: string;
  status: RentalStatus;
}

const RENTAL_HISTORY_DATA: RentalHistoryItem[] = [
  {
    id: "1",
    bookingCode: "#CRH-2410-088",
    unitName: "Honda Brio RS",
    nopol: "D 2091 AGH",
    renterName: "Rizky Kurniawan",
    duration: "3 Hari (22 - 25 Okt 2026)",
    totalCost: "Rp 1.050.000",
    status: "Selesai",
  },
  {
    id: "2",
    bookingCode: "#BK-2024-1024",
    unitName: "Toyota Innova Zenix 2.0 V",
    nopol: "B 2884 SSR",
    renterName: "Hendro Wicaksono",
    duration: "3 Hari (25 - 28 Okt 2026)",
    totalCost: "Rp 3.400.000",
    status: "Aktif",
  },
  {
    id: "3",
    bookingCode: "#CRH-2410-075",
    unitName: "Toyota Avanza 1.5 G",
    nopol: "B 1482 KFD",
    renterName: "PT Surya Logistik",
    duration: "5 Hari (15 - 20 Okt 2026)",
    totalCost: "Rp 2.750.000",
    status: "Selesai",
  },
  {
    id: "4",
    bookingCode: "#CRH-2410-060",
    unitName: "HiAce Commuter",
    nopol: "B 1019 TRB",
    renterName: "CV Tour & Travel",
    duration: "2 Hari (10 - 12 Okt 2026)",
    totalCost: "Rp 2.400.000",
    status: "Dibatalkan",
  },
];

export default function RentalHistoryPage() {
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  const filteredData =
    filterStatus === "Semua" ? RENTAL_HISTORY_DATA : RENTAL_HISTORY_DATA.filter((item) => item.status === filterStatus);

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span>Manajemen</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">Riwayat Sewa</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Arsip & Riwayat Penyewaan Armada
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekapitulasi seluruh transaksi rental kendaraan yang sedang berjalan, telah selesai, maupun dibatalkan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-slate-500">download</span>
            <span>Ekspor Laporan (Excel/PDF)</span>
          </button>
        </div>
      </div>

      {/* ================= STATS / METRICS CARDS (2 Kolom) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Transaksi (Bulan Ini)
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">42 Sesi</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">receipt_long</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sewa Aktif Berjalan</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">8 Unit</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN TABLE SECTION ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {["Semua", "Aktif", "Selesai", "Dibatalkan"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                  filterStatus === status
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {status}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari kode booking, nopol, atau penyewa..."
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Tabel Riwayat Sewa */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200">
                <th className="px-4 py-3">ID / Booking</th>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Penyewa</th>
                <th className="px-4 py-3">Durasi Sewa</th>
                <th className="px-4 py-3">Total Biaya</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.map((item) => {
                let statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (item.status === "Aktif") statusBadge = "bg-sky-50 text-sky-700 border-sky-200";
                if (item.status === "Dibatalkan") statusBadge = "bg-rose-50 text-rose-700 border-rose-200";

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-slate-900">{item.bookingCode}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{item.unitName}</div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">{item.nopol}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{item.renterName}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{item.duration}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900">{item.totalCost}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] inline-flex items-center gap-1.5 ${statusBadge}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                        Detail Transaksi
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
