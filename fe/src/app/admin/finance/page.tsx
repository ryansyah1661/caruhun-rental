"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function KeuanganPage() {
  const [filterType, setFilterType] = useState<string>("all");

  // Contoh data transaksi keuangan
  const transactions = [
    {
      id: "TRX-001",
      date: "15 Nov 2026",
      desc: "Pelunasan Sewa Unit #CRH-2410-085 (Bapak Rizky)",
      type: "income",
      amount: "Rp 1.250.000",
      category: "Sewa Unit",
    },
    {
      id: "TRX-002",
      date: "14 Nov 2026",
      desc: "Servis Berkala & Ganti Oli Unit HiAce B 1019 TRB (Auto2000)",
      type: "expense",
      amount: "Rp 850.000",
      category: "Perawatan/Servis",
    },
    {
      id: "TRX-003",
      date: "12 Nov 2026",
      desc: "DP Booking Unit Innova Zenix - Ibu Maya Anggraini",
      type: "income",
      amount: "Rp 500.000",
      category: "Booking/DP",
    },
    {
      id: "TRX-004",
      date: "10 Nov 2026",
      desc: "Penggantian Kampas Rem Depan Avanza B 1482 KFD",
      type: "expense",
      amount: "Rp 400.000",
      category: "Perawatan/Servis",
    },
  ];

  const filteredTransactions = transactions.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Keuangan</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Keuangan & Kas</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau arus kas masuk dari penyewaan unit dan pengeluaran biaya perawatan operasional pool.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert("Fitur tambah transaksi kas baru")}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Catat Transaksi Baru</span>
        </button>
      </div>

      {/* KPI Cards Keuangan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pemasukan (Bulan Ini)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">Rp 18.750.000</div>
          <p className="text-xs text-slate-500 pt-1">+12% dari bulan lalu</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran / Servis</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">Rp 3.450.000</div>
          <p className="text-xs text-slate-500 pt-1">Termasuk 4 unit servis bengkel</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Kas Bersih</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">Rp 15.300.000</div>
          <p className="text-xs text-emerald-600 font-semibold pt-1">Kas operasional aman</p>
        </div>
      </div>

      {/* Tabel Riwayat Transaksi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Riwayat Transaksi Kas</h2>
            <p className="text-xs text-slate-500 mt-0.5">Daftar pemasukan dan pengeluaran kas real-time</p>
          </div>
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs font-bold">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterType === "all" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}>
              Semua
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterType === "income" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}>
              Pemasukan
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterType === "expense" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}>
              Pengeluaran
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3">ID Transaksi</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3 text-center">Kategori</th>
                <th className="px-4 py-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredTransactions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{item.id}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-medium">{item.date}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{item.desc}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-extrabold ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                    {item.type === "income" ? `+ ${item.amount}` : `- ${item.amount}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
