"use client";

import React, { useState } from "react";

interface ClaimItem {
  id: string;
  code: string;
  unit: string;
  nopol: string;
  issue: string;
  reporter: string;
  date: string;
  status: "Pending" | "Dalam Perbaikan" | "Selesai";
}

const INITIAL_CLAIMS: ClaimItem[] = [
  {
    id: "1",
    code: "#CLM-991",
    unit: "Mitsubishi Pajero",
    nopol: "E 5555 LJ",
    issue: "AC MATI IDUP (Kompresor perlu dicek)",
    reporter: "Asha (Penyewa)",
    date: "12 Okt 2024, 10:04",
    status: "Pending",
  },
];

export default function ClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = INITIAL_CLAIMS.filter(
    (c) =>
      c.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nopol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Kerusakan & Klaim</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Kerusakan & Klaim Asuransi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Laporan kendala teknis kendaraan di lapangan, klaim asuransi, serta pemantauan bengkel.
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">report_problem</span>
          <span>+ Buat Laporan Kerusakan</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm font-bold text-slate-900">Daftar Laporan Aktif</div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari unit atau nomor polisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200">
                <th className="px-4 py-3">Kode Laporan</th>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Keluhan / Kerusakan</th>
                <th className="px-4 py-3">Pelapor</th>
                <th className="px-4 py-3">Waktu Laporan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{item.code}</td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{item.unit}</div>
                    <div className="font-mono text-[11px] text-slate-500">{item.nopol}</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-rose-600">{item.issue}</td>
                  <td className="px-4 py-3.5 font-medium">{item.reporter}</td>
                  <td className="px-4 py-3.5 text-slate-500">{item.date}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-amber-50 text-amber-700 border-amber-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                      Tindak Lanjuti
                    </button>
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
