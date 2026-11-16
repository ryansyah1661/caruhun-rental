"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { roleLabel } from "@/lib/auth";

interface AttendanceRecord {
  id: string;
  userId: string | null;
  name: string;
  role: string;
  clockIn: string;
  clockOut: string;
  status: "Hadir" | "Izin" | "Alpha" | "Sakit" | "Belum Hadir";
  location: string;
  notes: string;
}

export default function AttendancePage() {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State Catat Absensi
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [selectedStaffRole, setSelectedStaffRole] = useState("petugas");
  const [status, setStatus] = useState("Hadir");
  const [location, setLocation] = useState("Pool Utama - Cilandak");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil Data Absensi Riil dari DB
  const { data, isLoading } = useQuery<{ date: string; attendances: AttendanceRecord[]; total: number }>({
    queryKey: ["admin", "attendances"],
    queryFn: async () => (await api.get("/admin/attendances")).data,
  });

  const attendances = data?.attendances || [];
  const filtered = attendances.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenModal = (staff?: AttendanceRecord) => {
    if (staff && staff.userId) {
      setSelectedStaff(staff.userId);
      setSelectedStaffName(staff.name);
      setSelectedStaffRole(staff.role);
    } else {
      setSelectedStaff("");
      setSelectedStaffName("");
      setSelectedStaffRole("petugas");
    }
    setStatus("Hadir");
    setLocation("Pool Utama - Cilandak");
    setNotes("");
    setIsModalOpen(true);
  };

  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/admin/attendances", {
        user_id: selectedStaff || null,
        name: selectedStaffName,
        role: selectedStaffRole,
        status,
        location,
        notes,
      });

      qc.invalidateQueries({ queryKey: ["admin", "attendances"] });
      setIsModalOpen(false);
    } catch {
      alert("Gagal mencatat absensi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClockOut = async (id: string) => {
    try {
      await api.put(`/admin/attendances/${id}/clock-out`);
      qc.invalidateQueries({ queryKey: ["admin", "attendances"] });
    } catch {
      alert("Gagal mencatat jam pulang.");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen p-6 lg:p-8 animate-pulse space-y-6">
        <div className="h-20 bg-white rounded-2xl border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Kehadiran</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kehadiran Staff & Driver Pool
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data absensi real-time dari database PostgreSQL untuk hari ini ({data?.date || "Hari Ini"}).
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">fingerprint</span>
          <span>Catat Absensi</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm font-bold text-slate-900">Total {attendances.length} Staf Terdata Hari Ini</div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nama pegawai..."
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
                <th className="px-4 py-3">Nama Pegawai</th>
                <th className="px-4 py-3">Jabatan / Role</th>
                <th className="px-4 py-3 text-center">Jam Masuk</th>
                <th className="px-4 py-3 text-center">Jam Pulang</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Lokasi / Keterangan</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{item.name}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-600">
                      {roleLabel[item.role as keyof typeof roleLabel] || item.role}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold">{item.clockIn}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-semibold">{item.clockOut}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          item.status === "Hadir"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : item.status === "Izin"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : item.status === "Sakit"
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : item.status === "Belum Hadir"
                                  ? "bg-slate-100 text-slate-500 border-slate-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      <div>{item.location}</div>
                      {item.notes && item.notes !== "-" && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.notes}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {item.status === "Belum Hadir" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenModal(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs inline-flex items-center gap-1 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          <span>Catat Hadir</span>
                        </button>
                      ) : item.status === "Hadir" && item.clockOut === "-" ? (
                        <button
                          type="button"
                          onClick={() => handleClockOut(item.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs inline-flex items-center gap-1 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">logout</span>
                          <span>Absen Pulang</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold">Tercatat</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada data kehadiran yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Absensi Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Catat Absensi Staf</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Pegawai / Staf</label>
                <input
                  type="text"
                  required
                  value={selectedStaffName}
                  onChange={(e) => setSelectedStaffName(e.target.value)}
                  placeholder="Ketik nama staff..."
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Kehadiran</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600">
                  <option value="Hadir">Hadir (Masuk Kerja)</option>
                  <option value="Izin">Izin</option>
                  <option value="Sakit">Sakit</option>
                  <option value="Alpha">Alpha (Tanpa Keterangan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Penugasan</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Pool Utama, Kantor Depok, Lapangan..."
                  className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan dinas luar, alasan izin, dll..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm cursor-pointer disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan Absensi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
