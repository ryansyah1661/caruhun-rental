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

  if (!isLoading && !me) {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full bg-surface-container-lowest font-body-md text-body-md text-on-surface antialiased">
      {/* Sidebar selalu dirender tetap dan statis (diam total, tidak ada efek pudar) */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen w-full">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="w-full flex-1">{isLoading ? <AdminContentSkeleton /> : children}</main>
      </div>
    </div>
  );
}

function AdminContentSkeleton() {
  return (
    <div className="p-6 lg:p-8 space-y-6 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="h-28 bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded-lg w-64" />
          <div className="h-4 bg-slate-100 rounded w-44" />
        </div>
        <div className="h-3 bg-slate-100 rounded w-72" />
      </div>

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
            <div className="h-3 bg-slate-100 rounded w-20" />
            <div className="h-7 bg-slate-200 rounded w-14" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-40" />
          <div className="h-9 bg-slate-100 rounded-xl w-60" />
        </div>
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 border border-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
