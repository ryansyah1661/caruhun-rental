"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useInspections, InspectionType } from "@/lib/use-inspections";

export default function PemeriksaanKendaraanPage() {
  const { data, isLoading } = useInspections();
  const [activeTab, setActiveTab] = useState<InspectionType>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const inspections = useMemo(() => data?.inspections || [], [data?.inspections]);

  const filteredData = useMemo(() => {
    return inspections.filter((item) => {
      const matchesTab = activeTab === "Semua" || item.type === activeTab;
      const fullSearch = `${item.unit} ${item.nopol} ${item.code} ${item.pic}`.toLowerCase();
      const matchesSearch = fullSearch.includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [inspections, activeTab, searchQuery]);

  if (isLoading) {
    return <InspectionSkeleton />;
  }

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
            Rekapitulasi ceklis kondisi fisik kendaraan saat keluar pool maupun kembali dari penyewa.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/inspections/keluar"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>+ Pemeriksaan Keluar</span>
          </Link>
          <Link
            href="/admin/inspections/masuk"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">login</span>
            <span>+ Catat Masuk</span>
          </Link>
        </div>
      </div>

      {/* Filter & Tabel */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Tab Filter */}
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
              placeholder="Cari nopol, unit, atau PIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Kode</th>
                <th className="px-4 py-3 text-center">Kendaraan</th>
                <th className="px-4 py-3 text-center">Jenis Pemeriksaan</th>
                <th className="px-4 py-3 text-center">Petugas</th>
                <th className="px-4 py-3 text-center">Waktu</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{item.code}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{item.unit}</div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">{item.nopol}</div>
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
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                            item.status === "Selesai"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          className="w-24 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200/60">
                          Detail
                        </button>
                      </div>
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

function InspectionSkeleton() {
  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6 flex justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-36"></div>
          <div className="h-8 bg-slate-200 rounded w-72"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-60"></div>
      </div>
      <div className="h-96 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-slate-50 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}
