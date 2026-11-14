"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ---------- Types ---------- */

type NavLink = {
  label: string;
  href: string;
};

/* ---------- Flag SVG Components ---------- */

const IndonesiaFlag = ({ className = "w-4 h-3" }: { className?: string }) => (
  <svg className={`rounded-2xs shadow-2xs shrink-0 ${className}`} viewBox="0 0 640 480">
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#e70011" d="M0 0h640v240H0z" />
      <path fill="#fff" d="M0 240h640v240H0z" />
    </g>
  </svg>
);

const UKFlag = ({ className = "w-4 h-3" }: { className?: string }) => (
  <svg className={`rounded-2xs shadow-2xs shrink-0 ${className}`} viewBox="0 0 640 480">
    <path fill="#012169" d="M0 0h640v480H0z" />
    <path fill="#fff" d="m75 0 245 180L565 0h75v60L395 240l245 180v60h-75L320 300 75 480H0v-60l245-180L0 60V0h75z" />
    <path
      fill="#C8102E"
      d="m424 261 216 159v60h-40L360 290l64-29zM216 219 0 60V0h40l240 190-64 29zM0 420l216-159 64 29L40 480H0v-60zm640-360L424 219l-64-29L599 0h41v60z"
    />
    <path fill="#fff" d="M240 0h160v480H240zM0 160h640v160H0z" />
    <path fill="#C8102E" d="M272 0h96v480h-96zM0 192h640v96H0z" />
  </svg>
);

/* ---------- Config Navigasi ---------- */

const navLinks: NavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang", href: "/tentang" },
  { label: "Katalog", href: "/katalog" },
  { label: "Tarif & Ongkir", href: "/tarif" },
  { label: "Keunggulan", href: "/keunggulan" },
  { label: "Partner", href: "/partner" },
];

/* ---------- Navbar Component ---------- */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [currentLang, setCurrentLang] = useState<"ID" | "EN">("ID");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) {
    return null;
  }

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/#katalog") {
      return (
        pathname === "/katalog" ||
        pathname?.startsWith("/katalog/") ||
        pathname === "/cari" ||
        pathname?.startsWith("/cari/")
      );
    }
    if (href.startsWith("/#") || href.startsWith("#")) return false;
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleContactWhatsApp = () => {
    const adminPhoneNumber = "6282112102262";
    const msg = "Halo Admin Caruhun Rental, saya ingin bertanya mengenai sewa armada kendaraan.";
    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      {/* ================= FLOATING NAVBAR ================= */}
      <header className="fixed top-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none">
        <nav className="w-full flex justify-center z-50 pt-3 sm:pt-4 px-4">
          <div
            className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible
              bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full
              w-[95%] h-16 sm:h-20 px-6 sm:px-8
              ${scrolled ? "max-w-4xl shadow-md border-slate-300" : "max-w-6xl shadow-sm"}`}>
            {/* Group Kiri (Logo + Navigasi) */}
            <div className="flex items-center gap-4 xl:gap-6 shrink-0">
              {/* Logo Brand */}
              <Link href="/" className="flex items-center gap-2.5 shrink-0 group whitespace-nowrap">
                <img
                  src="/images/logo.png"
                  alt="Logo Caruhun"
                  className="h-9 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col leading-none"></div>
              </Link>

              {/* Menu Navigasi Links */}
              <div className="hidden lg:flex items-center gap-1 font-body-sm text-xs sm:text-sm font-extrabold whitespace-nowrap">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.href);

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center whitespace-nowrap hover:text-amber-600 ${
                        isActive ? "text-amber-600" : "text-slate-800"
                      }`}>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Group Kanan (Pemilih Bahasa) */}
            <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
              <div className="relative group whitespace-nowrap">
                <button
                  type="button"
                  className="flex items-center gap-1.5 font-body-sm text-xs font-extrabold text-slate-700 hover:text-amber-600 transition-colors cursor-pointer py-1.5 px-2.5 rounded-full hover:bg-slate-100/80">
                  {currentLang === "ID" ? <IndonesiaFlag /> : <UKFlag />}
                  <span className="hidden sm:inline text-slate-700">{currentLang}</span>
                  <span className="material-symbols-outlined text-[15px] transition-transform duration-300 group-hover:rotate-180 shrink-0">
                    expand_more
                  </span>
                </button>

                <div className="absolute right-0 top-full pt-2 w-32 z-50 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <div className="flex flex-col p-1.5 bg-white border border-slate-200 rounded-2xl shadow-md gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentLang("ID")}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        currentLang === "ID"
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}>
                      <IndonesiaFlag />
                      <span>Indonesia</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentLang("EN")}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        currentLang === "EN"
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}>
                      <UKFlag />
                      <span>English</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ================= FLOATING WHATSAPP BUTTON (POJOK KANAN BAWAH) ================= */}
      <button
        type="button"
        onClick={handleContactWhatsApp}
        aria-label="Kontak WhatsApp Admin"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 sm:py-3.5 flex items-center gap-2 shadow-[0_10px_25px_rgba(5,150,105,0.35)] hover:shadow-[0_14px_30px_rgba(5,150,105,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
        <span className="material-symbols-outlined text-[18px] sm:text-[20px] shrink-0">chat</span>
        <span>Kontak WhatsApp</span>
      </button>
    </>
  );
}
