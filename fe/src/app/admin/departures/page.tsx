"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useDepartures } from "@/lib/use-departures";

export default function DeparturePage() {
  const { data, isLoading } = useDepartures();

  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const departures = useMemo(() => data?.departures || [], [data?.departures]);
  const stats = data?.stats || { ready: 0, ongoing: 0, completed: 0 };

  // Filter logika pencarian & tab status
  const filteredData = useMemo(() => {
    return departures.filter((item) => {
      const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
      const fullSearch = `${item.nopol} ${item.unitName} ${item.renterName} ${item.bookingCode}`.toLowerCase();
      const matchSearch = fullSearch.includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [departures, filterStatus, searchQuery]);

  if (isLoading) {
    return <DeparturesPageSkeleton />;
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span>Operasional Lapangan</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">Jadwal Keberangkatan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Monitoring Keberangkatan Unit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola serah terima kendaraan, ceklis kelayakan fisik, dan pantau jadwal pelepasan armada keluar pool.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-slate-500">print</span>
            <span>Cetak Surat Jalan</span>
          </button>

          <Link
            href="/admin/departures/create"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>Input Keberangkatan Baru</span>
          </Link>
        </div>
      </div>

      {/* ================= STATS / METRICS CARDS (DARI DATABASE) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Siap Berangkat (Hari Ini)</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.ready} Unit</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dalam Perjalanan</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.ongoing} Unit</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selesai / Kembali</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.completed} Unit</h3>
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
            {["Semua", "Siap Berangkat", "Dalam Perjalanan", "Tertunda", "Selesai"].map((status) => (
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

        {/* Tabel Data Keberangkatan */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Kode Booking</th>
                <th className="px-4 py-3 text-center">Kendaraan</th>
                <th className="px-4 py-3 text-center">Penyewa & Driver</th>
                <th className="px-4 py-3 text-center">Tujuan & Waktu</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  let statusBadge = "bg-sky-50 text-sky-700 border-sky-200";
                  if (item.status === "Siap Berangkat") statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
                  if (item.status === "Selesai") statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  if (item.status === "Tertunda") statusBadge = "bg-rose-50 text-rose-700 border-rose-200";

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
                        <div className="font-semibold text-slate-900">{item.destination}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{item.departureTime}</div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex justify-center">
                          <span
                            className={`w-36 px-2.5 py-1 rounded-full border font-bold text-[11px] inline-flex items-center justify-center gap-1.5 ${statusBadge}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href="/admin/pemeriksaan-kendaraan/keluar"
                            className="w-28 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center border border-slate-200/60">
                            Ceklis Fisik
                          </Link>
                          <Link
                            href={`/admin/departures/${cleanBookingId}`}
                            className="w-24 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center shadow-sm">
                            Proses
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada jadwal keberangkatan yang sesuai dengan filter.
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
function DeparturesPageSkeleton() {
  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-48"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-80"></div>
          <div className="h-4 bg-slate-100 rounded w-96"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-36 bg-slate-100 rounded-xl"></div>
          <div className="h-10 w-44 bg-slate-200 rounded-xl"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 rounded w-32"></div>
              <div className="h-7 bg-slate-200 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-100"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-slate-100 rounded-xl w-64"></div>
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
