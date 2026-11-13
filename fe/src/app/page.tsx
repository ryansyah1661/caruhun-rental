"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomTimePicker from "@/components/CustomTimePicker";
import CustomDurationPicker from "@/components/CustomDurationPicker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type CategoryFilter = "semua" | "mpv" | "city" | "suv" | "minibus";
type ServicePackage = "lepas-kunci" | "dengan-driver" | "bandara";

interface BookedSlot {
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
}

interface CatalogVehicle {
  id: string;
  name: string;
  category: CategoryFilter;
  categoryLabel: string;
  transmission: string;
  seats: number;
  fuelType: string;
  pricePerDay: number;
  priceWithDriverPerDay: number;
  image: string;
  bookedDates: BookedSlot[];
  details: {
    year: number;
    engine: string;
    description: string;
    features: string[];
  };
}

const CATALOG_VEHICLES: CatalogVehicle[] = [
  {
    id: "1",
    name: "Toyota Avanza 1.5 G",
    category: "mpv",
    categoryLabel: "MPV / Keluarga",
    transmission: "Automatic (CVT)",
    seats: 7,
    fuelType: "Bensin",
    pricePerDay: 450000,
    priceWithDriverPerDay: 650000,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
    bookedDates: [{ startDate: "2026-11-15", endDate: "2026-11-17" }],
    details: {
      year: 2023,
      engine: "1.500 cc Dual VVT-i",
      description: "Mobil keluarga favorit dengan kabin luas, irit bensin, dan AC dingin double blower.",
      features: ["AC Double Blower", "Bluetooth Audio", "Sensor Parkir", "Kamera Mundur"],
    },
  },
  {
    id: "2",
    name: "Toyota Innova Zenix 2.0 V",
    category: "mpv",
    categoryLabel: "Premium MPV",
    transmission: "Automatic",
    seats: 7,
    fuelType: "Bensin",
    pricePerDay: 800000,
    priceWithDriverPerDay: 1000000,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
    bookedDates: [],
    details: {
      year: 2024,
      engine: "2.000 cc Dynamic Force",
      description: "Performa mumpuni dengan kenyamanan kelas atas untuk dinas kantor maupun liburan keluarga.",
      features: ["Panoramic Sunroof", "Captain Seat", "Ambient Light", "Power Backdoor"],
    },
  },
  {
    id: "3",
    name: "Honda Brio RS Urbanite",
    category: "city",
    categoryLabel: "City Car",
    transmission: "Matic CVT",
    seats: 5,
    fuelType: "Bensin",
    pricePerDay: 350000,
    priceWithDriverPerDay: 550000,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop",
    bookedDates: [],
    details: {
      year: 2022,
      engine: "1.200 cc i-VTEC",
      description: "Lincah di jalan perkotaan, sangat hemat BBM, dan gampang untuk parkir.",
      features: ["Touchscreen Headunit", "Bodykit RS", "Keyless Entry", "Audio Steering Switch"],
    },
  },
  {
    id: "4",
    name: "Mitsubishi Pajero Sport Dakar",
    category: "suv",
    categoryLabel: "SUV Tough",
    transmission: "Automatic 8-Speed",
    seats: 7,
    fuelType: "Diesel",
    pricePerDay: 1200000,
    priceWithDriverPerDay: 1450000,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    bookedDates: [{ startDate: "2026-11-13", endDate: "2026-11-16" }],
    details: {
      year: 2023,
      engine: "2.400 cc MIVEC Turbo Diesel",
      description: "SUV tangguh dan mewah siap melibas segala rute perjalanan luar kota.",
      features: ["Sunroof", "Leather Seat", "Forward Collision Mitigation", "Paddle Shift"],
    },
  },
  {
    id: "5",
    name: "Toyota HiAce Commuter",
    category: "minibus",
    categoryLabel: "Minibus 16-Seat",
    transmission: "Manual Diesel",
    seats: 16,
    fuelType: "Diesel",
    pricePerDay: 1300000,
    priceWithDriverPerDay: 1300000, // Wajib include driver
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop",
    bookedDates: [],
    details: {
      year: 2021,
      engine: "2.500 cc Turbo Diesel",
      description: "Solusi terbaik untuk rombongan wisata, acara keluarga besar, maupun travel dinas.",
      features: ["Reclining Seat", "Full AC Microbus", "Colokan Charger Phone", "Bagasi Luas"],
    },
  },
];

