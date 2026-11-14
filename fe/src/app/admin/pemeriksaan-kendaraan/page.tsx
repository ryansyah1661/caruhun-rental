"use client";

import React, { useState } from "react";
import Link from "next/link";

type InspectionType = "Semua" | "Keluar (Check-Out)" | "Masuk (Check-In)";

interface InspectionItem {
  id: string;
  code: string;
  unit: string;
  nopol: string;
  type: "Keluar (Check-Out)" | "Masuk (Check-In)";
  pic: string;
  date: string;
  status: string;
}

const INITIAL_INSPECTIONS: InspectionItem[] = [
  {
    id: "1",
    code: "#INS-2024-089",
    unit: "Toyota Avanza 1.5 G",
    nopol: "B 1482 KFD",
    type: "Keluar (Check-Out)",
    pic: "Budi Santoso",
    date: "24 Okt 2024, 09:00",
    status: "Selesai",
  },
  {
    id: "2",
    code: "#INS-2024-088",
    unit: "Honda Brio RS",
    nopol: "D 2091 AGH",
    type: "Masuk (Check-In)",
    pic: "Naila",
    date: "24 Okt 2024, 08:30",
    status: "Selesai (Deposit 100%)",
  },
  {
    id: "3",
    code: "#INS-2024-087",
    unit: "Toyota Innova Zenix",
    nopol: "B 2884 SSR",
    type: "Keluar (Check-Out)",
    pic: "Budi Santoso",
    date: "23 Okt 2024, 14:15",
    status: "Selesai",
  },
];

export default function PemeriksaanKendaraanPage() {
  const [activeTab, setActiveTab] = useState<InspectionType>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = INITIAL_INSPECTIONS.filter((item) => {
    const matchesTab = activeTab === "Semua" || item.type === activeTab;
    const matchesSearch = `${item.unit} ${item.nopol} ${item.code}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header & Tombol Aksi Cepat */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Pemeriksaan Kendaraan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Pemeriksaan Fisik Armada
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekapitulasi ceklis kondisi fisik kendaraan saat hendak keluar pool maupun saat kembali dari penyewa.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/pemeriksaan-kendaraan/keluar"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>+ Pemeriksaan Keluar</span>
          </Link>
          <Link
            href="/admin/pemeriksaan-kendaraan/masuk"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>+ Catat Pengembalian (Masuk)</span>
          </Link>
        </div>
      </div>

      {/* Filter & Tabel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Tab Filter dengan ukuran seragam & proporsional */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            {(["Semua", "Keluar (Check-Out)", "Masuk (Check-In)"] as InspectionType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer whitespace-nowrap ${
                  activeTab === tab ? "bg-amber-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
                }`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nopol atau unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200">
                <th className="px-4 py-3">Kode / ID</th>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Jenis Pemeriksaan</th>
                <th className="px-4 py-3">Petugas (PIC)</th>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{item.code}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{item.unit}</div>
                      <div className="font-mono text-[11px] text-slate-500">{item.nopol}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 ${
                          item.type.includes("Keluar")
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-sky-50 text-sky-700 border border-sky-200"
                        }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{item.pic}</td>
                    <td className="px-4 py-3.5 text-slate-500">{item.date}</td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-700">{item.status}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada data pemeriksaan yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
