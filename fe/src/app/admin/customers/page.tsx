"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCustomers } from "@/lib/use-customers";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  nik: string;
  totalRental: number;
  status: string;
}

export default function CustomersPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useCustomers();
  const [searchQuery, setSearchQuery] = useState("");

  // State Modal Edit & Hapus
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editNik, setEditNik] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customers = useMemo(() => (data?.customers || []) as CustomerItem[], [data?.customers]);
  const totalCount = data?.total ?? customers.length;

  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nik.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [customers, searchQuery]);

  const handleOpenEdit = (c: CustomerItem) => {
    setEditingCustomer(c);
    setEditName(c.name);
    setEditPhone(c.phone !== "-" ? c.phone : "");
    setEditNik(c.nik !== "-" ? c.nik : "");
  };

  const handleSaveEdit = async () => {
    if (!editingCustomer) return;
    setIsSubmitting(true);
    try {
      await api.put(`/admin/customers/${editingCustomer.id}`, {
        name: editName,
        phone: editPhone,
        nik: editNik,
      });
      qc.invalidateQueries({ queryKey: ["admin", "customers"] });
      setEditingCustomer(null);
    } catch {
      alert("Gagal memperbarui data pelanggan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      await api.delete(`/admin/customers/${id}`);
      qc.invalidateQueries({ queryKey: ["admin", "customers"] });
      setDeletingId(null);
    } catch {
      alert("Gagal menghapus pelanggan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <CustomersSkeleton />;
  }

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header Utama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Pelanggan</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Pelanggan & Penyewa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar penyewa terverifikasi, kontak WhatsApp, dan riwayat rental dari database PostgreSQL.
          </p>
        </div>
        <Link
          href="/admin/customers/create"
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Tambah Pelanggan Baru</span>
        </Link>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="text-sm font-bold text-slate-900">Total {totalCount} Pelanggan Terdaftar</div>
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari nama, WhatsApp, atau NIK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Tabel Pelanggan */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3 text-center">Nama Pelanggan</th>
                <th className="px-4 py-3 text-center">Kontak WhatsApp</th>
                <th className="px-4 py-3 text-center">No. Identitas (NIK)</th>
                <th className="px-4 py-3 text-center">Total Sewa</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{c.name}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{c.phone}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">{c.nik}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{c.totalRental} Kali</td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-center">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {c.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {c.phone && c.phone !== "-" && (
                          <a
                            href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs inline-flex items-center gap-1 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">chat</span>
                            <span>WA</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">edit</span>
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(c.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada pelanggan yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Pelanggan */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Edit Pelanggan</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK / KTP</label>
                <input
                  type="text"
                  value={editNik}
                  onChange={(e) => setEditNik(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
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

      {/* Modal Konfirmasi Hapus */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <span className="material-symbols-outlined text-4xl text-rose-500">warning</span>
            <h3 className="font-extrabold text-base text-slate-900">Hapus Data Pelanggan?</h3>
            <p className="text-xs text-slate-500">Data pelanggan ini akan diarsipkan (soft delete).</p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50">
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomersSkeleton() {
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
