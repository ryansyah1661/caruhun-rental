"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/use-me";
import AdminSidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !me) {
      router.replace("/login");
    }
  }, [isLoading, me, router]);

  // Layar loading pencegah flash render (menggunakan warna tema terang agar tidak berkedip gelap saat refresh)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3.5px] border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500 tracking-wide">Memuat sesi Caruhun...</span>
        </div>
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface antialiased">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="w-full flex-1">{children}</main>
      </div>
    </div>
  );
}
