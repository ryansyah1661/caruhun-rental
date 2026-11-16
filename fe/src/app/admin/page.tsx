"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useDashboard, DashboardVehicle } from "@/lib/use-dashboard";
import { useMe } from "@/lib/use-me";

type FleetStatus = "Tersedia" | "Dipesan" | "Disewa" | "Servis";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const { data: user } = useMe();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("");

  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isTransmissionOpen, setIsTransmissionOpen] = useState<boolean>(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const transmissionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (transmissionRef.current && !transmissionRef.current.contains(event.target as Node)) {
        setIsTransmissionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fleetData: DashboardVehicle[] = useMemo(() => data?.vehicles || [], [data?.vehicles]);
  const departures = useMemo(() => data?.departures || [], [data?.departures]);
  const arrivals = useMemo(() => data?.arrivals || [], [data?.arrivals]);
  const overdueAlerts = useMemo(() => data?.overdueAlerts || [], [data?.overdueAlerts]);
  const activeRentals = useMemo(() => data?.activeRentals || [], [data?.activeRentals]);

  const kpi = data?.kpi || {
    total: 0,
    available: 0,
    booked: 0,
    rented: 0,
    maintenance: 0,
  };
  const totalFleetCount = kpi.total || fleetData.length || 1;

  const filteredFleet = useMemo(() => {
    return fleetData.filter((item) => {
      const matchesTab = activeTab === "all" || item.status === activeTab;
      const fullSearchString = `${item.nopol} ${item.name} ${item.category}`.toLowerCase();
      const matchesSearch = fullSearchString.includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesTransmission =
        !selectedTransmission || item.transmission.toLowerCase().includes(selectedTransmission.toLowerCase());

      return matchesTab && matchesSearch && matchesCategory && matchesTransmission;
    });
  }, [fleetData, activeTab, searchQuery, selectedCategory, selectedTransmission]);

  const currentDateFormatted = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen">
      <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Utama */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {greeting}, {user?.name || "Admin"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-amber-600">schedule</span>
              <span>Ringkasan Operasional Rental ({currentDateFormatted})</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <Link
              href="/admin/bookings/create"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Booking Baru</span>
            </Link>
            <Link
              href="/admin/inspections/keluar"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">fact_check</span>
              <span>Inspeksi Cepat</span>
            </Link>
          </div>
        </div>

        {/* Notifikasi Armada Terlambat */}
        {overdueAlerts.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-rose-600 text-2xl">warning</span>
              <div>
                <h4 className="font-bold text-sm text-rose-900">Perhatian: Ada Armada Melewati Batas Sewa</h4>
                <p className="text-xs text-rose-700">
                  {overdueAlerts.length} unit rental belum dikembalikan sesuai jadwal.
                </p>
              </div>
            </div>
            <Link
              href="/admin/rentals"
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shrink-0">
              Cek Riwayat
            </Link>
          </div>
        )}

        {/* Statistik Kartu KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          <StatCard title="Total Armada" value={kpi.total} icon="directions_car" color="slate" />
          <StatCard title="Armada Tersedia" value={kpi.available} icon="check_circle" color="emerald" />
          <StatCard title="Armada Dipesan" value={kpi.booked} icon="schedule" color="amber" />
          <StatCard title="Sedang Disewa" value={kpi.rented} icon="key" color="sky" />
          <StatCard title="Perbaikan / Servis" value={kpi.maintenance} icon="build" color="rose" />
        </div>

        {/* Tabel Monitoring Armada */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Monitoring Armada Real-Time</h2>
              <p className="text-xs text-slate-500">Pantau ketersediaan armada langsung dari database PostgreSQL</p>
            </div>
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Cari armada atau plat nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase h-10">
                <tr>
                  <th className="px-4 py-3">Kendaraan</th>
                  <th className="px-4 py-3">Plat Nomor</th>
                  <th className="px-4 py-3">Kategori & Transmisi</th>
                  <th className="px-4 py-3">Kilometer</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredFleet.length > 0 ? (
                  filteredFleet.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{v.name}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-500">{v.nopol}</td>
                      <td className="px-4 py-3.5">
                        {v.category} &bull; {v.transmission}
                      </td>
                      <td className="px-4 py-3.5 font-semibold">{v.odometer}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            v.status === "Tersedia"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : v.status === "Disewa"
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : v.status === "Dipesan"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      Tidak ada armada yang sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    slate: "bg-slate-50 text-slate-700 border-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color]} shadow-2xs space-y-2`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">{title}</span>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="text-2xl font-extrabold text-slate-900">{value}</div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full min-h-screen p-6 lg:p-8 space-y-6 animate-pulse bg-slate-50/50">
      <div className="h-24 bg-white rounded-2xl border border-slate-200" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200" />
        ))}
      </div>
      <div className="h-64 bg-white rounded-2xl border border-slate-200" />
    </div>
  );
}
