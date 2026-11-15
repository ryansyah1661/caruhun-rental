"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCustomers } from "@/lib/use-customers";

export default function CustomersPage() {
  const { data, isLoading } = useCustomers();
  const [searchQuery, setSearchQuery] = useState("");

  const customers = useMemo(() => data?.customers || [], [data?.customers]);
  const totalCount = data?.total ?? customers.length;

  // Filter pencarian berdasarkan nama, nomor HP, atau NIK KTP
  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.nik.includes(searchQuery),
    );
  }, [customers, searchQuery]);

  if (isLoading) {
    return <CustomersSkeleton />;
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header Utama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Pelanggan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Pelanggan & Penyewa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar rekam jejak pelanggan, verifikasi KTP/SIM, dan total riwayat penyewaan dari PostgreSQL.
          </p>
        </div>
        <Link
          href="/admin/customers/create"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Tambah Pelanggan</span>
        </Link>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm font-bold text-slate-900">Total {totalCount} Pelanggan Terdaftar</div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nama, NIK, atau nomor HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Tabel Pelanggan Section */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Nama Pelanggan</th>
                <th className="px-4 py-3 text-center">Nomor WhatsApp</th>
                <th className="px-4 py-3 text-center">NIK KTP</th>
                <th className="px-4 py-3 text-center">Total Sewa</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{c.name}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{c.phone}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">{c.nik}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{c.totalRental} Kali</td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {c.phone && c.phone !== "-" && (
                          <a
                            href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-20 h-9 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs inline-flex items-center justify-center gap-1 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            <span>WA</span>
                          </a>
                        )}
                        <Link
                          href={`/admin/customers/${c.id}`}
                          className="w-24 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center border border-slate-200/60">
                          Detail
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada pelanggan yang sesuai dengan kriteria pencarian.
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

// ----------------------------------------------------------------------
// Skeleton Loading Komponen
// ----------------------------------------------------------------------
function CustomersSkeleton() {
  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-36"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-72"></div>
          <div className="h-4 bg-slate-100 rounded w-96"></div>
        </div>
        <div className="h-10 w-44 bg-slate-100 rounded-xl"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-44"></div>
          <div className="h-10 bg-slate-100 rounded-xl w-72"></div>
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl border border-slate-100"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
