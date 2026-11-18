"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useClaims, ClaimItem } from "@/lib/use-claims";
import { api } from "@/lib/api";

export default function ClaimsPage() {
  const { data, isLoading, refetch } = useClaims();
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const claims = useMemo(() => data?.claims || [], [data?.claims]);
  const stats = data?.stats || {
    total: claims.length,
    pending: claims.filter((c) => c.status === "Pending").length,
    inRepair: claims.filter((c) => c.status === "Dalam Perbaikan").length,
    resolved: claims.filter((c) => c.status === "Selesai").length,
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = useMemo(() => {
    return claims.filter((c) => {
      const matchStatus = filterStatus === "Semua" || c.status === filterStatus;
      const fullSearch = `${c.unit} ${c.nopol} ${c.issue} ${c.code} ${c.reporter}`.toLowerCase();
      const matchSearch = fullSearch.includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [claims, filterStatus, searchQuery]);

  // Update Status Klaim
  const handleUpdateStatus = async (claimId: string, newStatus: "Pending" | "Dalam Perbaikan" | "Selesai") => {
    setIsUpdating(true);
    try {
      await api.put(`/admin/claims/${claimId}`, { status: newStatus });
      showToast(
        "success",
        newStatus === "Selesai"
          ? "Perbaikan armada selesai! Unit kini kembali berstatus Tersedia di pool."
          : `Status klaim berhasil diperbarui menjadi ${newStatus}.`,
      );
      setSelectedClaim(null);
      await refetch();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Gagal memperbarui status klaim.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <ClaimsSkeleton />;
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

      {/* Header Utama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Kerusakan & Klaim</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manajemen Kerusakan & Klaim Armada
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau laporan baret bodi, tindak lanjut bengkel rekanan, dan pengembalian unit ke pool setelah diperbaiki.
          </p>
        </div>
        <Link
          href="/admin/claims/create"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0">
          <span className="material-symbols-outlined text-[18px]">report_problem</span>
          <span>Buat Laporan Kerusakan</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div
          onClick={() => setFilterStatus("Semua")}
          className={`p-5 rounded-2xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            filterStatus === "Semua" ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 hover:border-slate-300"
          }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${filterStatus === "Semua" ? "text-slate-400" : "text-slate-500"}`}>
              Total Laporan
            </span>
            <h3 className={`text-2xl font-black mt-1 ${filterStatus === "Semua" ? "text-white" : "text-slate-900"}`}>{stats.total} Unit</h3>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${filterStatus === "Semua" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-700"}`}>
            <span className="material-symbols-outlined text-xl">car_crash</span>
          </div>
        </div>

        {/* Pending */}
        <div
          onClick={() => setFilterStatus("Pending")}
          className={`p-5 rounded-2xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            filterStatus === "Pending" ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500" : "bg-white border-slate-200 hover:border-amber-400"
          }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Menunggu (Pending)</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.pending} Unit</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">hourglass_top</span>
          </div>
        </div>

        {/* Dalam Perbaikan */}
        <div
          onClick={() => setFilterStatus("Dalam Perbaikan")}
          className={`p-5 rounded-2xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            filterStatus === "Dalam Perbaikan" ? "bg-sky-50 border-sky-500 ring-2 ring-sky-500" : "bg-white border-slate-200 hover:border-sky-400"
          }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800">Di Bengkel (Perbaikan)</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.inRepair} Unit</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">build</span>
          </div>
        </div>

        {/* Selesai */}
        <div
          onClick={() => setFilterStatus("Selesai")}
          className={`p-5 rounded-2xl border shadow-2xs flex items-center justify-between cursor-pointer transition-all ${
            filterStatus === "Selesai" ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500" : "bg-white border-slate-200 hover:border-emerald-400"
          }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Selesai (Tersedia)</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.resolved} Unit</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">task_alt</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {["Semua", "Pending", "Dalam Perbaikan", "Selesai"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === st ? "bg-amber-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}>
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari unit, nopol, atau keluhan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Tabel Data Klaim */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Kode</th>
                <th className="px-4 py-3 text-center">Kendaraan</th>
                <th className="px-4 py-3 text-center">Keluhan / Kerusakan</th>
                <th className="px-4 py-3 text-center">Pelapor</th>
                <th className="px-4 py-3 text-center">Estimasi Biaya</th>
                <th className="px-4 py-3 text-center">Waktu</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{item.code}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{item.unit}</div>
                      <div className="font-mono text-[11px] text-slate-500 mt-0.5">{item.nopol}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-rose-600 line-clamp-2">{item.issue}</div>
                      {item.bookingCode && (
                        <div className="text-[10px] text-slate-400 mt-0.5">Ref Sewa: {item.bookingCode}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900">{item.reporter}</div>
                      {item.reporterPhone && item.reporterPhone !== "-" && (
                        <div className="font-mono text-[10px] text-slate-400">{item.reporterPhone}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      {item.estimatedCost && item.estimatedCost > 0
                        ? `Rp ${item.estimatedCost.toLocaleString("id-ID")}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                            item.status === "Selesai"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.status === "Dalam Perbaikan"
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => setSelectedClaim(item)}
                          className="w-24 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer border border-slate-200 inline-flex items-center justify-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Detail</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">
                      check_circle
                    </span>
                    Tidak ada laporan kerusakan atau klaim armada untuk filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail & Tindak Lanjut Klaim */}
      {selectedClaim && (
        <div
          onClick={() => setSelectedClaim(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 cursor-default">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">report_problem</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Tindak Lanjut Klaim {selectedClaim.code}
                  </h3>
                  <p className="text-[11px] text-slate-500">Update progres perbaikan bengkel atau selesaikan unit</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Unit Info Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Unit Armada:</span>
                  <h4 className="font-bold text-sm text-slate-900">{selectedClaim.unit}</h4>
                  <span className="font-mono font-bold text-slate-600">{selectedClaim.nopol}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Saat Ini:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border inline-block mt-0.5 ${
                      selectedClaim.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : selectedClaim.status === "Dalam Perbaikan"
                        ? "bg-sky-50 text-sky-700 border-sky-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                    {selectedClaim.status}
                  </span>
                </div>
              </div>

              {/* Detail Kerusakan */}
              <div className="space-y-1">
                <span className="font-bold text-slate-700 block">Rincian Kendala / Kerusakan:</span>
                <p className="p-3 rounded-xl bg-rose-50/50 border border-rose-200 text-rose-900 leading-relaxed font-medium">
                  {selectedClaim.issue}
                </p>
              </div>

              {/* Rincian Pelapor & Biaya */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Pelapor / Sumber:</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{selectedClaim.reporter}</span>
                  <span className="text-slate-400 text-[10px]">{selectedClaim.date}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimasi Biaya:</span>
                  <span className="font-mono font-black text-slate-900 text-sm mt-0.5 block">
                    {selectedClaim.estimatedCost && selectedClaim.estimatedCost > 0
                      ? `Rp ${selectedClaim.estimatedCost.toLocaleString("id-ID")}`
                      : "Belum Ditentukan"}
                  </span>
                </div>
              </div>

              {/* Foto Bukti Kerusakan jika ada */}
              {selectedClaim.photo && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-700 block">Foto Bukti Kerusakan:</span>
                  <div
                    onClick={() => setPreviewPhoto(selectedClaim.photo || null)}
                    className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group">
                    <img
                      src={selectedClaim.photo}
                      alt="Bukti Kerusakan"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                      <span className="material-symbols-outlined text-base">visibility</span>
                      <span>Perbesar Foto</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-2">
              {selectedClaim.status !== "Dalam Perbaikan" && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus(selectedClaim.id, "Dalam Perbaikan")}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">build</span>
                  <span>Kirim ke Bengkel</span>
                </button>
              )}

              {selectedClaim.status !== "Selesai" && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus(selectedClaim.id, "Selesai")}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span>Tandai Selesai (Unit Tersedia)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Foto Layar Penuh */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-700">
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer z-10">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <img
              src={previewPhoto}
              alt="Bukti Kerusakan"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ClaimsSkeleton() {
  return (
    <div className="w-full min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6 flex justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-36"></div>
          <div className="h-8 bg-slate-200 rounded w-72"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-52"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200"></div>
        ))}
      </div>
      <div className="h-96 bg-white rounded-2xl border border-slate-200 p-6"></div>
    </div>
  );
}
