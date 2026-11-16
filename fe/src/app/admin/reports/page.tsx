"use client";

import React, { useState } from "react";

export default function LaporanPage() {
  const [reportPeriod, setReportPeriod] = useState<string>("Oktober 2026");

  const fleetPerformance = [
    {
      unit: "Toyota Innova Zenix 2.0 V",
      nopol: "B 2884 SSR",
      totalTrip: 14,
      revenue: "Rp 9.800.000",
      status: "Sangat Padat",
    },
    { unit: "Toyota Avanza 1.5 G", nopol: "B 1482 KFD", totalTrip: 12, revenue: "Rp 6.000.000", status: "Padat" },
    { unit: "Honda Brio RS Urbanite", nopol: "D 2891 AGH", totalTrip: 10, revenue: "Rp 4.500.000", status: "Stabil" },
    {
      unit: "Toyota HiAce Commuter 16S",
      nopol: "B 1019 TRB",
      totalTrip: 6,
      revenue: "Rp 7.200.000",
      status: "Servis/Rental",
    },
  ];

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Laporan</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Laporan & Analitik Performa</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rekapitulasi performa penyewaan armada, tingkat utilitas unit, dan unduh laporan berkala.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => alert("Mengunduh laporan PDF...")}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh PDF</span>
          </button>
          <button
            type="button"
            onClick={() => alert("Mengunduh laporan Excel...")}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Perjalanan (Trip)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">42 Trip</div>
          <p className="text-xs text-slate-500 pt-1">Akumulasi bulan ini</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tingkat Okupansi Armada</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">84.5%</div>
          <p className="text-xs text-emerald-600 font-semibold pt-1">Sangat Produktif</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rata-rata Durasi Sewa</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">2.4 Hari</div>
          <p className="text-xs text-slate-500 pt-1">Per transaksi sewa</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kendaraan Terfavorit</span>
          <div className="text-lg font-extrabold text-slate-900 truncate">Innova Zenix</div>
          <p className="text-xs text-slate-500 pt-1">14 kali pemesanan</p>
        </div>
      </div>

      {/* Tabel Performa Unit */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Performa & Pendapatan Per Unit Armada</h2>
            <p className="text-xs text-slate-500 mt-0.5">Analisis kontribusi pendapatan dan frekuensi sewa tiap unit</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3">Kendaraan & Nopol</th>
                <th className="px-4 py-3 text-center">Total Trip</th>
                <th className="px-4 py-3 text-center">Status Produktivitas</th>
                <th className="px-4 py-3 text-right">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {fleetPerformance.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{item.unit}</div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">{item.nopol}</div>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-slate-900">{item.totalTrip} Trip</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-extrabold text-slate-900">{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
