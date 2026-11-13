"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TentangPage() {
  const handleContactWhatsApp = () => {
    const adminPhoneNumber = "6281234567890";
    const msg = "Halo Admin Caruhun Rental, saya ingin mengetahui informasi lebih lanjut mengenai layanan sewa armada.";
    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body-md text-slate-900 antialiased">
      {/* Panggil Component Navbar */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="bg-white pt-32 sm:pt-36 pb-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            Tentang Caruhun Rental Armada
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Mitra Perjalanan Resmi, Aman, <br />
            <span className="text-amber-600">& Terpercaya Untuk Setiap Kebutuhan</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Hadir dengan standar armada terawat dan sistem manajemen operasional terpadu untuk memastikan kenyamanan
            mobilitas pribadi, keluarga, maupun korporasi Anda.
          </p>
        </div>
      </section>

      {/* ================= PROFIL & CERITA KAMI ================= */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Gambar */}
            <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
                alt="Armada Caruhun Rental"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Konten Teks */}
            <div className="space-y-5">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">SIAPA KAMI</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Mengutamakan Kualitas Armada & Ketepatan Layanan
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                <strong>Caruhun Rental Armada</strong> didirikan dengan komitmen menjawab kebutuhan transportasi yang
                transparan, mudah diakses, dan dapat diandalkan. Kami memahami bahwa keamanan di jalan dimulai dari
                kondisi kendaraan yang prima.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Oleh karena itu, setiap unit kendaraan yang kami sewakan—mulai dari City Car, MPV keluarga, SUV tangguh,
                hingga Minibus rombongan—selalu melewati daftar periksa (checklist) kelayakan sebelum keberangkatan dan
                perawatan berkala yang terjadwal.
              </p>

              {/* Statistik Singkat */}
              <div className="grid grid-cols-3 gap-4 pt-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl sm:text-2xl font-extrabold text-slate-900">65+</span>
                  <span className="text-[11px] text-slate-500 font-medium">Unit Armada</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl sm:text-2xl font-extrabold text-amber-600">24/7</span>
                  <span className="text-[11px] text-slate-500 font-medium">Dukungan CS</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="block text-xl sm:text-2xl font-extrabold text-emerald-600">99.8%</span>
                  <span className="text-[11px] text-slate-500 font-medium">Kepuasan Klien</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISI & MISI ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kartu Visi */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">visibility</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Visi Kami</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Menjadi penyedia layanan penyewaan kendaraan paling tepercaya dan berstandar profesional tinggi yang
                memberikan ketenangan serta kenyamanan di setiap perjalanan pelanggan.
              </p>
            </div>

            {/* Kartu Misi */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">flag</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Misi Kami</h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Menyediakan armada bersih, wangi, dan terawat secara teknis melalui inspeksi rutin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>
                    Memberikan kemudahan proses pemesanan, transparansi tarif, serta dokumen administrasi resmi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>Menghadirkan pengemudi ramah, berpengalaman, dan menguasai rute perjalanan.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LAYANAN UTAMA CARUHUN ================= */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">LAYANAN KAMI</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Pilihan Paket Sewa Fleksibel</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sesuaikan kebutuhan perjalanan Anda dengan tiga opsi layanan utama dari Caruhun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Layanan 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">key</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900">Sewa Lepas Kunci</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Nikmati privasi dan kebebasan mengatur jadwal perjalanan Anda sendiri dengan persyaratan verifikasi yang
                mudah dan cepat.
              </p>
            </div>

            {/* Layanan 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">airline_seat_recline_normal</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900">Sewa Dengan Driver</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Perjalanan bisnis maupun wisata keluarga jadi lebih santai bersama tim pengemudi kami yang profesional,
                rapi, dan tepat waktu.
              </p>
            </div>

            {/* Layanan 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
              </div>
              <h3 className="font-bold text-lg text-slate-900">Antar-Jemput Bandara</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Layanan drop-off dan pick-up bandara yang terjadwal akurat agar Anda tidak perlu khawatir tertinggal
                penerbangan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Siap Merencanakan Perjalanan Anda?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Cek ketersediaan armada kami sekarang atau hubungi admin melalui WhatsApp untuk konsultasi jadwal dan
              penawaran harga terbaik.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/katalog"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all active:scale-95">
                Lihat Katalog Armada
              </Link>
              <button
                type="button"
                onClick={handleContactWhatsApp}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Hubungi Admin via WA</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Panggil Component Footer */}
      <Footer />
    </div>
  );
}
