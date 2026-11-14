"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateBookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi proses simpan API
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin");
    }, 1000);
  }

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
          href="/admin"
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
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Pilih Unit Kendaraan Tersedia</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all">
                <option value="">-- Pilih Armada --</option>
                <option value="avanza">Toyota Avanza 1.5 G (B 1482 KFD)</option>
                <option value="zenix">Toyota Innova Zenix 2.0 V (B 2884 SSR)</option>
                <option value="brio">Honda Brio RS (D 2091 AGH)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Jenis Layanan / Paket</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all">
                <option value="lepas-kunci">Sewa Lepas Kunci</option>
                <option value="dengan-driver">Sewa Dengan Driver</option>
                <option value="bandara">Drop-off / Antar Jemput Bandara</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Durasi Sewa</label>
              <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all">
                <option value="1">1 Hari (24 Jam)</option>
                <option value="2">2 Hari</option>
                <option value="3">3 Hari</option>
                <option value="custom">Kustom / Mingguan</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Tanggal & Jam Mulai</label>
              <input
                type="datetime-local"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Tanggal & Jam Selesai</label>
              <input
                type="datetime-local"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
              />
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
            href="/admin"
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
