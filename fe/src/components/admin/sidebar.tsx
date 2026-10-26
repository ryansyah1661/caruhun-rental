"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { api, TOKEN_KEY } from "@/lib/api";
import { roleLabel, type Role } from "@/lib/auth";
import { useMe } from "@/lib/use-me";

export type MenuItem = { href: string; label: string; icon: string; roles: Role[] };

const ALL: Role[] = ["admin", "office_staff", "field_staff"];
const OFFICE: Role[] = ["admin", "office_staff"];
const FIELD: Role[] = ["admin", "office_staff", "field_staff"];

export const ADMIN_MENU: MenuItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", roles: OFFICE },
  { href: "/admin/bookings", label: "Booking", icon: "book_online", roles: OFFICE },
  { href: "/admin/departures", label: "Keberangkatan", icon: "departure_board", roles: FIELD },
  { href: "/admin/arrivals", label: "Kedatangan", icon: "assignment_turned_in", roles: FIELD },
  { href: "/admin/rentals", label: "Riwayat Sewa", icon: "history", roles: OFFICE },
  { href: "/admin/vehicles", label: "Kendaraan", icon: "directions_car", roles: OFFICE },
  { href: "/admin/customers", label: "Pelanggan", icon: "groups", roles: OFFICE },
  { href: "/admin/attendance", label: "Kehadiran", icon: "badge", roles: ALL },
  { href: "/admin/inspections", label: "Pemeriksaan Kendaraan", icon: "fact_check", roles: FIELD },
  { href: "/admin/claims", label: "Kerusakan & Klaim", icon: "car_crash", roles: FIELD },
  { href: "/admin/finance", label: "Keuangan", icon: "account_balance_wallet", roles: ["admin"] },
  { href: "/admin/reports", label: "Laporan", icon: "bar_chart", roles: ["admin"] },
  { href: "/admin/documents", label: "Dokumen Rental", icon: "description", roles: OFFICE },
  { href: "/admin/settings", label: "Pengaturan", icon: "settings", roles: ["admin"] },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const { data: me } = useMe();

  async function logout() {
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    qc.clear();
    router.replace("/login");
  }

  const items = me ? ADMIN_MENU.filter((m) => m.roles.includes(me.role)) : [];

  return (
    <>
      {/* Sidebar Overlay (Mobile) */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar Navigasi */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-inverse-surface z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out shadow-[0_1px_8px_rgba(0,0,0,0.15)] ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Header */}
          <div className="h-16 px-space-lg flex items-center gap-space-sm bg-inverse-surface shrink-0">
            <img alt="Caruhun Logo" className="h-8 w-auto object-contain" src="/images/logo.png" />
            <div className="flex flex-col overflow-hidden">
              <span className="font-title-md text-title-md text-surface-container-lowest leading-none tracking-tight">
                Caruhun
              </span>
              <span className="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider mt-1">
                Management System
              </span>
            </div>
          </div>

          {/* Sub Navbar Status */}
          <div className="px-space-md py-space-sm">
            <div className="px-space-sm py-1.5 rounded-lg bg-inverse-surface flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-secondary-fixed-dim uppercase tracking-wider">
                Navigasi Operasional
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-space-md pb-space-md space-y-1 overflow-y-auto">
            {items.map((m) => {
              const active = m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href);
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={onClose}
                  className={`min-h-[44px] px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                    active
                      ? "bg-primary-container text-on-primary font-title-md shadow-sm"
                      : "font-body-md text-body-md text-secondary-fixed-dim hover:text-surface-container-lowest hover:bg-surface-dim/20"
                  }`}>
                  <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                  <span>{m.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        {me && (
          <div className="p-space-md bg-inverse-surface shrink-0 space-y-space-sm">
            <div className="flex items-center gap-space-sm p-2 rounded-lg bg-surface-dim/10">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shrink-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvkCl7lzGEmb2FxV_joWnIyswcr0kc4m8aASK2k2BfbNCjvOEuYn6TmPLhug1TLZeg4gejqLzUgbfn2rxfqmsPqmIhZ7befiF3vQ3IyxuAL-vtedfFH4GszfHueWNf0xqfNAa2uZSz0vbecGBzsAHtdlN_9RvcqPIXNVaaZveef2JvAuft18D3MqDxyT2OudhhMMvSom61KQHOtswX10yfoYSqzdXraqi7P_7AIHCtOhTIUFHM0wJFoA"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-label-lg text-label-lg text-surface-container-lowest font-medium truncate">
                  {me.name}
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim truncate">
                  {roleLabel[me.role]}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full min-h-[44px] px-3 py-2 rounded-lg flex items-center justify-center gap-2 font-label-lg text-label-lg text-secondary-fixed-dim hover:text-error hover:bg-error-container/20 transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Keluar</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
