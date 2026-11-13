"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomSelect from "@/components/CustomSelect";

type ActiveTab = "tarif" | "ongkir";
type PackageTab = "lepas-kunci" | "dengan-driver" | "bandara";
type CategoryFilter = "semua" | "mpv" | "city" | "suv" | "minibus";

interface VehicleRate {
  id: string;
  name: string;
  category: CategoryFilter;
  categoryLabel: string;
  transmission: string;
  luggage: string;
  selfDrive: {
    rate12h: number | null;
    rate24h: number;
    rate30d: number;
    deposit: number;
  } | null;
  withDriver: {
    rate12h: number;
    rate24h: number;
    overtimePerHour: number;
    deposit: number;
    note: string;
  };
  airport: {
    cgk: number;
    hlp: number;
    whoosh: number;
  };
}

interface DeliveryZone {
  id: string;
  district: string;
  city: string;
  normalFee: number;
  nightDropFee: number;
  nightPickupFee: number;
}

const VEHICLE_RATES: VehicleRate[] = [
  {
    id: "1",
    name: "Honda Brio RS Urbanite",
    category: "city",
    categoryLabel: "City Car • 5 Kursi",
    transmission: "Matic CVT",
    luggage: "2 Koper Kabin",
    selfDrive: {
      rate12h: 250000,
      rate24h: 350000,
      rate30d: 8500000,
      deposit: 500000,
    },
    withDriver: {
      rate12h: 450000,
      rate24h: 550000,
      overtimePerHour: 45000,
      deposit: 300000,
      note: "Unit + Jasa Driver",
    },
    airport: {
      cgk: 450000,
      hlp: 350000,
      whoosh: 350000,
    },
  },
  {
    id: "2",
    name: "Toyota Avanza 1.5 G",
    category: "mpv",
    categoryLabel: "MPV Keluarga • 7 Kursi",
    transmission: "Automatic (CVT)",
    luggage: "3 Koper Sedang",
    selfDrive: {
      rate12h: 325000,
      rate24h: 450000,
      rate30d: 10500000,
      deposit: 500000,
    },
    withDriver: {
      rate12h: 525000,
      rate24h: 650000,
      overtimePerHour: 50000,
      deposit: 300000,
      note: "Unit + Jasa Driver",
    },
    airport: {
      cgk: 500000,
      hlp: 400000,
      whoosh: 400000,
    },
  },
  {
    id: "3",
    name: "Toyota Innova Zenix 2.0 V",
    category: "mpv",
    categoryLabel: "Premium MPV • 7 Kursi",
    transmission: "Automatic",
    luggage: "4 Koper Besar",
    selfDrive: {
      rate12h: 600000,
      rate24h: 800000,
      rate30d: 18500000,
      deposit: 1000000,
    },
    withDriver: {
      rate12h: 800000,
      rate24h: 1000000,
      overtimePerHour: 75000,
      deposit: 500000,
      note: "Unit + Driver VIP",
    },
    airport: {
      cgk: 700000,
      hlp: 550000,
      whoosh: 550000,
    },
  },
  {
    id: "4",
    name: "Mitsubishi Pajero Sport Dakar",
    category: "suv",
    categoryLabel: "SUV Tough • 7 Kursi",
    transmission: "Automatic 8-Speed",
    luggage: "4 Koper Besar",
    selfDrive: {
      rate12h: null,
      rate24h: 1200000,
      rate30d: 26000000,
      deposit: 1500000,
    },
    withDriver: {
      rate12h: 1150000,
      rate24h: 1450000,
      overtimePerHour: 100000,
      deposit: 750000,
      note: "Unit + Driver VIP",
    },
    airport: {
      cgk: 950000,
      hlp: 800000,
      whoosh: 800000,
    },
  },
  {
    id: "5",
    name: "Toyota HiAce Commuter",
    category: "minibus",
    categoryLabel: "Minibus • 16 Kursi",
    transmission: "Manual Diesel",
    luggage: "10+ Koper Rombongan",
    selfDrive: null,
    withDriver: {
      rate12h: 1100000,
      rate24h: 1300000,
      overtimePerHour: 100000,
      deposit: 750000,
      note: "Wajib Driver Caruhun",
    },
    airport: {
      cgk: 1100000,
      hlp: 900000,
      whoosh: 900000,
    },
  },
];

