"use client";

import React, { useState } from "react";
import Link from "next/link"; // Jangan lupa import Link dari next/link

// Types
type DepartureStatus = "Siap Berangkat" | "Dalam Perjalanan" | "Selesai" | "Tertunda";

interface DepartureItem {
  id: string;
  bookingCode: string;
  unitName: string;
  nopol: string;
  renterName: string;
  renterPhone: string;
  destination: string;
  departureTime: string;
  driverName: string;
  status: DepartureStatus;
}

// Dummy Data Keberangkatan
const DEPARTURE_DATA: DepartureItem[] = [
  {
    id: "1",
    bookingCode: "#CRH-2410-091",
    unitName: "Toyota Avanza 1.5 G",
    nopol: "B 1482 KFD",
    renterName: "PT Surya Logistik",
    renterPhone: "0812-3456-7890",
    destination: "Bandara Soekarno-Hatta (T3)",
    departureTime: "Hari Ini, 09:00 WIB",
    driverName: "Ahmad Sopian",
    status: "Siap Berangkat",
  },
  {
    id: "2",
    bookingCode: "#BK-2024-1024",
    unitName: "Innova Zenix 2.0 V",
    nopol: "B 2884 SSR",
    renterName: "Hendro Wicaksono",
    renterPhone: "0812-9876-5432",
    destination: "Bogor Inner City / Puncak",
    departureTime: "Hari Ini, 10:30 WIB",
    driverName: "Lepas Kunci (Self-Drive)",
    status: "Dalam Perjalanan",
  },
  {
    id: "3",
    bookingCode: "#CRH-2410-088",
    unitName: "Honda Brio RS",
    nopol: "D 2091 AGH",
    renterName: "Rizky Kurniawan",
    renterPhone: "0851-4161-0411",
    destination: "Kawasan Industri Cikarang",
    departureTime: "Kemarin, 08:00 WIB",
    driverName: "Lepas Kunci (Self-Drive)",
    status: "Selesai",
  },
];

export default function DeparturePage() {
  const [filterStatus, setFilterStatus] = useState<string>("Semua");

  const filteredData =
    filterStatus === "Semua" ? DEPARTURE_DATA : DEPARTURE_DATA.filter((item) => item.status === filterStatus);

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
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-slate-500">print</span>
            <span>Cetak Surat Jalan</span>
          </button>

          {/* Tombol Input Keberangkatan Baru diarahkan ke detail atau form */}
          <Link
            href="/admin/departures/create"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            <span>Input Keberangkatan Baru</span>
          </Link>
        </div>
      </div>

      {/* ================= STATS / METRICS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Siap Berangkat (Hari Ini)</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">2 Unit</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dalam Perjalanan</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">1 Unit</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">directions_car</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selesai / Kembali</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">12 Unit</h3>
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
            {["Semua", "Siap Berangkat", "Dalam Perjalanan", "Selesai"].map((status) => (
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
              placeholder="Cari nopol, unit, atau pelanggan..."
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Tabel Data Keberangkatan */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200">
                <th className="px-4 py-3">ID / Booking</th>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Penyewa & Driver</th>
                <th className="px-4 py-3">Tujuan & Waktu</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredData.map((item) => {
                let statusBadge = "bg-sky-50 text-sky-700 border-sky-200";
                if (item.status === "Siap Berangkat") statusBadge = "bg-amber-50 text-amber-700 border-amber-200";
                if (item.status === "Selesai") statusBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";

                // Bersihkan string bookingCode untuk URL (misal: hilangkan tanda pagar #)
                const cleanBookingId = item.bookingCode.replace("#", "");

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
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
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] inline-flex items-center gap-1.5 ${statusBadge}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                          Ceklis Fisik
                        </button>

                        {/* Tombol Proses dibungkus Link ke folder [detail] */}
                        <Link
                          href={`/admin/departures/${cleanBookingId}`}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer inline-flex items-center shadow-xs">
                          Proses
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
