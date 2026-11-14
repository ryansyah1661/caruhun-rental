"use client";

import React, { useState, useMemo } from "react";

// Types
type UnitStatus = "Tersedia" | "Dipesan" | "Disewa" | "Servis";

interface CalendarBooking {
  id: string;
  bookingCode: string;
  renterName: string;
  renterPhone: string;
  isKtpVerified: boolean;
  isSimActive: boolean;
  unitName: string;
  unitInitial: string;
  shortNopol: string;
  unitSpecs: string;
  date: number;
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

// Dummy Data Booking Berdasarkan Tanggal di Bulan Oktober 2026
const MONTH_BOOKINGS: CalendarBooking[] = [
  {
    id: "1",
    bookingCode: "#CRH-2410-088",
    renterName: "Rizky Kurniawan",
    renterPhone: "0851-4161-0411",
    isKtpVerified: true,
    isSimActive: true,
    unitName: "Honda Brio RS",
    unitInitial: "BRO",
    shortNopol: "D 2091 AGH",
    unitSpecs: "1.2 CVT • 5 Kursi",
    date: 10,
    startDateFull: "10 Okt 2026 • 10:00 WIB",
    endDateFull: "12 Okt 2026 • 10:00 WIB",
    duration: "2 Hari",
    status: "Disewa",
    poolLocation: "Pool Utama",
    adminName: "Naila",
  },
  {
    id: "2",
    bookingCode: "#CRH-2410-091",
    renterName: "PT Surya Logistik",
    renterPhone: "0812-3456-7890",
    isKtpVerified: true,
    isSimActive: true,
    unitName: "Toyota Avanza 1.5 G",
    unitInitial: "AVZ",
    shortNopol: "B 1482 KFD",
    unitSpecs: "1.5 G MT • 7 Kursi",
    date: 24,
    startDateFull: "24 Okt 2026 • 09:00 WIB",
    endDateFull: "26 Okt 2026 • 09:00 WIB",
    duration: "2 Hari Penuh (48 Jam)",
    status: "Disewa",
    poolLocation: "Pool Cilandak (Ready)",
    adminName: "Budi S.",
  },
  {
    id: "3",
    bookingCode: "#BK-2024-1024",
    renterName: "Hendro Wicaksono",
    renterPhone: "0812-9876-5432",
    isKtpVerified: true,
    isSimActive: true,
    unitName: "Innova Zenix 2.0 V",
    unitInitial: "ZNX",
    shortNopol: "B 2884 SSR",
    unitSpecs: "2.0 V AT • 7 Kursi",
    date: 24,
    startDateFull: "24 Okt 2026 • 09:00 WIB",
    endDateFull: "28 Okt 2026 • 09:00 WIB",
    duration: "4 Hari Penuh",
    status: "Dipesan",
    poolLocation: "Pool Cilandak (Siap Ready)",
    adminName: "Budi S.",
  },
  {
    id: "4",
    bookingCode: "#CRH-2410-095",
    renterName: "Servis Rutin 10.000km",
    renterPhone: "-",
    isKtpVerified: false,
    isSimActive: false,
    unitName: "HiAce Commuter",
    unitInitial: "HAC",
    shortNopol: "B 1019 TRB",
    unitSpecs: "2.5 Diesel • 16 Kursi",
    date: 25,
    startDateFull: "25 Okt 2026",
    endDateFull: "27 Okt 2026",
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
];

export default function BookingCalendarPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeBooking, setActiveBooking] = useState<CalendarBooking | null>(MONTH_BOOKINGS[1]);

  const calendarDays = useMemo(() => {
    const days = [];
    const emptySlotsAtStart = 3;

    for (let i = 0; i < emptySlotsAtStart; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false });
    }

    for (let d = 1; d <= 31; d++) {
      days.push({ dayNumber: d, isCurrentMonth: true });
    }

