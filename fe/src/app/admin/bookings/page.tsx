"use client";

import React, { useState } from "react";

// Types
type UnitStatus = "Tersedia" | "Dipesan" | "Disewa" | "Servis";

interface TimelineBooking {
  id: string;
  bookingCode: string;
  renterName: string;
  renterPhone: string;
  isKtpVerified: boolean;
  isSimActive: boolean;
  unitName: string;
  nopol: string;
  unitSpecs: string;
  startDay: number; // 21 - 27 Okt
  endDay: number;
  startDateFull: string;
  endDateFull: string;
  duration: string;
  status: UnitStatus;
  poolLocation: string;
  adminName: string;
}

interface RentalTableItem {
  id: string;
  renterName: string;
  renterPhone: string;
  unitName: string;
  nopol: string;
  period: string;
  packageType: string;
  status: UnitStatus | "Selesai";
}

// Dummy Data Timeline
const TIMELINE_DATA: TimelineBooking[] = [
  {
    id: "1",
    bookingCode: "#CRH-2410-091",
    renterName: "PT Surya Logistik",
    renterPhone: "0812-3456-7890",
    isKtpVerified: true,
    isSimActive: true,
    unitName: "Toyota Avanza",
    nopol: "B 1482 KFD",
    unitSpecs: "1.5 G MT • 7 Kursi",
    startDay: 24,
    endDay: 26,
    startDateFull: "24 Okt 2026 • 09:00 WIB",
    endDateFull: "26 Okt 2026 • 09:00 WIB",
    duration: "2 Hari Penuh (48 Jam)",
    status: "Disewa",
    poolLocation: "Pool Cilandak (Ready)",
    adminName: "Budi S.",
  },
  {
    id: "2",
    bookingCode: "#BK-2024-1024",
    renterName: "Hendro Wicaksono",
    renterPhone: "0812-9876-5432",
    isKtpVerified: true,
    isSimActive: true,
    unitName: "Innova Zenix 2.0 V",
    nopol: "B 2884 SSR",
    unitSpecs: "2.0 V AT • 7 Kursi",
    startDay: 25,
    endDay: 28,
    startDateFull: "25 Okt 2026 • 09:00 WIB",
    endDateFull: "28 Okt 2026 • 09:00 WIB",
    duration: "3 Hari Penuh (72 Jam)",
    status: "Dipesan",
    poolLocation: "Pool Cilandak (Siap Ready)",
    adminName: "Budi S.",
  },
  {
    id: "3",
    bookingCode: "#CRH-2410-088",
    renterName: "Rizky Kurniawan",
    renterPhone: "0851-4161-0411",
    isKtpVerified: true,
    isSimActive: true,
    unitName: "Honda Brio RS",
    nopol: "D 2091 AGH",
    unitSpecs: "1.2 CVT • 5 Kursi",
    startDay: 22,
    endDay: 24,
    startDateFull: "22 Okt 2026 • 10:00 WIB",
    endDateFull: "24 Okt 2026 • 10:00 WIB",
    duration: "2 Hari",
    status: "Disewa",
    poolLocation: "Pool Utama",
    adminName: "Naila",
  },
  {
    id: "4",
    bookingCode: "#CRH-2410-095",
    renterName: "Servis Rutin 10.000km",
    renterPhone: "-",
    isKtpVerified: false,
    isSimActive: false,
    unitName: "HiAce Commuter",
    nopol: "B 1019 TRB",
    unitSpecs: "2.5 Diesel • 16 Kursi",
    startDay: 23,
    endDay: 25,
    startDateFull: "23 Okt 2026",
    endDateFull: "25 Okt 2026",
    duration: "Bengkel Resmi",
    status: "Servis",
    poolLocation: "Auto2000 Cilandak",
    adminName: "Mekanik Pool",
  },
];

const DAFTAR_RENTAL_TABLE: RentalTableItem[] = [
  {
    id: "1",
    renterName: "Asha",
    renterPhone: "08123456789",
    unitName: "Toyota Avanza",
    nopol: "B 1956 SBK",
    period: "18 Okt 2026 - 19 Okt 2026",
    packageType: "Paket 1 Hari (24 Jam)",
    status: "Disewa",
  },
  {
    id: "2",
    renterName: "Rizki Ramdhani",
    renterPhone: "081244321000",
    unitName: "Honda PCX 160",
    nopol: "B 1234 BKC",
    period: "14 Okt 2026 - 15 Okt 2026",
    packageType: "Custom Paket 2 Hari",
    status: "Selesai",
  },
];

