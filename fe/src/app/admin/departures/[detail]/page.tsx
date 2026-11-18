"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface SopDocuments {
  ktp_number?: string | null;
  ktp_photo?: string | null;
  sim_number?: string | null;
  sim_photo?: string | null;
  kk_status?: "ada" | "tidak_ada";
  kk_photo?: string | null;
  npwp_status?: "ada" | "tidak_ada";
  npwp_photo?: string | null;
  id_card_status?: "ada" | "tidak_ada";
  id_card_photo?: string | null;
  social_media?: string | null;
  emergency_family_name?: string | null;
  emergency_family_phone?: string | null;
  emergency_peer_name?: string | null;
  emergency_peer_phone?: string | null;
}

interface SopGuarantee {
  type: "motor" | "deposit";
  motor_info?: string | null;
  deposit_amount?: number | null;
  photo?: string | null;
}

interface DepartureDetail {
  id: string;
  bookingCode: string;
  status: string;
  statusLabel: string;
  serviceType?: "Lepas Kunci" | "Dengan Driver" | "Drop-off Bandara" | string;
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
    sim?: string;
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
    sopDocuments?: SopDocuments | null;
    sopGuarantee?: SopGuarantee | null;
    handedAt: string | null;
  } | null;
}

// Helper membaca file gambar menjadi Base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });
}

