"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleLabel } from "@/lib/auth";

interface AttendanceRecord {
  id: string;
  userId: string | null;
  name: string;
  role: string;
  clockIn: string;
  clockOut: string;
  status: "Hadir" | "Izin" | "Alpha" | "Sakit" | "Belum Hadir";
  location: string;
  notes: string;
}

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

const DAY_HEADERS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function AttendancePage() {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State Pilihan Tanggal (Default Hari Ini dalam format YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // State Popover Kalender Interaktif (Klik langsung muncul tampilan kalender)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  // Sinkronkan bulan kalender saat selectedDate berubah
  useEffect(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split("-").map(Number);
      if (y && m) {
        setCalYear(y);
        setCalMonth(m - 1);
      }
    }
  }, [selectedDate]);

  // Tutup kalender saat klik di luar popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form State Catat Absensi
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [selectedStaffRole, setSelectedStaffRole] = useState("petugas");
  const [status, setStatus] = useState("Hadir");
  const [location, setLocation] = useState("Pool Utama - Cilandak");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // State Notifikasi In-App & Modal Konfirmasi
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [confirmClockOutItem, setConfirmClockOutItem] = useState<AttendanceRecord | null>(null);
  const [isClockingOut, setIsClockingOut] = useState(false);

  // Ambil Data Absensi Riil dari DB berdasarkan Tanggal yang dipilih
  const { data, isLoading } = useQuery<{
    date: string;
    isToday: boolean;
    attendances: AttendanceRecord[];
    total: number;
  }>({
    queryKey: ["admin", "attendances", selectedDate],
    queryFn: async () => (await api.get("/admin/attendances", { params: { date: selectedDate } })).data,
  });

  const attendances = data?.attendances || [];
  const filtered = attendances.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Format Tanggal Bahasa Indonesia Lengkap (e.g. "Selasa, 17 November 2026")
  const formattedDateTitle = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dateObj);
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  // Format Tanggal Ringkas untuk Tombol (e.g. "17 Nov 2026")
  const formattedDisplayDate = useMemo(() => {
    try {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dateObj);
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  const isTodaySelected = selectedDate === todayStr;

  // Grid Kalender Interaktif
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0 = Minggu
    const totalDays = new Date(calYear, calMonth + 1, 0).getDate();
    const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

    const cells: { dateStr: string; dayNumber: number; isCurrent: boolean }[] = [];
    const pad = (n: number) => String(n).padStart(2, "0");

    // Hari dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevM = calMonth === 0 ? 12 : calMonth;
      const prevY = calMonth === 0 ? calYear - 1 : calYear;
      cells.push({
        dateStr: `${prevY}-${pad(prevM)}-${pad(day)}`,
        dayNumber: day,
        isCurrent: false,
      });
    }

    // Hari bulan aktif
    for (let day = 1; day <= totalDays; day++) {
      cells.push({
        dateStr: `${calYear}-${pad(calMonth + 1)}-${pad(day)}`,
        dayNumber: day,
        isCurrent: true,
      });
    }

    // Hari bulan berikutnya hingga kelipatan 7
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const nextM = calMonth === 11 ? 1 : calMonth + 2;
      const nextY = calMonth === 11 ? calYear + 1 : calYear;
      cells.push({
        dateStr: `${nextY}-${pad(nextM)}-${pad(day)}`,
        dayNumber: day,
        isCurrent: false,
      });
    }

    return cells;
  }, [calYear, calMonth]);

  // Handler Pilih Tanggal dari Kalender
  const handleSelectCalendarDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsCalendarOpen(false);
  };

  // Navigasi Bulan di dalam Kalender Popover
  const handlePrevCalMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextCalMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  // Navigasi Tanggal Cepat Panah Kiri / Kanan
  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d - 1);
    const pad = (n: number) => String(n).padStart(2, "0");
    setSelectedDate(`${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d + 1);
    const pad = (n: number) => String(n).padStart(2, "0");
    setSelectedDate(`${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`);
  };

  const handleResetToday = () => {
    setSelectedDate(todayStr);
    setIsCalendarOpen(false);
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleOpenModal = (staff?: AttendanceRecord) => {
    setModalError(null);
    if (staff && staff.userId) {
      setSelectedStaff(staff.userId);
      setSelectedStaffName(staff.name);
      setSelectedStaffRole(staff.role);
    } else {
      setSelectedStaff("");
      setSelectedStaffName("");
      setSelectedStaffRole("petugas");
    }
    setStatus("Hadir");
    setLocation("Pool Utama - Cilandak");
    setNotes("");
    setIsModalOpen(true);
  };

  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);

    try {
      await api.post("/admin/attendances", {
        date: selectedDate,
        user_id: selectedStaff || null,
        name: selectedStaffName,
        role: selectedStaffRole,
        status,
        location,
        notes,
      });

      qc.invalidateQueries({ queryKey: ["admin", "attendances"] });
      setIsModalOpen(false);
      showToast("success", `Absensi untuk ${selectedStaffName} berhasil dicatat.`);
    } catch (err: any) {
      setModalError(
        err.response?.data?.message ||
          "Gagal mencatat absensi. Pastikan server backend berjalan dan formulir terisi lengkap.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteClockOut = async () => {
    if (!confirmClockOutItem) return;
    setIsClockingOut(true);

    try {
      await api.put(`/admin/attendances/${confirmClockOutItem.id}/clock-out`);
      qc.invalidateQueries({ queryKey: ["admin", "attendances"] });
      setConfirmClockOutItem(null);
      showToast("success", `Jam pulang untuk ${confirmClockOutItem.name} berhasil dicatat.`);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Gagal mencatat jam pulang. Coba beberapa saat lagi.");
    } finally {
      setIsClockingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen p-6 lg:p-8 animate-pulse space-y-6">
        <div className="h-24 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Toast Notifikasi In-App Modern */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold ${
              toast.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20"
                : "bg-rose-600 text-white border-rose-500 shadow-rose-600/20"
            }`}>
            <span className="material-symbols-outlined text-[18px]">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast(null)} className="ml-2 hover:opacity-80 cursor-pointer">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Utama */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Kehadiran</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Kehadiran Staff & Driver</span>
            {isTodaySelected ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Hari Ini
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Riwayat Lampau
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data absensi real-time dari database PostgreSQL untuk{" "}
            <strong className="text-slate-800 font-bold">{formattedDateTitle}</strong>.
          </p>
        </div>

        {/* Toolbar Aksi & Kontrol Kalender Interaktif */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Kontrol Kalender Popover (Klik langsung muncul kalender) */}
          <div className="relative" ref={calendarRef}>
            <div className="flex items-center bg-slate-50 border border-slate-200 p-1 rounded-2xl gap-1 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevDay}
                title="Hari Sebelumnya"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              {/* Tombol Kalender (Tinggal klik, kalender langsung terbuka) */}
              <button
                type="button"
                onClick={() => setIsCalendarOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCalendarOpen
                    ? "bg-white text-amber-700 shadow-2xs ring-2 ring-amber-500/20"
                    : "text-slate-800 hover:bg-white"
                }`}>
                <span className="material-symbols-outlined text-amber-600 text-[18px]">calendar_month</span>
                <span>{formattedDisplayDate}</span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">
                  {isCalendarOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleNextDay}
                title="Hari Berikutnya"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>

              {!isTodaySelected && (
                <button
                  type="button"
                  onClick={handleResetToday}
                  className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer border border-amber-200/60 ml-1">
                  Hari Ini
                </button>
              )}
            </div>

            {/* Popover Tampilan Kalender Lengkap */}
            {isCalendarOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Header Kalender: Navigasi Bulan & Tahun */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <button
                    type="button"
                    onClick={handlePrevCalMonth}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Bulan Sebelumnya">
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextCalMonth}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Bulan Berikutnya">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>

                {/* Header Hari: Min, Sen, Sel, Rab, Kam, Jum, Sab */}
                <div className="grid grid-cols-7 text-center mb-1.5">
                  {DAY_HEADERS.map((dayName) => (
                    <span key={dayName} className="text-[10px] font-extrabold text-slate-400 uppercase py-1">
                      {dayName}
                    </span>
                  ))}
                </div>

                {/* Grid Angka Tanggal */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendarGrid.map((cell, idx) => {
                    const isSelected = cell.dateStr === selectedDate;
                    const isToday = cell.dateStr === todayStr;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCalendarDate(cell.dateStr)}
                        className={`h-8 w-8 mx-auto rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-600 text-white shadow-sm"
                            : isToday
                              ? "bg-amber-50 text-amber-700 border border-amber-300 font-extrabold hover:bg-amber-100"
                              : cell.isCurrent
                                ? "text-slate-800 hover:bg-slate-100"
                                : "text-slate-300 hover:bg-slate-50"
                        }`}>
                        {cell.dayNumber}
                      </button>
                    );
                  })}
                </div>

                {/* Footer Cepat Kalender */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between px-1">
                  <span className="text-[10px] font-medium text-slate-400">Pilih tanggal</span>
                  <button
                    type="button"
                    onClick={handleResetToday}
                    className="text-xs font-extrabold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer">
                    Kembali ke Hari Ini
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">fingerprint</span>
            <span>Catat Absensi</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-600">calendar_today</span>
            <span>
              Absensi Tanggal: <strong className="text-amber-800">{formattedDateTitle}</strong> ({attendances.length}{" "}
              staf)
            </span>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nama pegawai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3">Nama Pegawai</th>
                <th className="px-4 py-3">Jabatan / Role</th>
                <th className="px-4 py-3 text-center">Jam Masuk</th>
                <th className="px-4 py-3 text-center">Jam Pulang</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Lokasi / Keterangan</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{item.name}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-600">
                      {roleLabel[item.role as keyof typeof roleLabel] || item.role}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold">{item.clockIn}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold">{item.clockOut}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          item.status === "Hadir"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "Izin"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : item.status === "Sakit"
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : item.status === "Belum Hadir"
                                  ? "bg-slate-100 text-slate-500 border-slate-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      <div>{item.location}</div>
                      {item.notes && item.notes !== "-" && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.notes}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {item.status === "Belum Hadir" || item.status === "Alpha" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenModal(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs inline-flex items-center gap-1 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          <span>Catat Hadir</span>
                        </button>
                      ) : item.status === "Hadir" && item.clockOut === "-" ? (
                        <button
                          type="button"
                          onClick={() => setConfirmClockOutItem(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs inline-flex items-center gap-1 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">logout</span>
                          <span>Absen Pulang</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold">Tercatat</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada data kehadiran yang sesuai untuk tanggal ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Absensi Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Catat Absensi Staf</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Absensi untuk tanggal: <span className="font-bold text-amber-700">{formattedDateTitle}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* In-App Error Alert */}
            {modalError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] shrink-0 text-rose-600">error</span>
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveAttendance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pegawai / Staf</label>
                <input
                  type="text"
                  required
                  value={selectedStaffName}
                  onChange={(e) => setSelectedStaffName(e.target.value)}
                  placeholder="Ketik nama staff..."
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Kehadiran</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600">
                  <option value="Hadir">Hadir (Masuk Kerja)</option>
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpha">Alpha (Tanpa Keterangan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Penugasan</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Pool Utama, Kantor Depok, Lapangan..."
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan dinas luar, alasan izin, dll..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Absensi</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Absen Pulang (In-App) */}
      {confirmClockOutItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">logout</span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Konfirmasi Absen Pulang</h3>
                <p className="text-xs text-slate-500 mt-0.5">Catat jam kepulangan staf hari ini?</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              Apakah Anda yakin ingin mencatat jam pulang untuk{" "}
              <strong className="text-slate-900">{confirmClockOutItem.name}</strong>?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClockOutItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                Batal
              </button>
              <button
                type="button"
                disabled={isClockingOut}
                onClick={handleExecuteClockOut}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                {isClockingOut ? "Menyimpan..." : "Ya, Catat Pulang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
