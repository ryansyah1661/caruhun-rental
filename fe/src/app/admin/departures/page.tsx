"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useDepartures } from "@/lib/use-departures";

export default function DeparturePage() {
  const { data, isLoading } = useDepartures();

  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [filterService, setFilterService] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const departures = useMemo(() => data?.departures || [], [data?.departures]);
  const stats = data?.stats || { ready: 0, ongoing: 0, completed: 0 };

  // Hitung jumlah per kategori layanan
  const serviceStats = useMemo(() => {
    let lepasKunci = 0;
    let denganDriver = 0;
    let bandara = 0;

    departures.forEach((item) => {
      const type = item.serviceType || (item.driverName?.includes("Lepas Kunci") ? "Lepas Kunci" : "Dengan Driver");
      if (type === "Drop-off Bandara") bandara++;
      else if (type === "Dengan Driver") denganDriver++;
      else lepasKunci++;
    });

    return { lepasKunci, denganDriver, bandara, total: departures.length };
  }, [departures]);

  // Filter gabungan: Kategori Layanan + Status Operasional + Pencarian Teks
  const filteredData = useMemo(() => {
    return departures.filter((item) => {
      const itemService = item.serviceType || (item.driverName?.includes("Lepas Kunci") ? "Lepas Kunci" : "Dengan Driver");
      const matchService = filterService === "Semua" || itemService === filterService;
      const matchStatus = filterStatus === "Semua" || item.status === filterStatus;
      const fullSearch = `${item.nopol} ${item.unitName} ${item.renterName} ${item.bookingCode} ${item.destination}`.toLowerCase();
      const matchSearch = fullSearch.includes(searchQuery.toLowerCase());
      return matchService && matchStatus && matchSearch;
    });
  }, [departures, filterService, filterStatus, searchQuery]);

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
            Pisahkan pantauan antara <strong>Sewa Lepas Kunci</strong>, <strong>Dengan Driver</strong>, dan <strong>Drop-off Bandara</strong> untuk SOP serah terima yang tepat.
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
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">SOP Jaminan</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{serviceStats.lepasKunci} Unit</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Wajib KTP, SIM A & Jaminan Titip Motor / Deposit</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center font-bold shrink-0">
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
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold">Supir Caruhun</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{serviceStats.denganDriver} Unit</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Penugasan driver resmi & titik penjemputan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-2xl">person_pin</span>
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
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">Charter Bandara</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{serviceStats.bandara} Unit</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Jadwal flight, no penerbangan & drop terminal</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center font-bold shrink-0">
            <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN TABLE SECTION ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        {/* Filter Bar (Tab Layanan + Tab Status + Pencarian) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tab Kategori Layanan */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {[
                { key: "Semua", label: `Semua (${serviceStats.total})` },
                { key: "Lepas Kunci", label: `Lepas Kunci (${serviceStats.lepasKunci})` },
                { key: "Dengan Driver", label: `Driver (${serviceStats.denganDriver})` },
                { key: "Drop-off Bandara", label: `Bandara (${serviceStats.bandara})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterService(tab.key)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    filterService === tab.key
                      ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Filter Tab Status */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/60 text-xs">
              {["Semua", "Siap Berangkat", "Dalam Perjalanan", "Tertunda", "Selesai"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    filterStatus === status
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}>
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nopol, unit, penyewa, atau rute..."
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
                <th className="px-4 py-3 text-center">Penyewa & Jenis Layanan</th>
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

                  const cleanBookingId = item.id || item.bookingCode.replace("#", "");
                  const itemService = item.serviceType || (item.driverName?.includes("Lepas Kunci") ? "Lepas Kunci" : "Dengan Driver");

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
                          {itemService === "Lepas Kunci" ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              Lepas Kunci
                            </span>
                          ) : itemService === "Drop-off Bandara" ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1">
                              Drop-off Bandara
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                              Dengan Driver
                            </span>
                          )}
                          <span className="text-slate-400 text-[10px]">&bull; {item.driverName}</span>
                        </div>
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
                            href={`/admin/departures/${cleanBookingId}`}
                            className="w-28 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center justify-center shadow-sm">
                            Proses SOP
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
                    Tidak ada jadwal keberangkatan untuk filter layanan & status ini.
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

function DeparturesPageSkeleton() {
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
