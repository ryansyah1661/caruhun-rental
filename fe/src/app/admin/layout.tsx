"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, TOKEN_KEY } from "@/lib/api";
import { roleLabel, type Role } from "@/lib/auth";
import { useMe } from "@/lib/use-me";

type MenuItem = { href: string; label: string; roles: Role[] };

const ALL: Role[] = ["admin", "office_staff", "field_staff"];
const OFFICE: Role[] = ["admin", "office_staff"];
const FIELD: Role[] = ["admin", "office_staff", "field_staff"];

const menu: MenuItem[] = [
  { href: "/admin", label: "Dashboard", roles: OFFICE },
  { href: "/admin/bookings", label: "Booking", roles: OFFICE },
  { href: "/admin/departures", label: "Keberangkatan", roles: FIELD },
  { href: "/admin/arrivals", label: "Kedatangan", roles: FIELD },
  { href: "/admin/rentals", label: "Riwayat Sewa", roles: OFFICE },
  { href: "/admin/vehicles", label: "Kendaraan", roles: OFFICE },
  { href: "/admin/customers", label: "Pelanggan", roles: OFFICE },
  { href: "/admin/attendance", label: "Kehadiran", roles: ALL },
  { href: "/admin/inspections", label: "Pemeriksaan Kendaraan", roles: FIELD },
  { href: "/admin/claims", label: "Kerusakan & Klaim", roles: FIELD },
  { href: "/admin/finance", label: "Keuangan", roles: ["admin"] },
  { href: "/admin/reports", label: "Laporan", roles: ["admin"] },
  { href: "/admin/documents", label: "Dokumen Rental", roles: OFFICE },
  { href: "/admin/settings", label: "Pengaturan", roles: ["admin"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const qc = useQueryClient();
  const { data: me, isLoading } = useMe();
  const [open, setOpen] = useState(false);

  async function logout() {
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    qc.clear();
    router.replace("/login");
  }

  if (isLoading || !me) {
    return <div className="p-8 text-slate-500">Memuat...</div>;
  }

  const items = menu.filter((m) => m.roles.includes(me.role));

  const nav = (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {items.map((m) => {
        const active =
          m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href);
        return (
          <Link
            key={m.href}
            href={m.href}
            onClick={() => setOpen(false)}
            className={`block rounded-md px-3 py-2 text-sm ${
              active
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {m.label}
          </Link>
        );
      })}
    </nav>
  );

  const account = (
    <div className="border-t border-slate-800 p-3 text-sm">
      <p className="font-medium text-white">{me.name}</p>
      <p className="text-slate-400">{roleLabel[me.role]}</p>
      <button
        onClick={logout}
        className="mt-2 w-full rounded-md bg-slate-800 py-2 text-slate-200 hover:bg-slate-700"
      >
        Keluar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col bg-slate-900 md:flex md:sticky md:top-0 md:h-screen">
        <div className="p-4 text-lg font-semibold text-white">Rental</div>
        {nav}
        {account}
      </aside>

      {/* Bar atas HP */}
      <header className="flex items-center justify-between bg-slate-900 p-3 text-white md:hidden">
        <span className="font-semibold">Rental</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm"
        >
          {open ? "Tutup" : "Menu"}
        </button>
      </header>
      {open && (
        <div className="flex flex-col bg-slate-900 md:hidden">
          {nav}
          {account}
        </div>
      )}

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}