"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomTimePicker from "@/components/CustomTimePicker";
import CustomDurationPicker from "@/components/CustomDurationPicker";
import { useCatalog, CatalogVehicle, CategoryFilter } from "@/lib/use-catalog";

type TransmissionFilter = "semua" | "matic" | "manual";
type SeatFilter = 0 | 5 | 7 | 16;
type PlateFilter = "semua" | "Plat ganjil" | "Plat genap";
type ServicePackage = "lepas-kunci" | "dengan-driver" | "bandara";
type SortOption = "termurah" | "termahal" | "terbaru";

const SHORT_DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function formatFullSchedule(dateStr: string, timeStr: string, addDays = 0): string {
  const base = new Date(dateStr + "T00:00:00");
  if (isNaN(base.getTime())) return `${dateStr} • ${timeStr} WIB`;
  base.setDate(base.getDate() + addDays);
  const dayName = SHORT_DAYS[base.getDay()];
  const dayNum = base.getDate();
  const monthName = SHORT_MONTHS[base.getMonth()];
  const yearNum = base.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${yearNum} • ${timeStr} WIB`;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil data riil dari PostgreSQL via Laravel API
  const { data: rawVehicles = [], isLoading } = useCatalog();

  const initialPkg = (searchParams.get("paket") as ServicePackage) || "lepas-kunci";
  const initialDate = searchParams.get("mulai") || new Date().toISOString().split("T")[0];
  const initialTime = searchParams.get("jam") || "08:00";
  const initialDays = Math.max(1, Number(searchParams.get("hari")) || 1);

  const [servicePackage, setServicePackage] = useState<ServicePackage>(initialPkg);
  const [pickupDate, setPickupDate] = useState<string>(initialDate);
  const [pickupTime, setPickupTime] = useState<string>(initialTime);
  const [durationDays, setDurationDays] = useState<number>(initialDays);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  // Sidebar Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [catFilter, setCatFilter] = useState<CategoryFilter>("semua");
  const [transFilter, setTransFilter] = useState<TransmissionFilter>("semua");
  const [seatFilter, setSeatFilter] = useState<SeatFilter>(0);
  const [plateFilter, setPlateFilter] = useState<PlateFilter>("semua");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("termurah");

  // Multi-Unit Selection (Maks 5 unit)
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [detailModalVehicle, setDetailModalVehicle] = useState<CatalogVehicle | null>(null);

  const checkAvailability = (vehicle: CatalogVehicle) => {
    const start = new Date(pickupDate + "T00:00:00");
    const end = new Date(pickupDate + "T00:00:00");
    end.setDate(start.getDate() + durationDays - 1);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    const booked = vehicle.bookedDates || [];
    for (const slot of booked) {
      if (startStr <= slot.endDate && endStr >= slot.startDate) {
        return { available: false, conflictSlot: slot };
      }
    }
    return { available: true, conflictSlot: null };
  };

  const getDailyPrice = (vehicle: CatalogVehicle) => {
    if (vehicle.category === "minibus") return vehicle.priceWithDriverPerDay;
    return servicePackage === "dengan-driver" ? vehicle.priceWithDriverPerDay : vehicle.pricePerDay;
  };

  const processedVehicles = useMemo(() => {
    const filtered = rawVehicles.filter((v) => {
      if (searchQuery && !v.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (catFilter !== "semua" && v.category !== catFilter) return false;
      const vTrans = v.transmissionType || (v.transmission?.toLowerCase().includes("man") ? "manual" : "matic");
      if (transFilter !== "semua" && vTrans !== transFilter) return false;
      if (seatFilter !== 0 && v.seats !== seatFilter) return false;
      const vPlate = v.plateType || "Plat genap";
      if (plateFilter !== "semua" && vPlate !== plateFilter) return false;
      if (onlyAvailable && !checkAvailability(v).available) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      const availA = checkAvailability(a).available ? 0 : 1;
      const availB = checkAvailability(b).available ? 0 : 1;
      if (availA !== availB) return availA - availB;

      if (sortBy === "termurah") return getDailyPrice(a) - getDailyPrice(b);
      if (sortBy === "termahal") return getDailyPrice(b) - getDailyPrice(a);
      return (b.details?.year || 0) - (a.details?.year || 0);
    });
  }, [
    rawVehicles,
    searchQuery,
    catFilter,
    transFilter,
    seatFilter,
    plateFilter,
    onlyAvailable,
    sortBy,
    pickupDate,
    durationDays,
    servicePackage,
  ]);

  const availableCount = useMemo(
    () => processedVehicles.filter((v) => checkAvailability(v).available).length,
    [processedVehicles, pickupDate, durationDays],
  );

  const toggleSelectUnit = (id: string) => {
    setSelectedUnitIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const selectedVehicles = useMemo(
    () => rawVehicles.filter((v) => selectedUnitIds.includes(v.id)),
    [rawVehicles, selectedUnitIds],
  );

  const grandTotal = useMemo(
    () => selectedVehicles.reduce((sum, v) => sum + getDailyPrice(v) * durationDays, 0),
    [selectedVehicles, durationDays, servicePackage],
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setCatFilter("semua");
    setTransFilter("semua");
    setSeatFilter(0);
    setPlateFilter("semua");
    setOnlyAvailable(false);
  };

  const handleApplyUpdatedSchedule = () => {
    setIsEditingSchedule(false);
    setSelectedUnitIds((prev) =>
      prev.filter((id) => {
        const unit = rawVehicles.find((v) => v.id === id);
        return unit ? checkAvailability(unit).available : false;
      }),
    );
    router.replace(
      `/cari?paket=${servicePackage}&mulai=${pickupDate}&jam=${encodeURIComponent(pickupTime)}&hari=${durationDays}`,
    );
  };

  const handleCheckoutWhatsApp = () => {
    if (selectedVehicles.length === 0) return;
    const adminPhone = "6281234567890";
    const pkgLabel =
      servicePackage === "lepas-kunci"
        ? "Lepas Kunci"
        : servicePackage === "dengan-driver"
          ? "Dengan Driver"
          : "Drop-off Bandara";

    const unitLines = selectedVehicles
      .map(
        (v, idx) =>
          `${idx + 1}. *${v.name}* (${v.transmissionLabel || v.transmission}, ${v.plateType || "Plat genap"}) — Rp ${(
            getDailyPrice(v) * durationDays
          ).toLocaleString("id-ID")}`,
      )
      .join("\n");

    const msg = `Halo Admin Caruhun Rental, saya ingin memesan armada:

*Jadwal Ambil:* ${formatFullSchedule(pickupDate, pickupTime, 0)}
*Jadwal Kembali:* ${formatFullSchedule(pickupDate, pickupTime, durationDays)}
*Layanan:* ${pkgLabel} (${durationDays} Hari)

*Daftar Armada:*
${unitLines}

*Total Estimasi:* Rp ${grandTotal.toLocaleString("id-ID")}

Mohon info ketersediaan & prosedur selanjutnya. Terima kasih!`;

    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <Navbar />

      {/* ================= TOP SCHEDULE HEADER BAND ================= */}
      <section className="bg-white border-b border-slate-200 pt-28 sm:pt-32 pb-6 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {/* Breadcrumb & Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="hover:text-amber-600 transition-colors cursor-pointer">
                  Beranda
                </button>
                <span>/</span>
                <span className="font-semibold text-slate-800">Ketersediaan Armada</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isLoading ? "Memuat Ketersediaan..." : `${availableCount} Armada Siap Jalan`}
              </h1>
            </div>

            {/* Switcher Paket Layanan Langsung */}
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start">
              {[
                { id: "lepas-kunci", label: "Lepas Kunci" },
                { id: "dengan-driver", label: "Dengan Driver" },
                { id: "bandara", label: "Drop-off Bandara" },
              ].map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setServicePackage(pkg.id as ServicePackage)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    servicePackage === pkg.id
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}>
                  {pkg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Summary Strip / Collapsible Editor */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
            {!isEditingSchedule ? (
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-amber-600 text-[20px] mt-0.5">login</span>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Pengambilan Unit
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatFullSchedule(pickupDate, pickupTime, 0)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-slate-500 text-[20px] mt-0.5">logout</span>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Pengembalian Unit
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatFullSchedule(pickupDate, pickupTime, durationDays)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px] mt-0.5">timelapse</span>
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Durasi Sewa
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {durationDays} Hari ({durationDays * 24} Jam)
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingSchedule(true)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-amber-600 text-xs font-bold text-slate-800 hover:text-amber-700 flex items-center justify-center gap-1.5 transition-colors self-start lg:self-auto cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                  <span>Ubah Jadwal</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Sesuaikan Jadwal Sewa</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingSchedule(false)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer">
                    Tutup
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                  <CustomDatePicker label="Tanggal Mulai" value={pickupDate} onChange={setPickupDate} />
                  <CustomTimePicker label="Jam Ambil" value={pickupTime} onChange={setPickupTime} />
                  <CustomDurationPicker label="Lama Sewa" value={durationDays} onChange={setDurationDays} />
                  <button
                    type="button"
                    onClick={handleApplyUpdatedSchedule}
                    className="h-14.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    <span>Simpan Jadwal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT: LEFT SIDEBAR + HORIZONTAL FLEET LIST ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KOLOM KIRI (3 Cols): SIDEBAR FILTER */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 space-y-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-amber-600">tune</span>
                Filter Armada
              </span>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer">
                Reset
              </button>
            </div>

            {/* Cari Nama Mobil */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Cari Unit</label>
              <div className="relative">
                <span className="material-symbols-outlined text-slate-400 text-[16px] absolute left-3 top-1/2 -translate-y-1/2">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Misal: Avanza, Zenix..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Toggle Hanya yang Kosong */}
            <div className="pt-1">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-xs font-bold text-slate-700">Hanya unit tersedia</span>
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Tipe Kendaraan */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="block text-xs font-bold text-slate-700">Tipe Kendaraan</span>
              <div className="space-y-1.5">
                {[
                  { id: "semua", label: "Semua Tipe" },
                  { id: "mpv", label: "MPV Keluarga" },
                  { id: "city", label: "City Car" },
                  { id: "suv", label: "SUV" },
                  { id: "minibus", label: "Minibus (16 Kursi)" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCatFilter(cat.id as CategoryFilter)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      catFilter === cat.id ? "bg-amber-50 text-amber-800 font-bold" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmisi */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="block text-xs font-bold text-slate-700">Transmisi</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "semua", label: "Semua" },
                  { id: "matic", label: "Matic" },
                  { id: "manual", label: "Manual" },
                ].map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => setTransFilter(tr.id as TransmissionFilter)}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      transFilter === tr.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}>
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Kapasitas Kursi */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="block text-xs font-bold text-slate-700">Kapasitas Penumpang</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { val: 0, label: "Semua" },
                  { val: 5, label: "5 Kursi" },
                  { val: 7, label: "7 Kursi" },
                  { val: 16, label: "16 Kursi" },
                ].map((st) => (
                  <button
                    key={st.val}
                    type="button"
                    onClick={() => setSeatFilter(st.val as SeatFilter)}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      seatFilter === st.val
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}>
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ganjil / Genap */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <span className="block text-xs font-bold text-slate-700">Nomor Polisi</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "semua", label: "Semua" },
                  { id: "Plat ganjil", label: "Ganjil" },
                  { id: "Plat genap", label: "Genap" },
                ].map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => setPlateFilter(pl.id as PlateFilter)}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      plateFilter === pl.id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}>
                    {pl.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* KOLOM KANAN (9 Cols): SORT BAR & HORIZONTAL FLEET CARDS */}
          <div className="lg:col-span-9 space-y-4">
            {/* Bar Info Hasil & Sortir */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3">
              <p className="text-xs text-slate-600">
                {isLoading ? (
                  "Mengambil unit dari database..."
                ) : (
                  <>
                    Menampilkan <strong>{processedVehicles.length}</strong> unit untuk durasi{" "}
                    <strong>{durationDays} hari</strong> (maks. 5 unit per pesanan)
                  </>
                )}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer">
                  <option value="termurah">Harga Terendah</option>
                  <option value="termahal">Harga Tertinggi</option>
                  <option value="terbaru">Tahun Terbaru</option>
                </select>
              </div>
            </div>

            {/* Loading State Skeleton */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 h-44 bg-slate-100 rounded-xl" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-slate-100 rounded w-1/2" />
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-4 bg-slate-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : processedVehicles.length > 0 ? (
              /* Daftar Horizontal Fleet Cards */
              <div className="space-y-4">
                {processedVehicles.map((vehicle) => {
                  const { available, conflictSlot } = checkAvailability(vehicle);
                  const dailyRate = getDailyPrice(vehicle);
                  const totalRate = dailyRate * durationDays;
                  const isSelected = selectedUnitIds.includes(vehicle.id);

                  return (
                    <div
                      key={vehicle.id}
                      className={`bg-white border rounded-2xl overflow-hidden transition-all grid grid-cols-1 md:grid-cols-12 ${
                        !available
                          ? "border-slate-200 bg-slate-50/70 opacity-80"
                          : isSelected
                            ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md"
                            : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                      }`}>
                      {/* Kiri (4 cols): Foto Armada */}
                      <div className="md:col-span-4 relative h-48 md:h-full min-h-[185px] bg-slate-100 overflow-hidden">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className={`w-full h-full object-cover ${!available ? "grayscale" : ""}`}
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold">
                          {vehicle.categoryLabel}
                        </span>
                      </div>

                      {/* Tengah (5 cols): Spesifikasi & Fasilitas */}
                      <div className="md:col-span-5 p-5 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="font-extrabold text-lg text-slate-900">{vehicle.name}</h2>
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {vehicle.details.year}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{vehicle.details.description}</p>
                        </div>

                        {/* Baris Spesifikasi */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-700 pt-1">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-slate-400">tune</span>
                            {vehicle.transmissionLabel || vehicle.transmission}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-slate-400">group</span>
                            {vehicle.seats} Kursi
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-slate-400">
                              local_gas_station
                            </span>
                            {vehicle.fuelType}
                          </span>
                          <span className="text-slate-400">• {vehicle.plateType || "Plat genap"}</span>
                        </div>

                        {/* Fitur Singkat atau Info Bentrok */}
                        {!available && conflictSlot ? (
                          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-700 font-medium inline-flex items-center gap-1.5 self-start">
                            <span className="material-symbols-outlined text-[14px]">event_busy</span>
                            <span>
                              Terjadwal sewa {conflictSlot.startDate} s/d {conflictSlot.endDate}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {vehicle.details.features.slice(0, 3).map((feat) => (
                              <span
                                key={feat}
                                className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md">
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Kanan (3 cols): Harga Total & Tombol Aksi */}
                      <div className="md:col-span-3 p-5 bg-slate-50/70 border-t md:border-t-0 md:border-l border-slate-100 flex flex-row md:flex-col items-center md:items-end justify-between">
                        <div className="md:text-right">
                          <span className="block text-[11px] text-slate-400">
                            Rp {dailyRate.toLocaleString("id-ID")} / hari
                          </span>
                          <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                            Rp {totalRate.toLocaleString("id-ID")}
                          </div>
                          <span className="block text-[11px] font-semibold text-amber-700">
                            Total {durationDays} hari
                          </span>
                        </div>

                        <div className="flex flex-col gap-2 w-auto md:w-full">
                          {available ? (
                            <button
                              type="button"
                              onClick={() => toggleSelectUnit(vehicle.id)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                isSelected
                                  ? "bg-amber-600 text-white shadow-sm"
                                  : "bg-slate-900 hover:bg-amber-600 text-white"
                              }`}>
                              <span className="material-symbols-outlined text-[16px]">
                                {isSelected ? "check_circle" : "add_circle"}
                              </span>
                              <span>{isSelected ? "Dipilih" : "Pilih Unit"}</span>
                            </button>
                          ) : (
                            <span className="px-4 py-2 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold text-center">
                              Tidak Tersedia
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => setDetailModalVehicle(vehicle)}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer text-center">
                            Lihat Spesifikasi
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl text-slate-300">directions_car</span>
                <h3 className="font-bold text-base text-slate-900">Tidak ada armada yang cocok</h3>
                <p className="text-xs text-slate-500">
                  Coba ubah filter di sebelah kiri atau pilih tanggal sewa lainnya.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold cursor-pointer">
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================= FLOATING BOTTOM SUMMARY DOCK (MUNCUL SAAT ADA UNIT DIPILIH) ================= */}
      {selectedVehicles.length > 0 && (
        <div className="fixed bottom-4 inset-x-0 z-40 px-4">
          <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-2xl p-4 shadow-[0_20px_50px_rgba(15,23,42,0.35)] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[11px]">
                  {selectedVehicles.length} / 5 Unit
                </span>
                <span className="text-xs text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
                  {selectedVehicles.map((v) => v.name).join(", ")}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Jadwal: <strong className="text-white">{pickupDate}</strong> ({durationDays} hari)
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
              <div className="sm:text-right">
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">Total Estimasi</span>
                <span className="text-lg font-extrabold text-amber-400">Rp {grandTotal.toLocaleString("id-ID")}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckoutWhatsApp}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Pesan via WA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DETAIL SPESIFIKASI ================= */}
      {detailModalVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl space-y-4">
            <div className="relative h-52 w-full bg-slate-100">
              <img
                src={detailModalVehicle.image}
                alt={detailModalVehicle.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setDetailModalVehicle(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-5 pt-0 space-y-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{detailModalVehicle.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{detailModalVehicle.details.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block">Mesin</span>
                  <strong>{detailModalVehicle.details.engine}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Tahun & Plat</span>
                  <strong>
                    {detailModalVehicle.details.year} • {detailModalVehicle.plateType || "Plat genap"}
                  </strong>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {detailModalVehicle.details.features.map((f) => (
                  <span key={f} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function CariArmadaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">
          Memuat ketersediaan armada...
        </div>
      }>
      <SearchResultsContent />
    </Suspense>
  );
}
