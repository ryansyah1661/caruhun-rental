"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useVehicles } from "@/lib/use-vehicles";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleItem {
  id: string;
  name: string;
  nopol: string;
  category: string;
  transmission: string;
  year: number;
  status: string;
  daily_price?: number;
  odometer: string;
  notes?: string;
}

export default function VehiclesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useVehicles();
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);
  const [editStatus, setEditStatus] = useState("Tersedia");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>("");
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const vehicles = useMemo(() => (data?.vehicles || []) as VehicleItem[], [data?.vehicles]);
  const stats = (data as any)?.stats || {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "Tersedia").length,
    rented: vehicles.filter((v) => v.status === "Disewa").length,
    maintenance: vehicles.filter((v) => v.status === "Servis").length,
    washing: vehicles.filter((v) => v.status === "Cuci").length,
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchStatus = filterStatus === "Semua" || v.status === filterStatus;
      const fullSearch = `${v.name} ${v.nopol} ${v.category} ${v.notes || ""}`.toLowerCase();
      const matchSearch = fullSearch.includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [vehicles, filterStatus, searchQuery]);

  const handleOpenEdit = (v: VehicleItem) => {
    setEditingVehicle(v);
    setEditStatus(v.status);
    setEditPrice(v.daily_price || 0);
    setEditNotes(v.notes || "");
  };

  const handleSaveEdit = async () => {
    if (!editingVehicle) return;
    setIsSubmitting(true);
    try {
      await api.put(`/admin/vehicles/${editingVehicle.id}`, {
        status: editStatus,
        daily_price: editPrice,
        notes: editNotes,
      });
      qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      showToast("success", `Status unit ${editingVehicle.name} berhasil diperbarui.`);
      setEditingVehicle(null);
    } catch {
      showToast("error", "Gagal memperbarui armada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await api.delete(`/admin/vehicles/${id}`);
      qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      showToast("success", "Armada berhasil dihapus dari daftar operasional.");
      setDeletingVehicle(null);
    } catch {
      showToast("error", "Gagal menghapus armada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <VehiclesSkeleton />;
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Toast Notifikasi */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 border text-sm font-bold transition-all ${
            toast.type === "success"
              ? "bg-emerald-600 text-white border-emerald-700"
              : "bg-rose-600 text-white border-rose-700"
          }`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Armada</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Status & Manajemen Armada
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau ketersediaan armada pool: Tersedia di pool, Sedang Jalan (Disewa), Cuci Mobil, atau Di Bengkel.
          </p>
        </div>
        <Link
          href="/admin/vehicles/create"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Tambah Armada Baru</span>
        </Link>
      </div>

      {/* KPI Status Armada (Blueprint Papan Tulis) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Total Unit */}
        <div
          onClick={() => setFilterStatus("Semua")}
          className={`p-4 rounded-2xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all ${
            filterStatus === "Semua" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${filterStatus === "Semua" ? "text-slate-400" : "text-slate-500"}`}>
            Total Armada
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black">{stats.total} Unit</h3>
            <span className="material-symbols-outlined text-lg opacity-80">garage</span>
          </div>
        </div>

        {/* Tersedia di Pool */}
        <div
          onClick={() => setFilterStatus("Tersedia")}
          className={`p-4 rounded-2xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all ${
            filterStatus === "Tersedia" ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500" : "bg-white border-slate-200/80 hover:border-emerald-400"
          }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Tersedia</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-slate-900">{stats.available} Unit</h3>
            <span className="text-[10px] font-bold text-emerald-700">Siap Sewa</span>
          </div>
        </div>

        {/* Sedang Disewa / Jalan */}
        <div
          onClick={() => setFilterStatus("Disewa")}
          className={`p-4 rounded-2xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all ${
            filterStatus === "Disewa" ? "bg-sky-50 border-sky-500 ring-2 ring-sky-500" : "bg-white border-slate-200/80 hover:border-sky-400"
          }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">Sedang Jalan</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-slate-900">{stats.rented} Unit</h3>
            <span className="text-[10px] font-bold text-sky-700">Aktif Sewa</span>
          </div>
        </div>

        {/* Di Bengkel / Servis */}
        <div
          onClick={() => setFilterStatus("Servis")}
          className={`p-4 rounded-2xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all ${
            filterStatus === "Servis" ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500" : "bg-white border-slate-200/80 hover:border-rose-400"
          }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Di Bengkel</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-slate-900">{stats.maintenance} Unit</h3>
            <span className="text-[10px] font-bold text-rose-700">Perawatan</span>
          </div>
        </div>

        {/* Status Cuci */}
        <div
          onClick={() => setFilterStatus("Cuci")}
          className={`p-4 rounded-2xl border shadow-2xs flex flex-col justify-between cursor-pointer transition-all ${
            filterStatus === "Cuci" ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500" : "bg-white border-slate-200/80 hover:border-indigo-400"
          }`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Cuci Mobil</span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-slate-900">{stats.washing} Unit</h3>
            <span className="text-[10px] font-bold text-indigo-700">Kebersihan</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {["Semua", "Tersedia", "Disewa", "Servis", "Cuci"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === st ? "bg-amber-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {st}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nopol, unit, atau tipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Kendaraan & Nopol</th>
                <th className="px-4 py-3 text-center">Kategori</th>
                <th className="px-4 py-3 text-center">Transmisi / Tahun</th>
                <th className="px-4 py-3 text-center">Tarif / Hari</th>
                <th className="px-4 py-3 text-center">Status Armada</th>
                <th className="px-4 py-3 text-center">Catatan / Posisi</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{v.name}</div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">{v.nopol}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 text-center">
                      {v.transmission} ({v.year})
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 text-right">
                      {v.daily_price ? `Rp ${v.daily_price.toLocaleString("id-ID")}` : "Rp 350.000"}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                            v.status === "Tersedia"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : v.status === "Disewa"
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : v.status === "Cuci"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {v.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 max-w-[220px]">
                      <div className="truncate text-[11px]">
                        {v.notes ? v.notes : v.status === "Tersedia" ? "Pool Pusat Caruhun" : "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(v)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold text-xs transition-colors cursor-pointer">
                          Ubah Status
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingVehicle(v)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs transition-colors cursor-pointer">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">
                      directions_car
                    </span>
                    Tidak ada kendaraan yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ubah Status & Posisi Armada */}
      {editingVehicle && (
        <div
          onClick={() => setEditingVehicle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 cursor-default">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Ubah Status Armada</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editingVehicle.name} ({editingVehicle.nopol})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status Operasional</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600 cursor-pointer">
                  <option value="Tersedia">Tersedia (Siap di Pool)</option>
                  <option value="Disewa">Disewa (Sedang Jalan)</option>
                  <option value="Cuci">Cuci (Dalam Pembersihan)</option>
                  <option value="Servis">Servis (Di Bengkel Perawatan)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Harga Sewa / Hari (Rp)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan / Posisi</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Contoh: Pool Pusat / Bengkel Anugerah..."
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingVehicle(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50">
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Peringatan Hapus */}
      {deletingVehicle && (
        <div
          onClick={() => setDeletingVehicle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4 cursor-default">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-600 mt-1">
                Apakah Anda yakin ingin menghapus armada{" "}
                <strong>
                  {deletingVehicle.name} ({deletingVehicle.nopol})
                </strong>
                ?
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Data unit akan diarsipkan dari daftar operasional.</p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingVehicle(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingVehicle.id)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50">
                {isSubmitting ? "Menghapus..." : "Ya, Yakin Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VehiclesSkeleton() {
  return (
    <div className="w-full min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-36" />
          <div className="h-8 bg-slate-200 rounded-lg w-72" />
        </div>
        <div className="h-10 w-44 bg-slate-100 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-white rounded-2xl border border-slate-200" />
        ))}
      </div>
      <div className="h-96 bg-white rounded-2xl border border-slate-200 p-6" />
    </div>
  );
}
