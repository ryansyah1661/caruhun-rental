"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CAR_OPTIONS = [
  "Toyota Avanza 1.5 G (B 1482 KFD)",
  "Innova Zenix 2.0 V (B 2884 SSR)",
  "Honda Brio RS (D 2091 AGH)",
  "HiAce Commuter (B 1019 TRB)",
];

const DRIVER_OPTIONS = ["Lepas Kunci (Self-Drive)", "Ahmad Sopian", "Budi Santoso"];

const TIME_SLOTS = [
  "06:00 WIB",
  "07:00 WIB",
  "08:00 WIB",
  "09:00 WIB",
  "10:00 WIB",
  "11:00 WIB",
  "13:00 WIB",
  "14:00 WIB",
  "15:00 WIB",
  "16:00 WIB",
  "19:00 WIB",
  "21:00 WIB",
];

// Data Dummy Kalender Bulan November 2026 (Sesuai Referensi)
const DAYS_IN_NOV = [
  { day: 26, currentMonth: false },
  { day: 27, currentMonth: false },
  { day: 28, currentMonth: false },
  { day: 29, currentMonth: false },
  { day: 30, currentMonth: false },
  { day: 31, currentMonth: false },
  { day: 1, currentMonth: true },
  { day: 2, currentMonth: true },
  { day: 3, currentMonth: true },
  { day: 4, currentMonth: true },
  { day: 5, currentMonth: true },
  { day: 6, currentMonth: true },
  { day: 7, currentMonth: true },
  { day: 8, currentMonth: true },
  { day: 9, currentMonth: true },
  { day: 10, currentMonth: true },
  { day: 11, currentMonth: true },
  { day: 12, currentMonth: true },
  { day: 13, currentMonth: true, selected: true },
  { day: 14, currentMonth: true },
  { day: 15, currentMonth: true },
  { day: 16, currentMonth: true },
  { day: 17, currentMonth: true },
  { day: 18, currentMonth: true },
  { day: 19, currentMonth: true },
  { day: 20, currentMonth: true },
  { day: 21, currentMonth: true },
  { day: 22, currentMonth: true },
  { day: 23, currentMonth: true },
  { day: 24, currentMonth: true },
  { day: 25, currentMonth: true },
  { day: 26, currentMonth: true },
  { day: 27, currentMonth: true },
  { day: 28, currentMonth: true },
  { day: 29, currentMonth: true },
  { day: 30, currentMonth: true },
  { day: 1, currentMonth: false },
  { day: 2, currentMonth: false },
  { day: 3, currentMonth: false },
  { day: 4, currentMonth: false },
  { day: 5, currentMonth: false },
  { day: 6, currentMonth: false },
];

