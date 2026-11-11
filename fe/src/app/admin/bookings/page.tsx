"use client";

import React, { useState, useMemo } from "react";

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
  status: UnitStatus;
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
    status: "Selesai" as any,
  },
];

export default function BookingCalendarPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    <div className="w-full font-body-md text-on-surface antialiased p-space-md lg:p-margin-desktop space-y-space-lg">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-secondary mb-1">
            <span>Dashboard</span> &rsaquo; <span>Operasional Armada</span> &rsaquo;{" "}
            <span className="text-on-surface font-semibold">Kalender Armada</span>
          </div>
          <h1 className="font-display-md text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Kalender Armada & Reservasi
          </h1>
          <p className="font-body-md text-sm text-secondary mt-1">
            Visualisasi jadwal reservasi, status operasional, dan ketersediaan armada per hari.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface text-sm font-medium flex items-center gap-1.5 transition-colors">
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span>Hari Ini</span>
          </button>
          <button
            type="button"
            className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface text-sm font-medium flex items-center gap-1.5 transition-colors">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Ekspor Jadwal</span>
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-title-md font-semibold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Buat Booking Baru</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT LAYOUT (TIMELINE & FLYOUT DETAIL) ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* LEFT / CENTER: TIMELINE GANTT CHART (8 atau 12 Kolom) */}
        <div className={`${activeBooking ? "xl:col-span-8" : "xl:col-span-12"} transition-all space-y-space-md`}>
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md border border-surface-container">
            {/* Top Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container pb-space-md">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedCategory === "all" ? "bg-slate-900 text-white" : "bg-surface-container text-secondary hover:text-on-surface"}`}>
                  Semua Kategori <span className="ml-1 opacity-75">65</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("mpv")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedCategory === "mpv" ? "bg-slate-900 text-white" : "bg-surface-container text-secondary hover:text-on-surface"}`}>
                  MPV / Keluarga <span className="ml-1 opacity-75">24</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("city")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${selectedCategory === "city" ? "bg-slate-900 text-white" : "bg-surface-container text-secondary hover:text-on-surface"}`}>
                  City Car <span className="ml-1 opacity-75">15</span>
                </button>
              </div>

              {/* Status Indicator Legend */}
              <div className="flex items-center gap-3 text-xs font-medium text-secondary shrink-0">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tersedia
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Dipesan
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> Disewa
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span> Servis
                </span>
              </div>
            </div>

            {/* TIMELINE TABLE / MATRIX */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Timeline Days Header */}
                <div className="grid grid-cols-12 gap-2 pb-3 border-b border-surface-container text-center text-xs font-semibold">
                  <div className="col-span-4 text-left px-2 text-secondary">Armada Pool (8 Unit)</div>
                  <div className="col-span-8 grid grid-cols-7 gap-1">
                    {daysHeader.map((d) => (
                      <div
                        key={d.dateNum}
                        className={`p-1 rounded-lg ${d.isToday ? "bg-rose-50 border border-rose-200 text-rose-700" : "text-secondary"}`}>
                        <span className="block text-[10px] uppercase">{d.dayName}</span>
                        <span className="text-sm font-bold">{d.dateNum}</span>
                        {d.isToday && (
                          <span className="block text-[9px] font-extrabold uppercase tracking-tighter">HARI INI</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Rows */}
                <div className="divide-y divide-surface-container">
                  {TIMELINE_DATA.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 py-3.5 items-center hover:bg-surface-container-low transition-colors rounded-lg px-2">
                      {/* Unit Detail Info */}
                      <div className="col-span-4 flex items-center gap-3 pr-2">
                        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[20px]">directions_car</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-on-surface truncate">{item.unitName}</h4>
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-white font-semibold">
                              {item.nopol}
                            </span>
                          </div>
                          <p className="text-xs text-secondary truncate mt-0.5">{item.unitSpecs}</p>
                        </div>
                      </div>

                      {/* Bar Grid Visual */}
                      <div className="col-span-8 grid grid-cols-7 gap-1 relative items-center h-10">
                        {/* Status Bar */}
                        <div
                          onClick={() => setActiveBooking(item)}
                          className={`cursor-pointer absolute h-8 rounded-lg px-2 flex items-center justify-between text-xs font-semibold text-white shadow-sm hover:brightness-110 transition-all ${
                            item.status === "Disewa"
                              ? "bg-blue-600"
                              : item.status === "Dipesan"
                                ? "bg-amber-500"
                                : "bg-rose-600"
                          }`}
                          style={{
                            left: `${((item.startDay - 21) / 7) * 100}%`,
                            width: `${((item.endDay - item.startDay + 1) / 7) * 100}%`,
                          }}>
                          <span className="truncate">{item.renterName}</span>
                          <span className="text-[10px] opacity-90 font-mono hidden sm:inline">{item.bookingCode}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: DETAIL FLYOUT DRAWER (4 Kolom) */}
        {activeBooking && (
          <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container p-space-lg space-y-5 sticky top-4">
            {/* Top Close Bar */}
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                  {activeBooking.status} • Menunggu Serah Terima
                </span>
                <h3 className="font-mono text-xl font-bold text-on-surface">{activeBooking.bookingCode}</h3>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-dim flex items-center justify-center text-secondary transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Vehicle Card Header */}
            <div className="p-3 bg-surface-container-low rounded-xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">directions_car</span>
              </div>
              <div>
                <h4 className="font-bold text-base text-on-surface">{activeBooking.unitName}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {activeBooking.nopol}
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">{activeBooking.poolLocation}</span>
                </div>
              </div>
            </div>

            {/* Renter Information */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider block">INFORMASI PENYEWA</span>
              <div className="flex items-center justify-between p-3 rounded-lg border border-surface-container">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">
                    HW
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-on-surface">{activeBooking.renterName}</h5>
                    <p className="text-xs text-secondary font-mono">{activeBooking.renterPhone}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs pt-1">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> KTP Terverifikasi
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">badge</span> SIM A Aktif
                </span>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
                JADWAL & PENYERAHAN
              </span>
              <div className="bg-surface-container-low p-3 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Mulai Sewa (Pick-up):</span>
                  <strong className="text-on-surface">{activeBooking.startDateFull}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary">Pengembalian (Drop-off):</span>
                  <strong className="text-on-surface">{activeBooking.endDateFull}</strong>
                </div>
                <div className="pt-1 text-tertiary-container font-semibold">Durasi: {activeBooking.duration}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                className="w-full min-h-[44px] rounded-lg bg-primary-container hover:bg-primary text-on-primary font-title-md font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>Mulai Serah Terima Armada</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="w-full min-h-[40px] rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface text-xs font-semibold transition-colors">
                  Ubah Jadwal
                </button>
                <button
                  type="button"
                  className="w-full min-h-[40px] rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= BOTTOM SECTION: DAFTAR RENTAL TABLE ================= */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md border border-surface-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container pb-space-xs">
          <div>
            <h2 className="font-title-md text-lg font-bold text-on-surface">Daftar Rental Transaksi</h2>
            <p className="text-xs text-secondary mt-0.5">Rekapitulasi riwayat penyewaan aktif dan selesai</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-secondary">FILTER STATUS:</span>
            <select className="h-9 rounded-lg bg-surface-container px-3 text-xs font-semibold text-on-surface border-none focus:outline-none">
              <option>Semua Status</option>
              <option>Disewa</option>
              <option>Selesai</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container text-secondary font-semibold uppercase h-9">
                <th className="px-4 py-2">Pelanggan</th>
                <th className="px-4 py-2">Kendaraan</th>
                <th className="px-4 py-2">Periode</th>
                <th className="px-4 py-2">Paket</th>
                <th className="px-4 py-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {DAFTAR_RENTAL_TABLE.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-on-surface text-sm">{item.renterName}</div>
                    <div className="text-secondary font-mono">{item.renterPhone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-on-surface">{item.unitName}</div>
                    <div className="text-secondary font-mono">{item.nopol}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-on-surface">{item.period}</td>
                  <td className="px-4 py-3">{item.packageType}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-md bg-surface-container hover:bg-surface-dim font-semibold transition-colors">
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
