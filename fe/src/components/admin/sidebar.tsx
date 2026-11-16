"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type Role } from "@/lib/auth";
import { useMe } from "@/lib/use-me";

export type MenuItem = { href: string; label: string; icon: string; roles: Role[]; section?: string };

const ALL: Role[] = ["superadmin", "admin", "petugas"];
const OFFICE: Role[] = ["superadmin", "admin"];
const SUPER_ONLY: Role[] = ["superadmin"];

export const ADMIN_MENU: MenuItem[] = [
  // Grup 1: Operasional
  { href: "/admin", label: "Dashboard", icon: "dashboard", roles: ALL, section: "OPERASIONAL" },
  { href: "/admin/bookings", label: "Booking", icon: "book_online", roles: OFFICE, section: "OPERASIONAL" },
  { href: "/admin/departures", label: "Keberangkatan", icon: "departure_board", roles: ALL, section: "OPERASIONAL" },
  { href: "/admin/arrivals", label: "Kedatangan", icon: "assignment_turned_in", roles: ALL, section: "OPERASIONAL" },
  { href: "/admin/rentals", label: "Riwayat Sewa", icon: "history", roles: OFFICE, section: "OPERASIONAL" },

  // Grup 2: Armada & Lapangan
  { href: "/admin/vehicles", label: "Kendaraan", icon: "directions_car", roles: OFFICE, section: "ARMADA & LAPANGAN" },
  { href: "/admin/customers", label: "Pelanggan", icon: "groups", roles: OFFICE, section: "ARMADA & LAPANGAN" },
  { href: "/admin/attendance", label: "Kehadiran", icon: "badge", roles: ALL, section: "ARMADA & LAPANGAN" },
  {
    href: "/admin/inspections",
    label: "Pemeriksaan Kendaraan",
    icon: "fact_check",
    roles: ALL,
    section: "ARMADA & LAPANGAN",
  },
  { href: "/admin/claims", label: "Kerusakan & Klaim", icon: "car_crash", roles: ALL, section: "ARMADA & LAPANGAN" },

  // Grup 3: Manajemen & Website
  {
    href: "/admin/users",
    label: "Kelola Pengguna",
    icon: "manage_accounts",
    roles: SUPER_ONLY,
    section: "MANAJEMEN & WEBSITE",
  },
  {
    href: "/admin/finance",
    label: "Keuangan",
    icon: "account_balance_wallet",
    roles: SUPER_ONLY,
    section: "MANAJEMEN & WEBSITE",
  },
  { href: "/admin/reports", label: "Laporan", icon: "bar_chart", roles: SUPER_ONLY, section: "MANAJEMEN & WEBSITE" },
  {
    href: "/admin/documents",
    label: "Dokumen Rental",
    icon: "description",
    roles: OFFICE,
    section: "MANAJEMEN & WEBSITE",
  },
  { href: "/admin/konten", label: "Konten Website", icon: "web", roles: SUPER_ONLY, section: "MANAJEMEN & WEBSITE" },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: me, isLoading } = useMe();

  const items = me ? ADMIN_MENU.filter((m) => m.roles.includes(me.role)) : [];
  const sections = Array.from(new Set(items.map((i) => i.section || "LAINNYA")));

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out border-r border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        <div className="flex flex-col min-h-0 flex-1 pb-6">
          <div className="h-16 px-4 flex items-center gap-3 bg-slate-900 shrink-0 border-b border-slate-800">
            <img alt="Caruhun Logo" className="h-8 w-auto object-contain" src="/images/logo.png" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-extrabold text-white leading-none tracking-tight">Caruhun Trans</span>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mt-1">
                Management System
              </span>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-5 overflow-y-auto mt-4">
            {sections.map((sectionName) => {
              const sectionItems = items.filter((i) => (i.section || "LAINNYA") === sectionName);
              if (sectionItems.length === 0) return null;

              return (
                <div key={sectionName} className="space-y-1">
                  <div className="px-3 pb-1 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {sectionName}
                    </span>
                  </div>

                  {sectionItems.map((m) => {
                    const active =
                      m.href === "/admin"
                        ? pathname === "/admin"
                        : pathname === m.href || pathname.startsWith(`${m.href}/`);

                    return (
                      <Link
                        key={m.href}
                        href={m.href}
                        onClick={onClose}
                        className={`min-h-[38px] px-3 py-2 rounded-xl flex items-center gap-3 text-xs transition-colors ${
                          active
                            ? "bg-amber-600 text-white font-extrabold shadow-sm"
                            : "font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80"
                        }`}>
                        <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                        <span>{m.label}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