export default function DepartureCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bookingCode: "#CRH-2410-096",
    unitName: "Toyota Avanza 1.5 G (B 1482 KFD)",
    renterName: "",
    renterPhone: "",
    destination: "",
    departureDate: "13 November 2026",
    departureTime: "08:00 WIB",
    driverName: "Lepas Kunci (Self-Drive)",
    notes: "",
  });

  // State untuk mengontrol pop-up kustom
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Jadwal keberangkatan baru berhasil dibuat!");
    router.push("/admin/departures");
  };

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6 relative">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Operasional</span> &rsaquo; <span>Keberangkatan</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">Input Baru</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Input Jadwal Keberangkatan Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Buat data pelepasan unit baru ke lapangan sebelum melakukan ceklis fisik dan serah terima kunci.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/departures"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Daftar</span>
          </Link>
        </div>
      </div>

      {/* ================= FORM INPUT UTAMA ================= */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (8 Kolom): Input Data Kendaraan & Penyewa */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Data Unit */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">directions_car</span>
              1. Pilih Kendaraan & Kode Booking
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kode Booking / Referensi</label>
                <input
                  type="text"
                  value={formData.bookingCode}
                  onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>

              {/* CUSTOM DROPDOWN UNIT ARMADA */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-700">Unit Armada Pool</label>
                <div
                  onClick={() => {
                    setShowCarDropdown(!showCarDropdown);
                    setShowDriverDropdown(false);
                    setShowCalendarPopup(false);
                    setShowTimePopup(false);
                  }}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all">
                  <span className="truncate">{formData.unitName}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                </div>

                {showCarDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 space-y-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                    {CAR_OPTIONS.map((car, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData({ ...formData, unitName: car });
                          setShowCarDropdown(false);
                        }}
                        className={`p-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          formData.unitName === car
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}>
                        {car}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Data Penyewa */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">person</span>
              2. Informasi Penyewa / Customer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nama Penyewa / Perusahaan</label>
                <input
                  type="text"
                  placeholder="Contoh: PT Maju Jaya / Hendro Wicaksono"
                  value={formData.renterName}
                  onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / Telepon</label>
                <input
                  type="text"
                  placeholder="Contoh: 081234567890"
                  value={formData.renterPhone}
                  onChange={(e) => setFormData({ ...formData, renterPhone: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (4 Kolom): Jadwal & Tombol Simpan */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">schedule</span>
              3. Jadwal & Penugasan
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Tujuan Perjalanan</label>
                <input
                  type="text"
                  placeholder="Contoh: Bandara Soekarno-Hatta T3"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 1. POPUP KALENDER BULANAN PERSIS REFERENSI */}
                <div className="space-y-1.5 relative">
                  <label className="font-bold text-slate-700">Tanggal Pengambilan</label>
                  <div
                    onClick={() => {
                      setShowCalendarPopup(!showCalendarPopup);
                      setShowTimePopup(false);
                      setShowCarDropdown(false);
                      setShowDriverDropdown(false);
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all">
                    <span className="truncate text-[11px]">{formData.departureDate}</span>
                    <span className="material-symbols-outlined text-slate-400 text-[16px]">calendar_today</span>
                  </div>

                  {showCalendarPopup && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                      {/* Navigasi Bulan */}
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500">
                          &lsaquo;
                        </button>
                        <div className="flex items-center gap-1.5 text-sm">
                          <span>November 2026</span>
                          <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
                        </div>
                        <button
                          type="button"
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500">
                          &rsaquo;
                        </button>
                      </div>

                      {/* Header Hari */}
                      <div className="grid grid-cols-7 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                        <span>SEN</span>
                        <span>SEL</span>
                        <span>RAB</span>
                        <span>KAM</span>
                        <span>JUM</span>
                        <span>SAB</span>
                        <span>MIN</span>
                      </div>

                      {/* Grid Tanggal */}
                      <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-bold">
                        {DAYS_IN_NOV.map((item, idx) => {
                          const isSelected = item.day === 13 && item.currentMonth;
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (item.currentMonth) {
                                  setFormData({ ...formData, departureDate: `${item.day} November 2026` });
                                  setShowCalendarPopup(false);
                                }
                              }}
                              className={`h-8 w-8 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-amber-600 text-white shadow-md font-black"
                                  : item.currentMonth
                                    ? "text-slate-800 hover:bg-slate-100"
                                    : "text-slate-300 pointer-events-none"
                              }`}>
                              {item.day}
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer Kalender */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                        <span>13 November 2026</span>
                        <span className="text-amber-600 font-bold">Hari ini</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. POPUP GRID JAM PERSIS REFERENSI */}
                <div className="space-y-1.5 relative">
                  <label className="font-bold text-slate-700">Jam</label>
                  <div
                    onClick={() => {
                      setShowTimePopup(!showTimePopup);
                      setShowCalendarPopup(false);
                      setShowCarDropdown(false);
                      setShowDriverDropdown(false);
                    }}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all">
                    <span className="truncate text-[11px]">{formData.departureTime}</span>
                    <span className="material-symbols-outlined text-slate-400 text-[16px]">schedule</span>
                  </div>

                  {showTimePopup && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 z-50 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="font-bold text-xs text-slate-900">Pilih Jam Pengambilan</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">WIB</span>
                      </div>

                      {/* Grid Tombol Jam */}
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map((slot, idx) => {
                          const isSelected = formData.departureTime === slot;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, departureTime: slot });
                                setShowTimePopup(false);
                              }}
                              className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-amber-600 text-white shadow-md"
                                  : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100"
                              }`}>
                              {slot.replace(" WIB", "")}
                            </button>
                          );
                        })}
                      </div>

                      {/* Footer Jam */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-medium">
                        <span>
                          Terpilih: <strong>{formData.departureTime}</strong>
                        </span>
                        <span className="text-amber-600 font-bold">Default (08:00)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CUSTOM DROPDOWN PENUGASAN DRIVER */}
              <div className="space-y-1.5 relative">
                <label className="font-bold text-slate-700">Penugasan Driver</label>
                <div
                  onClick={() => {
                    setShowDriverDropdown(!showDriverDropdown);
                    setShowCarDropdown(false);
                    setShowCalendarPopup(false);
                    setShowTimePopup(false);
                  }}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all">
                  <span className="truncate">{formData.driverName}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_more</span>
                </div>

                {showDriverDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 space-y-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                    {DRIVER_OPTIONS.map((driver, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData({ ...formData, driverName: driver });
                          setShowDriverDropdown(false);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          formData.driverName === driver
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}>
                        {driver}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Catatan Tambahan</label>
                <textarea
                  rows={3}
                  placeholder="Catatan khusus untuk serah terima..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                <span>Buat & Simpan Keberangkatan</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
