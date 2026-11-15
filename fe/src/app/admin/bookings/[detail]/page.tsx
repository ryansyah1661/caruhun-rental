"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id || "1";

  // State untuk status pembayaran / simulasi aksi
  const [paymentStatus, setPaymentStatus] = useState<string>("Lunas");

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header Navigasi & Judul */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Link href="/admin/bookings" className="hover:text-slate-700">
              Booking & Jadwal
            </Link>{" "}
            &rsaquo;
            <span>Detail Transaksi</span> &rsaquo;
            <span className="text-slate-800 font-bold font-mono">#CRH-2410-091</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Rincian Pesanan Sewa</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              Disewa
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Informasi lengkap data penyewa, armada, jadwal sewa, serta status administrasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Kembali</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Cetak Invoice</span>
          </button>
        </div>
      </div>

      {/* Grid Konten Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri & Tengah: Info Utama (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informasi Unit & Paket */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">directions_car</span>
              Informasi Armada & Paket Sewa
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Unit Kendaraan</span>
                <div className="font-extrabold text-slate-900 text-sm">Toyota Avanza 1.5 G</div>
                <div className="font-mono text-xs font-bold text-slate-600">Plat Nomor: B 1482 KFD</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Jenis Layanan</span>
                <div className="font-extrabold text-slate-900 text-sm">Sewa Lepas Kunci</div>
                <div className="text-slate-600 font-medium">Durasi: 2 Hari Penuh (48 Jam)</div>
              </div>
            </div>

            {/* Timeline Jadwal */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Jadwal Operasional Sewa</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Mulai (Pick-up):</span>
                  <strong className="text-slate-900 text-sm">24 Okt 2026 • 09:00 WIB</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Selesai (Drop-off):</span>
                  <strong className="text-slate-900 text-sm">26 Okt 2026 • 09:00 WIB</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Data Penyewa & Verifikasi Identitas */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">person</span>
              Identitas Penyewa & Validasi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Nama Lengkap</span>
                <div className="font-bold text-slate-900 text-sm">PT Surya Logistik</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Kontak WhatsApp</span>
                <div className="font-mono font-bold text-slate-900 text-sm">0812-3456-7890</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">NIK KTP / SIM</span>
                <div className="font-mono font-bold text-slate-900 text-sm">32710482910002</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">verified</span> KTP Asli Terverifikasi
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">badge</span> SIM A Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan Pembayaran & Aksi Cepat (1 Kolom) */}
        <div className="space-y-6">
          {/* Card Pembayaran */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">payments</span>
              Rincian Biaya & Pembayaran
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Biaya Sewa (2 Hari):</span>
                <span className="font-bold text-slate-900 font-mono">Rp 700.000</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biaya Driver / Tambahan:</span>
                <span className="font-bold text-slate-900 font-mono">Rp 0</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                <span>Deposit Jaminan:</span>
                <span className="font-bold text-slate-900 font-mono">Rp 100.000</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-1">
                <span>Total Tagihan:</span>
                <span className="font-mono text-amber-700">Rp 800.000</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                <span>Status Pembayaran</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">LUNAS</span>
              </div>
            </div>
          </div>

          {/* Panel Aksi Cepat */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-3">
            <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Aksi Cepat Admin</h2>

            <Link
              href="/admin/pemeriksaan-kendaraan/keluar"
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center">
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Proses Serah Terima (Check-out)</span>
            </Link>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
              Ubah Jadwal / Edit Booking
            </button>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Hubungi Penyewa via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
