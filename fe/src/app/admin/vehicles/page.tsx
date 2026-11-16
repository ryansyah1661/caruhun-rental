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
}

export default function VehiclesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useVehicles();
  const [searchQuery, setSearchQuery] = useState("");

  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);
  const [editStatus, setEditStatus] = useState("Tersedia");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicles = useMemo(() => (data?.vehicles || []) as VehicleItem[], [data?.vehicles]);
  const totalCount = data?.total ?? vehicles.length;

  const filtered = useMemo(() => {
    return vehicles.filter(
      (v) =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.nopol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [vehicles, searchQuery]);

  const handleOpenEdit = (v: VehicleItem) => {
    setEditingVehicle(v);
    setEditStatus(v.status);
    setEditPrice(v.daily_price || 0);
  };

  const handleSaveEdit = async () => {
    if (!editingVehicle) return;
    setIsSubmitting(true);
    try {
      await api.put(`/admin/vehicles/${editingVehicle.id}`, {
        status: editStatus,
        daily_price: editPrice,
      });
      qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      setEditingVehicle(null);
    } catch {
      alert("Gagal memperbarui armada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await api.delete(`/admin/vehicles/${id}`);
      qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
      setDeletingVehicle(null);
    } catch {
      alert("Gagal menghapus armada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <VehiclesSkeleton />;
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Kendaraan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Armada Kendaraan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data master unit kendaraan, status operasional, edit tarif, dan riwayat armada.
          </p>
        </div>
        <Link
          href="/admin/vehicles/create"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Tambah Armada Baru</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm font-bold text-slate-900">Total {totalCount} Unit Terdaftar</div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari merk atau nomor polisi..."
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
                <th className="px-4 py-3 text-center">Odometer</th>
                <th className="px-4 py-3 text-center">Status</th>
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
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {v.transmission} ({v.year})
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{v.odometer}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
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
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(v)}
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold text-xs transition-colors cursor-pointer">
                          Edit
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
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada kendaraan yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Armada */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Edit Armada</h3>
            <p className="text-xs text-slate-500 font-medium">
              {editingVehicle.name} ({editingVehicle.nopol})
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Kendaraan</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600">
                  <option value="Tersedia">Tersedia</option>
                  <option value="Disewa">Disewa</option>
                  <option value="Dipesan">Dipesan</option>
                  <option value="Servis">Servis</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Harga Sewa / Hari (Rp)</label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
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
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-36" />
          <div className="h-8 bg-slate-200 rounded-lg w-72" />
        </div>
        <div className="h-10 w-44 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}
