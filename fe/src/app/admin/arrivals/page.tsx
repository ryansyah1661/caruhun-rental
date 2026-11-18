"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useArrivals, ArrivalServiceType } from "@/lib/use-arrivals";

export default function ArrivalPage() {
  const { data, isLoading } = useArrivals();

  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [filterService, setFilterService] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const arrivals = useMemo(() => data?.arrivals || [], [data?.arrivals]);
  const stats = data?.stats || { onTheWay: 0, needCheck: 0, inspectedDone: 0 };

  // Hitung jumlah per kategori layanan
  const serviceStats = useMemo(() => {
    let lepasKunci = 0;
    let denganDriver = 0;
    let bandara = 0;

    arrivals.forEach((item) => {
      const type = item.serviceType || (item.driverName?.includes("Lepas Kunci") ? "Lepas Kunci" : "Dengan Driver");
      if (type === "Drop-off Bandara") bandara++;
      else if (type === "Dengan Driver") denganDriver++;
      else lepasKunci++;
    });

    return { lepasKunci, denganDriver, bandara, total: arrivals.length };
  }, [arrivals]);

  // Filter gabungan: Kategori Layanan + Status Operasional + Pencarian Teks
  const filteredData = useMemo(() => {
    return arrivals.filter((item) => {
      const itemService = item.serviceType || (item.driverName?.includes("Lepas Kunci") ? "Lepas Kunci" : "Dengan Driver");
      const matchService = filterService === "Semua" || itemService === filterService;
      const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
      const fullSearch = `${item.nopol} ${item.unitName} ${item.renterName} ${item.bookingCode} ${item.originOrDestination}`.toLowerCase();
      const matchSearch = fullSearch.includes(searchQuery.toLowerCase());
      return matchService && matchStatus && matchSearch;
    });
  }, [arrivals, filterService, filterStatus, searchQuery]);

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
            Monitoring Kedatangan & Pengembalian Unit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau kendaraan yang kembali ke pool, cek BBM & Odometer, serta proses pengembalian jaminan motor/deposit penyewa.
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

      {/* ================= KARTU PEMISAH KATEGORI LAYANAN ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Kategori 1: Lepas Kunci */}
        <div
          onClick={() => setFilterService(filterService === "Lepas Kunci" ? "Semua" : "Lepas Kunci")}
          className={`p-5 rounded-2xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            filterService === "Lepas Kunci"
              ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500"
              : "bg-white border-slate-200/80 hover:border-amber-400"
          }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Lepas Kunci</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">Retur Jaminan</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{serviceStats.lepasKunci} Unit</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Cek BBM, Odo & serahkan kembali Motor / Deposit</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">key</span>
          </div>
        </div>

        {/* Kategori 2: Dengan Driver */}
        <div
          onClick={() => setFilterService(filterService === "Dengan Driver" ? "Semua" : "Dengan Driver")}
          className={`p-5 rounded-2xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            filterService === "Dengan Driver"
              ? "bg-sky-50/70 border-sky-500 ring-2 ring-sky-500"
              : "bg-white border-slate-200/80 hover:border-sky-400"
          }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Dengan Driver</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold">Serah Driver</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{serviceStats.denganDriver} Unit</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Driver serahkan kunci & laporan kondisi perjalanan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">badge</span>
          </div>
        </div>

        {/* Kategori 3: Drop-off Bandara */}
        <div
          onClick={() => setFilterService(filterService === "Drop-off Bandara" ? "Semua" : "Drop-off Bandara")}
          className={`p-5 rounded-2xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            filterService === "Drop-off Bandara"
              ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500"
              : "bg-white border-slate-200/80 hover:border-indigo-400"
          }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Drop-off Bandara</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">Airport Return</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{serviceStats.bandara} Unit</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Unit kembali ke pool setelah drop penumpang ke bandara</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">flight_land</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN TABLE SECTION ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        {/* Filter Bar: Layanan & Status */}
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Tab Kategori Layanan */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Layanan:</span>
              {[
                { key: "Semua", label: "Semua Layanan" },
                { key: "Lepas Kunci", label: "Lepas Kunci" },
                { key: "Dengan Driver", label: "Dengan Driver" },
                { key: "Drop-off Bandara", label: "Drop-off Bandara" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterService(tab.key)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filterService === tab.key
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Pencarian Teks */}
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

          {/* Tab Filter Status */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {["Semua", "Dalam Perjalanan", "Tiba di Pool", "Inspeksi Selesai", "Terlambat"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  filterStatus === status
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Data Kedatangan */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Kode Booking</th>
                <th className="px-4 py-3 text-center">Kendaraan</th>
                <th className="px-4 py-3 text-center">Penyewa & Layanan</th>
                <th className="px-4 py-3 text-center">Rute / Estimasi Tiba</th>
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

                  const serviceBadge =
                    item.serviceType === "Drop-off Bandara"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : item.serviceType === "Dengan Driver"
                      ? "bg-sky-50 text-sky-700 border-sky-200"
                      : "bg-amber-50 text-amber-700 border-amber-200";

                  const cleanBookingId = item.id || item.bookingCode.replace("#", "");

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
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${serviceBadge}`}>
                            {item.serviceType === "Drop-off Bandara" && "Drop-off Bandara"}
                            {item.serviceType === "Dengan Driver" && "Dengan Driver"}
                            {item.serviceType === "Lepas Kunci" && "Lepas Kunci"}
                          </span>
                          <span className="text-slate-400 text-[10px]">{item.renterPhone}</span>
                        </div>
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
                            href={`/admin/arrivals/${cleanBookingId}`}
                            className={`w-36 h-9 rounded-xl font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center shadow-xs ${
                              item.status === "Inspeksi Selesai"
                                ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                                : "bg-amber-600 hover:bg-amber-700 text-white"
                            }`}>
                            {item.status === "Inspeksi Selesai" ? "Lihat Hasil Cek" : "Proses Check-In"}
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">
                      content_paste_off
                    </span>
                    Tidak ada jadwal kedatangan untuk filter layanan & status ini.
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

function ArrivalsPageSkeleton() {
  return (
    <div className="w-full min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="h-24 bg-white rounded-2xl border border-slate-200" />
        <div className="h-24 bg-white rounded-2xl border border-slate-200" />
        <div className="h-24 bg-white rounded-2xl border border-slate-200" />
      </div>
      <div className="h-96 bg-white rounded-2xl border border-slate-200 p-6" />
    </div>
  );
}
