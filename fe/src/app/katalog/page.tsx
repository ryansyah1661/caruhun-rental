"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type CategoryFilter = "semua" | "mpv" | "city" | "suv" | "minibus";

interface CatalogVehicle {
  id: string;
  name: string;
  category: CategoryFilter;
  categoryLabel: string;
  transmission: string;
  seats: number;
  fuelType: string;
  pricePerDay: number;
  image: string;
  isAvailable: boolean;
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
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
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
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
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
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
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
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    isAvailable: false,
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
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop",
    isAvailable: true,
    details: {
      year: 2021,
      engine: "2.500 cc Turbo Diesel",
      description: "Solusi terbaik untuk rombongan wisata, acara keluarga besar, maupun travel dinas.",
      features: ["Reclining Seat", "Full AC Microbus", "Colokan Charger Phone", "Bagasi Luas"],
    },
  },
];

export default function KatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicleModal, setSelectedVehicleModal] = useState<CatalogVehicle | null>(null);

  const filteredVehicles = useMemo(() => {
    return CATALOG_VEHICLES.filter((item) => {
      const matchesCat = selectedCategory === "semua" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleContactWhatsApp = (vehicleName?: string) => {
    const adminPhoneNumber = "6281234567890";
    const msg = vehicleName
      ? `Halo Admin Caruhun Rental, saya berminat sewa unit *${vehicleName}*. Mohon info ketersediaan & prosedurnya.`
      : `Halo Admin Caruhun Rental, saya ingin berkonsultasi mengenai sewa armada kendaraan.`;
    window.open(`https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-body-md text-slate-900 antialiased">
      {/* Navbar Header */}
      <Navbar />

      {/* ================= HERO KATALOG (SERAGAM CENTERED) ================= */}
      <section className="bg-white pt-32 sm:pt-36 pb-14 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
            Pilihan Armada Terlengkap & Terawat
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Katalog Armada Sewa <br />
            <span className="text-amber-600">Siap Temani Perjalanan Anda</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Temukan unit kendaraan yang sesuai dengan kebutuhan perjalanan Anda. Tersedia transmisi matic & manual,
            layanan lepas kunci maupun dengan driver profesional.
          </p>
        </div>
      </section>

      {/* ================= DAFTAR KENDARAAN ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Bar Kontrol Terpadu (Filter Kategori + Pencarian) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "semua", label: "Semua Unit" },
              { id: "mpv", label: "MPV" },
              { id: "city", label: "City Car" },
              { id: "suv", label: "SUV" },
              { id: "minibus", label: "Minibus" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900"
                }`}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              Menampilkan <strong className="text-slate-800">{filteredVehicles.length}</strong> unit
            </span>

            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex items-center gap-2 w-full sm:w-64 focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
              <span className="material-symbols-outlined text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Cari tipe mobil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group">
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    {vehicle.isAvailable ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] shadow-sm">
                        Tersedia
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[11px] shadow-sm">
                        Sedang Disewa
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
                        <span className="material-symbols-outlined text-[16px] text-slate-400">local_gas_station</span>
                        <span>{vehicle.fuelType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Harga Sewa / Hari:</span>
                      <div className="text-lg font-extrabold text-slate-900">
                        Rp {vehicle.pricePerDay.toLocaleString("id-ID")}{" "}
                        <span className="text-xs font-normal text-slate-500">/24 jam</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedVehicleModal(vehicle)}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer">
                        Detail Spesifikasi
                      </button>

                      <button
                        type="button"
                        onClick={() => handleContactWhatsApp(vehicle.name)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer">
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>Hubungi WA</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center space-y-2 border border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-400">no_sim</span>
            <h3 className="font-bold text-lg text-slate-900">Kendaraan Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500">Coba ganti filter atau kata kunci pencarian mobil lain.</p>
          </div>
        )}
      </section>

      {/* ================= MODAL DETAIL SPESIFIKASI ================= */}
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

            <div className="p-6 pt-0 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl text-slate-900">{selectedVehicleModal.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    Th. {selectedVehicleModal.details.year}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedVehicleModal.details.description}</p>
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
                  <span className="text-xs text-slate-500">Harga Sewa:</span>
                  <div className="text-lg font-extrabold text-slate-900">
                    Rp {selectedVehicleModal.pricePerDay.toLocaleString("id-ID")}{" "}
                    <span className="text-xs font-normal text-slate-500">/hari</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const vehicleName = selectedVehicleModal.name;
                    setSelectedVehicleModal(null);
                    handleContactWhatsApp(vehicleName);
                  }}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                  <span>Hubungi Admin WA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
