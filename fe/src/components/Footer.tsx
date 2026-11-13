"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  const handleContactWhatsApp = () => {
    const adminPhoneNumber = "6281234567890";
    const msg = "Halo Admin Caruhun Rental, saya ingin berkonsultasi mengenai penyewaan armada.";
    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 font-body-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          {/* Kolom 1: Identitas Brand (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm">
                <img
                  src="/images/logo.png"
                  alt="Logo Caruhun"
                  className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-base text-white tracking-tight">Caruhun</span>
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-1">
                  Rental Armada
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm">
              Penyedia layanan sewa kendaraan MPV, SUV, City Car, hingga Minibus dengan perawatan berkala dan sistem
              penjadwalan transparan untuk perjalanan pribadi maupun dinas.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700/80 text-xs font-medium text-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Layanan Reservasi & Bantuan Darurat 24/7</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi Halaman (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Navigasi</h3>
            <ul className="space-y-2.5 text-xs font-medium text-stone-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/cari" className="hover:text-amber-400 transition-colors">
                  Cek Ketersediaan
                </Link>
              </li>
              <li>
                <Link href="/#tentang" className="hover:text-amber-400 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/keunggulan" className="hover:text-amber-400 transition-colors">
                  Keunggulan & Cara Sewa
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-amber-400 transition-colors">
                  Partner & Kemitraan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Paket Layanan (2 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Layanan</h3>
            <ul className="space-y-2.5 text-xs font-medium text-stone-400">
              <li>
                <Link href="/cari?paket=lepas-kunci" className="hover:text-amber-400 transition-colors">
                  Sewa Lepas Kunci
                </Link>
              </li>
              <li>
                <Link href="/cari?paket=dengan-driver" className="hover:text-amber-400 transition-colors">
                  Sewa Dengan Driver
                </Link>
              </li>
              <li>
                <Link href="/cari?paket=bandara" className="hover:text-amber-400 transition-colors">
                  Drop-off Bandara
                </Link>
              </li>
              <li>
                <Link href="/partner" className="hover:text-amber-400 transition-colors">
                  Kontrak Korporat
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Operasional (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">Pool & Kontak</h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-500 shrink-0 mt-0.5">
                  location_on
                </span>
                <span>Pool Utama Caruhun Armada, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-500 shrink-0">schedule</span>
                <span>Operasional Pool: 06.00 – 22.00 WIB</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-500 shrink-0">call</span>
                <span>+62 812-3456-7890</span>
              </li>
            </ul>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleContactWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Chat WhatsApp Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <p>&copy; {new Date().getFullYear()} Caruhun Rental Armada. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/keunggulan#cara-sewa" className="hover:text-stone-300 transition-colors">
              Syarat & Ketentuan Sewa
            </Link>
            <span>•</span>
            <Link href="/partner" className="hover:text-stone-300 transition-colors">
              Program Mitra
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
