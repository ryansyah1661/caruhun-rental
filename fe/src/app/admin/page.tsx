"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useDashboard, DashboardVehicle } from "@/lib/use-dashboard";
import { useMe } from "@/lib/use-me";

// Types untuk status armada
type FleetStatus = "Tersedia" | "Dipesan" | "Disewa" | "Servis";

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard();
  const { data: user } = useMe();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState<boolean>(false);

  // State untuk filter lanjutan
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("");

  // State dropdown kustom agar tidak menggunakan select bawaan browser
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isTransmissionOpen, setIsTransmissionOpen] = useState<boolean>(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const transmissionRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
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

  // Data dari API (PostgreSQL)
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

  // Filter logika tabel armada
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

  // Format tanggal & greeting dinamis
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
        {/* ================= HEADER UTAMA ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {greeting}, {user?.name || "Budi Santoso"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-amber-600">schedule</span>
              <span>Ringkasan Operasional Pool ({currentDateFormatted}) • Depok & Jakarta Selatan</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/bookings/create"
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Booking Baru</span>
            </Link>

            <Link
              href="/admin/pemeriksaan-kendaraan/keluar"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px] text-slate-500">logout</span>
              <span>Pemeriksaan Keluar</span>
            </Link>

            <Link
              href="/admin/pemeriksaan-kendaraan/masuk"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[18px] text-slate-500">login</span>
              <span>Catat Pengembalian</span>
            </Link>
          </div>
        </div>

        {/* ================= OPERATIONAL ALERT BANNER (DARI POSTGRESQL) ================= */}
        {overdueAlerts.length > 0 && (
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-900">
                  Peringatan Keterlambatan Pengembalian ({overdueAlerts.length} Unit)
                </span>
                <span className="text-xs text-slate-600 mt-0.5">
                  {overdueAlerts.map((alert, idx) => (
                    <span key={alert.id}>
                      Unit {alert.unitName} (<strong className="text-slate-900 font-semibold">{alert.nopol}</strong>)
                      {idx < overdueAlerts.length - 1 ? " dan " : " "}
                    </span>
                  ))}
                  melewati jatuh tempo pengembalian.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-100/60 font-bold text-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer shadow-2xs"
              type="button">
              <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
              <span>Lihat Kontak Penyewa</span>
            </button>
          </div>
        )}

        {/* ================= PEMBERITAHUAN KONDISI KENDARAAN ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">build_circle</span>
                Pemberitahuan Kondisi Kendaraan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Masalah teknis & status urgensi armada yang dilaporkan</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              {kpi.maintenance > 0 ? `${kpi.maintenance} Perlu Perawatan` : "Kondisi Baik"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <VehicleConditionAlert
              unitName="Mitsubishi Pajero"
              nopol="E 5555 LJ"
              issue="AC MATI IDUP"
              time="12 Okt, 10:04"
              badgeText="Penting"
            />
          </div>
        </div>

        {/* ================= KPI METRICS GRID (DARI POSTGRESQL) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Armada Tersedia"
            statusLabel="Tersedia"
            statusColor="bg-emerald-500"
            metricValue={String(kpi.available)}
            metricTotal={`/ ${kpi.total} Unit`}
            progressPercent={Math.round((kpi.available / totalFleetCount) * 100)}
            description="Siap jalan di pool utama & cabang operasional"
          />
          <KPICard
            title="Siap Berangkat"
            statusLabel="Dipesan"
            statusColor="bg-amber-500"
            metricValue={String(kpi.booked)}
            metricTotal="Unit"
            progressPercent={Math.round((kpi.booked / totalFleetCount) * 100)}
            description="Menunggu jadwal penyerahan kunci hari ini"
          />
          <KPICard
            title="Sedang Berjalan"
            statusLabel="Disewa"
            statusColor="bg-sky-500"
            metricValue={String(kpi.rented)}
            metricTotal="Unit"
            progressPercent={Math.round((kpi.rented / totalFleetCount) * 100)}
            description="Aktif di lapangan bersama pengemudi/lepas kunci"
          />
          <KPICard
            title="Perawatan Bengkel"
            statusLabel="Servis"
            statusColor="bg-rose-500"
            metricValue={String(kpi.maintenance)}
            metricTotal="Unit"
            progressPercent={Math.round((kpi.maintenance / totalFleetCount) * 100)}
            description="Unit yang sedang inspeksi atau perawatan bengkel"
            isError={kpi.maintenance > 0}
          />
        </div>

        {/* ================= RENTAL SEDANG BERJALAN ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">key</span>
                Rental Sedang Berjalan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Armada aktif disewa pelanggan saat ini</p>
            </div>
            <Link
              href="/admin/rentals"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
              Lihat Semua Rental
            </Link>
          </div>

          {activeRentals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {activeRentals.map((rental) => (
                <ActiveRentalCard
                  key={rental.id}
                  id={rental.id}
                  unitName={rental.unitName}
                  nopol={rental.nopol}
                  renterName={rental.renterName}
                  renterPhone={rental.renterPhone}
                  departureTime={rental.departureTime}
                  returnTime={rental.returnTime}
                  totalFee={rental.totalFee}
                  paymentStatus={rental.paymentStatus}
                  remainingFee={rental.remainingFee}
                  extraNote={rental.extraNote || undefined}
                  adminName={rental.adminName}
                  isOverdue={rental.isOverdue}
                />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              Belum ada data rental aktif yang sedang berjalan saat ini.
            </div>
          )}
        </div>

        {/* ================= JADWAL KEBERANGKATAN & KEDATANGAN ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jadwal Keberangkatan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">departure_board</span>
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 leading-tight">Jadwal Keberangkatan</h2>
                  <p className="text-xs text-slate-500">{departures.length} unit dijadwalkan keluar hari ini</p>
                </div>
              </div>
              <Link
                href="/admin/departures"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                Lihat Semua ({departures.length})
              </Link>
            </div>

            <div className="space-y-3">
              {departures.length > 0 ? (
                departures.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-900 shrink-0 shadow-2xs">
                        <span className="text-[10px] font-bold text-amber-600 tracking-wider">JAM</span>
                        <span className="font-extrabold text-sm leading-none">{item.time}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-800 text-[11px] font-mono font-bold">
                            {item.nopol}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{item.unitName}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Penyewa: <strong className="text-slate-900 font-medium">{item.renterName}</strong> {item.type}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {item.status === "confirmed" ? "Siap Serah Terima" : item.status}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">#{item.code}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/admin/pemeriksaan-kendaraan/keluar"
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">key</span>
                      <span>Mulai Serah Terima</span>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Tidak ada jadwal keberangkatan untuk hari ini.
                </div>
              )}
            </div>
          </div>

          {/* Jadwal Kedatangan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 leading-tight">Jadwal Kedatangan & Pengembalian</h2>
                  <p className="text-xs text-slate-500">{arrivals.length} unit terjadwal masuk hari ini</p>
                </div>
              </div>
              <Link
                href="/admin/arrivals"
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                Lihat Semua ({arrivals.length})
              </Link>
            </div>

            <div className="space-y-3">
              {arrivals.length > 0 ? (
                arrivals.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      item.isOverdue
                        ? "bg-rose-50/50 border-rose-200/80"
                        : "bg-slate-50 border-slate-100 hover:bg-slate-100/60"
                    }`}>
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-white border flex flex-col items-center justify-center shrink-0 shadow-2xs ${
                          item.isOverdue ? "border-rose-200 text-rose-700" : "border-slate-200 text-slate-900"
                        }`}>
                        <span
                          className={`text-[10px] font-bold tracking-wider ${
                            item.isOverdue ? "text-rose-600 uppercase" : "text-sky-600"
                          }`}>
                          {item.isOverdue ? "TELAT" : "EST"}
                        </span>
                        <span className="font-extrabold text-sm leading-none">{item.time}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                              item.isOverdue ? "bg-rose-200 text-rose-900" : "bg-slate-200/70 text-slate-800"
                            }`}>
                            {item.nopol}
                          </span>
                          <span className="font-bold text-sm text-slate-900">{item.unitName}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Penyewa: <strong className="text-slate-900 font-medium">{item.renterName}</strong>
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] text-slate-400 font-mono">#{item.code}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/admin/pemeriksaan-kendaraan/masuk"
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">fact_check</span>
                      <span>Pemeriksaan Masuk</span>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  Tidak ada jadwal kedatangan untuk hari ini.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= REAL-TIME FLEET MONITORING TABLE (DARI POSTGRESQL) ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Status & Kesiapan Armada</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Pantau bensin, odometer, dan status operasional armada ({fleetData.length} unit terdaftar di PostgreSQL)
              </p>
            </div>

            {/* Filter Tabs Dinamis */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto border border-slate-200/60">
              <FilterTabButton
                label={`Semua (${kpi.total})`}
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
              />
              <FilterTabButton
                label={`Tersedia (${kpi.available})`}
                active={activeTab === "Tersedia"}
                onClick={() => setActiveTab("Tersedia")}
              />
              <FilterTabButton
                label={`Dipesan (${kpi.booked})`}
                active={activeTab === "Dipesan"}
                onClick={() => setActiveTab("Dipesan")}
              />
              <FilterTabButton
                label={`Disewa (${kpi.rented})`}
                active={activeTab === "Disewa"}
                onClick={() => setActiveTab("Disewa")}
              />
              <FilterTabButton
                label={`Servis (${kpi.maintenance})`}
                active={activeTab === "Servis"}
                onClick={() => setActiveTab("Servis")}
              />
            </div>
          </div>

          {/* Search & Action Sub-bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                search
              </span>
              <input
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                placeholder="Cari Plat nomor atau tipe unit..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsAdvancedFilterOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Filter Lanjutan</span>
              </button>
            </div>
          </div>

          {/* Table Armada (Dengan Pembatas Kolom dan Judul Status/Aksi di Tengah) */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold text-xs border-b border-slate-200 h-11 divide-x divide-slate-200">
                  <th className="px-4 py-3">UNIT & NO. POLISI</th>
                  <th className="px-4 py-3">KATEGORI</th>
                  <th className="px-4 py-3 text-center">STATUS</th>
                  <th className="px-4 py-3">ODOMETER & BBM</th>
                  <th className="px-4 py-3 text-center">AKSI CEPAT</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-200">
                {filteredFleet.length > 0 ? (
                  filteredFleet.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                            <span className="material-symbols-outlined text-[20px]">
                              {item.status === "Servis" ? "directions_bus" : "directions_car"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-900 tracking-tight">{item.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {item.nopol} • {item.transmission} ({item.year})
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex justify-center">
                          <StatusBadge status={item.status} />
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col space-y-0.5">
                          <span className="font-semibold text-slate-800">{item.odometer}</span>
                          <span
                            className={`font-semibold text-[11px] ${
                              item.status === "Servis"
                                ? "text-rose-600"
                                : item.status === "Disewa"
                                  ? "text-sky-600"
                                  : item.status === "Dipesan"
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                            }`}>
                            {item.fuel}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex justify-center">
                          <Link
                            href={item.actionHref}
                            className={`w-36 h-9 px-3.5 rounded-xl font-bold text-xs inline-flex items-center justify-center transition-all shadow-2xs cursor-pointer ${
                              item.status === "Disewa"
                                ? "bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200"
                                : item.status === "Servis"
                                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                  : item.status === "Dipesan"
                                    ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60"
                            }`}>
                            <span>{item.actionText}</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                      Tidak ada armada yang sesuai dengan kriteria pencarian/filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500 font-medium">
              Menampilkan <strong className="text-slate-800">{filteredFleet.length}</strong> dari total {kpi.total}{" "}
              armada di database
            </span>
          </div>
        </div>
      </div>

      {/* ================= MODAL FILTER LANJUTAN ================= */}
      {isAdvancedFilterOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">tune</span>
                Filter Lanjutan Armada
              </h3>
              <button
                onClick={() => setIsAdvancedFilterOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Kategori Kendaraan (Custom Dropdown) */}
              <div className="space-y-1.5 relative" ref={categoryRef}>
                <label className="font-bold text-slate-700">Kategori Kendaraan</label>
                <div
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-xs text-slate-900 flex items-center justify-between cursor-pointer transition-all ${
                    isCategoryOpen
                      ? "border-amber-500 ring-2 ring-amber-500/20 bg-white"
                      : "border-slate-200 hover:bg-slate-100/60"
                  }`}>
                  <span className={!selectedCategory ? "text-slate-800 font-medium" : "text-slate-900 font-bold"}>
                    {selectedCategory === ""
                      ? "Semua Kategori"
                      : selectedCategory === "MPV"
                        ? "MPV 7-Seater"
                        : selectedCategory === "SUV"
                          ? "SUV"
                          : selectedCategory === "City Car"
                            ? "City Car"
                            : "Minibus"}
                  </span>
                  <span
                    className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </div>

                {/* Dropdown Menu List */}
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                    {[
                      { label: "Semua Kategori", value: "" },
                      { label: "MPV 7-Seater", value: "MPV" },
                      { label: "SUV", value: "SUV" },
                      { label: "City Car", value: "City Car" },
                      { label: "Minibus", value: "Minibus" },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setSelectedCategory(opt.value);
                          setIsCategoryOpen(false);
                        }}
                        className={`px-3.5 py-2.5 cursor-pointer text-xs transition-colors flex items-center justify-between ${
                          selectedCategory === opt.value
                            ? "bg-amber-50 text-amber-800 font-bold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}>
                        <span>{opt.label}</span>
                        {selectedCategory === opt.value && (
                          <span className="material-symbols-outlined text-amber-600 text-[16px]">check</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Jenis Transmisi (Custom Dropdown) */}
              <div className="space-y-1.5 relative" ref={transmissionRef}>
                <label className="font-bold text-slate-700">Jenis Transmisi</label>
                <div
                  onClick={() => setIsTransmissionOpen(!isTransmissionOpen)}
                  className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-xs text-slate-900 flex items-center justify-between cursor-pointer transition-all ${
                    isTransmissionOpen
                      ? "border-amber-500 ring-2 ring-amber-500/20 bg-white"
                      : "border-slate-200 hover:bg-slate-100/60"
                  }`}>
                  <span className={!selectedTransmission ? "text-slate-800 font-medium" : "text-slate-900 font-bold"}>
                    {selectedTransmission === ""
                      ? "Semua Transmisi"
                      : selectedTransmission === "Matic"
                        ? "Matic / CVT"
                        : "Manual"}
                  </span>
                  <span
                    className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform ${isTransmissionOpen ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </div>

                {/* Dropdown Menu List */}
                {isTransmissionOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                    {[
                      { label: "Semua Transmisi", value: "" },
                      { label: "Matic / CVT", value: "Matic" },
                      { label: "Manual", value: "Manual" },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setSelectedTransmission(opt.value);
                          setIsTransmissionOpen(false);
                        }}
                        className={`px-3.5 py-2.5 cursor-pointer text-xs transition-colors flex items-center justify-between ${
                          selectedTransmission === opt.value
                            ? "bg-amber-50 text-amber-800 font-bold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}>
                        <span>{opt.label}</span>
                        {selectedTransmission === opt.value && (
                          <span className="material-symbols-outlined text-amber-600 text-[16px]">check</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedTransmission("");
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                type="button">
                Reset
              </button>
              <button
                onClick={() => setIsAdvancedFilterOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm">
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL LIHAT KONTAK PENYEWA TERLAMBAT ================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">warning</span>
                Kontak Penyewa Terlambat ({overdueAlerts.length} Unit)
              </h3>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3">
              {overdueAlerts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{contact.unitName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                        {contact.nopol}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Penyewa: <strong className="text-slate-900">{contact.renterName}</strong> •{" "}
                      <span className="font-mono">{contact.renterPhone || "Tidak ada nomor"}</span>
                    </p>
                    <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                      Terlambat: +{contact.hoursLate} Jam
                    </p>
                  </div>
                  {contact.renterPhone && (
                    <a
                      href={`https://wa.me/${contact.renterPhone}?text=${encodeURIComponent(
                        `Halo Kak ${contact.renterName}, kami dari Caruhun Rental mengingatkan bahwa unit ${contact.unitName} (${contact.nopol}) sudah melewati jadwal pengembalian. Mohon konfirmasinya ya kak. Terima kasih.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Skeleton Loading Komponen
// ----------------------------------------------------------------------
function DashboardSkeleton() {
  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen animate-pulse">
      <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded-lg w-64"></div>
            <div className="h-4 bg-slate-100 rounded-md w-96"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
            <div className="h-10 w-36 bg-slate-100 rounded-xl"></div>
            <div className="h-10 w-36 bg-slate-100 rounded-xl"></div>
          </div>
        </div>

        {/* Alert Banner Skeleton */}
        <div className="h-16 bg-amber-100/50 rounded-2xl border border-amber-200/50"></div>

        {/* KPI Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-5 bg-slate-100 rounded-full w-16"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
              <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
              <div className="h-3 bg-slate-100 rounded w-40"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
          <div className="h-6 bg-slate-200 rounded w-48"></div>
          <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-slate-50 rounded-xl border border-slate-100"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Komponen Reusable
// ----------------------------------------------------------------------

interface KPICardProps {
  title: string;
  statusLabel: string;
  statusColor: string;
  metricValue: string;
  metricTotal: string;
  progressPercent: number;
  description: string;
  isError?: boolean;
}

function KPICard({
  title,
  statusLabel,
  statusColor,
  metricValue,
  metricTotal,
  progressPercent,
  description,
  isError = false,
}: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-xs text-slate-500 uppercase tracking-wider">{title}</span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
          <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
          {statusLabel}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold tracking-tight ${isError ? "text-rose-600" : "text-slate-900"}`}>
            {metricValue}
          </span>
          <span className="text-xs font-medium text-slate-500">{metricTotal}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`${statusColor} h-1.5 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 pt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface FilterTabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterTabButton({ label, active, onClick }: FilterTabButtonProps) {
  return (
    <button
      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
        active ? "bg-amber-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
      }`}
      type="button"
      onClick={onClick}>
      {label}
    </button>
  );
}

interface StatusBadgeProps {
  status: FleetStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  let dotColor = "bg-emerald-500";
  let badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";

  if (status === "Dipesan") {
    dotColor = "bg-amber-500";
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (status === "Disewa") {
    dotColor = "bg-sky-500";
    badgeStyle = "bg-sky-50 text-sky-700 border-sky-200";
  } else if (status === "Servis") {
    dotColor = "bg-rose-500";
    badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
}

interface VehicleConditionAlertProps {
  unitName: string;
  nopol: string;
  issue: string;
  time: string;
  badgeText?: string;
}

function VehicleConditionAlert({ unitName, nopol, issue, time, badgeText = "Penting" }: VehicleConditionAlertProps) {
  return (
    <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="font-bold text-xs text-slate-900">
            {unitName} <span className="font-mono font-normal text-slate-500">({nopol})</span>
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">{badgeText}</span>
      </div>
      <div className="bg-white p-3 rounded-xl border-l-4 border-amber-500 border-y border-r border-slate-200/60 flex justify-between items-center shadow-2xs">
        <div>
          <p className="font-extrabold text-xs text-slate-900 tracking-wide">{issue}</p>
          <span className="text-[11px] text-slate-500 block mt-0.5">{time}</span>
        </div>
        <Link
          href="/admin/claims"
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer">
          Tindak Lanjuti
        </Link>
      </div>
    </div>
  );
}

interface ActiveRentalCardProps {
  id: string;
  unitName: string;
  nopol: string;
  renterName: string;
  renterPhone: string;
  departureTime: string;
  returnTime: string;
  totalFee: string;
  paymentStatus: "Sewa Lunas" | "Sewa Belum Bayar";
  remainingFee: string;
  extraNote?: string;
  adminName: string;
  isOverdue?: boolean;
}

function ActiveRentalCard({
  id,
  unitName,
  nopol,
  renterName,
  renterPhone,
  departureTime,
  returnTime,
  totalFee,
  paymentStatus,
  remainingFee,
  extraNote,
  adminName,
  isOverdue = false,
}: ActiveRentalCardProps) {
  const isPaid = paymentStatus === "Sewa Lunas";

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">directions_car</span>
            <h3 className="font-bold text-sm text-slate-900 truncate max-w-[150px]">{unitName}</h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
              Disewa
            </span>
            {isOverdue && (
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[12px]">warning</span>
                TELAT
              </span>
            )}
          </div>
        </div>

        <div className="mb-2">
          <span className="font-bold text-xs text-slate-900">{renterName}</span>
          <span className="text-xs text-slate-500 ml-1.5 font-mono">({renterPhone})</span>
        </div>

        <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500 mb-3 bg-slate-50 p-2 rounded-xl">
          <span>
            Berangkat: <strong className="text-slate-800 font-medium">{departureTime}</strong>
          </span>
          <span>➔</span>
          <span>
            Kembali: <strong className="text-slate-800 font-medium">{returnTime}</strong>
          </span>
        </div>

        <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-xl mb-4 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">{totalFee}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {paymentStatus}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 text-[11px]">
            <span>Sisa Sewa:</span>
            <strong className={remainingFee === "Rp0" ? "text-emerald-700" : "text-rose-600 font-bold"}>
              {remainingFee}
            </strong>
          </div>
          {extraNote && <div className="text-amber-700 font-semibold text-[11px]">{extraNote}</div>}
          <div className="text-slate-400 text-[10px] pt-1 border-t border-slate-200/60">
            Admin bertugas: <span className="text-slate-700 font-medium">{adminName}</span>
          </div>
        </div>
      </div>

      {/* Tombol Detail dan Pengingat */}
      <div className="flex items-center gap-2 pt-1">
        <Link
          href={`/admin/rentals/${id}`}
          className="flex-1 h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-colors flex items-center justify-center">
          Detail
        </Link>
        <button
          type="button"
          onClick={() => {
            const message = `Halo Kak ${renterName}, kami dari Caruhun Rental mengingatkan bahwa unit ${unitName} (${nopol}) sudah melewati jadwal pengembalian (${returnTime}). Mohon konfirmasinya ya kak. Terima kasih.`;
            window.open(`https://wa.me/${renterPhone}?text=${encodeURIComponent(message)}`, "_blank");
          }}
          className="flex-1 h-10 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap">
          <span className="material-symbols-outlined text-[15px] leading-none">send</span>
          <span>Pengingat</span>
        </button>
      </div>
    </div>
  );
}
