"use client";

import React, { useState, useId, use, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useArrivalDetail } from "@/lib/use-arrivals";

export default function ArrivalDetailPage({
  params,
}: {
  params: Promise<{ detail: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawId = resolvedParams.detail;
  const cleanId = decodeURIComponent(rawId).replace("#", "");

  const { data: booking, isLoading, refetch } = useArrivalDetail(cleanId);

  // Form states
  const [odometerReturn, setOdometerReturn] = useState<string>("");
  const [fuelReturn, setFuelReturn] = useState<string>("Full");
  const [conditionStatus, setConditionStatus] = useState<"ok" | "damaged">("ok");
  const [damageDescription, setDamageDescription] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<string>("");
  const [conditionNotes, setConditionNotes] = useState<string>("");

  // Jaminan return state (Lepas Kunci)
  const [guaranteeAction, setGuaranteeAction] = useState<"returned" | "held">("returned");
  const [guaranteeNotes, setGuaranteeNotes] = useState<string>("");

  // Checklist
  const [checklist, setChecklist] = useState({
    bodiAman: true,
    banUtuh: true,
    stnkAda: true,
    toolkitLengkap: true,
    interiorBersih: true,
  });

  // Photos (5 sisi wajib + 1 foto kerusakan)
  const [photos, setPhotos] = useState<{
    front: string | null;
    rear: string | null;
    left: string | null;
    right: string | null;
    odometer: string | null;
    damage: string | null;
  }>({
    front: null,
    rear: null,
    left: null,
    right: null,
    odometer: null,
    damage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Set default nilai dari database ketika booking dimuat
  useEffect(() => {
    if (booking) {
      if (booking.arrival) {
        // Jika sudah pernah check-in sebelumnya
        setOdometerReturn(String(booking.arrival.odometer || ""));
        setFuelReturn(
          booking.arrival.fuelLevel >= 90
            ? "Full"
            : booking.arrival.fuelLevel >= 70
            ? "3/4"
            : booking.arrival.fuelLevel >= 45
            ? "1/2"
            : booking.arrival.fuelLevel >= 20
            ? "1/4"
            : "E",
        );
        setConditionStatus(booking.arrival.conditionStatus || "ok");
        setDamageDescription(booking.arrival.damageDescription || "");
        setEstimatedCost(booking.arrival.estimatedCost ? String(booking.arrival.estimatedCost) : "");
        setGuaranteeAction(booking.arrival.guaranteeAction === "held" ? "held" : "returned");
        setGuaranteeNotes(booking.arrival.guaranteeNotes || "");
        if (booking.arrival.checklist) {
          setChecklist((prev) => ({ ...prev, ...booking.arrival?.checklist }));
        }
        if (booking.arrival.photos) {
          setPhotos({
            front: booking.arrival.photos.front || null,
            rear: booking.arrival.photos.rear || null,
            left: booking.arrival.photos.left || null,
            right: booking.arrival.photos.right || null,
            odometer: booking.arrival.photos.odometer || null,
            damage: booking.arrival.photos.damage || null,
          });
        }
      } else {
        // Default saran odometer saat kembali = odo berangkat + estimasi pemakaian
        const depOdo = booking.departure?.odometer || 12450;
        setOdometerReturn(String(depOdo + 350));
      }
    }
  }, [booking]);

  // Kalkulasi selisih KM
  const departureOdo = booking?.departure?.odometer || 0;
  const currentOdoNum = parseInt(odometerReturn.replace(/[^0-9]/g, ""), 10) || 0;
  const distanceTraveled = Math.max(0, currentOdoNum - departureOdo);

  // Handle upload foto
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: "front" | "rear" | "left" | "right" | "odometer" | "damage",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast("error", "Ukuran foto maksimal 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => ({ ...prev, [key]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Submit Check-In Pengembalian
  const handleSubmitCheckin = async () => {
    if (!odometerReturn.trim()) {
      showToast("error", "Mohon masukkan angka odometer akhir (KM).");
      return;
    }

    if (currentOdoNum < departureOdo) {
      showToast("error", `Odometer akhir (${currentOdoNum} KM) tidak boleh lebih rendah dari KM berangkat (${departureOdo} KM).`);
      return;
    }

    if (conditionStatus === "damaged" && !damageDescription.trim()) {
      showToast("error", "Mohon jelaskan rincian kerusakan atau baret pada kendaraan.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        odometer: currentOdoNum,
        fuel_level: fuelReturn,
        condition_status: conditionStatus,
        damage_description: damageDescription,
        estimated_cost: estimatedCost ? parseInt(estimatedCost.replace(/[^0-9]/g, ""), 10) : 0,
        condition_notes: conditionNotes,
        guarantee_action: booking?.serviceType === "Lepas Kunci" ? guaranteeAction : "none",
        guarantee_notes: guaranteeNotes,
        checklist,
        photo_front: photos.front,
        photo_rear: photos.rear,
        photo_left: photos.left,
        photo_right: photos.right,
        photo_odometer: photos.odometer,
        photo_damage: photos.damage,
      };

      await api.post(`/admin/arrivals/${cleanId}/checkin`, payload);
      showToast("success", conditionStatus === "damaged"
        ? "Check-in berhasil dicatat dengan klaim kerusakan. Status unit dialihkan ke Perawatan."
        : "Check-in selesai! Unit mobil kini berstatus Tersedia dan siap disewa kembali.");

      await refetch();
      setTimeout(() => {
        router.push("/admin/arrivals");
      }, 1500);
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Gagal memproses check-in kedatangan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !booking) {
    return (
      <div className="w-full min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-2xl border border-slate-200" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-white rounded-2xl border border-slate-200" />
          <div className="lg:col-span-4 h-96 bg-white rounded-2xl border border-slate-200" />
        </div>
      </div>
    );
  }

  const isAlreadyCompleted = booking.status === "completed" || !!booking.arrival;
  const isLepasKunci = booking.serviceType === "Lepas Kunci";

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Toast Notifikasi */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border text-sm font-bold transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-700"
              : "bg-rose-600 text-white border-rose-700"
          }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Operasional</span> &rsaquo; <span>Kedatangan</span> &rsaquo;{" "}
            <span className="text-slate-800 font-bold">{booking.bookingCode}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Check-In Pengembalian Unit
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isAlreadyCompleted
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}>
              <span className={`w-2 h-2 rounded-full ${isAlreadyCompleted ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`}></span>
              {isAlreadyCompleted ? "Inspeksi Selesai (Unit Kembali)" : "Tiba di Pool (Perlu Inspeksi)"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Jadwal Selesai Sewa: <strong>{booking.endDate}</strong> • Rute: <strong>{booking.destination}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/arrivals"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali ke Daftar</span>
          </Link>
        </div>
      </div>

      {/* ================= PERBANDINGAN BERANGKAT VS KEMBALI ================= */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400 text-xl">compare_arrows</span>
            <h3 className="font-bold text-sm text-white">Baseline Data Serah Terima Saat Berangkat</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Berangkat: {booking.departure?.handedAt || booking.startDate}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">KM Berangkat:</span>
            <span className="text-base font-extrabold text-amber-400 font-mono mt-0.5 block">
              {departureOdo.toLocaleString("id-ID")} KM
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">BBM Berangkat:</span>
            <span className="text-base font-extrabold text-sky-400 font-mono mt-0.5 block">
              {booking.departure?.fuelLevel}% (Full)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Layanan:</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
              {booking.serviceType}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Jaminan Lepas Kunci:</span>
            <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">
              {booking.departure?.guarantee
                ? booking.departure.guarantee.type === "motor"
                  ? `Motor: ${booking.departure.guarantee.motor_info || "Ada"}`
                  : `Deposit: Rp ${(booking.departure.guarantee.deposit_amount || 1500000).toLocaleString("id-ID")}`
                : "Tanpa Jaminan (Driver)"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN 2-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (FORM UTAMA: KONDISI KEMBALI, KLAIM & FOTO) - 8 Kolom */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. KEPUTUSAN KONDISI AKHIR (OK / MULUS vs ADA KLAIM KERUSAKAN) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Hasil Penilaian Kondisi Fisik</h3>
                  <p className="text-xs text-slate-500">Tentukan apakah kendaraan kembali mulus atau terdapat kerusakan baru</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opsi 1: OK / Mulus */}
              <button
                type="button"
                disabled={isAlreadyCompleted}
                onClick={() => setConditionStatus("ok")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  conditionStatus === "ok"
                    ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500"
                    : "bg-white border-slate-200 hover:border-slate-300 opacity-70"
                }`}>
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">Unit Mulus / Normal (OK)</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Tidak ada baret atau kerusakan baru. Unit langsung dialihkan ke status <strong>Tersedia</strong> dan jaminan dapat dikembalikan penuh.
                  </p>
                </div>
              </button>

              {/* Opsi 2: Rusak / Klaim */}
              <button
                type="button"
                disabled={isAlreadyCompleted}
                onClick={() => setConditionStatus("damaged")}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  conditionStatus === "damaged"
                    ? "bg-rose-50/80 border-rose-500 ring-2 ring-rose-500"
                    : "bg-white border-slate-200 hover:border-slate-300 opacity-70"
                }`}>
                <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">Ada Baret / Kerusakan (Klaim)</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ditemukan baret bodi, velg penyok, atau kendala fisik. Unit dialihkan ke status <strong>Perawatan</strong> dan jaminan ditahan.
                  </p>
                </div>
              </button>
            </div>

            {/* Form Rincian Kerusakan (Jika Damaged) */}
            {conditionStatus === "damaged" && (
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-3 mt-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                  <span className="material-symbols-outlined text-base">report_problem</span>
                  <span>Form Rincian Klaim & Estimasi Perbaikan:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Deskripsi Kerusakan Baru <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={isAlreadyCompleted}
                      value={damageDescription}
                      onChange={(e) => setDamageDescription(e.target.value)}
                      placeholder="Contoh: Baret dalam pada bemper depan kiri & spion lecet"
                      className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Estimasi Biaya Perbaikan (Rp)
                    </label>
                    <input
                      type="number"
                      disabled={isAlreadyCompleted}
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
                      placeholder="Contoh: 500000"
                      className="w-full h-10 px-3 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Foto Bukti Kerusakan Baru
                    </label>
                    <label className="h-10 px-3 bg-white rounded-lg border border-dashed border-rose-300 text-xs font-bold text-rose-700 flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-50 transition-colors">
                      <span className="material-symbols-outlined text-base">add_a_photo</span>
                      <span>{photos.damage ? "Foto Kerusakan Terlampir" : "Unggah Foto Kerusakan"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isAlreadyCompleted}
                        onChange={(e) => handleFileUpload(e, "damage")}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. ODOMETER & BAHAN BAKAR SAAT KEMBALI */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">speed</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Odometer & Indikator Bahan Bakar</h3>
                  <p className="text-xs text-slate-500">Hitung selisih jarak pemakaian dan cek kepatuhan tingkat BBM</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Odometer Input */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Odometer Akhir (KM)</label>
                  <span className="text-[11px] text-slate-500">Awal: {departureOdo.toLocaleString("id-ID")} KM</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    disabled={isAlreadyCompleted}
                    value={odometerReturn}
                    onChange={(e) => setOdometerReturn(e.target.value)}
                    placeholder="Contoh: 12980"
                    className="w-full h-11 px-3 bg-white rounded-lg border border-slate-200 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">KM</span>
                </div>
                <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">route</span>
                  <span>Jarak pemakaian sewa: <strong>{distanceTraveled.toLocaleString("id-ID")} KM</strong></span>
                </p>
              </div>

              {/* Fuel Level Selector */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">BBM Saat Kembali</label>
                  <span className="text-[11px] text-slate-500">Berangkat: {booking.departure?.fuelLevel}%</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {["E", "1/4", "1/2", "3/4", "Full"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      disabled={isAlreadyCompleted}
                      onClick={() => setFuelReturn(lvl)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        fuelReturn === lvl
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}>
                      {lvl}
                    </button>
                  ))}
                </div>
                {fuelReturn !== "Full" && fuelReturn !== "3/4" && (
                  <p className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-xs">warning</span>
                    <span>BBM kembali di bawah standar berangkat (ada selisih BBM).</span>
                  </p>
                )}
              </div>
            </div>

            {/* Checklist Kelengkapan */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Ceklis Kelengkapan Unit Dikembalikan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: "bodiAman", label: "Bodi & Interior Tanpa Kerusakan Baru" },
                  { key: "banUtuh", label: "Ban & Velg Utuh Sesuai Berangkat" },
                  { key: "stnkAda", label: "STNK Asli Masih Lengkap di Mobil" },
                  { key: "toolkitLengkap", label: "Tool Kit & Dongkrak Lengkap" },
                  { key: "interiorBersih", label: "Kabin Bersih & Bebas Asap Rokok" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      disabled={isAlreadyCompleted}
                      checked={checklist[item.key as keyof typeof checklist]}
                      onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
                    />
                    <span className="text-xs font-bold text-slate-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 3. DOKUMENTASI FOTO MASUK POOL (5 SISI WAJIB) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Foto Dokumentasi Tiba (5 Sisi Wajib)</h3>
                  <p className="text-xs text-slate-500">Bukti visual kondisi kendaraan saat tiba di pool</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                {Object.values(photos).filter(Boolean).length}/5 Terlampir
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { key: "front", label: "1. Depan & Plat Nomor" },
                { key: "rear", label: "2. Bagian Belakang" },
                { key: "left", label: "3. Samping Kiri" },
                { key: "right", label: "4. Samping Kanan" },
                { key: "odometer", label: "5. Odometer & BBM" },
              ].map((slot) => {
                const photoSrc = photos[slot.key as keyof typeof photos];
                const inputId = `file-${slot.key}`;

                return (
                  <div
                    key={slot.key}
                    className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-100 aspect-video flex flex-col items-center justify-center text-center p-2 hover:border-amber-500 transition-all group">
                    {photoSrc ? (
                      <>
                        <img
                          src={photoSrc}
                          alt={slot.label}
                          className="w-full h-full object-cover rounded-lg cursor-pointer"
                          onClick={() => setPreviewImage(photoSrc)}
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewImage(photoSrc)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer">
                          <span className="material-symbols-outlined text-base">visibility</span>
                          <span>Lihat</span>
                        </button>
                        <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      </>
                    ) : (
                      <label
                        htmlFor={inputId}
                        className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <span className="material-symbols-outlined text-slate-400 text-2xl mb-1 group-hover:scale-110 transition-transform">
                          add_a_photo
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 leading-tight">{slot.label}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Klik untuk unggah</span>
                        <input
                          id={inputId}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isAlreadyCompleted}
                          onChange={(e) => handleFileUpload(e, slot.key as any)}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (SUMMARY KENDARAAN, JAMINAN, & ACTION BUTTON) - 4 Kolom */}
        <div className="lg:col-span-4 space-y-6 sticky top-6">
          {/* Ringkasan Armada */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Unit Armada
            </span>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white font-mono font-black flex items-center justify-center text-xs shrink-0 shadow-sm">
                CRH
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">{booking.vehicle.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                    {booking.vehicle.plateNumber}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">{booking.vehicle.transmission}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Penyewa:</span>
                <strong className="text-slate-900">{booking.customer.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Kontak:</span>
                <span className="font-mono text-slate-900">{booking.customer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Layanan:</span>
                <strong className="text-amber-700">{booking.serviceType}</strong>
              </div>
            </div>
          </div>

          {/* PENGEMBALIAN JAMINAN (KHUSUS SEWA LEPAS KUNCI) */}
          {isLepasKunci && (
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-2xs space-y-4 bg-amber-50/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-xl">savings</span>
                <h4 className="font-bold text-sm text-slate-900">Pengembalian Jaminan Sewa</h4>
              </div>

              {booking.departure?.guarantee ? (
                <div className="p-3 rounded-xl bg-white border border-amber-200 text-xs space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-800 uppercase block">Jaminan Yang Dititipkan:</span>
                  <div className="font-bold text-slate-900">
                    {booking.departure.guarantee.type === "motor"
                      ? `🏍️ Motor + STNK: ${booking.departure.guarantee.motor_info || "Motor Penyewa"}`
                      : `💰 Uang Deposit: Rp ${(booking.departure.guarantee.deposit_amount || 1500000).toLocaleString("id-ID")}`}
                  </div>
                  {booking.departure.guarantee.photo && (
                    <button
                      type="button"
                      onClick={() => setPreviewImage(booking.departure.guarantee?.photo || null)}
                      className="text-[11px] text-amber-700 font-bold underline cursor-pointer block mt-1">
                      Lihat Foto Jaminan Saat Berangkat
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Tidak ada data jaminan tercatat.</p>
              )}

              {/* Pilihan Tindakan Terhadap Jaminan */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 block">Tindakan Jaminan:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={isAlreadyCompleted}
                    onClick={() => setGuaranteeAction("returned")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      guaranteeAction === "returned"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}>
                    ✓ Kembalikan Penuh
                  </button>
                  <button
                    type="button"
                    disabled={isAlreadyCompleted}
                    onClick={() => setGuaranteeAction("held")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      guaranteeAction === "held"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}>
                    ✕ Tahan Jaminan
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  disabled={isAlreadyCompleted}
                  value={guaranteeNotes}
                  onChange={(e) => setGuaranteeNotes(e.target.value)}
                  placeholder="Catatan jaminan (misal: Diserahkan kembali ke penyewa)"
                  className="w-full h-9 px-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Konfirmasi & Tombol Selesai Check-In */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Eksekusi Akhir
            </span>

            {isAlreadyCompleted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <span className="material-symbols-outlined text-3xl text-emerald-600">check_circle</span>
                <h5 className="font-bold text-sm text-emerald-900">Check-In Sudah Selesai</h5>
                <p className="text-xs text-emerald-700">
                  Kendaraan ini telah melalui serah terima kembali dan tercatat di database.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                  Setelah tombol ditekan, status booking akan berubah menjadi <strong>Selesai</strong> dan status kendaraan otomatis diperbarui di database.
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitCheckin}
                  className={`w-full py-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer ${
                    conditionStatus === "damaged"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}>
                  <span className="material-symbols-outlined text-[18px]">
                    {isSubmitting ? "hourglass_top" : conditionStatus === "damaged" ? "report_problem" : "task_alt"}
                  </span>
                  <span>
                    {isSubmitting
                      ? "Menyimpan Data..."
                      : conditionStatus === "damaged"
                      ? "Simpan Check-In & Buat Klaim"
                      : "Selesaikan Check-In (Unit Tersedia)"}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Preview Gambar */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-700">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer z-10">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
