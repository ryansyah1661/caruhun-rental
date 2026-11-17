"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBookings, CalendarBooking, UnitStatus } from "@/lib/use-bookings";

// Daftar Bulan
const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function BookingCalendarPage() {
  const router = useRouter();
  const { data, isLoading, error } = useBookings();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [tableFilterStatus, setTableFilterStatus] = useState<string>("Semua Status");

  // State Bulan & Tahun Aktif (Default Oktober 2026 sesuai mockup)
  const [currentMonth, setCurrentMonth] = useState<number>(9);
  const [currentYear, setCurrentYear] = useState<number>(2026);

  // State untuk Dropdown Pilihan Bulan di Header
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState<boolean>(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  // Data bookings dari PostgreSQL via Laravel API
  const allBookings = useMemo(() => data?.bookings || [], [data?.bookings]);

  // State Booking Aktif di Drawer Kanan
  const [activeBooking, setActiveBooking] = useState<CalendarBooking | null>(null);

  // Set default active booking saat data selesai dimuat
  const hasInitializedActive = useRef<boolean>(false);
  useEffect(() => {
    if (hasInitializedActive.current || allBookings.length === 0) return;

    const currentMonthMatch = allBookings.find((b) => b.month === currentMonth && b.year === currentYear);
    setActiveBooking(currentMonthMatch || allBookings[0]);
    hasInitializedActive.current = true;
  }, [allBookings, currentMonth, currentYear]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setIsMonthDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate Hari dalam Kalender berdasarkan Bulan & Tahun yang dipilih
  const calendarDays = useMemo(() => {
    const days = [];
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
    const emptySlotsAtStart = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    for (let i = 0; i < emptySlotsAtStart; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false });
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      days.push({ dayNumber: d, isCurrentMonth: true });
    }

    return days;
  }, [currentMonth, currentYear]);

  // Filter booking sesuai bulan & tahun yang aktif di kalender
  const currentMonthBookings = useMemo(() => {
    return allBookings.filter((b) => {
      const matchMonth = b.month === currentMonth && b.year === currentYear;
      if (!matchMonth) return false;
      if (selectedCategory === "all") return true;
      if (selectedCategory === "mpv") return b.category === "mpv" || b.unitSpecs.includes("7 Kursi");
      return true;
    });
  }, [allBookings, currentMonth, currentYear, selectedCategory]);

  // Filter data untuk tabel rekapitulasi di bawah
  const filteredTableData = useMemo(() => {
    return allBookings.filter((item) => {
      if (tableFilterStatus === "Semua Status") return true;
      if (tableFilterStatus === "Selesai") return item.status === "Selesai";
      return item.status === tableFilterStatus;
    });
  }, [allBookings, tableFilterStatus]);

  // Handler navigasi tombol bulan
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentMonth(9); // Oktober
    setCurrentYear(2026);
  };

  // Handler klik tombol Detail pada tabel: Memilih booking tersebut agar drawer detail di atas langsung terbuka
  const handleViewDetail = (booking: CalendarBooking) => {
    setActiveBooking(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <BookingsPageSkeleton />;
  }

  // Helper indeks bulan sebelumnya & selanjutnya untuk tombol navigasi
  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span>Operasional Armada</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">Kalender & Daftar Booking</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Reservasi & Jadwal Booking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau ketersediaan unit melalui kalender interaktif atau kelola daftar transaksi sewa dalam format tabel.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {/* TOMBOL DROPDOWN PILIH BULAN DI HEADER */}
          <div className="relative" ref={monthDropdownRef}>
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              type="button"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer border border-slate-200">
              <span className="material-symbols-outlined text-[18px] text-slate-500">calendar_today</span>
              <span>
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </button>

            {/* Menu Dropdown Pilihan Bulan */}
            {isMonthDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Pilih Bulan 2026
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {MONTH_NAMES.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentMonth(idx);
                        setCurrentYear(2026);
                        setIsMonthDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors flex items-center justify-between ${
                        currentMonth === idx ? "bg-amber-50 text-amber-700" : "text-slate-700 hover:bg-slate-50"
                      }`}>
                      <span>{m} 2026</span>
                      {currentMonth === idx && (
                        <span className="material-symbols-outlined text-[16px] text-amber-600">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/admin/bookings/create"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Buat Booking Baru</span>
          </Link>
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
                  Semua Kategori <span className="ml-1 opacity-80">{data?.counts?.total ?? 65}</span>
                </button>
                <button
                  onClick={() => setSelectedCategory("mpv")}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    selectedCategory === "mpv"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  MPV / Keluarga <span className="ml-1 opacity-80">{data?.counts?.mpv ?? 24}</span>
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

            {/* Navigasi Bulan Dinamis */}
            <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                <span className="material-symbols-outlined text-[18px] text-amber-600">event_note</span>
                <span>
                  {MONTH_NAMES[currentMonth]} {currentYear} — Jadwal Operasional Armada
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs">
                  &lsaquo; {MONTH_NAMES[prevMonthIndex].slice(0, 3)}
                </button>
                <button
                  onClick={handleToday}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs">
                  Hari Ini
                </button>
                <button
                  onClick={handleNextMonth}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs">
                  {MONTH_NAMES[nextMonthIndex].slice(0, 3)} &rsaquo;
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

                  const dayBookings = currentMonthBookings.filter((b) => b.date === slot.dayNumber);
                  const isToday = slot.dayNumber === 24 && currentMonth === 9 && currentYear === 2026;
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

                      {/* Badge Inisial & Plat Mobil */}
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
                  Detail Reservasi ({activeBooking.status})
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
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-2xs space-y-2.5">
              <h4 className="font-extrabold text-sm text-slate-900">{activeBooking.unitName}</h4>

              {/* Plat gaya plat nomor */}
              <div className="inline-flex items-center px-3 py-1 rounded-md bg-white border-2 border-slate-900 shadow-2xs">
                <span className="font-mono text-sm font-black tracking-widest text-slate-900 whitespace-nowrap">
                  {activeBooking.shortNopol}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <span className="material-symbols-outlined text-[18px] leading-none shrink-0">location_on</span>
                <span className="leading-snug">{activeBooking.poolLocation}</span>
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
                    {activeBooking.renterName.substring(0, 2).toUpperCase()}
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
              <Link
                href="/admin/inspections/keluar"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>Mulai Serah Terima Armada</span>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                  Ubah Jadwal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const message = `Halo Kak ${activeBooking.renterName}, kami dari Caruhun Rental mengonfirmasi jadwal reservasi unit ${activeBooking.unitName} (${activeBooking.shortNopol}) untuk jadwal ${activeBooking.startDateFull}.`;
                    window.open(
                      `https://wa.me/${activeBooking.renterPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`,
                      "_blank",
                    );
                  }}
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
            <p className="text-xs text-slate-500 mt-0.5">Rekapitulasi riwayat penyewaan aktif, pesanan, dan selesai.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-400">FILTER STATUS:</span>
            <select
              value={tableFilterStatus}
              onChange={(e) => setTableFilterStatus(e.target.value)}
              className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer">
              <option value="Semua Status">Semua Status</option>
              <option value="Disewa">Disewa</option>
              <option value="Dipesan">Dipesan</option>
              <option value="Servis">Servis</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Kode Booking</th>
                <th className="px-4 py-3 text-center">Pelanggan</th>
                <th className="px-4 py-3 text-center">Kendaraan</th>
                <th className="px-4 py-3 text-center">Periode</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredTableData.length > 0 ? (
                filteredTableData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{item.bookingCode}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 text-sm">{item.renterName}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">{item.renterPhone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{item.unitName}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">{item.shortNopol}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <PeriodCell start={item.startDateFull} end={item.endDateFull} duration={item.duration} />
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            item.status === "Disewa"
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : item.status === "Dipesan"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : item.status === "Servis"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleViewDetail(item)}
                          className="w-24 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200/60">
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada data transaksi yang sesuai dengan filter.
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
// Skeleton Loading Komponen untuk Booking Page
// ----------------------------------------------------------------------
function BookingsPageSkeleton() {
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

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
          <div className="flex justify-between items-center">
            <div className="h-8 w-60 bg-slate-100 rounded-xl"></div>
            <div className="h-4 w-40 bg-slate-100 rounded"></div>
          </div>
          <div className="h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
          <div className="h-96 bg-slate-100 rounded-2xl"></div>
        </div>
        <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5">
          <div className="h-6 w-48 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-100 rounded-2xl"></div>
          <div className="h-28 bg-slate-100 rounded-2xl"></div>
          <div className="h-28 bg-slate-100 rounded-2xl"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48"></div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl border border-slate-100"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PeriodCell({ start, end, duration }: { start: string; end: string; duration?: string }) {
  const [startDate, startTime = ""] = start.split(" • ");
  const [endDate, endTime = ""] = end.split(" • ");

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="w-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mulai</span>
        <span className="font-bold text-slate-900">{startDate}</span>
        <span className="font-mono text-[11px] text-slate-500">{startTime.replace(" WIB", "")}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selesai</span>
        <span className="font-bold text-slate-900">{endDate}</span>
        <span className="font-mono text-[11px] text-slate-500">{endTime.replace(" WIB", "")}</span>
        <span className="text-[10px] font-semibold text-slate-400">WIB</span>
        {duration && (
          <span className="ml-1 px-1.5 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold">
            {duration}
          </span>
        )}
      </div>
    </div>
  );
}
