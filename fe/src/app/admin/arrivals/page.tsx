"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useArrivals } from "@/lib/use-arrivals";

export default function ArrivalPage() {
  const { data, isLoading } = useArrivals();

  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const arrivals = useMemo(() => data?.arrivals || [], [data?.arrivals]);
  const stats = data?.stats || { onTheWay: 0, needCheck: 0, inspectedDone: 0 };

  // Filter logika pencarian & tab status
  const filteredData = useMemo(() => {
    return arrivals.filter((item) => {
      const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
      const fullSearch = `${item.nopol} ${item.unitName} ${item.renterName} ${item.bookingCode}`.toLowerCase();
      const matchSearch = fullSearch.includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [arrivals, filterStatus, searchQuery]);

  if (isLoading) {
    return <ArrivalsPageSkeleton />;
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span>Operasional Lapangan</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">Jadwal Kedatangan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Monitoring Kedatangan Unit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau kendaraan yang sedang dalam perjalanan kembali ke pool, lakukan inspeksi pengembalian, dan cek
            kondisi fisik akhir.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-slate-500">print</span>
            <span>Cetak Rekap Harian</span>
          </button>
        </div>
      </div>

      {/* ================= STATS / METRICS CARDS (DARI DATABASE) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dalam Perjalanan Pulang</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.onTheWay} Unit</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiba di Pool (Perlu Cek)</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.needCheck} Unit</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">assignment_returned</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Inspeksi Selesai</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.inspectedDone} Unit</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN TABLE SECTION ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {["Semua", "Dalam Perjalanan", "Tiba di Pool", "Inspeksi Selesai", "Terlambat"].map((status) => (
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nopol, unit, atau pelanggan..."
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Tabel Data Kedatangan dengan Pembatas Kolom (divide-x) */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Kode Booking</th>
                <th className="px-4 py-3 text-center">Kendaraan</th>
                <th className="px-4 py-3 text-center">Penyewa & Driver</th>
                <th className="px-4 py-3 text-center">Asal / Estimasi Tiba</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  let statusBadge = "bg-sky-50 text-sky-700 border-sky-200";
                  if (item.status === "Tiba di Pool") statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
                  if (item.status === "Inspeksi Selesai")
                    statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  if (item.status === "Terlambat") statusBadge = "bg-rose-50 text-rose-700 border-rose-200";

                  const cleanBookingId = item.bookingCode.replace("#", "");

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-slate-900">{item.bookingCode}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{item.unitName}</div>
                        <div className="font-mono text-[11px] text-slate-500 mt-0.5">{item.nopol}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{item.renterName}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">Driver: {item.driverName}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">{item.originOrDestination}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{item.estimatedArrival}</div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex justify-center">
                          <span
                            className={`px-3 py-1.5 rounded-lg border font-bold text-[11px] inline-flex items-center gap-2 w-44 text-left ${statusBadge}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0"></span>
                            <span className="truncate">{item.status}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href="/admin/inspections/masuk"
                            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer w-36 text-left whitespace-nowrap block">
                            Cek Fisik Masuk
                          </Link>
                          <Link
                            href={`/admin/arrivals/${cleanBookingId}`}
                            className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer w-36 text-center shadow-xs whitespace-nowrap block">
                            Proses Check-In
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada jadwal kedatangan yang sesuai dengan filter.
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
function ArrivalsPageSkeleton() {
  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-48"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-80"></div>
          <div className="h-4 bg-slate-100 rounded w-96"></div>
        </div>
        <div className="h-10 w-36 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}
