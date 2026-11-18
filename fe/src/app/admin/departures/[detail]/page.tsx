"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface DepartureDetail {
  id: string;
  bookingCode: string;
  status: string;
  statusLabel: string;
  departureTime: string;
  startDate: string;
  endDate: string;
  duration: string;
  withDriver: boolean;
  destination: string;
  notes: string | null;
  customer: {
    id: string | null;
    name: string;
    phone: string;
    nik: string;
    address: string;
  };
  vehicle: {
    id: string | null;
    name: string;
    brand: string;
    model: string;
    plateNumber: string;
    transmission: string;
    fuelType: string;
    poolLocation: string;
  };
  handover: {
    id: string;
    fuelLevel: number | null;
    odometer: number | null;
    conditionNotes: string | null;
    handedAt: string | null;
  } | null;
}

export default function DepartureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const bookingId = (params?.detail as string) || "";

  // Data Fetching dari Backend Real
  const { data: booking, isLoading, isError, refetch } = useQuery<DepartureDetail>({
    queryKey: ["admin", "departure", bookingId],
    queryFn: async () => {
      const res = await api.get<DepartureDetail>(`/admin/departures/${bookingId}`);
      return res.data;
    },
    enabled: Boolean(bookingId),
    retry: 1,
  });

  // State Form SOP Keberangkatan & Serah Terima
  const [fuelLevel, setFuelLevel] = useState<string>("Full");
  const [odometer, setOdometer] = useState<string>("12.450");
  const [checklist, setChecklist] = useState({
    bodi: true,
    ban: true,
    stnk: true,
    kunci: true,
    toolkit: true,
    ktp: true,
    sim: true,
  });

  const [photosCompleted, setPhotosCompleted] = useState<Record<string, boolean>>({
    depan: true,
    belakang: true,
    kiri: true,
    kanan: true,
    speedometer: true,
    video360: true,
  });

  const [conditionNotes, setConditionNotes] = useState<string>(
    "Unit bersih luar dalam. Bodi mulus bebas baret baru, siap jalan operasional."
  );
  const [customerAgreement, setCustomerAgreement] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // In-App Toast Feedback
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Sinkronkan data jika sudah pernah ada handover sebelumnya
  useEffect(() => {
    if (booking?.handover) {
      if (booking.handover.odometer) {
        setOdometer(booking.handover.odometer.toLocaleString("id-ID"));
      }
      if (booking.handover.fuelLevel !== null) {
        if (booking.handover.fuelLevel >= 85) setFuelLevel("Full");
        else if (booking.handover.fuelLevel >= 65) setFuelLevel("3/4");
        else if (booking.handover.fuelLevel >= 40) setFuelLevel("1/2");
        else if (booking.handover.fuelLevel >= 20) setFuelLevel("1/4");
        else setFuelLevel("E");
      }
      if (booking.handover.conditionNotes) {
        setConditionNotes(booking.handover.conditionNotes);
      }
    }
  }, [booking]);

  const togglePhoto = (key: string) => {
    setPhotosCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isOngoingOrCompleted = booking?.status === "ongoing" || booking?.status === "completed";

  // Eksekusi Serah Terima Kendaraan (Check-Out)
  const handleExecuteCheckout = async () => {
    if (!customerAgreement) {
      setToast({
        show: true,
        type: "error",
        message: "Harap centang klausul konfirmasi serah terima pelanggan terlebih dahulu.",
      });
      return;
    }

    if (!checklist.ktp || !checklist.sim) {
      setToast({
        show: true,
        type: "error",
        message: "SOP Lapangan: Verifikasi fisik KTP asli & SIM aktif penyewa wajib diperiksa!",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        odometer: odometer.replace(/[^0-9]/g, ""),
        fuel_level: fuelLevel,
        condition_notes: conditionNotes,
        checklist,
      };

      await api.post(`/admin/departures/${bookingId}/checkout`, payload);

      setToast({
        show: true,
        type: "success",
        message: "Berhasil! Serah terima kunci dicatat dan unit resmi berstatus Disewa (Ongoing).",
      });

      // Refresh data
      await refetch();
      qc.invalidateQueries({ queryKey: ["admin", "departures"] });
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Gagal memproses serah terima kendaraan.";
      setToast({
        show: true,
        type: "error",
        message: errMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <DepartureDetailSkeleton />;
  }

  if (isError || !booking) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl">error</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Data Keberangkatan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-md">
          Pesanan sewa dengan ID atau Kode <strong>#{bookingId}</strong> tidak terdaftar di database.
        </p>
        <Link
          href="/admin/departures"
          className="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Jadwal Keberangkatan</span>
        </Link>
      </div>
    );
  }

  const allChecklistCount = Object.values(checklist).filter(Boolean).length;
  const totalChecklistCount = Object.keys(checklist).length;
  const allPhotosCount = Object.values(photosCompleted).filter(Boolean).length;

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

      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Link href="/admin/departures" className="hover:text-slate-700 transition-colors">
              Operasional Lapangan
            </Link>{" "}
            &rsaquo; <span>Keberangkatan</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold font-mono">{booking.bookingCode}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Eksekusi Serah Terima Keberangkatan
            </h1>
            <span
              className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
                booking.status === "ongoing"
                  ? "bg-sky-50 text-sky-700 border-sky-200"
                  : booking.status === "completed"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {booking.statusLabel || "Siap Berangkat"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Jadwal Pelepasan Armada: <strong className="text-slate-800">{booking.departureTime}</strong> &bull; Rute:{" "}
            <span className="text-slate-700 font-medium">{booking.destination}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/departures"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Daftar</span>
          </Link>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN DESKTOP LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (FORM UTAMA: CEKLIS & FOTO) - 8 Kolom */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Checklist Teknis & Fisik Lapangan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Checklist SOP Teknis & Dokumen</h3>
                  <p className="text-xs text-slate-500">Pemeriksaan fisik kendaraan, bahan bakar, dan kelengkapan identitas</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-lg font-bold text-xs border ${
                  allChecklistCount === totalChecklistCount
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                {allChecklistCount}/{totalChecklistCount} Selesai
              </span>
            </div>

            {/* Input BBM & Odometer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Tingkat Bahan Bakar (BBM Awal)</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {["E", "1/4", "1/2", "3/4", "Full"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      disabled={isOngoingOrCompleted}
                      onClick={() => setFuelLevel(lvl)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        fuelLevel === lvl
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 disabled:opacity-60"
                      }`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Angka Odometer Saat Keluar (KM)</label>
                <div className="relative">
                  <input
                    type="text"
                    disabled={isOngoingOrCompleted}
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    placeholder="Contoh: 12.450"
                    className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 disabled:bg-slate-100"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                </div>
                <p className="text-[11px] text-slate-500">Catat kilometer akurat sebelum unit diserahkan ke penyewa.</p>
              </div>
            </div>

            {/* Checkboxes Kelengkapan & Verifikasi Fisik */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Pemeriksaan Fisik & Validasi Identitas (SOP Caruhun)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "bodi", label: "Bodi Mulus & Kabin Interior Bersih", icon: "cleaning_services" },
                  { key: "ban", label: "Ban Utama & Cadangan Siap Jalan", icon: "tire_repair" },
                  { key: "stnk", label: "Surat STNK Asli di Glovebox", icon: "description" },
                  { key: "toolkit", label: "Tool Kit & Dongkrak Lengkap", icon: "handyman" },
                  { key: "ktp", label: "Verifikasi Fisik KTP Asli Penyewa", icon: "badge" },
                  { key: "sim", label: "Verifikasi Fisik SIM A Aktif Penyewa", icon: "contact_emergency" },
                  { key: "kunci", label: "Kunci Kontak Utama & Remote Siap", icon: "key" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      disabled={isOngoingOrCompleted}
                      checked={checklist[item.key as keyof typeof checklist]}
                      onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer disabled:opacity-60"
                    />
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">{item.icon}</span>
                      <span className="text-xs font-bold text-slate-800">{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Catatan Kondisi Bodi & Cacat Fisik Awal */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">edit_note</span>
                Catatan Kondisi Awal / Baret Bodi Sebelum Keluar
              </label>
              <textarea
                rows={2}
                disabled={isOngoingOrCompleted}
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                placeholder="Tuliskan baret halus, lecet, atau cacat fisik bawaan jika ada..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 disabled:bg-slate-100 transition-all"
              />
            </div>
          </div>

          {/* 2. Dokumentasi Visual SOP (Video 360° & Foto 5 Sisi) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Dokumentasi Visual (SOP Video 360° & Foto)</h3>
                  <p className="text-xs text-slate-500">Tercap otomatis watermark waktu, lokasi GPS, dan identitas petugas</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-lg font-bold text-xs border ${
                  allPhotosCount === 6
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-sky-50 text-sky-700 border-sky-200"
                }`}>
                {allPhotosCount}/6 Terdokumentasi
              </span>
            </div>

            {/* Kartu Khusus: Video 360 Derajat Keliling Bodi */}
            <div
              onClick={() => !isOngoingOrCompleted && togglePhoto("video360")}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                photosCompleted.video360
                  ? "bg-emerald-50/70 border-emerald-200"
                  : "bg-slate-50 border-slate-200 hover:border-amber-500"
              }`}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    photosCompleted.video360 ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                  <span className="material-symbols-outlined text-2xl">videocam</span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>1. Rekaman Video 360° Keliling Mobil</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">Wajib SOP</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Petugas mengitari mobil satu putaran penuh merekam detail bodi, kaca, dan ban.
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 ${
                  photosCompleted.video360 ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-700"
                }`}>
                {photosCompleted.video360 ? "✓ Terunggah" : "Ambil Video"}
              </span>
            </div>

            {/* Grid 5 Sisi Foto Utama */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {[
                { key: "depan", label: "Depan & Nopol", icon: "front_hand" },
                { key: "belakang", label: "Belakang & Bumper", icon: "directions_car" },
                { key: "kiri", label: "Samping Kiri", icon: "west" },
                { key: "kanan", label: "Samping Kanan", icon: "east" },
                { key: "speedometer", label: "Speedo & BBM", icon: "speed" },
              ].map((side) => {
                const isDone = photosCompleted[side.key];
                return (
                  <div
                    key={side.key}
                    onClick={() => !isOngoingOrCompleted && togglePhoto(side.key)}
                    className={`relative rounded-xl border p-3 flex flex-col items-center justify-center text-center aspect-square transition-all cursor-pointer ${
                      isDone
                        ? "bg-emerald-50/50 border-emerald-300 text-emerald-800"
                        : "bg-slate-50 border-slate-200 hover:border-amber-500 text-slate-600"
                    }`}>
                    <span className="material-symbols-outlined text-2xl mb-1">
                      {isDone ? "check_circle" : "add_a_photo"}
                    </span>
                    <span className="text-[11px] font-bold leading-tight">{side.label}</span>
                    <span
                      className={`absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                      {isDone ? "✓" : "+"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (SUMMARY KENDARAAN, PENYEWA & TANDA TANGAN) - 4 Kolom */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* Ringkasan Unit Kendaraan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Armada yang Diberangkatkan
            </span>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white font-mono font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                {booking.vehicle.plateNumber.slice(0, 4)}
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-sm text-slate-900 truncate">{booking.vehicle.name}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {booking.vehicle.plateNumber}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">{booking.vehicle.poolLocation}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <div>
                Durasi Sewa: <strong className="text-slate-900">{booking.duration}</strong>
              </div>
              <div>
                Layanan:{" "}
                <strong className="text-slate-900">
                  {booking.withDriver ? "Include Driver" : "Lepas Kunci (Self-Drive)"}
                </strong>
              </div>
              <div>
                Transmisi: <strong className="text-slate-900">{booking.vehicle.transmission}</strong>
              </div>
            </div>
          </div>

          {/* Informasi Penyewa */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Identitas Penyewa
            </span>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                    {booking.customer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{booking.customer.name}</h5>
                    <p className="text-xs text-slate-500 font-mono">{booking.customer.phone}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <a
                    href={`https://wa.me/${booking.customer.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                    title="WhatsApp">
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                  </a>
                  <a
                    href={`tel:${booking.customer.phone}`}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
                    title="Telepon">
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </a>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex flex-col gap-0.5">
                <span>NIK: <strong className="text-slate-700 font-mono">{booking.customer.nik || "-"}</strong></span>
                <span className="truncate">Alamat: <span className="text-slate-700">{booking.customer.address || "Sesuai KTP"}</span></span>
              </div>
            </div>
          </div>

          {/* Konfirmasi Tanda Tangan & Tombol Eksekusi Serah Terima */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Konfirmasi Serah Terima Kunci
            </span>

            {/* Kotak Tanda Tangan Digital */}
            <div className="h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative p-3">
              <p className="text-[11px] text-slate-400 italic">Tanda Tangan Digital Berita Acara</p>
              <div className="font-serif text-slate-800 font-bold tracking-widest text-lg opacity-80 select-none mt-1">
                {booking.customer.name}
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono">
                {booking.handover?.handedAt || "Verifikasi Lapangan"}
              </span>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                disabled={isOngoingOrCompleted}
                checked={customerAgreement}
                onChange={(e) => setCustomerAgreement(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer disabled:opacity-60"
              />
              <span>
                Penyewa telah memeriksa kondisi fisik kendaraan secara langsung, mencocokkan kelengkapan, dan menyetujui berita acara serah terima.
              </span>
            </label>

            {/* Tombol Eksekusi Utama */}
            {isOngoingOrCompleted ? (
              <div className="w-full py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Armada Sudah Diserahterimakan (Dalam Perjalanan)</span>
              </div>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleExecuteCheckout}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer disabled:opacity-60">
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>{isSubmitting ? "Menyimpan Data..." : "Serahkan Kunci & Kendaraan (Check Out)"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartureDetailSkeleton() {
  return (
    <div className="w-full min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-80 bg-white rounded-2xl border border-slate-200" />
          <div className="h-64 bg-white rounded-2xl border border-slate-200" />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="h-44 bg-white rounded-2xl border border-slate-200" />
          <div className="h-44 bg-white rounded-2xl border border-slate-200" />
          <div className="h-60 bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    </div>
  );
}
