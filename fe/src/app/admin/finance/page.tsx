"use client";

import React, { useState, useMemo } from "react";
import { useFinance, TransactionItem } from "@/lib/use-finance";
import { api } from "@/lib/api";

export default function KeuanganPage() {
  const { data, isLoading, refetch } = useFinance();
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trxType, setTrxType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("Sewa Unit");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("transfer");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const transactions = useMemo(() => data?.transactions || [], [data?.transactions]);
  const stats = data?.stats || {
    totalIncome: 0,
    totalExpense: 0,
    netCash: 0,
    totalCount: 0,
    incomeCount: 0,
    expenseCount: 0,
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchType = filterType === "all" || item.type === filterType;
      const fullSearch = `${item.trxCode} ${item.desc} ${item.category} ${item.method} ${item.bookingCode || ""}`.toLowerCase();
      const matchSearch = fullSearch.includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [transactions, filterType, searchQuery]);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10);

    if (!numericAmount || numericAmount <= 0) {
      showToast("error", "Nominal transaksi harus lebih besar dari 0.");
      return;
    }

    if (!desc.trim()) {
      showToast("error", "Mohon isi keterangan transaksi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/admin/finance", {
        type: trxType,
        category,
        amount: numericAmount,
        method,
        desc: desc.trim(),
      });

      showToast("success", "Transaksi kas berhasil dicatat!");
      setIsModalOpen(false);
      setAmount("");
      setDesc("");
      await refetch();
    } catch (err: any) {
      showToast("error", err?.response?.data?.message || "Gagal mencatat transaksi kas.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <FinanceSkeleton />;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Keuangan</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Keuangan & Kas Pool</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau arus kas masuk dari penyewaan unit, pencatatan deposit sewa, serta pengeluaran operasional & servis bengkel.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Catat Transaksi Kas</span>
        </button>
      </div>

      {/* KPI Cards Keuangan (Data Real dari DB) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Pemasukan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pemasukan Sewa</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            Rp {stats.totalIncome.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-slate-500 pt-1">
            {stats.incomeCount} Transaksi pendapatan sewa & deposit
          </p>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran / Servis</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600">
            Rp {stats.totalExpense.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-slate-500 pt-1">
            {stats.expenseCount} Biaya perawatan & perbaikan bengkel
          </p>
        </div>

        {/* Saldo Kas Bersih */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Kas Bersih</span>
          <div className={`text-2xl sm:text-3xl font-extrabold ${stats.netCash >= 0 ? "text-slate-900" : "text-rose-600"}`}>
            Rp {stats.netCash.toLocaleString("id-ID")}
          </div>
          <p className="text-xs text-emerald-600 font-semibold pt-1">Arus kas operasional aktif</p>
        </div>
      </div>

      {/* Tabel Riwayat Transaksi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-base font-bold text-slate-900">Riwayat Arus Kas</h2>
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === "all" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}>
                Semua ({stats.totalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("income")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === "income" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}>
                Pemasukan ({stats.incomeCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("expense")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === "expense" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}>
                Pengeluaran ({stats.expenseCount})
              </button>
            </div>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari transaksi, kode booking, unit..."
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
                <th className="px-4 py-3 text-center">ID Transaksi</th>
                <th className="px-4 py-3 text-center">Tanggal</th>
                <th className="px-4 py-3">Keterangan / Rujukan</th>
                <th className="px-4 py-3 text-center">Metode</th>
                <th className="px-4 py-3 text-center">Kategori</th>
                <th className="px-4 py-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 text-center">{item.trxCode}</td>
                    <td className="px-4 py-3.5 text-slate-500 font-medium whitespace-nowrap text-center">{item.date}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{item.desc}</div>
                      {item.notes && item.notes !== item.desc && (
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.notes}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.method}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3.5 text-right font-extrabold font-mono text-sm whitespace-nowrap ${
                        item.type === "income" ? "text-emerald-600" : "text-rose-600"
                      }`}>
                      {item.type === "income"
                        ? `+ Rp ${item.amount.toLocaleString("id-ID")}`
                        : `- Rp ${item.amount.toLocaleString("id-ID")}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <span className="material-symbols-outlined text-4xl block mb-2 text-slate-300">
                      receipt_long
                    </span>
                    Tidak ada transaksi kas yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Transaksi Kas */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200 cursor-default">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">payments</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Catat Transaksi Kas Baru</h3>
                  <p className="text-[11px] text-slate-500">Input pemasukan sewa atau pengeluaran operasional</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTransaction} className="p-6 space-y-4 text-xs">
              {/* Jenis Transaksi */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Jenis Arus Kas</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTrxType("income");
                      setCategory("Sewa Unit");
                    }}
                    className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      trxType === "income"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}>
                    <span className="material-symbols-outlined text-base">arrow_downward</span>
                    <span>Pemasukan (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrxType("expense");
                      setCategory("Perawatan/Servis");
                    }}
                    className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      trxType === "expense"
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}>
                    <span className="material-symbols-outlined text-base">arrow_upward</span>
                    <span>Pengeluaran (-)</span>
                  </button>
                </div>
              </div>

              {/* Kategori Transaksi */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer">
                  {trxType === "income" ? (
                    <>
                      <option value="Sewa Unit">Sewa Unit / Pelunasan</option>
                      <option value="Booking/DP">Uang Muka (DP Booking)</option>
                      <option value="Uang Deposit">Titip Uang Deposit</option>
                      <option value="Denda / Klaim">Denda / Klaim Kerusakan</option>
                      <option value="Lainnya">Pemasukan Lainnya</option>
                    </>
                  ) : (
                    <>
                      <option value="Perawatan/Servis">Perawatan / Servis Bengkel</option>
                      <option value="BBM Operasional">BBM Armada Pool</option>
                      <option value="Cuci Mobil">Biaya Cuci Mobil</option>
                      <option value="Refund Deposit">Pengembalian (Refund) Deposit</option>
                      <option value="Lainnya">Operasional Lainnya</option>
                    </>
                  )}
                </select>
              </div>

              {/* Nominal & Metode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Nominal (Rp) *</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Contoh: 500000"
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Metode Pembayaran</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 cursor-pointer">
                    <option value="transfer">Transfer Bank</option>
                    <option value="cash">Tunai (Cash Pool)</option>
                    <option value="qris">QRIS</option>
                  </select>
                </div>
              </div>

              {/* Keterangan */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Keterangan Transaksi *</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Contoh: Pelunasan sisa sewa Avanza B 1482 KFD atau Ganti oli rutin HiAce..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"></textarea>
              </div>

              {/* Tombol Simpan */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                  <span className="material-symbols-outlined text-[16px]">
                    {isSubmitting ? "hourglass_top" : "check"}
                  </span>
                  <span>{isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FinanceSkeleton() {
  return (
    <div className="w-full min-h-screen p-6 lg:p-8 space-y-6 animate-pulse">
      <div className="h-28 bg-white rounded-2xl border border-slate-200 p-6 flex justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-36"></div>
          <div className="h-8 bg-slate-200 rounded w-72"></div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-44"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200"></div>
        ))}
      </div>
      <div className="h-96 bg-white rounded-2xl border border-slate-200 p-6"></div>
    </div>
  );
}
