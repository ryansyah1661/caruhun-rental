"use client";

import React, { useState } from "react";

interface AttendanceItem {
  id: string;
  name: string;
  role: string;
  clockIn: string;
  clockOut: string;
  status: "Hadir" | "Izin" | "Alpha";
  location: string;
}

const INITIAL_ATTENDANCE: AttendanceItem[] = [
  {
    id: "1",
    name: "Budi Santoso",
    role: "Admin Pool",
    clockIn: "07:45 WIB",
    clockOut: "-",
    status: "Hadir",
    location: "Pool Utama - Cilandak",
  },
  {
    id: "2",
    name: "Naila",
    role: "Staff Administrasi",
    clockIn: "08:00 WIB",
    clockOut: "-",
    status: "Hadir",
    location: "Kantor Depok",
  },
  {
    id: "3",
    name: "Acep Saepudin",
    role: "Driver Operasional",
    clockIn: "07:30 WIB",
    clockOut: "-",
    status: "Hadir",
    location: "Lapangan / Tugas Luar",
  },
  { id: "4", name: "Jajang", role: "Driver Pool", clockIn: "-", clockOut: "-", status: "Izin", location: "-" },
];

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = INITIAL_ATTENDANCE.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Kehadiran</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kehadiran Staff & Driver Pool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau absensi jam masuk, jam pulang, serta lokasi penugasan tim operasional hari ini.
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">fingerprint</span>
          <span>Catat Absensi Manual</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm font-bold text-slate-900">Rekapitulasi Harian (Senin, 24 Okt 2024)</div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nama staff..."
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
                <th className="px-4 py-3">Nama Pegawai</th>
                <th className="px-4 py-3">Jabatan / Peran</th>
                <th className="px-4 py-3">Jam Masuk</th>
                <th className="px-4 py-3">Jam Pulang</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Lokasi / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{item.name}</td>
                  <td className="px-4 py-3.5 text-slate-600">{item.role}</td>
                  <td className="px-4 py-3.5 font-mono text-emerald-700 font-semibold">{item.clockIn}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-500">{item.clockOut}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        item.status === "Hadir"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 font-medium">{item.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