export default function BookingCalendarPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeBooking, setActiveBooking] = useState<TimelineBooking | null>(TIMELINE_DATA[1]); // Default B 2884 SSR

  const daysHeader = [
    { dayName: "Sen", dateNum: 21 },
    { dayName: "Sel", dateNum: 22 },
    { dayName: "Rab", dateNum: 23 },
    { dayName: "Kam", dateNum: 24, isToday: true },
    { dayName: "Jum", dateNum: 25 },
    { dayName: "Sab", dateNum: 26 },
    { dayName: "Ming", dateNum: 27 },
  ];

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span>Operasional Armada</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">Kalender Armada</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kalender Armada & Reservasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualisasi jadwal reservasi, status operasional, dan ketersediaan armada per hari.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-slate-500">calendar_today</span>
            <span>Hari Ini</span>
          </button>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-slate-500">file_download</span>
            <span>Ekspor Jadwal</span>
          </button>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Buat Booking Baru</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT LAYOUT (TIMELINE & FLYOUT DETAIL) ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: TIMELINE GANTT CHART */}
        <div className={`${activeBooking ? "xl:col-span-8" : "xl:col-span-12"} transition-all space-y-6`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            {/* Top Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCategory === "all"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  Semua Kategori <span className="ml-1 opacity-80">65</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("mpv")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCategory === "mpv"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  MPV / Keluarga <span className="ml-1 opacity-80">24</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("city")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCategory === "city"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  City Car <span className="ml-1 opacity-80">15</span>
                </button>
              </div>

              {/* Status Indicator Legend */}
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tersedia
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Dipesan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span> Disewa
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Servis
                </span>
              </div>
            </div>

            {/* TIMELINE TABLE / MATRIX */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Timeline Days Header */}
                <div className="grid grid-cols-12 gap-3 pb-3 border-b border-slate-100 text-center text-xs font-bold text-slate-500">
                  <div className="col-span-4 text-left px-2">Armada Pool (4 Unit Aktif)</div>
                  <div className="col-span-8 grid grid-cols-7 gap-1.5">
                    {daysHeader.map((d) => (
                      <div
                        key={d.dateNum}
                        className={`p-2 rounded-xl border ${
                          d.isToday
                            ? "bg-amber-50 border-amber-300 text-amber-900 shadow-2xs"
                            : "bg-slate-50/70 border-slate-200/70 text-slate-600"
                        }`}>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">{d.dayName}</span>
                        <span className="text-sm font-extrabold">{d.dateNum}</span>
                        {d.isToday && (
                          <span className="block text-[9px] font-extrabold uppercase tracking-tighter text-amber-600 mt-0.5">
                            HARI INI
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Rows */}
                <div className="divide-y divide-slate-100">
                  {TIMELINE_DATA.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-3 py-3.5 items-center hover:bg-slate-50/80 transition-colors rounded-xl px-2">
                      {/* Unit Detail Info */}
                      <div className="col-span-4 flex items-center gap-3 pr-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                          <span className="material-symbols-outlined text-[20px]">directions_car</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-900 truncate">{item.unitName}</h4>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-white font-semibold">
                              {item.nopol}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{item.unitSpecs}</p>
                        </div>
                      </div>

                      {/* Bar Grid Visual */}
                      <div className="col-span-8 grid grid-cols-7 gap-1.5 relative items-center h-10">
                        <div
                          onClick={() => setActiveBooking(item)}
                          className={`cursor-pointer absolute h-8 rounded-xl px-3 flex items-center justify-between text-xs font-bold text-white shadow-sm hover:brightness-105 transition-all ${
                            item.status === "Disewa"
                              ? "bg-sky-600"
                              : item.status === "Dipesan"
                                ? "bg-amber-500"
                                : "bg-rose-600"
                          }`}
                          style={{
                            left: `${((item.startDay - 21) / 7) * 100}%`,
                            width: `${((item.endDay - item.startDay + 1) / 7) * 100}%`,
                          }}>
                          <span className="truncate">{item.renterName}</span>
                          <span className="text-[10px] opacity-90 font-mono hidden sm:inline font-semibold">
                            {item.bookingCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DETAIL FLYOUT DRAWER */}
        {activeBooking && (
          <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-5 sticky top-6">
            {/* Top Close Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                  {activeBooking.status} • Menunggu Serah Terima
                </span>
                <h3 className="font-mono text-xl font-extrabold text-slate-900 mt-0.5">{activeBooking.bookingCode}</h3>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Vehicle Card Header */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
                <span className="material-symbols-outlined text-2xl">directions_car</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{activeBooking.unitName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {activeBooking.nopol}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">{activeBooking.poolLocation}</span>
                </div>
              </div>
            </div>

            {/* Renter Information */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Informasi Penyewa
              </span>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                    HW
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{activeBooking.renterName}</h5>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{activeBooking.renterPhone}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">verified</span> KTP Terverifikasi
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1 text-[11px]">
                  <span className="material-symbols-outlined text-[14px]">badge</span> SIM A Aktif
                </span>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Jadwal & Penyerahan
              </span>
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Mulai Sewa (Pick-up):</span>
                  <strong className="text-slate-900">{activeBooking.startDateFull}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Pengembalian (Drop-off):</span>
                  <strong className="text-slate-900">{activeBooking.endDateFull}</strong>
                </div>
                <div className="pt-2 border-t border-slate-200/60 text-sky-700 font-bold">
                  Durasi: {activeBooking.duration}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>Mulai Serah Terima Armada</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                  Ubah Jadwal
                </button>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= BOTTOM SECTION: DAFTAR RENTAL TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Daftar Rental Transaksi</h2>
            <p className="text-xs text-slate-500 mt-0.5">Rekapitulasi riwayat penyewaan aktif dan selesai</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-400">FILTER STATUS:</span>
            <select className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500">
              <option>Semua Status</option>
              <option>Disewa</option>
              <option>Selesai</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200">
                <th className="px-4 py-3">Pelanggan</th>
                <th className="px-4 py-3">Kendaraan</th>
                <th className="px-4 py-3">Periode</th>
                <th className="px-4 py-3">Paket</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {DAFTAR_RENTAL_TABLE.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 text-sm">{item.renterName}</div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">{item.renterPhone}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900">{item.unitName}</div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">{item.nopol}</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">{item.period}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {item.packageType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
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
