"use client";

import React, { useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/CustomSelect";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CORPORATE_PARTNERS = [
  {
    name: "PT Surya Logistik",
    sector: "Logistik & Distribusi",
    cooperation: "Sewa Operasional Bulanan (MPV & Niaga)",
    since: "2023",
  },
  {
    name: "Mandiri Travel",
    sector: "Biro Perjalanan & Wisata",
    cooperation: "Dukungan Armada HiAce & Pariwisata",
    since: "2022",
  },
  {
    name: "Auto2000 Cilandak",
    sector: "Otomotif & Bengkel Resmi",
    cooperation: "Mitra Perawatan Berkala & Suku Cadang",
    since: "2021",
  },
  {
    name: "PT Indonesia Maju",
    sector: "Kontraktor & Infrastruktur",
    cooperation: "Kontrak Kendaraan Proyek & Dinas Lapangan",
    since: "2024",
  },
  {
    name: "Nusantara Event Organizer",
    sector: "MICE & Event Korporat",
    cooperation: "Drop-off VIP, Tamu Negara & Crew",
    since: "2023",
  },
  {
    name: "Klinik Sehat Sentosa",
    sector: "Layanan Kesehatan",
    cooperation: "Transportasi Operasional Tim Medis",
    since: "2024",
  },
];

const PARTNERSHIP_MODELS = [
  {
    icon: "corporate_fare",
    badge: "B2B & Instansi",
    title: "Kontrak Sewa Korporat",
    description:
      "Penyediaan armada jangka pendek maupun kontrak bulanan/tahunan untuk operasional perusahaan, kunjungan dinas, dan antar-jemput karyawan.",
    benefits: [
      "Skema pembayaran termin & invoice resmi perusahaan",
      "Unit pengganti (backup) siap sedia jika terjadi servis",
      "Prioritas ketersediaan armada saat peak season",
    ],
  },
  {
    icon: "handshake",
    badge: "Bagi Hasil",
    title: "Titip Unit / Kemitraan Armada",
    description:
      "Program pengelolaan kendaraan milik perorangan atau investor ke dalam sistem operasional Caruhun dengan pelaporan jadwal yang transparan.",
    benefits: [
      "Penyewa terverifikasi ketat (KTP, SIM A & BI Checking)",
      "Unit terpantau GPS 24 jam & jadwal terdata rapi",
      "Laporan pendapatan & riwayat perawatan berkala",
    ],
  },
  {
    icon: "flight_takeoff",
    badge: "Hospitality & Travel",
    title: "Mitra Hotel, Tour & EO",
    description:
      "Kolaborasi penyediaan transportasi tamu hotel, peserta seminar, maupun paket wisata rombongan dengan tarif khusus mitra.",
    benefits: [
      "Komisi/rate khusus rekanan biro perjalanan & hotel",
      "Driver berpengalaman, rapi, dan paham rute wisata",
      "Koordinasi jadwal penjemputan bandara tepat waktu",
    ],
  },
];

const PARTNER_STEPS = [
  {
    step: "1",
    title: "Ajukan Profil Kemitraan",
    desc: "Isi formulir singkat di bawah atau hubungi tim B2B kami untuk menyampaikan kebutuhan armada atau unit yang ingin dititipkan.",
  },
  {
    step: "2",
    title: "Diskusi Skema & Penawaran",
    desc: "Tim kami menyusun penawaran tarif korporat atau simulasi bagi hasil sesuai jenis unit dan durasi kontrak.",
  },
  {
    step: "3",
    title: "Verifikasi & Inspeksi",
    desc: "Pengecekan legalitas perusahaan/dokumen kendaraan serta inspeksi fisik unit untuk memastikan standar kelayakan.",
  },
  {
    step: "4",
    title: "Penandatanganan MOU",
    desc: "Kesepakatan kerja sama dituangkan dalam kontrak resmi demi keamanan dan kejelasan hak kedua belah pihak.",
  },
  {
    step: "5",
    title: "Operasional Berjalan",
    desc: "Armada siap beroperasi penuh dengan dukungan admin 24/7, perawatan terjadwal, dan pelaporan berkala.",
  },
];

