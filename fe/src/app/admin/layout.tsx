"use client";

import { useState } from "react";
import { useMe } from "@/lib/use-me";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: me, isLoading } = useMe();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading || !me) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-stone-500 font-body-md">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface antialiased">
      {/* Sidebar Navigasi Admin */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Kontainer Utama */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        {/* Top Header Admin */}
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Konten Halaman Aktif (Dashboard, Booking, Kendaraan, dll) */}
        <main className="w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