const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: "bogor-tengah",
    district: "Bogor Tengah",
    city: "Kota Bogor",
    normalFee: 50000,
    nightDropFee: 100000,
    nightPickupFee: 100000,
  },
  {
    id: "bogor-utara",
    district: "Bogor Utara",
    city: "Kota Bogor",
    normalFee: 60000,
    nightDropFee: 110000,
    nightPickupFee: 110000,
  },
  {
    id: "bogor-barat",
    district: "Bogor Barat / Dramaga",
    city: "Kab. Bogor",
    normalFee: 75000,
    nightDropFee: 125000,
    nightPickupFee: 125000,
  },
  {
    id: "cibinong",
    district: "Cibinong",
    city: "Kab. Bogor",
    normalFee: 100000,
    nightDropFee: 150000,
    nightPickupFee: 150000,
  },
  {
    id: "sentul",
    district: "Babakan Madang / Sentul",
    city: "Kab. Bogor",
    normalFee: 110000,
    nightDropFee: 160000,
    nightPickupFee: 160000,
  },
  {
    id: "ciawi",
    district: "Ciawi / Puncak Bawah",
    city: "Kab. Bogor",
    normalFee: 120000,
    nightDropFee: 170000,
    nightPickupFee: 170000,
  },
  {
    id: "beji",
    district: "Beji / Margonda",
    city: "Kota Depok",
    normalFee: 150000,
    nightDropFee: 200000,
    nightPickupFee: 200000,
  },
  {
    id: "cinere",
    district: "Cinere / Limo",
    city: "Kota Depok",
    normalFee: 175000,
    nightDropFee: 225000,
    nightPickupFee: 225000,
  },
  {
    id: "cilandak",
    district: "Cilandak / TB Simatupang",
    city: "Jakarta Selatan",
    normalFee: 210000,
    nightDropFee: 260000,
    nightPickupFee: 260000,
  },
  {
    id: "kebayoran",
    district: "Kebayoran Baru / Sudirman",
    city: "Jakarta Selatan",
    normalFee: 230000,
    nightDropFee: 280000,
    nightPickupFee: 280000,
  },
  {
    id: "bekasi-barat",
    district: "Bekasi Barat",
    city: "Kota Bekasi",
    normalFee: 220000,
    nightDropFee: 270000,
    nightPickupFee: 270000,
  },
  {
    id: "soetta",
    district: "Bandara Soekarno-Hatta",
    city: "Tangerang",
    normalFee: 320000,
    nightDropFee: 370000,
    nightPickupFee: 400000,
  },
];

const TIME_SLOT_OPTIONS = [
  { value: "normal", label: "Jam Normal (06.00 – 21.00 WIB)" },
  { value: "night-drop", label: "Pengantaran Malam (> 21.00 WIB)" },
  { value: "night-pickup", label: "Penjemputan Malam (> 22.00 WIB)" },
];

