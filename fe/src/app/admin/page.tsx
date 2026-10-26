"use client";

import React, { useState, useMemo } from "react";

// Types untuk data armada
type FleetStatus = "Tersedia" | "Dipesan" | "Disewa" | "Servis";

interface FleetItem {
  id: string;
  name: string;
  nopol: string;
  transmission: string;
  year: number;
  category: string;
  status: FleetStatus;
  location: string;
  isLocationEnRoute?: boolean;
  odometer: string;
  fuel: string;
  fuelPercentage: number;
  fuelNote?: string;
  actionText: string;
  actionIcon: string;
}

// Dummy data armada sesuai tabel HTML
const INITIAL_FLEET: FleetItem[] = [
  {
    id: "1",
    name: "Toyota Avanza 1.5 G",
    nopol: "B 1482 KFD",
    transmission: "Transmisi CVT",
    year: 2023,
    category: "MPV 7-Seater",
    status: "Tersedia",
    location: "Pool Utama - Cilandak",
    odometer: "34.120 km",
    fuel: "BBM 90% (Penuh)",
    fuelPercentage: 90,
    actionText: "Detail",
    actionIcon: "more_vert",
  },
  {
    id: "2",
    name: "Toyota Innova Zenix 2.0 V",
    nopol: "B 2884 SSR",
    transmission: "Gasoline",
    year: 2024,
    category: "Premium MPV",
    status: "Dipesan",
    location: "Pool Utama - Bay 3",
    odometer: "12.450 km",
    fuel: "BBM 75%",
    fuelPercentage: 75,
    actionText: "Detail",
    actionIcon: "more_vert",
  },
  {
    id: "3",
    name: "Honda Brio RS Urbanite",
    nopol: "D 2091 AGH",
    transmission: "Matic",
    year: 2022,
    category: "City Car",
    status: "Disewa",
    location: "Jalan Tol Jagorawi KM 28",
    isLocationEnRoute: true,
    odometer: "48.910 km",
    fuel: "BBM 60%",
    fuelPercentage: 60,
    actionText: "Lacak GPS",
    actionIcon: "gps_fixed",
  },
  {
    id: "4",
    name: "Mitsubishi Xpander Ultimate",
    nopol: "B 2390 POX",
    transmission: "CVT",
    year: 2023,
    category: "L-MPV",
    status: "Disewa",
    location: "Bandung - Dago Pakar",
    isLocationEnRoute: true,
    odometer: "29.800 km",
    fuel: "BBM 85%",
    fuelPercentage: 85,
    actionText: "Lacak GPS",
    actionIcon: "gps_fixed",
  },
  {
    id: "5",
    name: "Toyota HiAce Commuter",
    nopol: "B 1019 TRB",
    transmission: "Manual Diesel",
    year: 2021,
    category: "Minibus 16-Seat",
    status: "Servis",
    location: "Bengkel Resmi Auto2000 TB Simatupang",
    odometer: "94.200 km",
    fuel: "Ganti Oli & Kampas Rem",
    fuelPercentage: 0,
    fuelNote: "service",
    actionText: "SPK Servis",
    actionIcon: "receipt_long",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Filter logika tabel
  const filteredFleet = useMemo(() => {
    return INITIAL_FLEET.filter((item) => {
      const matchesTab = activeTab === "all" || item.status === activeTab;
      const fullSearchString = `${item.nopol} ${item.name} ${item.category}`.toLowerCase();
      const matchesSearch = fullSearchString.includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="w-full font-body-md text-body-md text-on-surface antialiased">
      <div className="flex flex-col w-full px-space-md lg:px-margin-desktop py-space-lg space-y-space-lg">
        {/* Sub-header & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-display-md text-display-md text-on-surface tracking-tight">
                Selamat Pagi, Budi Santoso
              </h1>
            </div>
            <p className="font-body-md text-body-md text-secondary mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
              Ringkasan Operasional Pool Hari Ini (Senin, 24 Oktober 2024) • Depok & Jakarta Selatan
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-space-sm shrink-0">
            <button
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-title-md text-title-md flex items-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              type="button">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>+ Booking Baru</span>
            </button>
            <button
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-title-md text-title-md flex items-center gap-2 transition-colors"
              type="button">
              <span className="material-symbols-outlined text-[20px] text-primary">logout</span>
              <span>Pemeriksaan Keluar</span>
            </button>
            <button
              className="min-h-[44px] px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-title-md text-title-md flex items-center gap-2 transition-colors"
              type="button">
              <span className="material-symbols-outlined text-[20px] text-secondary">login</span>
              <span>Catat Pengembalian</span>
            </button>
          </div>
        </div>

        {/* Operational Alert Banner */}
        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-md shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface">
                Peringatan Keterlambatan Pengembalian (2 Unit)
              </span>
              <span className="font-body-md text-body-md text-secondary">
                Unit Innova Zenix <span className="font-semibold text-on-surface">B 1928 TYA</span> dan Avanza{" "}
                <span className="font-semibold text-on-surface">B 3819 UKL</span> melewati jatuh tempo pengembalian
                lebih dari 2 jam.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="min-h-[44px] px-4 py-2 rounded-lg bg-surface-container-lowest text-primary font-title-md text-title-md shadow-sm hover:bg-surface transition-colors flex items-center gap-2"
              type="button">
              <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
              <span>Lihat Kontak Penyewa</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          <KPICard
            title="Armada Tersedia"
            statusLabel="Tersedia"
            statusColor="bg-emerald-500"
            metricValue="38"
            metricTotal="/ 65 Unit"
            progressPercent={58.4}
            description="Siap jalan di pool utama & cabang operasional"
          />
          <KPICard
            title="Siap Berangkat"
            statusLabel="Dipesan"
            statusColor="bg-amber-500"
            metricValue="12"
            metricTotal="Unit"
            progressPercent={18.5}
            description="Menunggu jadwal penyerahan kunci hari ini"
          />
          <KPICard
            title="Sedang Berjalan"
            statusLabel="Disewa"
            statusColor="bg-tertiary-container"
            metricValue="11"
            metricTotal="Unit"
            progressPercent={16.9}
            description="Aktif di lapangan bersama pengemudi/lepas kunci"
          />
          <KPICard
            title="Perawatan Bengkel"
            statusLabel="Servis"
            statusColor="bg-error"
            metricValue="4"
            metricTotal="Unit"
            progressPercent={6.2}
            description="2 perawatan rutin berkala, 2 perbaikan fisik"
            isError
          />
        </div>

        {/* Operational Flow: Split Daily Schedules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
          {/* Kolom Kiri: Jadwal Keberangkatan */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col space-y-space-md">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">departure_board</span>
                </div>
                <div>
                  <h2 className="font-title-md text-title-md text-on-surface leading-tight">Jadwal Keberangkatan</h2>
                  <p className="font-body-sm text-body-sm text-secondary">5 unit dijadwalkan keluar hari ini</p>
                </div>
              </div>
              <button
                className="min-h-[44px] px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors"
                type="button">
                Lihat Semua (5)
              </button>
            </div>
            <div className="space-y-3">
              {/* Keberangkatan 1 */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center text-on-surface shrink-0">
                    <span className="font-label-sm text-label-sm text-primary uppercase">JAM</span>
                    <span className="font-title-md text-title-md leading-none">09:00</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container text-on-surface">
                        B 1482 KFD
                      </span>
                      <span className="font-title-md text-title-md text-on-surface">Toyota Avanza 1.5 G (2023)</span>
                    </div>
                    <div className="font-body-sm text-body-sm text-secondary mt-1">
                      Penyewa: <strong className="text-on-surface font-medium">PT Surya Logistik (Pak Deni)</strong> •
                      Sewa 3 Hari
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-700 bg-surface-container-lowest px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Siap Serah Terima
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary">#CRH-2410-091</span>
                    </div>
                  </div>
                </div>
                <button
                  className="min-h-[44px] px-3.5 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md shrink-0 flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-95"
                  type="button">
                  <span className="material-symbols-outlined text-[16px]">key</span>
                  <span>Mulai Serah Terima</span>
                </button>
              </div>

              {/* Keberangkatan 2 */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center text-on-surface shrink-0">
                    <span className="font-label-sm text-label-sm text-primary uppercase">JAM</span>
                    <span className="font-title-md text-title-md leading-none">10:30</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container text-on-surface">
                        B 2884 SSR
                      </span>
                      <span className="font-title-md text-title-md text-on-surface">Toyota Innova Zenix V</span>
                    </div>
                    <div className="font-body-sm text-body-sm text-secondary mt-1">
                      Penyewa: <strong className="text-on-surface font-medium">Ibu Maya Anggraini</strong> • Driver
                      Caruhun (Lepas Kunci)
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-amber-700 bg-surface-container-lowest px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pemeriksaan Fisik Belum Lengkap
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary">#CRH-2410-094</span>
                    </div>
                  </div>
                </div>
                <button
                  className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-dim font-label-md text-label-md shrink-0 flex items-center justify-center gap-1 transition-colors"
                  type="button">
                  <span className="material-symbols-outlined text-[16px]">assignment</span>
                  <span>Check Fisik</span>
                </button>
              </div>

              {/* Keberangkatan 3 */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center text-on-surface shrink-0">
                    <span className="font-label-sm text-label-sm text-primary uppercase">JAM</span>
                    <span className="font-title-md text-title-md leading-none">13:00</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container text-on-surface">
                        B 1019 TRB
                      </span>
                      <span className="font-title-md text-title-md text-on-surface">Toyota HiAce Commuter 15s</span>
                    </div>
                    <div className="font-body-sm text-body-sm text-secondary mt-1">
                      Penyewa: <strong className="text-on-surface font-medium">PT Mandiri Karya Travel</strong> • Paket
                      Plus Pengemudi
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-emerald-700 bg-surface-container-lowest px-2 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Siap Serah Terima
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary">#CRH-2410-098</span>
                    </div>
                  </div>
                </div>
                <button
                  className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-dim font-label-md text-label-md shrink-0 flex items-center justify-center gap-1 transition-colors"
                  type="button">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>Detail Jadwal</span>
                </button>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Jadwal Kedatangan / Pengembalian */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col space-y-space-md">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary-container">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
                <div>
                  <h2 className="font-title-md text-title-md text-on-surface leading-tight">
                    Jadwal Kedatangan & Pengembalian
                  </h2>
                  <p className="font-body-sm text-body-sm text-secondary">4 unit terjadwal masuk hari ini</p>
                </div>
              </div>
              <button
                className="min-h-[44px] px-3 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-dim transition-colors"
                type="button">
                Lihat Semua (4)
              </button>
            </div>
            <div className="space-y-3">
              {/* Kedatangan 1 */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center text-on-surface shrink-0">
                    <span className="font-label-sm text-label-sm text-tertiary-container uppercase">EST</span>
                    <span className="font-title-md text-title-md leading-none">14:30</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container text-on-surface">
                        D 2091 AGH
                      </span>
                      <span className="font-title-md text-title-md text-on-surface">Honda Brio RS CVT</span>
                    </div>
                    <div className="font-body-sm text-body-sm text-secondary mt-1">
                      Penyewa: <strong className="text-on-surface font-medium">Bapak Rizky Kurniawan</strong> • Pool
                      Selatan
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-label-sm">
                      <span className="text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">
                          local_gas_station
                        </span>
                        Status BBM: Sesuai (F)
                      </span>
                      <span className="text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-tertiary-container">verified</span>
                        Deposit: Rp 500.000
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface text-on-surface font-label-md text-label-md shrink-0 flex items-center justify-center gap-1 shadow-sm transition-colors"
                  type="button">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container">fact_check</span>
                  <span>Pemeriksaan Masuk</span>
                </button>
              </div>

              {/* Kedatangan 2 */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center text-on-surface shrink-0">
                    <span className="font-label-sm text-label-sm text-tertiary-container uppercase">EST</span>
                    <span className="font-title-md text-title-md leading-none">16:00</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container text-on-surface">
                        B 2390 POX
                      </span>
                      <span className="font-title-md text-title-md text-on-surface">Mitsubishi Xpander Ultimate</span>
                    </div>
                    <div className="font-body-sm text-body-sm text-secondary mt-1">
                      Penyewa: <strong className="text-on-surface font-medium">Hendro Wicaksono</strong> • Rute Bandung
                      - Jakarta
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-label-sm">
                      <span className="text-amber-800 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-amber-600">
                          notifications_active
                        </span>
                        Pengingat: Konfirmasi Drop-off
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface text-on-surface font-label-md text-label-md shrink-0 flex items-center justify-center gap-1 shadow-sm transition-colors"
                  type="button">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-container">fact_check</span>
                  <span>Pemeriksaan Masuk</span>
                </button>
              </div>

              {/* Kedatangan 3 (Keterlambatan) */}
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center text-on-surface shrink-0">
                    <span className="font-label-sm text-label-sm text-error uppercase">TELAT</span>
                    <span className="font-title-md text-title-md text-error leading-none">11:00</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-error-container text-on-error-container">
                        B 1928 TYA
                      </span>
                      <span className="font-title-md text-title-md text-on-surface">Toyota Innova Zenix 2.0</span>
                    </div>
                    <div className="font-body-sm text-body-sm text-secondary mt-1">
                      Penyewa: <strong className="text-on-surface font-medium">Agus Prasetyo</strong> • Terlambat +3 Jam
                      15 Menit
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-label-sm">
                      <span className="text-error flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[15px]">alarm_on</span>
                        Estimasi Denda: Rp 225.000
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="min-h-[44px] px-3.5 py-2 rounded-lg bg-error text-on-error font-label-md text-label-md shrink-0 flex items-center justify-center gap-1 shadow-sm hover:opacity-95 transition-opacity"
                  type="button">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Hubungi Cepat</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Fleet Monitoring Table Section */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col space-y-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div>
              <h2 className="font-display-md text-display-md text-on-surface tracking-tight">
                Status & Kesiapan Armada
              </h2>
              <p className="font-body-md text-body-md text-secondary">
                Pantau lokasi, bensin, dan status pemeriksaan 65 unit kendaraan
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-surface-container rounded-lg overflow-x-auto">
              <FilterTabButton label="Semua (65)" active={activeTab === "all"} onClick={() => setActiveTab("all")} />
              <FilterTabButton
                label="Tersedia (38)"
                active={activeTab === "Tersedia"}
                onClick={() => setActiveTab("Tersedia")}
              />
              <FilterTabButton
                label="Dipesan (12)"
                active={activeTab === "Dipesan"}
                onClick={() => setActiveTab("Dipesan")}
              />
              <FilterTabButton
                label="Disewa (11)"
                active={activeTab === "Disewa"}
                onClick={() => setActiveTab("Disewa")}
              />
              <FilterTabButton
                label="Servis (4)"
                active={activeTab === "Servis"}
                onClick={() => setActiveTab("Servis")}
              />
            </div>
          </div>

          {/* Filter & Search Sub-bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-xs">
            <div className="relative w-full sm:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-secondary">
                search
              </span>
              <input
                className="w-full h-11 pl-9 pr-3 rounded-lg bg-surface-container text-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Cari Plat nomor atau tipe unit..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-space-xs w-full sm:w-auto justify-end">
              <button
                className="min-h-[44px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors"
                type="button">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Filter Lanjutan</span>
              </button>
              <button
                className="min-h-[44px] px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors"
                type="button">
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* Table Armada */}
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-secondary font-label-md text-label-md h-11">
                  <th className="px-4 py-2 font-semibold">UNIT & NO. POLISI</th>
                  <th className="px-4 py-2 font-semibold">KATEGORI</th>
                  <th className="px-4 py-2 font-semibold">STATUS</th>
                  <th className="px-4 py-2 font-semibold">LOKASI & POOL</th>
                  <th className="px-4 py-2 font-semibold">ODOMETER & BBM</th>
                  <th className="px-4 py-2 font-semibold text-right">AKSI CEPAT</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-container">
                {filteredFleet.length > 0 ? (
                  filteredFleet.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                            <span className="material-symbols-outlined text-[20px]">
                              {item.status === "Servis" ? "directions_bus" : "directions_car"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-title-md text-title-md font-semibold text-on-surface tracking-tight">
                              {item.name}
                            </span>
                            <span className="font-label-sm text-label-sm text-secondary font-mono">
                              {item.nopol} • {item.transmission} ({item.year})
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-sm text-label-sm">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div
                          className={`flex items-center gap-1.5 ${
                            item.status === "Servis" ? "text-error" : "text-on-surface"
                          }`}>
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              item.isLocationEnRoute
                                ? "text-tertiary-container"
                                : item.status === "Servis"
                                  ? ""
                                  : "text-secondary"
                            }`}>
                            {item.status === "Servis" ? "build" : item.isLocationEnRoute ? "navigation" : "location_on"}
                          </span>
                          <span>{item.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col font-label-md text-label-md">
                          <span>{item.odometer}</span>
                          <span
                            className={`font-semibold flex items-center gap-1 text-[11px] ${
                              item.status === "Servis"
                                ? "text-error"
                                : item.status === "Disewa"
                                  ? "text-tertiary"
                                  : item.status === "Dipesan"
                                    ? "text-amber-700"
                                    : "text-emerald-700"
                            }`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {item.status === "Servis" ? "engineering" : "local_gas_station"}
                            </span>
                            {item.fuel}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          className="min-h-[44px] px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-md text-label-md inline-flex items-center gap-1 transition-colors"
                          type="button">
                          <span className="material-symbols-outlined text-[18px]">{item.actionIcon}</span>
                          <span>{item.actionText}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-6 text-center text-secondary" colSpan={6}>
                      Tidak ada armada yang sesuai dengan kriteria pencarian/filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-sm">
            <span className="font-body-sm text-body-sm text-secondary">
              Menampilkan {filteredFleet.length} dari total 65 armada Caruhun
            </span>
            <div className="flex items-center gap-1">
              <button
                className="min-h-[44px] min-w-[44px] rounded-lg bg-surface-container text-secondary flex items-center justify-center hover:text-on-surface disabled:opacity-40 transition-colors"
                disabled
                type="button">
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                className="min-h-[44px] min-w-[44px] rounded-lg bg-primary-container text-on-primary font-label-md text-label-md flex items-center justify-center"
                type="button">
                1
              </button>
              <button
                className="min-h-[44px] min-w-[44px] rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors"
                type="button">
                2
              </button>
              <button
                className="min-h-[44px] min-w-[44px] rounded-lg bg-surface-container hover:bg-surface-dim text-on-surface font-label-md text-label-md flex items-center justify-center transition-colors"
                type="button">
                3
              </button>
              <button
                className="min-h-[44px] min-w-[44px] rounded-lg bg-surface-container text-secondary flex items-center justify-center hover:text-on-surface transition-colors"
                type="button">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
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
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="font-title-md text-title-md text-secondary">{title}</span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-md text-label-md text-on-surface">
          <span className={`w-2 h-2 rounded-full ${statusColor}`}></span>
          {statusLabel}
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className={`font-data-metric text-data-metric ${isError ? "text-error" : "text-on-surface"}`}>
            {metricValue}
          </span>
          <span className="font-body-md text-body-md text-secondary">{metricTotal}</span>
        </div>
        <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
          <div className={`${statusColor} h-1.5 rounded-full`} style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="font-body-sm text-body-sm text-secondary pt-2">{description}</p>
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
      className={`min-h-[36px] px-3 py-1.5 rounded-md font-label-md text-label-md transition-colors whitespace-nowrap ${
        active ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-secondary hover:text-on-surface"
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
  if (status === "Dipesan") dotColor = "bg-amber-500";
  if (status === "Disewa") dotColor = "bg-tertiary-container";
  if (status === "Servis") dotColor = "bg-error";

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-md text-label-md text-on-surface">
      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
}