    return days;
  }, []);

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span>Operasional Armada</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">Kalender Bulanan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kalender Reservasi Bulanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tampilan kalender interaktif bulan Oktober 2026. Klik pada inisial/plat mobil untuk melihat detail sewa.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-slate-500">calendar_today</span>
            <span>Oktober 2026</span>
          </button>
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Buat Booking Baru</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT LAYOUT ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: INTERACTIVE MONTHLY CALENDAR GRID */}
        <div className={`${activeBooking ? "xl:col-span-8" : "xl:col-span-12"} transition-all space-y-6`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            {/* Top Filter & Legend */}
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
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Tersedia
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Dipesan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Disewa
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Servis
                </span>
              </div>
            </div>

            {/* Navigasi Bulan */}
            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                <span className="material-symbols-outlined text-[18px] text-amber-600">event_note</span>
                <span>Oktober 2026 — Jadwal Operasional Armada</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs">
                  &lsaquo; Sept
                </button>
                <button className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs">
                  Hari Ini
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs">
                  Nov &rsaquo;
                </button>
              </div>
            </div>

            {/* KALENDER BULANAN GRID INTERAKTIF */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              {/* Header Hari */}
              <div className="grid grid-cols-7 bg-slate-100/80 border-b border-slate-200 text-center text-xs font-bold text-slate-700 py-3">
                <span>Senin</span>
                <span>Selasa</span>
                <span>Rabu</span>
                <span>Kamis</span>
                <span>Jumat</span>
                <span>Sabtu</span>
                <span>Minggu</span>
              </div>

              {/* Kotak Tanggal Grid */}
              <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px">
                {calendarDays.map((slot, index) => {
                  if (!slot.isCurrentMonth || slot.dayNumber === null) {
                    return <div key={index} className="bg-slate-50/40 min-h-[145px] p-2"></div>;
                  }

                  const dayBookings = MONTH_BOOKINGS.filter((b) => b.date === slot.dayNumber);
                  const isToday = slot.dayNumber === 24;
                  const isSelected = activeBooking && dayBookings.some((b) => b.id === activeBooking.id);

                  return (
                    <div
                      key={index}
                      className={`bg-white min-h-[145px] p-2 flex flex-col justify-between transition-all relative group ${
                        isToday ? "bg-amber-50/40 ring-2 ring-amber-400 inset-0 z-10" : "hover:bg-slate-50/70"
                      } ${isSelected ? "bg-sky-50/30" : ""}`}>
                      {/* Nomor Tanggal & Indikator Unit */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-black w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isToday ? "bg-amber-600 text-white shadow-sm" : "text-slate-700 bg-slate-100/60"
                          }`}>
                          {slot.dayNumber}
                        </span>
                        {dayBookings.length > 0 && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {dayBookings.length} unit
                          </span>
                        )}
                      </div>

                      {/* Badge Inisial & Plat Mobil Tanpa Potong Teks */}
                      <div className="space-y-1.5 mt-1.5">
                        {dayBookings.map((bk) => {
                          let badgeBg = "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-600 hover:text-white";
                          if (bk.status === "Dipesan")
                            badgeBg = "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-600 hover:text-white";
                          if (bk.status === "Servis")
                            badgeBg = "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-600 hover:text-white";

                          const isCurrentActive = activeBooking?.id === bk.id;

                          return (
                            <div
                              key={bk.id}
                              onClick={() => setActiveBooking(bk)}
                              className={`cursor-pointer px-2 py-1.5 rounded-xl border text-[10px] font-black shadow-2xs transition-all flex flex-col gap-0.5 ${badgeBg} ${
                                isCurrentActive ? "ring-2 ring-amber-500 shadow-sm scale-[1.02]" : ""
                              }`}
                              title={`Klik untuk lihat detail ${bk.unitName}`}>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 font-extrabold">
                                  <span className="material-symbols-outlined text-[12px] opacity-75">
                                    {bk.status === "Servis" ? "build" : "directions_car"}
                                  </span>
                                  {bk.unitInitial}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              </div>
                              <span className="font-mono text-[9px] opacity-90 tracking-tighter truncate font-semibold">
                                {bk.shortNopol}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: INTERACTIVE DETAIL FLYOUT DRAWER */}
        {activeBooking && (
          <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 space-y-5 sticky top-6 animate-in fade-in duration-200">
            {/* Top Close Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wide flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  {activeBooking.status} • Detail Reservasi
                </span>
                <h3 className="font-mono text-xl font-black text-slate-900 mt-0.5">{activeBooking.bookingCode}</h3>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Vehicle Card Header */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3.5 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black shrink-0 shadow-sm text-xs">
                {activeBooking.unitInitial}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{activeBooking.unitName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {activeBooking.shortNopol}
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
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-xs">
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
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2.5 text-xs shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Mulai Sewa (Pick-up):</span>
                  <strong className="text-slate-900">{activeBooking.startDateFull}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Pengembalian (Drop-off):</span>
                  <strong className="text-slate-900">{activeBooking.endDateFull}</strong>
                </div>
                <div className="pt-2.5 border-t border-slate-200/60 text-sky-700 font-bold flex items-center justify-between">
                  <span>Durasi Sewa:</span>
                  <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200">{activeBooking.duration}</span>
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