export default function TarifDanOngkirPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("tarif");
  const [packageTab, setPackageTab] = useState<PackageTab>("lepas-kunci");
  const [catFilter, setCatFilter] = useState<CategoryFilter>("semua");

  const [zoneSearch, setZoneSearch] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState<string>(DELIVERY_ZONES[0].id);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("normal");

  const filteredRates = useMemo(() => {
    return VEHICLE_RATES.filter((v) => {
      if (packageTab === "lepas-kunci" && !v.selfDrive) return false;
      if (catFilter !== "semua" && v.category !== catFilter) return false;
      return true;
    });
  }, [packageTab, catFilter]);

  const filteredZones = useMemo(() => {
    if (!zoneSearch.trim()) return DELIVERY_ZONES;
    const q = zoneSearch.toLowerCase();
    return DELIVERY_ZONES.filter((z) => z.district.toLowerCase().includes(q) || z.city.toLowerCase().includes(q));
  }, [zoneSearch]);

  const selectedZone = useMemo(
    () => DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[0],
    [selectedZoneId],
  );

  const calculatedOngkir = useMemo(() => {
    if (selectedTimeSlot === "night-drop") return selectedZone.nightDropFee;
    if (selectedTimeSlot === "night-pickup") return selectedZone.nightPickupFee;
    return selectedZone.normalFee;
  }, [selectedZone, selectedTimeSlot]);

  const zoneSelectOptions = useMemo(
    () =>
      DELIVERY_ZONES.map((z) => ({
        value: z.id,
        label: `${z.district} (${z.city})`,
      })),
    [],
  );

  const handleOrderOngkirWA = () => {
    const adminPhone = "6281234567890";
    const slotLabel = TIME_SLOT_OPTIONS.find((t) => t.value === selectedTimeSlot)?.label || "Jam Normal";

    const msg = `Halo Admin Caruhun Rental, saya ingin konfirmasi layanan antar/jemput unit:

- *Area / Kecamatan:* ${selectedZone.district} (${selectedZone.city})
- *Waktu:* ${slotLabel}
- *Estimasi Ongkir:* Rp ${calculatedOngkir.toLocaleString("id-ID")} (per arah)

Mohon info ketersediaan jadwal pengantaran. Terima kasih.`;

    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body-md text-slate-900 antialiased">
      <Navbar />

      {/* ================= HERO + TAB SWITCHER (CENTERED & SIMETRIS) ================= */}
      <section className="bg-white pt-32 sm:pt-36 pb-14 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            Transparansi Biaya
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tarif Sewa & Ongkir <br />
            <span className="text-amber-600">Jelas Sejak Awal</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Pilih paket layanan untuk melihat rincian harga resmi per durasi sewa, nominal deposit, serta simulasi biaya
            antar-jemput unit ke lokasi Anda.
          </p>

          {/* Switcher Utama Centered 50:50 */}
          <div className="pt-2 flex justify-center">
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 w-full max-w-md shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("tarif")}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold text-center transition-all cursor-pointer ${
                  activeTab === "tarif" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}>
                Daftar Tarif Sewa
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ongkir")}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold text-center transition-all cursor-pointer ${
                  activeTab === "ongkir" ? "bg-amber-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}>
                Cek Ongkir Antar-Jemput
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TAB 1: DAFTAR TARIF PER PAKET ================= */}
      {activeTab === "tarif" && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {/* Satu Bar Kontrol Terpadu (Paket di Kiri, Filter Tipe & CTA di Kanan) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Pilihan Paket */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "lepas-kunci", label: "Lepas Kunci" },
                  { id: "dengan-driver", label: "Dengan Driver" },
                  { id: "bandara", label: "Drop-off Bandara" },
                ].map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setPackageTab(pkg.id as PackageTab)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      packageTab === pkg.id
                        ? "bg-amber-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                    }`}>
                    {pkg.label}
                  </button>
                ))}
              </div>

              {/* Filter Tipe Mobil + Tombol Cek Unit */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "semua", label: "Semua" },
                    { id: "city", label: "City Car" },
                    { id: "mpv", label: "MPV" },
                    { id: "suv", label: "SUV" },
                    { id: "minibus", label: "Minibus" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCatFilter(cat.id as CategoryFilter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        catFilter === cat.id
                          ? "bg-amber-50 text-amber-700 border-amber-300"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}>
                      {cat.label}
                    </button>
                  ))}
                </div>

                <Link
                  href={`/cari?paket=${packageTab}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs inline-flex items-center justify-center transition-all ml-auto lg:ml-2">
                  Cek Unit →
                </Link>
              </div>
            </div>

            {/* Tabel Dinamis Berdasarkan Paket Dipilih */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    {packageTab === "lepas-kunci" && (
                      <tr className="bg-stone-900 text-white text-[11px] uppercase tracking-wider">
                        <th className="px-5 py-4 font-bold">Tipe Unit</th>
                        <th className="px-5 py-4 font-bold">12 Jam</th>
                        <th className="px-5 py-4 font-bold text-amber-400">24 Jam (Harian)</th>
                        <th className="px-5 py-4 font-bold">30 Hari (Bulanan)</th>
                        <th className="px-5 py-4 font-bold">Deposit Jaminan</th>
                      </tr>
                    )}

                    {packageTab === "dengan-driver" && (
                      <tr className="bg-stone-900 text-white text-[11px] uppercase tracking-wider">
                        <th className="px-5 py-4 font-bold">Tipe Unit</th>
                        <th className="px-5 py-4 font-bold">12 Jam (Dalam Kota)</th>
                        <th className="px-5 py-4 font-bold text-amber-400">24 Jam / Full Day</th>
                        <th className="px-5 py-4 font-bold">Overtime / Jam</th>
                        <th className="px-5 py-4 font-bold">Deposit Jaminan</th>
                      </tr>
                    )}

                    {packageTab === "bandara" && (
                      <tr className="bg-stone-900 text-white text-[11px] uppercase tracking-wider">
                        <th className="px-5 py-4 font-bold">Tipe Unit</th>
                        <th className="px-5 py-4 font-bold text-amber-400">Bandara Soetta (CGK)</th>
                        <th className="px-5 py-4 font-bold">Bandara Halim (HLP)</th>
                        <th className="px-5 py-4 font-bold">Stasiun Whoosh Halim</th>
                        <th className="px-5 py-4 font-bold">Kapasitas Bagasi</th>
                      </tr>
                    )}
                  </thead>

                  <tbody className="divide-y divide-slate-200/80">
                    {filteredRates.map((item) => (
                      <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-extrabold text-slate-900">{item.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.categoryLabel} • {item.transmission}
                          </div>
                        </td>

                        {/* Kolom Paket 1: Lepas Kunci */}
                        {packageTab === "lepas-kunci" && item.selfDrive && (
                          <>
                            <td className="px-5 py-4 text-slate-700 font-medium">
                              {item.selfDrive.rate12h ? (
                                `Rp ${item.selfDrive.rate12h.toLocaleString("id-ID")}`
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Min. 24 jam</span>
                              )}
                            </td>
                            <td className="px-5 py-4 font-extrabold text-amber-700 bg-amber-50/50">
                              Rp {item.selfDrive.rate24h.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-4 text-slate-800 font-semibold">
                              Rp {item.selfDrive.rate30d.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-4 text-slate-700 font-semibold">
                              Rp {item.selfDrive.deposit.toLocaleString("id-ID")}
                            </td>
                          </>
                        )}

                        {/* Kolom Paket 2: Dengan Driver */}
                        {packageTab === "dengan-driver" && (
                          <>
                            <td className="px-5 py-4 text-slate-700 font-semibold">
                              Rp {item.withDriver.rate12h.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-4 font-extrabold text-amber-700 bg-amber-50/50">
                              Rp {item.withDriver.rate24h.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-4 text-slate-700 font-medium">
                              Rp {item.withDriver.overtimePerHour.toLocaleString("id-ID")} / jam
                            </td>
                            <td className="px-5 py-4">
                              <div className="font-semibold text-slate-800">
                                Rp {item.withDriver.deposit.toLocaleString("id-ID")}
                              </div>
                              <span className="block text-[11px] text-slate-500 mt-0.5">{item.withDriver.note}</span>
                            </td>
                          </>
                        )}

                        {/* Kolom Paket 3: Drop-off Bandara */}
                        {packageTab === "bandara" && (
                          <>
                            <td className="px-5 py-4 font-extrabold text-amber-700 bg-amber-50/50">
                              Rp {item.airport.cgk.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-4 text-slate-800 font-semibold">
                              Rp {item.airport.hlp.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-4 text-slate-800 font-semibold">
                              Rp {item.airport.whoosh.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-4 text-slate-600 text-xs font-medium">{item.luggage}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Catatan Ketentuan Dinamis Sesuai Paket */}
            {packageTab === "lepas-kunci" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Pengembalian Deposit</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Deposit jaminan dikembalikan 100% via transfer maksimal 1×24 jam setelah unit kembali tanpa kendala
                    atau pelanggaran ETLE.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Toleransi & Overtime</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Toleransi keterlambatan pengembalian 1 jam. Selebihnya dikenakan biaya overtime 10% per jam dari
                    tarif harian unit.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Ketentuan BBM (Bar-to-Bar)</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tarif Lepas Kunci belum termasuk BBM, tol, dan parkir. Posisi indikator BBM saat kembali wajib sama
                    seperti saat serah terima awal.
                  </p>
                </div>
              </div>
            )}

            {packageTab === "dengan-driver" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Ketentuan Deposit Jaminan</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Deposit jaminan digunakan untuk mengantisipasi biaya overtime, rute tambahan, atau tol/parkir di
                    akhir perjalanan, dan sisanya dikembalikan penuh maksimal 1×24 jam.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Biaya Operasional Perjalanan</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Tarif tertera mencakup unit dan jasa pengemudi. BBM, tol, parkir, dan uang makan driver (Rp
                    75.000/hari) ditanggung penyewa.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Perjalanan Menginap Luar Kota</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Untuk perjalanan luar kota menginap, penyewa menyediakan akomodasi penginapan driver atau biaya
                    penginapan Rp 150.000/malam.
                  </p>
                </div>
              </div>
            )}

            {packageTab === "bandara" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Tarif All-In Sekali Jalan</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Harga paket Drop-off Bandara sudah termasuk unit, driver, BBM, dan biaya tol dari titik jemput
                    wilayah Bogor ke terminal tujuan.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Penjemputan Bandara (Pick-up)</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Untuk penjemputan dari bandara ke Bogor berlaku tarif yang sama (hanya menambah biaya parkir resmi
                    bandara sesuai struk).
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 border-l-4 border-l-amber-500 space-y-1.5">
                  <h3 className="font-bold text-xs text-slate-900">Garansi Tepat Waktu</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Driver standby di lokasi penjemputan minimal 30 menit sebelum jadwal keberangkatan agar Anda tidak
                    terburu-buru mengejar penerbangan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= TAB 2: CEK ONGKIR ANTAR-JEMPUT ================= */}
      {activeTab === "ongkir" && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Simulasi Biaya Pengantaran
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold mt-1">Hitung Ongkir ke Lokasi Anda</h2>
                  <p className="text-xs text-stone-400 mt-1">
                    Ongkir dihitung per kecamatan, per unit, per arah (antar saja atau jemput saja). Pengambilan
                    langsung di Pool Caruhun gratis biaya ongkir.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-900">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">Pilih Kecamatan / Area</label>
                    <CustomSelect value={selectedZoneId} onChange={setSelectedZoneId} options={zoneSelectOptions} />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-300 mb-1">Waktu Antar / Jemput</label>
                    <CustomSelect value={selectedTimeSlot} onChange={setSelectedTimeSlot} options={TIME_SLOT_OPTIONS} />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-stone-800/90 border border-stone-700 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] text-stone-400 block">Estimasi Ongkir ({selectedZone.district}):</span>
                  <div className="text-3xl font-extrabold text-amber-400 mt-1">
                    Rp {calculatedOngkir.toLocaleString("id-ID")}
                    <span className="text-xs font-normal text-stone-400"> / arah</span>
                  </div>
                  <span className="text-[11px] text-stone-400 block mt-1">
                    Pulang-Pergi (Antar + Jemput):{" "}
                    <strong className="text-white">Rp {(calculatedOngkir * 2).toLocaleString("id-ID")}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOrderOngkirWA}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
                  <span>Pesan Antar-Jemput via WA</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Daftar Tarif per Kecamatan</h3>
                  <p className="text-xs text-slate-500">
                    Menampilkan {filteredZones.length} wilayah jangkauan pengantaran armada.
                  </p>
                </div>

                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Cari kecamatan atau kota..."
                    value={zoneSearch}
                    onChange={(e) => setZoneSearch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-[11px] uppercase tracking-wider border-b border-slate-200">
                        <th className="px-5 py-3.5 font-extrabold">Kecamatan / Area</th>
                        <th className="px-5 py-3.5 font-extrabold">Jam Normal</th>
                        <th className="px-5 py-3.5 font-extrabold">Antar &gt; 21.00</th>
                        <th className="px-5 py-3.5 font-extrabold">Jemput &gt; 22.00</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredZones.length > 0 ? (
                        filteredZones.map((zone) => (
                          <tr
                            key={zone.id}
                            onClick={() => setSelectedZoneId(zone.id)}
                            className={`cursor-pointer transition-colors ${
                              selectedZoneId === zone.id ? "bg-amber-50/80" : "hover:bg-slate-50"
                            }`}>
                            <td className="px-5 py-3.5">
                              <span className="font-bold text-slate-900 block">{zone.district}</span>
                              <span className="text-[11px] text-slate-500">{zone.city}</span>
                            </td>
                            <td className="px-5 py-3.5 font-extrabold text-slate-900">
                              Rp {zone.normalFee.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 font-medium">
                              Rp {zone.nightDropFee.toLocaleString("id-ID")}
                            </td>
                            <td className="px-5 py-3.5 text-slate-600 font-medium">
                              Rp {zone.nightPickupFee.toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-500">
                            Kecamatan tidak ditemukan. Hubungi admin via WhatsApp untuk pengecekan tarif area luar
                            jangkauan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
