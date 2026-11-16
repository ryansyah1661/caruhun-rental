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

  // Layar loading pencegah flash render
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400 tracking-wide">Memeriksa autentikasi...</span>
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