export default function DepartureDetailPage() {
  const params = useParams();
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

  // State Kategori Layanan (Dipisah: Lepas Kunci, Dengan Driver, Drop-off Bandara)
  const [currentServiceType, setCurrentServiceType] = useState<"Lepas Kunci" | "Dengan Driver" | "Drop-off Bandara">("Lepas Kunci");

  // State Form SOP Keberangkatan & Serah Terima
  const [fuelLevel, setFuelLevel] = useState<string>("Full");
  const [odometer, setOdometer] = useState<string>("12.450");
  const [checklist, setChecklist] = useState({
    bodi: true,
    ban: true,
    stnk: true,
    kunci: true,
    toolkit: true,
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

  // ================= STATE DOKUMEN SOP WAJIB UPLOAD (KHUSUS LEPAS KUNCI) =================
  const [ktpNumber, setKtpNumber] = useState<string>("");
  const [ktpPhoto, setKtpPhoto] = useState<string | null>(null);

  const [simNumber, setSimNumber] = useState<string>("");
  const [simPhoto, setSimPhoto] = useState<string | null>(null);

  // Dokumen Pendukung (Upload jika ada / Kasih Keterangan Tidak Punya)
  const [kkStatus, setKkStatus] = useState<"ada" | "tidak_ada">("ada");
  const [kkPhoto, setKkPhoto] = useState<string | null>(null);

  const [npwpStatus, setNpwpStatus] = useState<"ada" | "tidak_ada">("ada");
  const [npwpPhoto, setNpwpPhoto] = useState<string | null>(null);

  const [idCardStatus, setIdCardStatus] = useState<"ada" | "tidak_ada">("tidak_ada");
  const [idCardPhoto, setIdCardPhoto] = useState<string | null>(null);

  const [socialMedia, setSocialMedia] = useState<string>("");

  // 2 Kontak WhatsApp Darurat
  const [emergencyFamilyName, setEmergencyFamilyName] = useState<string>("");
  const [emergencyFamilyPhone, setEmergencyFamilyPhone] = useState<string>("");
  const [emergencyPeerName, setEmergencyPeerName] = useState<string>("");
  const [emergencyPeerPhone, setEmergencyPeerPhone] = useState<string>("");

  // Jaminan Sewa (Wajib Salah Satu: Titip Motor+STNK atau Deposit Uang)
  const [guaranteeType, setGuaranteeType] = useState<"motor" | "deposit">("motor");
  const [guaranteeMotorInfo, setGuaranteeMotorInfo] = useState<string>("Honda Vario 160 (D 4421 ABC) + STNK Asli");
  const [guaranteeDepositAmount, setGuaranteeDepositAmount] = useState<string>("1.500.000");
  const [guaranteePhoto, setGuaranteePhoto] = useState<string | null>(null);

  // Data Khusus Layanan Dengan Driver & Bandara
  const [driverStaffName, setDriverStaffName] = useState<string>("Ahmad Sopian (Driver Caruhun)");
  const [driverStaffPhone, setDriverStaffPhone] = useState<string>("0813-8821-9002");
  const [pickupAddress, setPickupAddress] = useState<string>("Lobby Hotel Pullman / Alamat Penyewa");
  const [flightNumber, setFlightNumber] = useState<string>("GA-402 (Terminal 3 Soekarno-Hatta)");

  // Modal Preview Gambar Full-Screen
  const [previewImageModal, setPreviewImageModal] = useState<{ url: string; title: string } | null>(null);

  // In-App Toast Feedback
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Sinkronkan data saat booking dimuat
  useEffect(() => {
    if (booking?.serviceType) {
      if (booking.serviceType === "Drop-off Bandara") setCurrentServiceType("Drop-off Bandara");
      else if (booking.serviceType === "Dengan Driver") setCurrentServiceType("Dengan Driver");
      else setCurrentServiceType("Lepas Kunci");
    } else if (booking?.withDriver) {
      setCurrentServiceType("Dengan Driver");
    }

    if (booking?.customer) {
      if (booking.customer.nik && booking.customer.nik !== "-") setKtpNumber(booking.customer.nik);
      if (booking.customer.sim && booking.customer.sim !== "-") setSimNumber(booking.customer.sim);
    }

    if (booking?.destination) {
      setPickupAddress(booking.destination);
    }

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

      // Restore data dokumen SOP
      const docs = booking.handover.sopDocuments;
      if (docs) {
        if (docs.ktp_number) setKtpNumber(docs.ktp_number);
        if (docs.ktp_photo) setKtpPhoto(docs.ktp_photo);
        if (docs.sim_number) setSimNumber(docs.sim_number);
        if (docs.sim_photo) setSimPhoto(docs.sim_photo);
        if (docs.kk_status) setKkStatus(docs.kk_status);
        if (docs.kk_photo) setKkPhoto(docs.kk_photo);
        if (docs.npwp_status) setNpwpStatus(docs.npwp_status);
        if (docs.npwp_photo) setNpwpPhoto(docs.npwp_photo);
        if (docs.id_card_status) setIdCardStatus(docs.id_card_status);
        if (docs.id_card_photo) setIdCardPhoto(docs.id_card_photo);
        if (docs.social_media) setSocialMedia(docs.social_media);
        if (docs.emergency_family_name) setEmergencyFamilyName(docs.emergency_family_name);
        if (docs.emergency_family_phone) setEmergencyFamilyPhone(docs.emergency_family_phone);
        if (docs.emergency_peer_name) setEmergencyPeerName(docs.emergency_peer_name);
        if (docs.emergency_peer_phone) setEmergencyPeerPhone(docs.emergency_peer_phone);
      }

      // Restore data jaminan SOP
      const guar = booking.handover.sopGuarantee;
      if (guar) {
        if (guar.type) setGuaranteeType(guar.type);
        if (guar.motor_info) setGuaranteeMotorInfo(guar.motor_info);
        if (guar.deposit_amount) setGuaranteeDepositAmount(guar.deposit_amount.toLocaleString("id-ID"));
        if (guar.photo) setGuaranteePhoto(guar.photo);
      }
    }
  }, [booking]);

  const isOngoingOrCompleted = booking?.status === "ongoing" || booking?.status === "completed";

  // Handler upload file gambar lokal
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setter(base64);
    } catch {
      setToast({ show: true, type: "error", message: "Gagal memproses file foto." });
    }
  };

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

    // ================= VALIDASI KHUSUS SEWA LEPAS KUNCI =================
    if (currentServiceType === "Lepas Kunci") {
      if (!ktpPhoto) {
        setToast({
          show: true,
          type: "error",
          message: "SOP Lepas Kunci: Foto KTP Asli penyewa wajib diunggah sebelum unit diserahkan!",
        });
        return;
      }

      if (!simPhoto) {
        setToast({
          show: true,
          type: "error",
          message: "SOP Lepas Kunci: Foto SIM A aktif penyewa wajib diunggah sebelum unit diserahkan!",
        });
        return;
      }

      if (!emergencyFamilyPhone.trim() || !emergencyPeerPhone.trim()) {
        setToast({
          show: true,
          type: "error",
          message: "SOP Lepas Kunci: Harap lengkapi 2 nomor WhatsApp darurat (Keluarga & Rekan)!",
        });
        return;
      }

      if (!guaranteePhoto) {
        const labelJaminan = guaranteeType === "motor" ? "Foto Motor & STNK Asli Titipan" : "Bukti Transfer / Kwitansi Titip Uang";
        setToast({
          show: true,
          type: "error",
          message: `SOP Lepas Kunci: Wajib mengunggah bukti fisik jaminan (${labelJaminan})!`,
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        odometer: odometer.replace(/[^0-9]/g, ""),
        fuel_level: fuelLevel,
        condition_notes: conditionNotes,
        checklist,
        service_type: currentServiceType,
        // Data Dokumen Persyaratan
        ktp_number: ktpNumber,
        ktp_photo: ktpPhoto,
        sim_number: simNumber,
        sim_photo: simPhoto,
        kk_status: kkStatus,
        kk_photo: kkStatus === "ada" ? kkPhoto : null,
        npwp_status: npwpStatus,
        npwp_photo: npwpStatus === "ada" ? npwpPhoto : null,
        id_card_status: idCardStatus,
        id_card_photo: idCardStatus === "ada" ? idCardPhoto : null,
        social_media: socialMedia,
        emergency_family_name: emergencyFamilyName,
        emergency_family_phone: emergencyFamilyPhone,
        emergency_peer_name: emergencyPeerName,
        emergency_peer_phone: emergencyPeerPhone,
        // Data Jaminan Sewa (Hanya jika lepas kunci)
        guarantee_type: guaranteeType,
        guarantee_motor_info: guaranteeType === "motor" ? guaranteeMotorInfo : null,
        guarantee_deposit_amount: guaranteeType === "deposit" ? Number(guaranteeDepositAmount.replace(/[^0-9]/g, "")) : null,
        guarantee_photo: guaranteePhoto,
      };

      await api.post(`/admin/departures/${bookingId}/checkout`, payload);

      setToast({
        show: true,
        type: "success",
        message: `SOP ${currentServiceType} Berhasil! Serah terima dicatat dan unit resmi berstatus Disewa (Ongoing).`,
      });

      // Refresh data
      await refetch();
      qc.invalidateQueries({ queryKey: ["admin", "departures"] });
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
    } catch (err: unknown) {
      const errMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal memproses serah terima kendaraan.";
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

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6 relative">
      {/* ================= MODAL PREVIEW FOTO FULL-SCREEN ================= */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPreviewImageModal(null)}>
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-sm text-slate-900">{previewImageModal.title}</h4>
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center max-h-[75vh]">
              <img
                src={previewImageModal.url}
                alt={previewImageModal.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

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
              SOP Serah Terima Keberangkatan
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

      {/* ================= TAB PEMILIH / INDIKATOR KATEGORI LAYANAN ================= */}
      <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 px-3 hidden sm:inline">Kategori Layanan:</span>
        {[
          { key: "Lepas Kunci", icon: "key", label: "🔑 Sewa Lepas Kunci (Wajib Upload Dokumen & Jaminan)" },
          { key: "Dengan Driver", icon: "person_pin", label: "👨‍✈️ Dengan Driver (Include Supir Caruhun)" },
          { key: "Drop-off Bandara", icon: "flight_takeoff", label: "✈️ Drop-off Bandara (Charter Khusus)" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            disabled={isOngoingOrCompleted}
            onClick={() => setCurrentServiceType(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              currentServiceType === tab.key
                ? tab.key === "Lepas Kunci"
                  ? "bg-amber-600 text-white shadow-xs"
                  : tab.key === "Drop-off Bandara"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-sky-600 text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
            }`}>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= MAIN 2-COLUMN DESKTOP LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (8 Kolom): FORM SESUAI KATEGORI LAYANAN */}
        <div className="lg:col-span-8 space-y-6">

          {/* ================= KASUS 1: FORM KHUSUS LEPAS KUNCI ================= */}
          {currentServiceType === "Lepas Kunci" && (
            <>
              {/* Bagian 1: Dokumen Persyaratan (Wajib Upload) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">badge</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">1. Dokumen Persyaratan Lepas Kunci</h3>
                      <p className="text-xs text-slate-500">Wajib upload bukti foto identitas asli sesuai SOP Caruhun Trans</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg font-bold text-xs bg-amber-50 text-amber-700 border border-amber-200">
                    SOP Ketat
                  </span>
                </div>

                {/* Grid KTP & SIM A */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* KTP */}
                  <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-600 text-[18px]">assignment_ind</span>
                        <span>KTP Asli Penyewa</span>
                        <span className="text-rose-500">*Wajib</span>
                      </label>
                      {ktpPhoto ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">✓ Terunggah</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">Belum Upload</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500">Nomor Induk Kependudukan (NIK)</span>
                      <input
                        type="text"
                        disabled={isOngoingOrCompleted}
                        value={ktpNumber}
                        onChange={(e) => setKtpNumber(e.target.value)}
                        placeholder="327xxxxxxxxxxxxx"
                        className="w-full h-9 px-3 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 disabled:bg-slate-100"
                      />
                    </div>

                    {ktpPhoto ? (
                      <div className="relative rounded-xl overflow-hidden border border-emerald-300 aspect-video bg-slate-900 group">
                        <img src={ktpPhoto} alt="Foto KTP" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewImageModal({ url: ktpPhoto, title: "Foto KTP Asli Penyewa" })}
                            className="px-2.5 py-1.5 bg-white text-slate-900 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                            <span className="material-symbols-outlined text-[14px]">visibility</span> Lihat
                          </button>
                          {!isOngoingOrCompleted && (
                            <label className="px-2.5 py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                              <span className="material-symbols-outlined text-[14px]">sync</span> Ganti
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setKtpPhoto)} />
                            </label>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50/70 rounded-xl aspect-video flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all">
                        <span className="material-symbols-outlined text-amber-600 text-3xl mb-1">add_a_photo</span>
                        <span className="text-xs font-bold text-slate-800">Upload Foto KTP Asli</span>
                        <input type="file" accept="image/*" disabled={isOngoingOrCompleted} className="hidden" onChange={(e) => handleFileUpload(e, setKtpPhoto)} />
                      </label>
                    )}
                  </div>

                  {/* SIM A */}
                  <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-600 text-[18px]">drive_eta</span>
                        <span>SIM A Aktif</span>
                        <span className="text-rose-500">*Wajib</span>
                      </label>
                      {simPhoto ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">✓ Terunggah</span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">Belum Upload</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500">Nomor SIM A</span>
                      <input
                        type="text"
                        disabled={isOngoingOrCompleted}
                        value={simNumber}
                        onChange={(e) => setSimNumber(e.target.value)}
                        placeholder="1234-5678-901234"
                        className="w-full h-9 px-3 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 disabled:bg-slate-100"
                      />
                    </div>

                    {simPhoto ? (
                      <div className="relative rounded-xl overflow-hidden border border-emerald-300 aspect-video bg-slate-900 group">
                        <img src={simPhoto} alt="Foto SIM A" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewImageModal({ url: simPhoto, title: "Foto SIM A Aktif Penyewa" })}
                            className="px-2.5 py-1.5 bg-white text-slate-900 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                            <span className="material-symbols-outlined text-[14px]">visibility</span> Lihat
                          </button>
                          {!isOngoingOrCompleted && (
                            <label className="px-2.5 py-1.5 bg-amber-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer">
                              <span className="material-symbols-outlined text-[14px]">sync</span> Ganti
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setSimPhoto)} />
                            </label>
                          )}
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50/70 rounded-xl aspect-video flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all">
                        <span className="material-symbols-outlined text-amber-600 text-3xl mb-1">add_a_photo</span>
                        <span className="text-xs font-bold text-slate-800">Upload Foto SIM A Aktif</span>
                        <input type="file" accept="image/*" disabled={isOngoingOrCompleted} className="hidden" onChange={(e) => handleFileUpload(e, setSimPhoto)} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Dokumen Pendukung & 2 WA Darurat */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">2 Kontak WhatsApp Darurat (Keluarga & Rekan)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500">1. Keluarga Kandung (Nama & WA)</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          disabled={isOngoingOrCompleted}
                          value={emergencyFamilyName}
                          onChange={(e) => setEmergencyFamilyName(e.target.value)}
                          placeholder="Nama Keluarga"
                          className="w-full h-9 px-2 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-900"
                        />
                        <input
                          type="text"
                          disabled={isOngoingOrCompleted}
                          value={emergencyFamilyPhone}
                          onChange={(e) => setEmergencyFamilyPhone(e.target.value)}
                          placeholder="081234567890"
                          className="w-full h-9 px-2 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500">2. Rekan / Teman (Nama & WA)</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          disabled={isOngoingOrCompleted}
                          value={emergencyPeerName}
                          onChange={(e) => setEmergencyPeerName(e.target.value)}
                          placeholder="Nama Rekan"
                          className="w-full h-9 px-2 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-900"
                        />
                        <input
                          type="text"
                          disabled={isOngoingOrCompleted}
                          value={emergencyPeerPhone}
                          onChange={(e) => setEmergencyPeerPhone(e.target.value)}
                          placeholder="089876543210"
                          className="w-full h-9 px-2 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Jaminan Lepas Kunci (Wajib Pilih Salah Satu) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-xl">shield</span>
                    <h3 className="font-bold text-base text-slate-900">2. Jaminan Wajib Sewa Lepas Kunci</h3>
                  </div>
                  {guaranteePhoto ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">✓ Bukti Jaminan Tersimpan</span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800">Wajib Upload Bukti</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => !isOngoingOrCompleted && setGuaranteeType("motor")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      guaranteeType === "motor" ? "bg-amber-50 border-amber-500 ring-1 ring-amber-500" : "bg-slate-50 border-slate-200"
                    }`}>
                    <span className="font-extrabold text-xs text-slate-900 block">Opsi A: Titip Motor + STNK Asli</span>
                    <span className="text-[11px] text-slate-500">Unit motor & STNK asli ditinggal di pool Caruhun</span>
                  </div>

                  <div
                    onClick={() => !isOngoingOrCompleted && setGuaranteeType("deposit")}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      guaranteeType === "deposit" ? "bg-amber-50 border-amber-500 ring-1 ring-amber-500" : "bg-slate-50 border-slate-200"
                    }`}>
                    <span className="font-extrabold text-xs text-slate-900 block">Opsi B: Deposit Uang (Mulai Rp 1.5jt)</span>
                    <span className="text-[11px] text-slate-500">Uang jaminan ditransfer/cash (dikembalikan saat unit aman)</span>
                  </div>
                </div>

                {/* Upload Bukti Jaminan */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  {guaranteeType === "motor" ? (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Rincian Motor (Merk, Tipe & Plat)</span>
                      <input
                        type="text"
                        disabled={isOngoingOrCompleted}
                        value={guaranteeMotorInfo}
                        onChange={(e) => setGuaranteeMotorInfo(e.target.value)}
                        placeholder="Contoh: Honda Vario 160 (D 4421 ABC) + STNK"
                        className="w-full h-9 px-3 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-900"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 block">Nominal Uang Jaminan (Rp)</span>
                      <input
                        type="text"
                        disabled={isOngoingOrCompleted}
                        value={guaranteeDepositAmount}
                        onChange={(e) => setGuaranteeDepositAmount(e.target.value)}
                        placeholder="1.500.000"
                        className="w-full h-9 px-3 bg-white rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-900"
                      />
                    </div>
                  )}

                  {guaranteePhoto ? (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-300">
                      <img src={guaranteePhoto} alt="Bukti Jaminan" className="w-16 h-12 object-cover rounded-lg" />
                      <span className="text-xs font-bold text-emerald-800 flex-1">✓ Bukti Fisik Jaminan Tersimpan</span>
                      {!isOngoingOrCompleted && (
                        <label className="px-2.5 py-1 bg-amber-600 text-white text-xs font-bold rounded-lg cursor-pointer">
                          Ganti
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setGuaranteePhoto)} />
                        </label>
                      )}
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-amber-300 bg-white hover:bg-amber-50 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer text-xs font-bold text-amber-900">
                      <span className="material-symbols-outlined text-[20px] text-amber-600">add_a_photo</span>
                      Upload Foto Fisik Motor + STNK / Bukti Transfer Deposit
                      <input type="file" accept="image/*" disabled={isOngoingOrCompleted} className="hidden" onChange={(e) => handleFileUpload(e, setGuaranteePhoto)} />
                    </label>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ================= KASUS 2: FORM KHUSUS DENGAN DRIVER ================= */}
          {currentServiceType === "Dengan Driver" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-600 text-2xl">person_pin</span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Data Penjemputan & Pengemudi Caruhun</h3>
                    <p className="text-xs text-slate-500">Layanan include supir &bull; Bebas jaminan motor/deposit Rp 1.5jt</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg font-bold text-xs bg-sky-50 text-sky-800 border border-sky-200">
                  Include Driver
                </span>
              </div>

              <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-200 text-xs text-sky-900 flex items-start gap-3">
                <span className="material-symbols-outlined text-sky-600 text-[20px] shrink-0 mt-0.5">verified_user</span>
                <div>
                  <strong className="block font-bold mb-0.5">Bebas Jaminan Kendaraan / Uang Titip</strong>
                  Karena armada dikemudikan oleh driver resmi Caruhun Trans, penyewa tidak diwajibkan menitipkan motor atau uang deposit. Cukup konfirmasi data penjemputan dan ceklis kondisi mobil.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Supir / Driver yang Bertugas</span>
                  <input
                    type="text"
                    disabled={isOngoingOrCompleted}
                    value={driverStaffName}
                    onChange={(e) => setDriverStaffName(e.target.value)}
                    className="w-full h-9 px-2.5 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    disabled={isOngoingOrCompleted}
                    value={driverStaffPhone}
                    onChange={(e) => setDriverStaffPhone(e.target.value)}
                    className="w-full h-8 px-2.5 bg-white rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 mt-1"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Titik Alamat Penjemputan Tamu</span>
                  <textarea
                    rows={2}
                    disabled={isOngoingOrCompleted}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= KASUS 3: FORM KHUSUS DROP-OFF BANDARA ================= */}
          {currentServiceType === "Drop-off Bandara" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600 text-2xl">flight_takeoff</span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Data Transfer / Antar Jemput Bandara</h3>
                    <p className="text-xs text-slate-500">Layanan point-to-point khusus penerbangan &bull; Bebas jaminan</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg font-bold text-xs bg-indigo-50 text-indigo-800 border border-indigo-200">
                  Charter Bandara
                </span>
              </div>

              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 text-xs text-indigo-900 flex items-start gap-3">
                <span className="material-symbols-outlined text-indigo-600 text-[20px] shrink-0 mt-0.5">flight</span>
                <div>
                  <strong className="block font-bold mb-0.5">Layanan Khusus Charter Bandara</strong>
                  Penjemputan disesuaikan dengan jadwal take-off / landing pesawat tamu. Tidak memerlukan jaminan fisik motor atau deposit uang.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Tujuan Bandara & Terminal</span>
                  <input
                    type="text"
                    disabled={isOngoingOrCompleted}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Contoh: Bandara Soekarno-Hatta Terminal 3"
                    className="w-full h-9 px-2.5 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">Jadwal & No. Penerbangan (Opsional)</span>
                  <input
                    type="text"
                    disabled={isOngoingOrCompleted}
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="Contoh: GA-402 (Flight 14:30 WIB)"
                    className="w-full h-9 px-2.5 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= BAGIAN UMUM: CHECKLIST FISIK & TEKNIS ARMADA ================= */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Checklist Fisik & BBM Armada Keluar Pool</h3>
                  <p className="text-xs text-slate-500">Pemeriksaan BBM, odometer awal, dan kelengkapan unit pool</p>
                </div>
              </div>
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
              </div>
            </div>

            {/* Checkboxes Kelengkapan */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Kelengkapan Fisik Mobil
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: "bodi", label: "Bodi Bersih & Interior Bebas Bau", icon: "cleaning_services" },
                  { key: "ban", label: "Ban Utama & Ban Cadangan Layak", icon: "tire_repair" },
                  { key: "stnk", label: "STNK Asli Mobil di Glovebox", icon: "description" },
                  { key: "toolkit", label: "Tool Kit & Dongkrak Lengkap", icon: "handyman" },
                  { key: "kunci", label: "Kunci Kontak & Remote Cadangan", icon: "key" },
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

            {/* Catatan Baret Awal */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">edit_note</span>
                Catatan Kondisi Awal / Cacat Bodi Sebelum Keluar
              </label>
              <textarea
                rows={2}
                disabled={isOngoingOrCompleted}
                value={conditionNotes}
                onChange={(e) => setConditionNotes(e.target.value)}
                placeholder="Tuliskan jika ada baret halus, lecet, atau cacat bawaan..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 disabled:bg-slate-100 transition-all"
              />
            </div>
          </div>

          {/* ================= BAGIAN UMUM: DOKUMENTASI VISUAL (VIDEO 360 & FOTO) ================= */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">photo_camera</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Dokumentasi Visual Mobil (Video 360° & Foto)</h3>
                  <p className="text-xs text-slate-500">Tercap otomatis watermark waktu, jam & GPS saat serah terima</p>
                </div>
              </div>
            </div>

            {/* Video 360 Putaran Penuh */}
            <div
              onClick={() => !isOngoingOrCompleted && setPhotosCompleted((p) => ({ ...p, video360: !p.video360 }))}
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
                    <span>Rekaman Video 360° Keliling Mobil</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">Wajib SOP</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Merekam kondisi keliling mobil satu putaran penuh sebelum kunci diserahkan.
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

            {/* Grid 5 Sudut Foto */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {[
                { key: "depan", label: "Depan & Plat" },
                { key: "belakang", label: "Belakang Bumper" },
                { key: "kiri", label: "Samping Kiri" },
                { key: "kanan", label: "Samping Kanan" },
                { key: "speedometer", label: "Speedometer & BBM" },
              ].map((side) => {
                const isDone = photosCompleted[side.key];
                return (
                  <div
                    key={side.key}
                    onClick={() => !isOngoingOrCompleted && setPhotosCompleted((p) => ({ ...p, [side.key]: !p[side.key] }))}
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

        {/* KOLOM KANAN (RINGKASAN UNIT, PENYEWA & TANDA TANGAN SERAH TERIMA) - 4 Kolom */}
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
              <div>Durasi Sewa: <strong className="text-slate-900">{booking.duration}</strong></div>
              <div>
                Jenis Layanan:{" "}
                <strong className="text-slate-900">
                  {currentServiceType === "Lepas Kunci"
                    ? "🔑 Lepas Kunci (Self-Drive)"
                    : currentServiceType === "Drop-off Bandara"
                    ? "✈️ Drop-off Bandara"
                    : "👨‍✈️ Dengan Driver"}
                </strong>
              </div>
              <div>Transmisi: <strong className="text-slate-900">{booking.vehicle.transmission}</strong></div>
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
                <span>NIK: <strong className="text-slate-700 font-mono">{ktpNumber || booking.customer.nik || "-"}</strong></span>
                <span>Alamat: <span className="text-slate-700">{booking.customer.address || "Sesuai KTP"}</span></span>
              </div>
            </div>
          </div>

          {/* Konfirmasi Tanda Tangan & Tombol Eksekusi Serah Terima */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Konfirmasi & Serah Terima
            </span>

            {/* Kotak Tanda Tangan Digital */}
            <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative p-2">
              <p className="text-[10px] text-slate-400 italic">Tanda Tangan Digital Berita Acara</p>
              <div className="font-serif text-slate-800 font-bold tracking-widest text-base opacity-80 select-none mt-1">
                {booking.customer.name}
              </div>
              <span className="absolute bottom-1.5 right-2 text-[9px] text-slate-400 font-mono">
                {booking.handover?.handedAt || "Verifikasi Lapangan Caruhun"}
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
                Pihak Caruhun Trans dan Penyewa telah memverifikasi seluruh klausul pelepasan unit sesuai kategori layanan <strong>{currentServiceType}</strong>.
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
                <span>{isSubmitting ? "Menyimpan Data..." : `Validasi & Serahkan (${currentServiceType})`}</span>
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
          <div className="h-96 bg-white rounded-2xl border border-slate-200" />
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
