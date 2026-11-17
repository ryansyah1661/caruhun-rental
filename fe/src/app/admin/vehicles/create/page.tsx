"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CreateVehiclePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [category, setCategory] = useState("mpv");
  const [transmission, setTransmission] = useState("automatic");
  const [year, setYear] = useState("2023");
  const [dailyPrice, setDailyPrice] = useState("350000");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Pisahkan merk dan tipe
    const parts = name.trim().split(" ");
    const brand = parts[0] || "Toyota";
    const model = parts.slice(1).join(" ") || "Unit";

    try {
      await api.post("/admin/vehicles", {
        plate_number: plateNumber,
        brand,
        model,
        category,
        transmission,
        year: parseInt(year, 10) || 2023,
        daily_price: parseInt(dailyPrice, 10) || 350000,
        status: "Tersedia",
        notes: notes || undefined,
      });

      router.push("/admin/vehicles");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Gagal menambahkan armada. Pastikan plat nomor belum terdaftar.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <Link href="/admin/vehicles" className="hover:text-slate-700">
              Kendaraan
            </Link>{" "}
            &rsaquo;
            <span className="text-slate-800 font-bold">Tambah Unit</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Formulir Tambah Armada Kendaraan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftarkan unit kendaraan baru ke dalam sistem manajemen operasional Caruhun.
          </p>
        </div>
        <Link
          href="/admin/vehicles"
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="material-symbols-outlined text-amber-600 text-[18px]">directions_car</span>
            Spesifikasi & Identitas Unit
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nama / Model Kendaraan</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Toyota Avanza 1.5 G"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nomor Polisi (Plat Nomor)</label>
              <input
                type="text"
                required
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                placeholder="Contoh: B 1482 KFD"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 uppercase focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kategori Kendaraan</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600">
                <option value="mpv">MPV 7-Seater</option>
                <option value="suv">SUV / Premium</option>
                <option value="city">City Car</option>
                <option value="minibus">Minibus / Van</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Transmisi</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600">
                <option value="automatic">Matic / CVT</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Tahun Pembuatan</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2023"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Tarif Sewa / Hari (Rp)</label>
              <input
                type="number"
                required
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
                placeholder="350000"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-slate-700">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Warna hitam metalik, interior fabric, audio Bluetooth"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/vehicles"
            className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50">
            {isSubmitting ? "Menyimpan..." : "Simpan Armada"}
          </button>
        </div>
      </form>
    </div>
  );
}