const PARTNERSHIP_OPTIONS = [
  { value: "Kontrak Sewa Korporat", label: "Kontrak Sewa Korporat" },
  { value: "Titip Unit / Bagi Hasil", label: "Titip Unit / Bagi Hasil" },
  { value: "Mitra Hotel, Tour & EO", label: "Mitra Hotel, Tour & EO" },
  { value: "Vendor Bengkel / Suku Cadang", label: "Vendor Bengkel / Suku Cadang" },
];

export default function PartnerPage() {
  const [companyName, setCompanyName] = useState("");
  const [picName, setPicName] = useState("");
  const [partnershipType, setPartnershipType] = useState("Kontrak Sewa Korporat");
  const [notes, setNotes] = useState("");

  const handleSubmitPartnership = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPhoneNumber = "6281234567890";
    const msg = `Halo Tim Kemitraan Caruhun Rental, saya ingin mengajukan kerja sama:

- *Nama Instansi / Pemilik:* ${companyName || "-"}
- *Nama PIC:* ${picName || "-"}
- *Jenis Kemitraan:* ${partnershipType}
- *Kebutuhan / Keterangan:* ${notes || "-"}

Mohon informasi jadwal diskusi lebih lanjut. Terima kasih.`;

    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body-md text-slate-900 antialiased">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="bg-white pt-32 sm:pt-36 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            Mitra & Relasi Bisnis
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tumbuh Bersama Caruhun <br />
            <span className="text-amber-600">Dalam Ekosistem Transportasi Andal</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Kami membuka peluang kerja sama strategis bagi perusahaan, instansi pemerintahan, biro perjalanan, maupun
            pemilik kendaraan untuk menghadirkan layanan mobilitas terbaik.
          </p>
        </div>
      </section>

      {/* ================= SKEMA KEMITRAAN ================= */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">PROGRAM KERJA SAMA</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Pilihan Skema Kemitraan</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PARTNERSHIP_MODELS.map((model, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">{model.icon}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">
                      {model.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{model.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{model.description}</p>
                </div>

                <ul className="space-y-2 pt-4 border-t border-slate-100">
                  {model.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DAFTAR PARTNER & PELANGGAN PERUSAHAAN ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">MITRA BERPENGALAMAN</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Partner & Pelanggan Perusahaan</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Telah dipercaya oleh berbagai instansi, bengkel resmi, dan perusahaan terkemuka.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CORPORATE_PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{partner.name}</h3>
                    <span className="text-xs font-semibold text-amber-700">{partner.sector}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-600 shrink-0">
                    Sejak {partner.since}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pt-2 border-t border-slate-200/70">{partner.cooperation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ALUR PENGAJUAN KEMITRAAN (5 LANGKAH SERAGAM) ================= */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">ALUR KERJA SAMA</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Cara Menjadi Partner Caruhun</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Proses pengajuan kemitraan yang ringkas, transparan, dan didukung kontrak resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {PARTNER_STEPS.map((item, idx) => (
              <div key={item.step} className="relative flex flex-col space-y-3">
                {idx < PARTNER_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-4 left-9 right-0 h-[2px] bg-slate-300 z-0" />
                )}

                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm relative z-10">
                  {item.step}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FORM PENGAJUAN KEMITRAAN ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                Formulir Kemitraan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">Tertarik Menjalin Kerja Sama?</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Lengkapi data singkat di samping untuk terhubung langsung dengan tim B2B & Kemitraan Caruhun via
                WhatsApp.
              </p>
              <div className="pt-2">
                <Link
                  href="/#katalog"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1">
                  <span>Lihat Daftar Armada Kami</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            <form
              onSubmit={handleSubmitPartnership}
              className="lg:col-span-7 bg-white text-slate-900 p-5 sm:p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Perusahaan / Instansi / Pemilik Unit
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Maju Bersama / Budi Santoso"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kontak (PIC)</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={picName}
                    onChange={(e) => setPicName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kerja Sama</label>
                  <CustomSelect
                    value={partnershipType}
                    onChange={(val) => setPartnershipType(val)}
                    options={PARTNERSHIP_OPTIONS}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kebutuhan / Detail Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Misal: Kebutuhan 3 unit Avanza untuk kontrak 6 bulan, atau ingin menitipkan Innova Zenix 2024..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Kirim Pengajuan via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
