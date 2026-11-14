"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Vehicle {
  id: string;
  name: string;
  nopol: string;
  category: string;
  transmission: string;
  year: number;
  status: "Tersedia" | "Disewa" | "Dipesan" | "Servis";
  odometer: string;
}

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "1",
    name: "Toyota Avanza 1.5 G",
    nopol: "B 1482 KFD",
    category: "MPV 7-Seater",
    transmission: "CVT",
    year: 2023,
    status: "Tersedia",
    odometer: "34.120 km",
  },
  {
    id: "2",
    name: "Toyota Innova Zenix 2.0 V",
    nopol: "B 2884 SSR",
    category: "Premium MPV",
    transmission: "Gasoline",
    year: 2024,
    status: "Dipesan",
    odometer: "12.450 km",
  },
  {
    id: "3",
    name: "Honda Brio RS Urbanite",
    nopol: "D 2091 AGH",
    category: "City Car",
    transmission: "Matic",
    year: 2022,
    status: "Disewa",
    odometer: "48.910 km",
  },
  {
    id: "4",
    name: "Mitsubishi Xpander Ultimate",
    nopol: "B 2390 POX",
    category: "L-MPV",
    transmission: "CVT",
    year: 2023,
    status: "Disewa",
    odometer: "29.800 km",
  },
  {
    id: "5",
    name: "Toyota HiAce Commuter",
    nopol: "B 1019 TRB",
    category: "Minibus 16-Seat",
    transmission: "Manual Diesel",
    year: 2021,
    status: "Servis",
    odometer: "94.200 km",
  },
];

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = INITIAL_VEHICLES.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.nopol.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Kendaraan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Armada Kendaraan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data master unit kendaraan, status operasional, dan riwayat kilometer.
          </p>
        </div>
        <Link
          href="/admin/vehicles/create"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Tambah Armada Baru</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm font-bold text-slate-900">Total 65 Unit Terdaftar</div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari merk atau nomor polisi..."
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
                <th className="px-4 py-3">Kendaraan & Nopol</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Transmisi / Tahun</th>
                <th className="px-4 py-3">Odometer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="font-mono text-[11px] text-slate-500">{v.nopol}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">
                      {v.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">
                    {v.transmission} ({v.year})
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{v.odometer}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        v.status === "Tersedia"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : v.status === "Disewa"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : v.status === "Dipesan"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                      Detail
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