const HOW_TO_RENT_STEPS = [
  {
    step: "1",
    title: "Pilih Tanggal & Unit",
    desc: "Atur tanggal mulai, jam ambil, dan durasi sewa untuk mengecek unit yang kosong beserta estimasi biayanya.",
  },
  {
    step: "2",
    title: "Kirim Pesanan via WA",
    desc: "Klik tombol Pesan Unit pada mobil pilihanmu. Format detail pesanan otomatis disiapkan menuju WhatsApp Admin.",
  },
  {
    step: "3",
    title: "Verifikasi Dokumen",
    desc: "Untuk paket Lepas Kunci, kirim foto KTP & SIM A aktif. Cukup sekali verifikasi untuk penyewaan berikutnya.",
  },
  {
    step: "4",
    title: "Konfirmasi & Invoice",
    desc: "Admin mengunci jadwal armada dan menerbitkan invoice resmi sesuai jadwal penjemputan atau ambil di pool.",
  },
  {
    step: "5",
    title: "Serah Terima Unit",
    desc: "Cek fisik & indikator BBM bersama petugas kami sebelum serah terima kunci. Mobil siap menemani perjalananmu.",
  },
];

export default function Home() {
  const router = useRouter();

  // Filter & Search States
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Booking & Schedule States
  const [servicePackage, setServicePackage] = useState<ServicePackage>("lepas-kunci");
  const [pickupDate, setPickupDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [pickupTime, setPickupTime] = useState("08:00");
  const [durationDays, setDurationDays] = useState<number>(1);

  // Modal State
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<CatalogVehicle | null>(null);

  // Cek apakah jadwal pilihan customer bentrok dengan jadwal terbooking mobil
  const checkVehicleAvailability = (vehicle: CatalogVehicle) => {
    if (!pickupDate) return { available: true, conflictSlot: null };

    const start = new Date(pickupDate);
    const end = new Date(pickupDate);
    end.setDate(start.getDate() + Math.max(1, durationDays) - 1);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    for (const slot of vehicle.bookedDates) {
      if (startStr <= slot.endDate && endStr >= slot.startDate) {
        return { available: false, conflictSlot: slot };
      }
    }
    return { available: true, conflictSlot: null };
  };

  // Hitung tarif harian sesuai paket yang dipilih
  const getUnitPrice = (vehicle: CatalogVehicle) => {
    if (vehicle.category === "minibus") return vehicle.priceWithDriverPerDay;
    return servicePackage === "dengan-driver" ? vehicle.priceWithDriverPerDay : vehicle.pricePerDay;
  };

  const filteredVehicles = useMemo(() => {
    return CATALOG_VEHICLES.filter((item) => {
      const matchesCat = selectedCategory === "semua" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const { available } = checkVehicleAvailability(item);
      const matchesAvailability = !onlyAvailable || available;
      return matchesCat && matchesSearch && matchesAvailability;
    });
  }, [selectedCategory, searchQuery, onlyAvailable, pickupDate, durationDays]);

  const handleCekArmada = () => {
    const params = new URLSearchParams({
      paket: servicePackage,
      mulai: pickupDate,
      jam: pickupTime,
      hari: String(durationDays),
    });
    router.push(`/cari?${params.toString()}`);
  };

  const handleContactWhatsApp = (vehicle?: CatalogVehicle) => {
    const adminPhoneNumber = "6281234567890";
    const packageLabel =
      servicePackage === "lepas-kunci"
        ? "Lepas Kunci"
        : servicePackage === "dengan-driver"
          ? "Dengan Driver"
          : "Drop-off Bandara";

    if (!vehicle) {
      const msg = `Halo Admin Caruhun Rental, saya ingin berkonsultasi mengenai sewa armada kendaraan (${packageLabel}) untuk tanggal ${pickupDate}.`;
      window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      return;
    }

    const dailyRate = getUnitPrice(vehicle);
    const totalEst = dailyRate * Math.max(1, durationDays);

    const msg = `Halo Admin Caruhun Rental, saya berminat sewa armada:
- *Unit:* ${vehicle.name}
- *Paket:* ${vehicle.category === "minibus" ? "Include Driver" : packageLabel}
- *Tanggal Mulai:* ${pickupDate} (Jam ${pickupTime} WIB)
- *Durasi:* ${durationDays} Hari
- *Estimasi Total:* Rp ${totalEst.toLocaleString("id-ID")}

Mohon konfirmasi ketersediaan jadwal & prosedurnya.`;

    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body-md text-slate-900 antialiased">
      {/* Panggil Component Navbar Header */}
      <Navbar />

      {/* ================= HERO SECTION + CEK JADWAL WIDGET ================= */}
      <section
        id="hero"
        className="bg-white pt-28 sm:pt-36 lg:pt-40 pb-16 lg:pb-20 border-b border-slate-200 relative z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Solusi Armada Berkualitas <br />
            <span className="text-amber-600">Untuk Perjalanan Tanpa Kendala</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Caruhun Rental Armada menyediakan unit kendaraan MPV, SUV, City Car, hingga Minibus dalam kondisi terawat.
            Melayani sewa Lepas Kunci, Paket Dengan Driver, hingga Drop-off Bandara.
          </p>

          {/* Interactive Booking / Schedule Check Bar */}
          <div className="pt-2 text-left relative z-30">
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)] space-y-4">
              {/* Pilihan Paket Layanan */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: "lepas-kunci", label: "Lepas Kunci" },
                    { id: "dengan-driver", label: "Dengan Driver" },
                    { id: "bandara", label: "Drop-off Bandara" },
                  ].map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setServicePackage(pkg.id as ServicePackage)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        servicePackage === pkg.id
                          ? "bg-amber-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}>
                      {pkg.label}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-medium text-slate-500 hidden sm:flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-emerald-600">event_available</span>
                  Pilih tanggal untuk cek armada kosong
                </span>
              </div>

              {/* Input Tanggal, Jam, Durasi & Tombol Cek */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                <CustomDatePicker
                  label="Tanggal Mulai"
                  value={pickupDate}
                  onChange={(newDate) => setPickupDate(newDate)}
                />

                <CustomTimePicker label="Jam Ambil" value={pickupTime} onChange={(newTime) => setPickupTime(newTime)} />

                <CustomDurationPicker
                  label="Lama Sewa"
                  value={durationDays}
                  onChange={(days) => setDurationDays(days)}
                />

                <button
                  type="button"
                  onClick={handleCekArmada}
                  className="h-14.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                  <span>Cek Armada</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TENTANG CARUHUN SECTION ================= */}
      <section id="tentang" className="py-16 bg-slate-100 border-b border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">PROFIL PERUSAHAAN</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
                Tentang Caruhun Rental Armada
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Caruhun Rental Armada adalah penyedia jasa transportasi dan sewa kendaraan terdepan yang berkomitmen
                memberikan pengalaman perjalanan aman, nyaman, dan efisien. Dengan dukungan sistem manajemen operasional
                modern, kami memastikan setiap armada dalam kondisi terbaik siap jalan.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-2xl font-extrabold text-slate-900">65+ Unit</span>
                  <span className="text-xs text-slate-500">Armada Siap Pakai</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-2xl font-extrabold text-emerald-600">99.8%</span>
                  <span className="text-xs text-slate-500">Kepuasan Pelanggan</span>
                </div>
              </div>
            </div>

            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop"
                alt="Caruhun Fleet Pool"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEUNGGULAN SECTION ================= */}
      <section id="keunggulan" className="py-16 bg-white border-b border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">MENGAPA MEMILIH KAMI</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Keunggulan Sewa di Caruhun</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Unit Prima & Terawat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap mobil rutin diservis berkala dan dibersihkan sebelum penyerahan ke penyewa.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">key</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Lepas Kunci & Driver</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pilihan paket fleksibel sesuai kebutuhan Anda, lepas kunci maupun plus pengemudi berpengalaman.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Respon Cepat 24/7</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tim admin dan petugas pool siap melayani reservasi dan pertanyaan Anda setiap saat.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">Tarif Transparan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harga jujur tanpa biaya tersembunyi dengan nota resmi terbit secara cepat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KATALOG ARMADA SECTION ================= */}
      <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 scroll-mt-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              JADWAL {pickupDate} ({durationDays} HARI)
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 mt-1">Pilihan Mobil Sewa Caruhun</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input Unit */}
            <div className="relative">
              <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                placeholder="Cari tipe unit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Filter Hanya yang Tersedia */}
            <button
              type="button"
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                onlyAvailable
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}>
              <span className="material-symbols-outlined text-[16px]">
                {onlyAvailable ? "check_box" : "check_box_outline_blank"}
              </span>
              <span>Hanya yang Kosong</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "semua", label: "Semua Unit" },
            { id: "mpv", label: "MPV" },
            { id: "city", label: "City Car" },
            { id: "suv", label: "SUV" },
            { id: "minibus", label: "Minibus" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => {
              const { available, conflictSlot } = checkVehicleAvailability(vehicle);
              const unitPrice = getUnitPrice(vehicle);
              const totalEstimate = unitPrice * Math.max(1, durationDays);

              return (
                <div
                  key={vehicle.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all flex flex-col justify-between group ${
                    available ? "border-slate-200 hover:shadow-lg" : "border-rose-200/80 bg-slate-50/70"
                  }`}>
                  <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className={`w-full h-full object-cover transition-transform duration-300 ${
                        available ? "group-hover:scale-105" : "grayscale-[35%] opacity-85"
                      }`}
                    />
                    <div className="absolute top-3 right-3">
                      {available ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Tersedia
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[11px] shadow-sm">
                          Sudah Dibooking
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                      {vehicle.categoryLabel}
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{vehicle.name}</h3>

                      {/* Info Jadwal Bentrok Jika Sudah Dibooking */}
                      {!available && conflictSlot && (
                        <div className="mt-2 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-medium flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] shrink-0">event_busy</span>
                          <span>
                            Terjadwal sewa: <strong>{conflictSlot.startDate}</strong> s/d{" "}
                            <strong>{conflictSlot.endDate}</strong>
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">tune</span>
                          <span className="truncate">{vehicle.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">group</span>
                          <span>{vehicle.seats} Kursi</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-slate-400">
                            local_gas_station
                          </span>
                          <span>{vehicle.fuelType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-[11px] text-slate-500 font-medium block">
                            Tarif{" "}
                            {vehicle.category === "minibus"
                              ? "(+Driver)"
                              : servicePackage === "dengan-driver"
                                ? "(+Driver)"
                                : "(Lepas Kunci)"}
                            :
                          </span>
                          <div className="text-lg font-extrabold text-slate-900">
                            Rp {unitPrice.toLocaleString("id-ID")}{" "}
                            <span className="text-xs font-normal text-slate-500">/24 jam</span>
                          </div>
                        </div>

                        {durationDays > 1 && (
                          <div className="text-right">
                            <span className="text-[10px] text-amber-700 font-bold block">
                              Total {durationDays} Hari:
                            </span>
                            <span className="text-xs font-extrabold text-amber-600">
                              Rp {totalEstimate.toLocaleString("id-ID")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVehicleModal(vehicle)}
                          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer">
                          Detail & Jadwal
                        </button>

                        <button
                          type="button"
                          onClick={() => handleContactWhatsApp(vehicle)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer ${
                            available
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-slate-800 hover:bg-slate-900 text-white"
                          }`}>
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          <span>{available ? "Pesan Unit" : "Tanya Jadwal"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center space-y-2 border border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-400">no_sim</span>
            <h3 className="font-bold text-lg text-slate-900">Kendaraan Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500">Coba ganti tanggal, filter ketersediaan, atau tipe mobil lain.</p>
          </div>
        )}
      </section>

      {/* ================= CARA SEWA / TUTORIAL PEMESANAN ================= */}
      <section id="cara-sewa" className="py-16 bg-slate-100 border-t border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">PANDUAN PEMESANAN</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Cara Sewa di Caruhun</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Ikuti 5 langkah mudah berikut untuk memesan armada sesuai kebutuhan perjalanan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {HOW_TO_RENT_STEPS.map((item, idx) => (
              <div key={item.step} className="relative flex flex-col space-y-3">
                {/* Garis Penghubung Horizontal Desktop */}
                {idx < HOW_TO_RENT_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-4 left-9 right-0 h-[2px] bg-slate-300 z-0" />
                )}

                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm relative z-10">
                  {item.step}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1 space-y-1.5">
                  <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PARTNER SECTION ================= */}
      <section id="partner" className="py-16 bg-white border-t border-slate-200 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">MITRA BERPENGALAMAN</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Partner & Pelanggan Perusahaan</h2>
            <p className="text-xs text-slate-500">Telah dipercaya oleh berbagai instansi dan perusahaan terkemuka.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold text-slate-700">
              PT Surya Logistik
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold text-slate-700">
              Mandiri Travel
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold text-slate-700">
              Auto2000 Cilandak
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold text-slate-700">
              PT Indonesia Maju
            </div>
          </div>
        </div>
      </section>

      {/* ================= MODAL DETAIL SPESIFIKASI & JADWAL ================= */}
      {selectedVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-900 space-y-4">
            <div className="relative h-56 w-full bg-slate-100">
              <img
                src={selectedVehicleModal.image}
                alt={selectedVehicleModal.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedVehicleModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 pt-0 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl text-slate-900">{selectedVehicleModal.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    Th. {selectedVehicleModal.details.year}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedVehicleModal.details.description}</p>
              </div>

              {/* Status Jadwal Booking Unit */}
              <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl space-y-1.5">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  Informasi Jadwal Unit:
                </span>
                {selectedVehicleModal.bookedDates.length > 0 ? (
                  <ul className="text-xs text-amber-900 space-y-1 pl-5 list-disc">
                    {selectedVehicleModal.bookedDates.map((slot, idx) => (
                      <li key={idx}>
                        Terbooking pada <strong>{slot.startDate}</strong> s/d <strong>{slot.endDate}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-700 font-semibold">
                    Unit ini kosong dan siap dipesan untuk tanggal pilihan Anda.
                  </p>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl grid grid-cols-2 gap-3 text-xs border border-slate-100">
                <div>
                  <span className="text-slate-500 block">Kategori:</span>
                  <strong className="text-slate-800">{selectedVehicleModal.categoryLabel}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Kapasitas Mesin:</span>
                  <strong className="text-slate-800">{selectedVehicleModal.details.engine}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Transmisi:</span>
                  <strong className="text-slate-800">{selectedVehicleModal.transmission}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Bahan Bakar:</span>
                  <strong className="text-slate-800">{selectedVehicleModal.fuelType}</strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                  Fitur & Fasilitas:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedVehicleModal.details.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500">Estimasi ({durationDays} Hari):</span>
                  <div className="text-lg font-extrabold text-slate-900">
                    Rp {(getUnitPrice(selectedVehicleModal) * durationDays).toLocaleString("id-ID")}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const vehicle = selectedVehicleModal;
                    setSelectedVehicleModal(null);
                    handleContactWhatsApp(vehicle);
                  }}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Pesan Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panggil Component Footer */}
      <Footer />
    </div>
  );
}
