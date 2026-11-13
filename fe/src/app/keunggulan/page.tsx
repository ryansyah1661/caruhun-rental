"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const KEUNGGULAN_UTAMA = [
  {
    icon: "verified",
    title: "Armada Prima & Inspeksi Ketat",
    description:
      "Setiap unit melewati daftar periksa (checklist) kelayakan fisik, mesin, dan kebersihan kabin sebelum diserahkan kepada penyewa.",
    highlight: "Standar Keamanan Tinggi",
  },
  {
    icon: "build_circle",
    title: "Perawatan Berkala Terjadwal",
    description:
      "Servis rutin di bengkel resmi, pengecekan ban, oli, dan pajak kendaraan selalu terpantau tepat waktu untuk mencegah kendala di jalan.",
    highlight: "Zero Mogok",
  },
  {
    icon: "key",
    title: "Opsi Paket Sewa Fleksibel",
    description:
      "Tersedia layanan Lepas Kunci (LK) untuk privasi penuh, Paket Dengan Driver berpengalaman, hingga Antar-Jemput Bandara yang akurat.",
    highlight: "LK / Driver / Bandara",
  },
  {
    icon: "receipt_long",
    title: "Tarif Transparan & Nota Resmi",
    description:
      "Tidak ada biaya tersembunyi. Setiap transaksi dilengkapi rincian tarif jelas, invoice, dan nota resmi siap cetak atau kirim digital.",
    highlight: "Cocok untuk Dinas & Korporasi",
  },
  {
    icon: "support_agent",
    title: "Dukungan Operasional 24/7",
    description:
      "Tim admin dan staf lapangan siap merespons kebutuhan reservasi, perubahan jadwal, maupun bantuan darurat kapan pun dibutuhkan.",
    highlight: "Fast Response via WA",
  },
  {
    icon: "satellite_alt",
    title: "Monitoring Armada Terintegrasi",
    description:
      "Seluruh kendaraan dilengkapi sistem pemantauan GPS dan manajemen jadwal terpadu sehingga ketersediaan unit terjamin tanpa bentrok.",
    highlight: "Anti Bentrok Jadwal",
  },
];

const PERBANDINGAN_LAYANAN = [
  {
    aspek: "Kondisi & Kebersihan Mobil",
    caruhun: "Checklist wajib & cuci bersih sebelum serah terima",
    biasa: "Sering diserahkan apa adanya",
  },
  {
    aspek: "Kepastian Jadwal Booking",
    caruhun: "Sistem anti-bentrok jadwal otomatis & terdata",
    biasa: "Pencatatan manual, rawan double booking",
  },
  {
    aspek: "Transparansi Harga & Denda",
    caruhun: "Rincian tarif & hitungan selisih waktu jelas sejak awal",
    biasa: "Biaya tambahan sering tidak jelas di awal",
  },
  {
    aspek: "Dokumen & Administrasi",
    caruhun: "Invoice & nota resmi digital/cetak tersedia",
    biasa: "Kwitansi tulis tangan sederhana",
  },
  {
    aspek: "Keamanan & Pemantauan",
    caruhun: "Terpantau GPS aktif & dukungan tim lapangan 24 jam",
    biasa: "Respon lambat saat terjadi kendala di rute",
  },
];

const HOW_TO_RENT_STEPS = [
  {
    step: "1",
    title: "Pilih Tanggal & Unit",
    desc: "Atur tanggal mulai, jam ambil, dan durasi sewa untuk mengecek unit yang kosong beserta estimasi biayanya.",
  },
  {
    step: "2",
    title: "Kirim Pesanan via WA",
    desc: "Klik tombol Pesan Unit pada mobil pilihanmu. Format detail pesanan otomatis disiapkan menuju WhatsApp Admin.",
  },
  {
    step: "3",
    title: "Verifikasi Dokumen",
    desc: "Untuk paket Lepas Kunci, kirim foto KTP & SIM A aktif. Cukup sekali verifikasi untuk penyewaan berikutnya.",
  },
  {
    step: "4",
    title: "Konfirmasi & Invoice",
    desc: "Admin mengunci jadwal armada dan menerbitkan invoice resmi sesuai jadwal penjemputan atau ambil di pool.",
  },
  {
    step: "5",
    title: "Serah Terima Unit",
    desc: "Cek fisik & indikator BBM bersama petugas kami sebelum serah terima kunci. Mobil siap menemani perjalananmu.",
  },
];

export default function KeunggulanPage() {
  const handleContactWhatsApp = () => {
    const adminPhoneNumber = "6281234567890";
    const msg =
      "Halo Admin Caruhun Rental, saya tertarik dengan layanan sewa armada Caruhun. Mohon informasi ketersediaan unit.";
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
            Mengapa Memilih Caruhun
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Standar Layanan Profesional <br />
            <span className="text-amber-600">Untuk Kenyamanan Perjalanan Anda</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Kami menggabungkan kualitas armada yang selalu prima dengan sistem manajemen operasional modern untuk
            memberikan pengalaman sewa kendaraan tanpa rasa khawatir.
          </p>
        </div>
      </section>

      {/* ================= 6 PILAR KEUNGGULAN ================= */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">NILAI LEBIH KAMI</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              6 Alasan Pelanggan Mempercayai Caruhun
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {KEUNGGULAN_UTAMA.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wide">
                      {item.highlight}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TABEL PERBANDINGAN STANDAR ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">PERBANDINGAN KUALITAS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Caruhun vs Rental Konvensional</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Komitmen kami menghadirkan kepastian jadwal dan keamanan kendaraan di setiap transaksi.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-5 py-4 font-bold">Aspek Layanan</th>
                  <th className="px-5 py-4 font-bold text-amber-400">Caruhun Rental Armada</th>
                  <th className="px-5 py-4 font-semibold text-slate-400">Rental Konvensional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {PERBANDINGAN_LAYANAN.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">{row.aspek}</td>
                    <td className="px-5 py-4 text-emerald-700 font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">
                          check_circle
                        </span>
                        <span>{row.caruhun}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{row.biasa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= CARA SEWA / TUTORIAL PEMESANAN (SAMA DENGAN BERANDA) ================= */}
      <section id="cara-sewa" className="py-16 bg-slate-100 border-b border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">PANDUAN PEMESANAN</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Cara Sewa di Caruhun</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Ikuti 5 langkah mudah berikut untuk memesan armada sesuai kebutuhan perjalanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {HOW_TO_RENT_STEPS.map((item, idx) => (
              <div key={item.step} className="relative flex flex-col space-y-3">
                {/* Garis Penghubung Horizontal Desktop */}
                {idx < HOW_TO_RENT_STEPS.length - 1 && (
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

      {/* ================= CTA SECTION ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Rasakan Pengalaman Sewa Mobil yang Lebih Aman</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Pilih unit favorit Anda sekarang atau konsultasikan kebutuhan perjalanan dinas dan keluarga langsung
              dengan tim admin kami.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/#katalog"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all active:scale-95">
                Jelajahi Katalog Mobil
              </Link>
              <button
                type="button"
                onClick={handleContactWhatsApp}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Tanya Admin via WA</span>
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
