"use client";

import React, { useState } from "react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  nik: string;
  totalRental: number;
  status: "Aktif" | "Blacklist";
}

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "1", name: "Deni Surya", phone: "085141610411", nik: "32750123456789", totalRental: 5, status: "Aktif" },
  { id: "2", name: "Rini Azlia", phone: "08178542190", nik: "32710987654321", totalRental: 2, status: "Aktif" },
  { id: "3", name: "Rizki Ramdhani", phone: "081244321000", nik: "32730456123789", totalRental: 8, status: "Aktif" },
  { id: "4", name: "Agus Prasetyo", phone: "081234567890", nik: "32740112233445", totalRental: 1, status: "Aktif" },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = INITIAL_CUSTOMERS.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery),
  );

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Pelanggan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Pelanggan & Penyewa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar rekam jejak pelanggan, verifikasi KTP/SIM, dan riwayat penyewaan unit.
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>+ Tambah Pelanggan</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm font-bold text-slate-900">Total Pelanggan Terdaftar</div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nama atau nomor HP..."
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
                <th className="px-4 py-3">Nama Pelanggan</th>
                <th className="px-4 py-3">Nomor WhatsApp</th>
                <th className="px-4 py-3">NIK KTP</th>
                <th className="px-4 py-3">Total Sewa</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-600">{c.phone}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-500">{c.nik}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{c.totalRental} Kali</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
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
