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
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen">
      <div className="flex flex-col w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ================= HEADER UTAMA ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Selamat Pagi, Budi Santoso
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-amber-600">schedule</span>
              <span>Ringkasan Operasional Pool Hari Ini (Senin, 24 Okt 2024) • Depok & Jakarta Selatan</span>
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
              type="button">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Booking Baru</span>
            </button>
            <button
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              type="button">
              <span className="material-symbols-outlined text-[18px] text-slate-500">logout</span>
              <span>Pemeriksaan Keluar</span>
            </button>
            <button
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              type="button">
              <span className="material-symbols-outlined text-[18px] text-slate-500">login</span>
              <span>Catat Pengembalian</span>
            </button>
          </div>
        </div>

        {/* ================= OPERATIONAL ALERT BANNER ================= */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900">Peringatan Keterlambatan Pengembalian (2 Unit)</span>
              <span className="text-xs text-slate-600 mt-0.5">
                Unit Innova Zenix <strong className="text-slate-900 font-semibold">B 1928 TYA</strong> dan Avanza{" "}
                <strong className="text-slate-900 font-semibold">B 3819 UKL</strong> melewati jatuh tempo pengembalian
                lebih dari 2 jam.
              </span>
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-100/60 font-bold text-xs transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer shadow-2xs"
            type="button">
            <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
            <span>Lihat Kontak Penyewa</span>
          </button>
        </div>

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
              1 Peringatan
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

        {/* ================= KPI METRICS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
            statusColor="bg-sky-500"
            metricValue="11"
            metricTotal="Unit"
            progressPercent={16.9}
            description="Aktif di lapangan bersama pengemudi/lepas kunci"
          />
          <KPICard
            title="Perawatan Bengkel"
            statusLabel="Servis"
            statusColor="bg-rose-500"
            metricValue="4"
            metricTotal="Unit"
            progressPercent={6.2}
            description="2 perawatan rutin berkala, 2 perbaikan fisik"
            isError
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
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
              Lihat Semua Rental
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <ActiveRentalCard
              unitName="Toyota Fortuner"
              nopol="B 1966 SBB"
              renterName="Deni"
              renterPhone="085141610411"
              departureTime="12 Okt, 12:00"
              returnTime="13 Okt, 12:05"
              totalFee="Rp750.000"
              paymentStatus="Sewa Lunas"
              remainingFee="Rp0"
              adminName="Naila"
              isOverdue={true}
            />
            <ActiveRentalCard
              unitName="Toyota Calya"
              nopol="D 3333 YR"
              renterName="Rini Azlia"
              renterPhone="0817854"
              departureTime="12 Okt, 12:07"
              returnTime="13 Okt, 12:10"
              totalFee="Rp450.000"
              paymentStatus="Sewa Belum Bayar"
              remainingFee="Rp450.000"
              extraNote="Sisa Sewa: Rp450.000"
              adminName="Naila"
              isOverdue={true}
            />
            <ActiveRentalCard
              unitName="Honda Brio"
              nopol="B 1234 BKC"
              renterName="Rizki Ramdhani"
              renterPhone="081244321000"
              departureTime="12 Okt, 20:00"
              returnTime="13 Okt, 20:00"
              totalFee="Rp450.000"
              paymentStatus="Sewa Lunas"
              remainingFee="Rp0"
              adminName="Naila"
              isOverdue={true}
            />
            <ActiveRentalCard
              unitName="Mitsubishi Pajero"
              nopol="E 5555 LJ"
              renterName="Asha"
              renterPhone="08123456789"
              departureTime="12 Okt, 21:00"
              returnTime="13 Okt, 21:00"
              totalFee="Rp750.000"
              paymentStatus="Sewa Lunas"
              remainingFee="Rp0"
              adminName="Naila"
              isOverdue={true}
            />
          </div>
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
                  <p className="text-xs text-slate-500">5 unit dijadwalkan keluar hari ini</p>
                </div>
              </div>
              <button
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                type="button">
                Lihat Semua (5)
              </button>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-900 shrink-0 shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-600 tracking-wider">JAM</span>
                    <span className="font-extrabold text-sm leading-none">09:00</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-800 text-[11px] font-mono font-bold">
                        B 1482 KFD
                      </span>
                      <span className="font-bold text-sm text-slate-900">Toyota Avanza 1.5 G (2023)</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Penyewa: <strong className="text-slate-900 font-medium">PT Surya Logistik (Pak Deni)</strong> •
                      Sewa 3 Hari
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Siap Serah Terima
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">#CRH-2410-091</span>
                    </div>
                  </div>
                </div>
                <button
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  type="button">
                  <span className="material-symbols-outlined text-[16px]">key</span>
                  <span>Mulai Serah Terima</span>
                </button>
              </div>

              {/* Item 2 */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-900 shrink-0 shadow-2xs">
                    <span className="text-[10px] font-bold text-amber-600 tracking-wider">JAM</span>
                    <span className="font-extrabold text-sm leading-none">10:30</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-800 text-[11px] font-mono font-bold">
                        B 2884 SSR
                      </span>
                      <span className="font-bold text-sm text-slate-900">Toyota Innova Zenix V</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Penyewa: <strong className="text-slate-900 font-medium">Ibu Maya Anggraini</strong> • Driver
                      Caruhun
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Fisik Belum Lengkap
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">#CRH-2410-094</span>
                    </div>
                  </div>
                </div>
                <button
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  type="button">
                  <span className="material-symbols-outlined text-[16px]">assignment</span>
                  <span>Check Fisik</span>
                </button>
              </div>
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
                  <p className="text-xs text-slate-500">4 unit terjadwal masuk hari ini</p>
                </div>
              </div>
              <button
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                type="button">
                Lihat Semua (4)
              </button>
            </div>

            <div className="space-y-3">
              {/* Kedatangan 1 */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100/60 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-900 shrink-0 shadow-2xs">
                    <span className="text-[10px] font-bold text-sky-600 tracking-wider">EST</span>
                    <span className="font-extrabold text-sm leading-none">14:30</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-800 text-[11px] font-mono font-bold">
                        D 2091 AGH
                      </span>
                      <span className="font-bold text-sm text-slate-900">Honda Brio RS CVT</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Penyewa: <strong className="text-slate-900 font-medium">Bapak Rizky Kurniawan</strong>
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] font-medium text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <span className="material-symbols-outlined text-[14px]">local_gas_station</span>
                        BBM: Sesuai (F)
                      </span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <span className="material-symbols-outlined text-[14px] text-amber-600">verified</span>
                        Deposit: Rp 500.000
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  type="button">
                  <span className="material-symbols-outlined text-[16px]">fact_check</span>
                  <span>Pemeriksaan Masuk</span>
                </button>
              </div>

              {/* Kedatangan Keterlambatan */}
              <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-rose-200 flex flex-col items-center justify-center text-rose-700 shrink-0 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider">TELAT</span>
                    <span className="font-extrabold text-sm leading-none">11:00</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[11px] font-mono font-bold">
                        B 1928 TYA
                      </span>
                      <span className="font-bold text-sm text-slate-900">Toyota Innova Zenix 2.0</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Penyewa: <strong className="text-slate-900 font-medium">Agus Prasetyo</strong> • Terlambat +3 Jam
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-rose-700">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">alarm_on</span>
                        Estimasi Denda: Rp 225.000
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  type="button">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Hubungi Cepat</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= REAL-TIME FLEET MONITORING TABLE ================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Status & Kesiapan Armada</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Pantau lokasi, bensin, dan status pemeriksaan 65 unit kendaraan
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto border border-slate-200/60">
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
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Filter Lanjutan</span>
              </button>
              <button
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button">
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* Table Armada */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold text-xs border-b border-slate-200 h-11">
                  <th className="px-4 py-3">UNIT & NO. POLISI</th>
                  <th className="px-4 py-3">KATEGORI</th>
                  <th className="px-4 py-3">STATUS</th>
                  <th className="px-4 py-3">LOKASI & POOL</th>
                  <th className="px-4 py-3">ODOMETER & BBM</th>
                  <th className="px-4 py-3 text-right">AKSI CEPAT</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100">
                {filteredFleet.length > 0 ? (
                  filteredFleet.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
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
                      <td className="px-4 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div
                          className={`flex items-center gap-1.5 font-medium ${item.status === "Servis" ? "text-rose-600" : "text-slate-800"}`}>
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              item.isLocationEnRoute
                                ? "text-sky-600"
                                : item.status === "Servis"
                                  ? "text-rose-500"
                                  : "text-slate-400"
                            }`}>
                            {item.status === "Servis" ? "build" : item.isLocationEnRoute ? "navigation" : "location_on"}
                          </span>
                          <span>{item.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col space-y-0.5">
                          <span className="font-semibold text-slate-800">{item.odometer}</span>
                          <span
                            className={`font-semibold flex items-center gap-1 text-[11px] ${
                              item.status === "Servis"
                                ? "text-rose-600"
                                : item.status === "Disewa"
                                  ? "text-sky-600"
                                  : item.status === "Dipesan"
                                    ? "text-amber-600"
                                    : "text-emerald-600"
                            }`}>
                            <span className="material-symbols-outlined text-[13px]">
                              {item.status === "Servis" ? "engineering" : "local_gas_station"}
                            </span>
                            {item.fuel}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          type="button">
                          <span className="material-symbols-outlined text-[16px]">{item.actionIcon}</span>
                          <span>{item.actionText}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>
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
              Menampilkan <strong className="text-slate-800">{filteredFleet.length}</strong> dari total 65 armada
              Caruhun
            </span>
            <div className="flex items-center gap-1">
              <button
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center disabled:opacity-40"
                disabled
                type="button">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                className="w-9 h-9 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow-xs"
                type="button">
                1
              </button>
              <button
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                type="button">
                2
              </button>
              <button
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                type="button">
                3
              </button>
              <button
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
                type="button">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Komponen Reusable yang Diperhalus
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
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700`}>
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
            style={{ width: `${progressPercent}%` }}
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
        active ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
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
        <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer">
          Tindak Lanjuti
        </button>
      </div>
    </div>
  );
}

interface ActiveRentalCardProps {
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
            <h3 className="font-bold text-sm text-slate-900">
              {unitName} <span className="font-mono text-slate-400 font-normal text-xs">({nopol})</span>
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
              Disewa
            </span>
            {isOverdue && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">warning</span>
                TERLAMBAT
              </span>
            )}
          </div>
        </div>

        <div className="mb-2">
          <span className="font-bold text-xs text-slate-900">{renterName}</span>
          <span className="text-xs text-slate-500 ml-1.5 font-mono">({renterPhone})</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded-xl">
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

      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
          Detail
        </button>
        <button
          type="button"
          className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer">
          <span className="material-symbols-outlined text-[14px]">send</span>
          <span>Kirim Pengingat</span>
        </button>
      </div>
    </div>
  );
}
