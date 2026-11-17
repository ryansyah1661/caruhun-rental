"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
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
  const qc = useQueryClient();
  const { data, isLoading, error } = useBookings();

  // State Modal Ubah Jadwal Booking
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<CalendarBooking | null>(null);
  const [editRenterName, setEditRenterName] = useState("");
  const [editRenterPhone, setEditRenterPhone] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("09:00");
  const [editEndDate, setEditEndDate] = useState("");
  const [editEndTime, setEditEndTime] = useState("09:00");
  const [editStatus, setEditStatus] = useState<UnitStatus>("Dipesan");
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [scheduleMsg, setScheduleMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  const handleOpenEditModal = (booking: CalendarBooking) => {
    setEditingBooking(booking);
    setEditRenterName(booking.renterName || "");
    setEditRenterPhone(booking.renterPhone || "");
    setEditStatus(booking.status);
    setScheduleMsg(null);

    const pad = (n: number) => String(n).padStart(2, "0");
    const m = pad(booking.month + 1);
    const d = pad(booking.date);
    setEditStartDate(`${booking.year}-${m}-${d}`);
    setEditStartTime("09:00");

    const nextDay = Math.min(28, booking.date + 2);
    setEditEndDate(`${booking.year}-${m}-${pad(nextDay)}`);
    setEditEndTime("09:00");

    setIsEditModalOpen(true);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    setIsSavingSchedule(true);
    setScheduleMsg(null);

    try {
      const startAt = `${editStartDate} ${editStartTime}:00`;
      const endAt = `${editEndDate} ${editEndTime}:00`;

      await api.put(`/admin/bookings/${editingBooking.id}`, {
        start_at: startAt,
        end_at: endAt,
        status: editStatus,
        renter_name: editRenterName,
        renter_phone: editRenterPhone,
      });

      setScheduleMsg({ type: "success", text: "Data booking & jadwal berhasil diperbarui!" });
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });

      // Perbarui juga data di state activeBooking jika ID cocok
      if (activeBooking && activeBooking.id === editingBooking.id) {
        setActiveBooking((prev) =>
          prev
            ? {
                ...prev,
                status: editStatus,
                renterName: editRenterName,
                renterPhone: editRenterPhone,
                startDateFull: `${editStartDate} • ${editStartTime} WIB`,
                endDateFull: `${editEndDate} • ${editEndTime} WIB`,
              }
            : null,
        );
      }

      setTimeout(() => {
        setIsEditModalOpen(false);
        setScheduleMsg(null);
      }, 1000);
    } catch (err: any) {
      setScheduleMsg({
        type: "error",
        text: err.response?.data?.message || "Gagal mengubah jadwal booking. Coba beberapa saat lagi.",
      });
    } finally {
      setIsSavingSchedule(false);
    }
  };

  // Generate Hari dalam Kalender berdasarkan Bulan & Tahun yang dipilih
  const daysInMonth = useMemo(() => {
    const days = [];
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  // Filter Bookings Kalender berdasarkan Kategori Mobil & Bulan/Tahun
  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      const matchesCategory =
        selectedCategory === "all" || (b.category || "").toLowerCase() === selectedCategory.toLowerCase();
      const matchesMonth = b.month === currentMonth;
      const matchesYear = b.year === currentYear;
      return matchesCategory && matchesMonth && matchesYear;
    });
  }, [allBookings, selectedCategory, currentMonth, currentYear]);

  // Filter Bookings untuk Tabel di Bawah
  const tableBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (tableFilterStatus === "Semua Status") return true;
      return b.status === tableFilterStatus;
    });
  }, [allBookings, tableFilterStatus]);

  // Helper untuk Mendapatkan Booking di Tanggal Tertentu
  const getBookingsForDate = (date: number) => {
    return filteredBookings.filter((b) => b.date === date);
  };

  // Navigasi Bulan Mundur
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  // Navigasi Bulan Maju
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Pilih Bulan & Tahun Spesifik
  const handleSelectMonthYear = (monthIndex: number, year: number) => {
    setCurrentMonth(monthIndex);
    setCurrentYear(year);
    setIsMonthDropdownOpen(false);
  };

  // Handler klik tombol Detail pada tabel
  const handleViewDetail = (booking: CalendarBooking) => {
    setActiveBooking(booking);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <BookingsPageSkeleton />;
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Operasional</span> &rsaquo; <span className="text-slate-800 font-bold">Kalender Booking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Reservasi & Jadwal Unit</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau ketersediaan armada, status penyewaan harian, dan serah terima kendaraan.
          </p>
        </div>

        {/* Filter & Tombol Buat Booking Baru */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}>
              Semua
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("mpv")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === "mpv"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}>
              MPV
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("city")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === "city"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}>
              City Car
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("minibus")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === "minibus"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}>
              Minibus
            </button>
          </div>

          <Link
            href="/admin/bookings/create"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Booking Baru</span>
          </Link>
        </div>
      </div>

      {/* Grid Utama: Kalender di Kiri, Drawer Detail Aktif di Kanan */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Kolom Kalender (8 Kolom) */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          {/* Baris Navigasi Bulan */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 relative" ref={monthDropdownRef}>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-2xl">calendar_month</span>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsMonthDropdownOpen((prev) => !prev)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                title="Pilih Bulan & Tahun">
                <span className="material-symbols-outlined text-[18px]">
                  {isMonthDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {/* Popover Pilihan Bulan */}
              {isMonthDropdownOpen && (
                <div className="absolute top-10 left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider px-2 py-1 mb-1">
                    Pilih Bulan Tahun {currentYear}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {MONTH_NAMES.map((name, idx) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => handleSelectMonthYear(idx, currentYear)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                          idx === currentMonth
                            ? "bg-amber-600 text-white shadow-2xs"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}>
                        {name.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                    <button
                      type="button"
                      onClick={() => setCurrentYear((prev) => prev - 1)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900">
                      &laquo; {currentYear - 1}
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-900">{currentYear}</span>
                    <button
                      type="button"
                      onClick={() => setCurrentYear((prev) => prev + 1)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900">
                      {currentYear + 1} &raquo;
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Bulan Sebelumnya">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentMonth(9);
                  setCurrentYear(2026);
                }}
                className="px-3 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 transition-colors cursor-pointer">
                Bulan Ini
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Bulan Berikutnya">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Label Hari */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 uppercase tracking-wider py-1 border-b border-slate-100">
            <div>Min</div>
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
          </div>

          {/* Grid Tanggal Kalender */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const bookingsOnThisDate = getBookingsForDate(day.date);
              const isSelected = activeBooking?.date === day.date && activeBooking?.month === currentMonth;

              return (
                <div
                  key={day.date}
                  onClick={() => {
                    if (bookingsOnThisDate.length > 0) {
                      setActiveBooking(bookingsOnThisDate[0]);
                    }
                  }}
                  className={`min-h-[105px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20 shadow-xs"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50/50"
                  } ${bookingsOnThisDate.length > 0 ? "cursor-pointer" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold w-6 h-6 flex items-center justify-center rounded-full ${
                        isSelected
                          ? "bg-amber-600 text-white"
                          : day.date === 24 && currentMonth === 9
                            ? "bg-amber-100 text-amber-800"
                            : "text-slate-800"
                      }`}>
                      {day.date}
                    </span>

                    {bookingsOnThisDate.length > 0 && (
                      <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                        {bookingsOnThisDate.length} unit
                      </span>
                    )}
                  </div>

                  {/* Daftar Unit Booking pada Tanggal Tersebut */}
                  <div className="space-y-1.5 mt-1.5 flex-1">
                    {bookingsOnThisDate.map((b) => {
                      const isCurrentActive = activeBooking?.id === b.id;

                      const statusColors: Record<UnitStatus, string> = {
                        Tersedia: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
                        Disewa: "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100",
                        Dipesan: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
                        Servis: "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100",
                        Selesai: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
                      };

                      return (
                        <div
                          key={b.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBooking(b);
                          }}
                          className={`px-2 py-1 rounded-xl border text-[11px] font-bold flex flex-col gap-0.5 transition-all cursor-pointer ${
                            statusColors[b.status]
                          } ${isCurrentActive ? "ring-2 ring-amber-600 shadow-xs" : ""}`}>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 truncate">
                              <span className="material-symbols-outlined text-[13px]">
                                {b.status === "Servis" ? "build" : "directions_car"}
                              </span>
                              <strong className="truncate">{b.unitCode || b.unitInitial || "UNIT"}</strong>
                            </span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                b.status === "Disewa"
                                  ? "bg-sky-500"
                                  : b.status === "Dipesan"
                                    ? "bg-amber-500"
                                    : b.status === "Servis"
                                      ? "bg-rose-500"
                                      : "bg-emerald-500"
                              }`}
                            />
                          </div>
                          <span className="text-[9px] font-mono opacity-80 truncate">{b.shortNopol}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legenda Status */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Dipesan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span>Sedang Disewa</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Perawatan / Bengkel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Selesai</span>
            </div>
          </div>
        </div>

        {/* Kolom Drawer Informasi Booking Aktif (4 Kolom) */}
        <div className="xl:col-span-4 space-y-5">
          {activeBooking ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    Kode Booking
                  </span>
                  <h3 className="font-mono font-extrabold text-sm text-slate-900">{activeBooking.bookingCode}</h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    activeBooking.status === "Disewa"
                      ? "bg-sky-50 text-sky-700 border-sky-200"
                      : activeBooking.status === "Dipesan"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : activeBooking.status === "Servis"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}>
                  {activeBooking.status}
                </span>
              </div>

              {/* Detail Unit Kendaraan */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Unit Armada</span>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">directions_car</span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{activeBooking.unitName}</h4>
                      <p className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
                        {activeBooking.shortNopol}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    {activeBooking.category}
                  </span>
                </div>
              </div>

              {/* Detail Penyewa */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Informasi Penyewa</span>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center">
                      {activeBooking.renterName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{activeBooking.renterName}</h4>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">{activeBooking.renterPhone}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>KTP Terverifikasi</span>
                    </span>
                    <span className="flex items-center gap-1 text-sky-600 font-semibold">
                      <span className="material-symbols-outlined text-[14px]">badge</span>
                      <span>SIM A Aktif</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Jadwal Sewa */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Jadwal & Penyerahan
                </span>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Mulai Sewa (Pick-up):</span>
                    <span className="font-bold text-slate-900">{activeBooking.startDateFull}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Pengembalian (Drop-off):</span>
                    <span className="font-bold text-slate-900">{activeBooking.endDateFull}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center font-bold">
                    <span className="text-slate-700">Durasi Sewa:</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs">
                      {activeBooking.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Aksi Cepat */}
              <div className="pt-2 space-y-2">
                <Link
                  href={`/admin/inspections/keluar?booking=${activeBooking.bookingCode}`}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">key</span>
                  <span>Mulai Serah Terima Armada</span>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(activeBooking)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                    Ubah Jadwal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanPhone = activeBooking.renterPhone.replace(/\D/g, "");
                      window.open(`https://wa.me/${cleanPhone}`, "_blank");
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-300">event_busy</span>
              <p className="text-xs font-semibold">
                Pilih salah satu tanggal atau unit di kalender untuk melihat detail jadwal.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabel Ringkasan Seluruh Transaksi Booking di Bawah */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Daftar Rental Transaksi</h2>
            <p className="text-xs text-slate-500">Rekapitulasi riwayat penyewaan aktif, pesanan, dan selesai.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase text-[10px]">Filter Status:</span>
            <select
              value={tableFilterStatus}
              onChange={(e) => setTableFilterStatus(e.target.value)}
              className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-amber-600">
              <option value="Semua Status">Semua Status</option>
              <option value="Dipesan">Dipesan</option>
              <option value="Disewa">Disewa</option>
              <option value="Selesai">Selesai</option>
              <option value="Servis">Servis</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase h-11">
              <tr className="divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Kode Booking</th>
                <th className="px-4 py-3 text-center">Pelanggan</th>
                <th className="px-4 py-3 text-center">Kendaraan</th>
                <th className="px-4 py-3 text-center">Periode</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {tableBookings.length > 0 ? (
                tableBookings.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{item.bookingCode}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{item.renterName}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">{item.renterPhone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900">{item.unitName}</div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">{item.shortNopol}</div>
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
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-medium">
                    Tidak ada reservasi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ubah Jadwal Booking */}
      {isEditModalOpen && editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Ubah Jadwal Booking Sewa</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {editingBooking.bookingCode} • {editingBooking.unitName} ({editingBooking.shortNopol})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              {scheduleMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    scheduleMsg.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-rose-50 border-rose-200 text-rose-700"
                  }`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {scheduleMsg.type === "success" ? "check_circle" : "error"}
                  </span>
                  <span>{scheduleMsg.text}</span>
                </div>
              )}

              {/* Data Penyewa (Dapat Diedit) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Penyewa / Pelanggan</label>
                  <input
                    type="text"
                    required
                    value={editRenterName}
                    onChange={(e) => setEditRenterName(e.target.value)}
                    placeholder="Nama Lengkap Penyewa"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kontak (Nomor HP / WA)</label>
                  <input
                    type="tel"
                    required
                    value={editRenterPhone}
                    onChange={(e) => setEditRenterPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Jadwal Mulai (Pick-up) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Waktu Mulai Sewa (Pick-up)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                  <input
                    type="time"
                    required
                    value={editStartTime}
                    onChange={(e) => setEditStartTime(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Jadwal Selesai (Drop-off) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Waktu Selesai Sewa (Drop-off)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                  <input
                    type="time"
                    required
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Status Booking */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Reservasi / Operasional</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as UnitStatus)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600">
                  <option value="Dipesan">Dipesan (Booking Terjadwal)</option>
                  <option value="Disewa">Disewa (Unit Sedang di Tangan Penyewa)</option>
                  <option value="Selesai">Selesai (Unit Sudah Kembali)</option>
                  <option value="Servis">Servis (Perawatan Bengkel)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingSchedule}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  {isSavingSchedule ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Perubahan Jadwal</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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
