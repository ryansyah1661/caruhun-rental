"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ---------- Types ---------- */

type SubItem = {
  label: string;
  href: string;
  dataPath: string;
  icon: string;
  description?: string;
};

type NavLink = {
  label: string;
  href: string;
  dataPath: string;
  hasDropdown?: boolean;
  subItems?: SubItem[];
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

/* ---------- Config Navigasi Caruhun ---------- */

const navLinks: NavLink[] = [
  { label: "Beranda", href: "/", dataPath: "beranda" },
  {
    label: "Katalog",
    href: "#katalog",
    dataPath: "katalog-armada",
    hasDropdown: true,
    subItems: [
      {
        label: "MPV Keluarga",
        href: "/#katalog",
        dataPath: "mpv-keluarga",
        icon: "directions_car",
        description: "Avanza, Innova Zenix & sejenisnya",
      },
      {
        label: "City Car",
        href: "/#katalog",
        dataPath: "city-car",
        icon: "directions_car",
        description: "Brio RS & tipe lincah perkotaan",
      },
      {
        label: "SUV Tough",
        href: "/#katalog",
        dataPath: "suv-tough",
        icon: "time_to_leave",
        description: "Pajero Sport & rute medan berat",
      },
      {
        label: "Minibus",
        href: "/#katalog",
        dataPath: "minibus",
        icon: "airport_shuttle",
        description: "HiAce Commuter 16-Seat & microbus",
      },
    ],
  },
  { label: "Tentang", href: "#tentang", dataPath: "tentang-kami" },
  { label: "Keunggulan", href: "#keunggulan", dataPath: "keunggulan" },
  { label: "Partner", href: "#partner", dataPath: "partner" },
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

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  const isLinkActive = (href: string) => {
    if (href.startsWith("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleContactWhatsApp = () => {
    const adminPhoneNumber = "6281234567890";
    const msg = "Halo Admin Caruhun Rental, saya ingin berkonsultasi mengenai sewa armada kendaraan.";
    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none">
      <nav className="w-full flex justify-center z-50 pt-4 px-4">
        <div
          className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] overflow-visible
            bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full shadow-sm
            ${
              scrolled
                ? "w-[90%] max-w-4xl h-14 px-5 shadow-md border-slate-300 scale-[0.98] -translate-y-1"
                : "w-[95%] max-w-6xl h-16 sm:h-20 px-8 shadow-sm scale-100 translate-y-0"
            }`}>
          {/* Group Kiri (Logo + Navigasi) */}
          <div className="flex items-center gap-4 xl:gap-6 shrink-0">
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group whitespace-nowrap">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">directions_car</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">Caruhun</span>
                <span className="text-[8px] font-semibold text-amber-600 uppercase tracking-widest mt-0.5">
                  Rental Armada
                </span>
              </div>
            </Link>

            {/* Menu Navigasi Links */}
            <div className="hidden lg:flex items-center gap-1 font-body-sm text-xs sm:text-sm font-extrabold whitespace-nowrap">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.href) || !!link.subItems?.some((s) => isLinkActive(s.href));

                return (
                  <div key={link.label} className="relative group whitespace-nowrap">
                    <Link
                      href={link.href}
                      data-path={link.dataPath}
                      aria-current={isActive ? "page" : undefined}
                      className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-0.5 whitespace-nowrap hover:text-amber-600 group-hover:text-amber-600 ${
                        isActive ? "text-amber-600" : "text-slate-800"
                      }`}>
                      <span className="whitespace-nowrap">{link.label}</span>
                      {link.hasDropdown && (
                        <span className="material-symbols-outlined text-[15px] transition-transform duration-300 group-hover:rotate-180 shrink-0">
                          expand_more
                        </span>
                      )}
                    </Link>

                    {/* Dropdown Menu List */}
                    {link.hasDropdown && (
                      <div className="absolute left-0 top-full pt-2 w-72 z-50 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out">
                        <div className="flex flex-col p-2 bg-white border border-slate-200 rounded-3xl shadow-[0_15px_30px_-5px_rgba(15,23,42,0.12)] gap-1">
                          {link.subItems?.map((item) => {
                            const subActive = isLinkActive(item.href);
                            return (
                              <Link
                                key={item.label}
                                href={item.href}
                                data-path={item.dataPath}
                                className={`p-2 rounded-2xl transition-colors flex items-center gap-3 group/item ${
                                  subActive ? "bg-amber-50 text-amber-700" : "hover:bg-slate-50 text-slate-800"
                                }`}>
                                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 group-hover/item:bg-amber-600 group-hover/item:text-white transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                </div>
                                <div className="flex flex-col leading-snug">
                                  <span className="text-xs font-bold text-slate-900 group-hover/item:text-amber-700 transition-colors whitespace-nowrap">
                                    {item.label}
                                  </span>
                                  {item.description && (
                                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                                      {item.description}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Kanan (CTA Actions & Language) */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            {/* Pemilih Bahasa */}
            <div className="relative group whitespace-nowrap">
              <button
                type="button"
                className="flex items-center gap-1 font-body-sm text-xs font-extrabold text-slate-700 hover:text-amber-600 transition-colors cursor-pointer py-1 px-1 rounded-lg">
                {currentLang === "ID" ? <IndonesiaFlag /> : <UKFlag />}
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

            {/* WhatsApp CTA */}
            <button
              type="button"
              onClick={handleContactWhatsApp}
              className={`rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95 whitespace-nowrap ${
                scrolled ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs"
              }`}>
              <span className="material-symbols-outlined text-[15px] shrink-0">chat</span>
              <span className="hidden sm:inline whitespace-nowrap">Hubungi WA</span>
            </button>

            {/* Admin Login Link */}
            <Link
              href="/login"
              className={`rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 whitespace-nowrap ${
                scrolled ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs"
              }`}>
              Masuk Admin
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
