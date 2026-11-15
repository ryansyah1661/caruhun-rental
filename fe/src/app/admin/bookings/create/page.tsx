"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function CreateBookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State nilai form
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("Sewa Lepas Kunci");
  const [selectedDuration, setSelectedDuration] = useState<string>("1 Hari (24 Jam)");

  // State Tanggal & Jam (Default Oktober 2026)
  const [startDate, setStartDate] = useState<string>("24 Okt 2026");
  const [startTime, setStartTime] = useState<string>("09:00 WIB");
  const [endDate, setEndDate] = useState<string>("26 Okt 2026");
  const [endTime, setEndTime] = useState<string>("09:00 WIB");

  // State navigasi kalender pop-up Tanggal Mulai
  const [startMonth, setStartMonth] = useState<number>(9); // Oktober
  const [startYear, setStartYear] = useState<number>(2026);

  // State navigasi kalender pop-up Tanggal Selesai
  const [endMonth, setEndMonth] = useState<number>(9); // Oktober
  const [endYear, setEndYear] = useState<number>(2026);

  // State kontrol buka/tutup dropdown
  const [isUnitOpen, setIsUnitOpen] = useState<boolean>(false);
  const [isServiceOpen, setIsServiceOpen] = useState<boolean>(false);
  const [isDurationOpen, setIsDurationOpen] = useState<boolean>(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState<boolean>(false);
  const [isStartTimeOpen, setIsStartTimeOpen] = useState<boolean>(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState<boolean>(false);
  const [isEndTimeOpen, setIsEndTimeOpen] = useState<boolean>(false);

  // Ref untuk klik di luar dropdown
  const unitRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endDateRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (unitRef.current && !unitRef.current.contains(event.target as Node)) setIsUnitOpen(false);
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) setIsServiceOpen(false);
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) setIsDurationOpen(false);
      if (startDateRef.current && !startDateRef.current.contains(event.target as Node)) setIsStartDateOpen(false);
      if (startTimeRef.current && !startTimeRef.current.contains(event.target as Node)) setIsStartTimeOpen(false);
      if (endDateRef.current && !endDateRef.current.contains(event.target as Node)) setIsEndDateOpen(false);
      if (endTimeRef.current && !endTimeRef.current.contains(event.target as Node)) setIsEndTimeOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/bookings");
    }, 1000);
  }

  const unitOptions = [
    { label: "-- Pilih Armada --", value: "" },
    { label: "Toyota Avanza 1.5 G (B 1482 KFD)", value: "avanza" },
    { label: "Toyota Innova Zenix 2.0 V (B 2884 SSR)", value: "zenix" },
    { label: "Honda Brio RS (D 2091 AGH)", value: "brio" },
  ];

  const serviceOptions = [
    { label: "Sewa Lepas Kunci", value: "Sewa Lepas Kunci" },
    { label: "Sewa Dengan Driver", value: "Sewa Dengan Driver" },
    { label: "Drop-off / Antar Jemput Bandara", value: "Drop-off / Antar Jemput Bandara" },
  ];

  const durationOptions = [
    { label: "1 Hari (24 Jam)", value: "1 Hari (24 Jam)" },
    { label: "2 Hari", value: "2 Hari" },
    { label: "3 Hari", value: "3 Hari" },
    { label: "Kustom / Mingguan", value: "Kustom / Mingguan" },
  ];

  // Generator Grid Kalender Bulanan
  const generateCalendarDays = (m: number, y: number) => {
    const days = [];
    const totalDays = new Date(y, m + 1, 0).getDate();
    const firstDayOfWeek = new Date(y, m, 1).getDay();
    const emptySlots = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    for (let i = 0; i < emptySlots; i++) {
      days.push({ dayNumber: null, isCurrentMonth: false });
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push({ dayNumber: d, isCurrentMonth: true });
    }
    return days;
  };

  const startCalendarDays = useMemo(() => generateCalendarDays(startMonth, startYear), [startMonth, startYear]);
  const endCalendarDays = useMemo(() => generateCalendarDays(endMonth, endYear), [endMonth, endYear]);

  // Daftar Jam Format 24 Jam (Grid 4 Kolom Menyamping)
  const timeList = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header Navigasi & Judul */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Link href="/admin" className="hover:text-slate-700">
              Dashboard
            </Link>{" "}
            &rsaquo;
            <span>Booking</span> &rsaquo;
            <span className="text-slate-800 font-bold">Booking Baru</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Formulir Penyewaan & Booking Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Catat pemesanan unit kendaraan baru, data penyewa, serta paket sewa yang dipilih.
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali</span>
        </Link>
      </div>

      {/* Form Utama */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Penyewa */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">person</span>
            Informasi Penyewa & Identitas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nama Lengkap (Sesuai KTP)</label>
              <input
                type="text"
                required
                placeholder="Contoh: Budi Santoso"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nomor WhatsApp / HP</label>
              <input
                type="text"
                required
                placeholder="Contoh: 081234567890"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nomor NIK KTP / SIM</label>
              <input
                type="text"
                required
                placeholder="327xxxxxxxxx"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Pemilihan Unit & Paket */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">directions_car</span>
            Pilihan Armada & Paket Sewa
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Custom Dropdown: Pilih Unit Kendaraan */}
            <div className="space-y-1.5 relative" ref={unitRef}>
              <label className="block text-xs font-bold text-slate-700">Pilih Unit Kendaraan Tersedia</label>
              <div
                onClick={() => setIsUnitOpen(!isUnitOpen)}
                className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  isUnitOpen
                    ? "border-amber-600 ring-2 ring-amber-500/20 bg-white"
                    : "border-slate-200 hover:bg-slate-100/60"
                }`}>
                <span className={!selectedUnit ? "text-slate-400 font-medium" : "text-slate-900 font-bold"}>
                  {unitOptions.find((o) => o.value === selectedUnit)?.label || "-- Pilih Armada --"}
                </span>
                <span
                  className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform ${isUnitOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </div>

              {isUnitOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1">
                  {unitOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        setSelectedUnit(opt.value);
                        setIsUnitOpen(false);
                      }}
                      className={`px-3.5 py-2.5 cursor-pointer text-xs transition-colors flex items-center justify-between ${
                        selectedUnit === opt.value
                          ? "bg-amber-50 text-amber-800 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}>
                      <span>{opt.label}</span>
                      {selectedUnit === opt.value && (
                        <span className="material-symbols-outlined text-amber-600 text-[16px]">check</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Dropdown: Jenis Layanan / Paket */}
            <div className="space-y-1.5 relative" ref={serviceRef}>
              <label className="block text-xs font-bold text-slate-700">Jenis Layanan / Paket</label>
              <div
                onClick={() => setIsServiceOpen(!isServiceOpen)}
                className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  isServiceOpen
                    ? "border-amber-600 ring-2 ring-amber-500/20 bg-white"
                    : "border-slate-200 hover:bg-slate-100/60"
                }`}>
                <span className="text-slate-900 font-bold">{selectedService}</span>
                <span
                  className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform ${isServiceOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </div>

              {isServiceOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1">
                  {serviceOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        setSelectedService(opt.value);
                        setIsServiceOpen(false);
                      }}
                      className={`px-3.5 py-2.5 cursor-pointer text-xs transition-colors flex items-center justify-between ${
                        selectedService === opt.value
                          ? "bg-amber-50 text-amber-800 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}>
                      <span>{opt.label}</span>
                      {selectedService === opt.value && (
                        <span className="material-symbols-outlined text-amber-600 text-[16px]">check</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Dropdown: Durasi Sewa */}
            <div className="space-y-1.5 relative" ref={durationRef}>
              <label className="block text-xs font-bold text-slate-700">Durasi Sewa</label>
              <div
                onClick={() => setIsDurationOpen(!isDurationOpen)}
                className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  isDurationOpen
                    ? "border-amber-600 ring-2 ring-amber-500/20 bg-white"
                    : "border-slate-200 hover:bg-slate-100/60"
                }`}>
                <span className="text-slate-900 font-bold">{selectedDuration}</span>
                <span
                  className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform ${isDurationOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </div>

              {isDurationOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden py-1">
                  {durationOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => {
                        setSelectedDuration(opt.value);
                        setIsDurationOpen(false);
                      }}
                      className={`px-3.5 py-2.5 cursor-pointer text-xs transition-colors flex items-center justify-between ${
                        selectedDuration === opt.value
                          ? "bg-amber-50 text-amber-800 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}>
                      <span>{opt.label}</span>
                      {selectedDuration === opt.value && (
                        <span className="material-symbols-outlined text-amber-600 text-[16px]">check</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- MULAI SEWA (KALENDER GRID BULANAN & JAM 24 JAM) --- */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
              {/* Tanggal Mulai (Pop-up Kalender Grid) */}
              <div className="relative" ref={startDateRef}>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Mulai</label>
                <div
                  onClick={() => setIsStartDateOpen(!isStartDateOpen)}
                  className={`w-full h-11 px-3 rounded-xl bg-slate-50 border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isStartDateOpen
                      ? "border-amber-600 ring-2 ring-amber-500/20 bg-white"
                      : "border-slate-200 hover:bg-slate-100/60"
                  }`}>
                  <span className="text-slate-900 font-bold truncate">{startDate}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[16px]">calendar_today</span>
                </div>

                {isStartDateOpen && (
                  <div className="absolute bottom-full left-0 w-[300px] mb-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 p-4 space-y-3">
                    {/* Header Bulan Kalender */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {MONTH_NAMES[startMonth]} {startYear}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (startMonth === 0) {
                              setStartMonth(11);
                              setStartYear(startYear - 1);
                            } else setStartMonth(startMonth - 1);
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                          &lsaquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (startMonth === 11) {
                              setStartMonth(0);
                              setStartYear(startYear + 1);
                            } else setStartMonth(startMonth + 1);
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                          &rsaquo;
                        </button>
                      </div>
                    </div>

                    {/* Hari Grid */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
                      <span>Sn</span>
                      <span>Sl</span>
                      <span>Rb</span>
                      <span>Km</span>
                      <span>Jm</span>
                      <span>Sb</span>
                      <span>Mg</span>
                    </div>

                    {/* Tanggal Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {startCalendarDays.map((slot, idx) => {
                        if (!slot.isCurrentMonth || slot.dayNumber === null) {
                          return <div key={idx} className="h-7"></div>;
                        }
                        const formattedDate = `${String(slot.dayNumber).padStart(2, "0")} ${MONTH_NAMES[startMonth].slice(0, 3)} ${startYear}`;
                        const isSelected = startDate === formattedDate;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              setStartDate(formattedDate);
                              setIsStartDateOpen(false);
                            }}
                            className={`h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                              isSelected ? "bg-amber-600 text-white shadow-xs" : "hover:bg-slate-100 text-slate-700"
                            }`}>
                            {slot.dayNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Jam Mulai (Grid Menyamping 24 Jam) */}
              <div className="relative" ref={startTimeRef}>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Jam Mulai</label>
                <div
                  onClick={() => setIsStartTimeOpen(!isStartTimeOpen)}
                  className={`w-full h-11 px-3 rounded-xl bg-slate-50 border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isStartTimeOpen
                      ? "border-amber-600 ring-2 ring-amber-500/20 bg-white"
                      : "border-slate-200 hover:bg-slate-100/60"
                  }`}>
                  <span className="text-slate-900 font-bold truncate">{startTime}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[16px]">schedule</span>
                </div>

                {isStartTimeOpen && (
                  <div className="absolute bottom-full right-0 w-[280px] mb-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 p-3">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
                      Pilih Jam (24 Jam)
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {timeList.map((tm, idx) => {
                        const fullVal = `${tm} WIB`;
                        const isSelected = startTime === fullVal;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              setStartTime(fullVal);
                              setIsStartTimeOpen(false);
                            }}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                            }`}>
                            {tm}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- SELESAI SEWA (KALENDER GRID BULANAN & JAM 24 JAM) --- */}
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1 grid grid-cols-2 gap-2">
              {/* Tanggal Selesai (Pop-up Kalender Grid) */}
              <div className="relative" ref={endDateRef}>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Tanggal Selesai</label>
                <div
                  onClick={() => setIsEndDateOpen(!isEndDateOpen)}
                  className={`w-full h-11 px-3 rounded-xl bg-slate-50 border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isEndDateOpen
                      ? "border-amber-600 ring-2 ring-amber-500/20 bg-white"
                      : "border-slate-200 hover:bg-slate-100/60"
                  }`}>
                  <span className="text-slate-900 font-bold truncate">{endDate}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[16px]">calendar_today</span>
                </div>

                {isEndDateOpen && (
                  <div className="absolute bottom-full left-0 w-[300px] mb-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 p-4 space-y-3">
                    {/* Header Bulan Kalender */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {MONTH_NAMES[endMonth]} {endYear}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (endMonth === 0) {
                              setEndMonth(11);
                              setEndYear(endYear - 1);
                            } else setEndMonth(endMonth - 1);
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                          &lsaquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (endMonth === 11) {
                              setEndMonth(0);
                              setEndYear(endYear + 1);
                            } else setEndMonth(endMonth + 1);
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                          &rsaquo;
                        </button>
                      </div>
                    </div>

                    {/* Hari Grid */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
                      <span>Sn</span>
                      <span>Sl</span>
                      <span>Rb</span>
                      <span>Km</span>
                      <span>Jm</span>
                      <span>Sb</span>
                      <span>Mg</span>
                    </div>

                    {/* Tanggal Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {endCalendarDays.map((slot, idx) => {
                        if (!slot.isCurrentMonth || slot.dayNumber === null) {
                          return <div key={idx} className="h-7"></div>;
                        }
                        const formattedDate = `${String(slot.dayNumber).padStart(2, "0")} ${MONTH_NAMES[endMonth].slice(0, 3)} ${endYear}`;
                        const isSelected = endDate === formattedDate;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              setEndDate(formattedDate);
                              setIsEndDateOpen(false);
                            }}
                            className={`h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                              isSelected ? "bg-amber-600 text-white shadow-xs" : "hover:bg-slate-100 text-slate-700"
                            }`}>
                            {slot.dayNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Jam Selesai (Grid Menyamping 24 Jam) */}
              <div className="relative" ref={endTimeRef}>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Jam Selesai</label>
                <div
                  onClick={() => setIsEndTimeOpen(!isEndTimeOpen)}
                  className={`w-full h-11 px-3 rounded-xl bg-slate-50 border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    isEndTimeOpen
                      ? "border-amber-600 ring-2 ring-amber-500/20 bg-white"
                      : "border-slate-200 hover:bg-slate-100/60"
                  }`}>
                  <span className="text-slate-900 font-bold truncate">{endTime}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[16px]">schedule</span>
                </div>

                {isEndTimeOpen && (
                  <div className="absolute bottom-full right-0 w-[280px] mb-1 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 p-3">
                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100">
                      Pilih Jam (24 Jam)
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {timeList.map((tm, idx) => {
                        const fullVal = `${tm} WIB`;
                        const isSelected = endTime === fullVal;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              setEndTime(fullVal);
                              setIsEndTimeOpen(false);
                            }}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-amber-600 text-white shadow-xs"
                                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                            }`}>
                            {tm}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Total Biaya Sewa (Rp)</label>
              <input
                type="text"
                placeholder="Contoh: 350000"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/bookings"
            className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                <span>Menyimpan Booking...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Simpan & Buat Booking</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
