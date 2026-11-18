"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

interface VehicleOption {
  id: string;
  name: string;
  plateNumber: string;
}

export default function DepartureCreatePage() {
  const router = useRouter();

  // Fetch real vehicles from API
  const { data: vehiclesData } = useQuery({
    queryKey: ["admin", "vehicles", "list"],
    queryFn: async () => {
      const res = await api.get("/admin/vehicles");
      const rawList = res.data?.vehicles || (Array.isArray(res.data) ? res.data : res.data?.data || []);
      return rawList.map((v: { id?: string; name?: string; brand?: string; model?: string; nopol?: string; plate_number?: string; full_name?: string }) => ({
        id: v.id || "",
        name: v.name || v.full_name || `${v.brand || ""} ${v.model || ""}`.trim() || "Unit Kendaraan",
        plateNumber: v.nopol || v.plate_number || "-",
      })) as VehicleOption[];
    },
  });

  const carOptions = vehiclesData && vehiclesData.length > 0 ? vehiclesData : [];

  // Pilihan Kategori Layanan: Lepas Kunci, Dengan Driver, Drop-off Bandara
  const [serviceType, setServiceType] = useState<"Lepas Kunci" | "Dengan Driver" | "Drop-off Bandara">("Lepas Kunci");

  const [formData, setFormData] = useState({
    bookingCode: `CRH-${Math.floor(1000 + Math.random() * 9000)}`,
    vehicleId: "",
    unitName: "Memuat armada...",
    renterName: "",
    renterPhone: "",
    destination: "Dalam Kota / Bandung Area",
    departureDate: "Hari Ini",
    departureTime: "08:00 WIB",
    driverName: "Lepas Kunci (Self-Drive)",
    flightInfo: "",
    notes: "",
  });

  // Sinkronkan pilihan unit saat data armada termuat
  useEffect(() => {
    if (carOptions.length > 0 && !formData.vehicleId) {
      setFormData((prev) => ({
        ...prev,
        vehicleId: carOptions[0].id,
        unitName: `${carOptions[0].name} (${carOptions[0].plateNumber})`,
      }));
    }
  }, [carOptions, formData.vehicleId]);

  // Sesuaikan nilai default saat berganti Jenis Layanan
  const handleSelectServiceType = (type: "Lepas Kunci" | "Dengan Driver" | "Drop-off Bandara") => {
    setServiceType(type);
    if (type === "Lepas Kunci") {
      setFormData((prev) => ({
        ...prev,
        driverName: "Lepas Kunci (Self-Drive)",
        destination: "Dalam Kota / Bandung Area",
      }));
    } else if (type === "Dengan Driver") {
      setFormData((prev) => ({
        ...prev,
        driverName: "Driver Ditugaskan (Ahmad Sopian)",
        destination: "Rute Perjalanan Dinas / Wisata Luar Kota",
      }));
    } else if (type === "Drop-off Bandara") {
      setFormData((prev) => ({
        ...prev,
        driverName: "Driver Khusus Bandara (Budi Santoso)",
        destination: "Bandara Internasional Soekarno-Hatta (T3)",
        flightInfo: "GA-402 (Garuda Indonesia)",
      }));
    }
  };

  // State untuk dropdown dan pop-up
  const [showCarDropdown, setShowCarDropdown] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In-App Toast
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.renterName.trim()) {
      setToast({ show: true, type: "error", message: "Harap isi nama penyewa terlebih dahulu." });
      return;
    }

    setIsSubmitting(true);
    try {
      let finalNotes = formData.destination;
      if (serviceType === "Drop-off Bandara" && formData.flightInfo) {
        finalNotes += ` [Flight: ${formData.flightInfo}]`;
      }
      if (formData.notes) {
        finalNotes += ` - ${formData.notes}`;
      }

      const payload = {
        vehicle_id: formData.vehicleId || (carOptions[0]?.id || null),
        customer_name: formData.renterName,
        customer_phone: formData.renterPhone,
        service_type: serviceType,
        notes: finalNotes,
        with_driver: serviceType !== "Lepas Kunci",
      };

      await api.post("/admin/departures", payload);

      setToast({
        show: true,
        type: "success",
        message: `Jadwal keberangkatan [${serviceType}] berhasil disimpan ke database!`,
      });

      setTimeout(() => {
        router.push("/admin/departures");
      }, 1200);
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Gagal membuat jadwal keberangkatan.";
      setToast({ show: true, type: "error", message: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6 relative">
      {/* ================= TOAST NOTIFIKASI ================= */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-xs font-bold transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === "success"
              ? "bg-emerald-500 text-white border-emerald-600"
              : "bg-rose-500 text-white border-rose-600"
          }`}>
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === "success" ? "check_circle" : "warning"}
          </span>
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-75 cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Link href="/admin/departures" className="hover:text-slate-700">Operasional</Link> &rsaquo;{" "}
            <Link href="/admin/departures" className="hover:text-slate-700">Keberangkatan</Link> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">Input Jadwal Baru</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Input Jadwal Keberangkatan Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pilih kategori layanan: <strong>Lepas Kunci</strong>, <strong>Dengan Driver</strong>, atau <strong>Drop-off Bandara</strong> agar SOP dan kelengkapannya sesuai.
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

      {/* ================= 3 KARTU PILIHAN KATEGORI LAYANAN ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pilihan 1: Lepas Kunci */}
        <div
          onClick={() => handleSelectServiceType("Lepas Kunci")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            serviceType === "Lepas Kunci"
              ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">key</span>
            </span>
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                serviceType === "Lepas Kunci" ? "border-amber-600 bg-amber-600" : "border-slate-300 bg-white"
              }`}>
              {serviceType === "Lepas Kunci" && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">1. Sewa Lepas Kunci (Self-Drive)</h4>
          <p className="text-[11px] text-slate-500 mt-1">
            Penyewa membawa unit sendiri. Wajib upload KTP, SIM A, data darurat & jaminan motor/deposit.
          </p>
        </div>

        {/* Pilihan 2: Dengan Driver */}
        <div
          onClick={() => handleSelectServiceType("Dengan Driver")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            serviceType === "Dengan Driver"
              ? "bg-sky-50/70 border-sky-500 ring-2 ring-sky-500 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">person_pin</span>
            </span>
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                serviceType === "Dengan Driver" ? "border-sky-600 bg-sky-600" : "border-slate-300 bg-white"
              }`}>
              {serviceType === "Dengan Driver" && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">2. Sewa Dengan Supir (Include Driver)</h4>
          <p className="text-[11px] text-slate-500 mt-1">
            Armada dikemudikan oleh supir resmi Caruhun. Bebas jaminan motor/deposit 1.5jt.
          </p>
        </div>

        {/* Pilihan 3: Drop-off Bandara */}
        <div
          onClick={() => handleSelectServiceType("Drop-off Bandara")}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            serviceType === "Drop-off Bandara"
              ? "bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500 shadow-xs"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
            </span>
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                serviceType === "Drop-off Bandara" ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
              }`}>
              {serviceType === "Drop-off Bandara" && <span className="w-2 h-2 rounded-full bg-white" />}
            </span>
          </div>
          <h4 className="font-extrabold text-sm text-slate-900">3. Drop-off / Antar Jemput Bandara</h4>
          <p className="text-[11px] text-slate-500 mt-1">
            Layanan khusus antar/jemput penerbangan bandara point-to-point dengan jadwal flight.
          </p>
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
                  onClick={() => setShowCarDropdown(!showCarDropdown)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all">
                  <span className="truncate">{formData.unitName}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
                </div>

                {showCarDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 space-y-1 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                    {carOptions.map((car) => (
                      <div
                        key={car.id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            vehicleId: car.id,
                            unitName: `${car.name} (${car.plateNumber})`,
                          });
                          setShowCarDropdown(false);
                        }}
                        className={`p-3 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          formData.vehicleId === car.id
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}>
                        <div className="font-extrabold">{car.name}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${formData.vehicleId === car.id ? "text-amber-100" : "text-slate-500"}`}>
                          Plat: {car.plateNumber}
                        </div>
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
                <label className="text-xs font-bold text-slate-700">Nama Penyewa / Tamu</label>
                <input
                  type="text"
                  placeholder="Contoh: Bapak Rizky Kurniawan"
                  value={formData.renterName}
                  onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nomor WhatsApp / Kontak</label>
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
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">schedule</span>
              3. Jadwal & Rute ({serviceType})
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {serviceType === "Drop-off Bandara" ? "Bandara & Terminal Tujuan" : "Rute / Tujuan Perjalanan"}
                </label>
                <input
                  type="text"
                  placeholder={
                    serviceType === "Drop-off Bandara"
                      ? "Contoh: Bandara Soekarno-Hatta T3"
                      : "Contoh: Dalam Kota Bandung & Lembang"
                  }
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                  required
                />
              </div>

              {/* Input Nomor Penerbangan jika Bandara */}
              {serviceType === "Drop-off Bandara" && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Kode & Nomor Penerbangan (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: GA-402 / QZ-753"
                    value={formData.flightInfo}
                    onChange={(e) => setFormData({ ...formData, flightInfo: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-mono font-medium text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              )}

              {/* Pilihan Waktu Jam */}
              <div className="space-y-1.5 relative">
                <label className="font-bold text-slate-700">Estimasi Jam Keberangkatan / Jemput</label>
                <div
                  onClick={() => setShowTimePopup(!showTimePopup)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 flex items-center justify-between cursor-pointer hover:border-amber-500 transition-all">
                  <span className="truncate">{formData.departureTime}</span>
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">schedule</span>
                </div>

                {showTimePopup && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 grid grid-cols-3 gap-2 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                    {TIME_SLOTS.map((time, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData({ ...formData, departureTime: time });
                          setShowTimePopup(false);
                        }}
                        className={`p-2 rounded-xl text-center text-xs font-bold cursor-pointer transition-all ${
                          formData.departureTime === time
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}>
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Penugasan Driver */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">Status Pengemudi</span>
                <span className="font-bold text-slate-900 block">{formData.driverName}</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Catatan Khusus</label>
                <textarea
                  rows={2}
                  placeholder="Catatan titik jemput, request khusus, dll..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-60">
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                <span>{isSubmitting ? "Menyimpan Jadwal..." : `Buat Jadwal ${serviceType}`}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
