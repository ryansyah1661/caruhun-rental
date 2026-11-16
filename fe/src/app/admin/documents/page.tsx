"use client";

import React, { useState } from "react";

export default function DokumenRentalPage() {
  const [searchDoc, setSearchDoc] = useState("");

  const documents = [
    {
      id: "DOC-8921",
      bookingCode: "#CRH-2410-094",
      renter: "Ibu Maya Anggraini",
      unit: "Toyota Innova Zenix",
      type: "Surat Perjanjian & KTP",
      date: "15 Nov 2026",
      status: "Terverifikasi",
    },
    {
      id: "DOC-8920",
      bookingCode: "#CRH-2410-091",
      renter: "PT Surya Logistik",
      unit: "Toyota Avanza 1.5 G",
      type: "MoU Korporat & SIM",
      date: "15 Nov 2026",
      status: "Terverifikasi",
    },
    {
      id: "DOC-8919",
      bookingCode: "#CRH-2410-085",
      renter: "Bapak Rizky Kurniawan",
      unit: "Honda Brio RS",
      type: "Berita Acara Keluar",
      date: "13 Nov 2026",
      status: "Lengkap",
    },
    {
      id: "DOC-8918",
      bookingCode: "#CRH-2410-077",
      renter: "Agus Prasetyo",
      unit: "Mitsubishi Xpander",
      type: "KTP & SIM A Asli",
      date: "12 Nov 2026",
      status: "Lengkap",
    },
  ];

  const filteredDocs = documents.filter(
    (doc) =>
      doc.renter.toLowerCase().includes(searchDoc.toLowerCase()) ||
      doc.bookingCode.toLowerCase().includes(searchDoc.toLowerCase()) ||
      doc.unit.toLowerCase().includes(searchDoc.toLowerCase()),
  );

  return (
    <div className="w-full font-body-md text-slate-800 antialiased bg-slate-50/50 min-h-screen p-6 lg:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 font-medium">
            <span>Dashboard</span> &rsaquo; <span className="text-slate-800 font-bold">Dokumen Rental</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Arsip Dokumen & Kontrak Rental</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pusat penyimpanan digital surat perjanjian sewa, verifikasi identitas KTP/SIM, dan berita acara serah
            terima.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert("Unggah dokumen baru")}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0">
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Unggah Dokumen Baru</span>
        </button>
      </div>

      {/* Search Bar & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
              search
            </span>
            <input
              type="text"
              placeholder="Cari nama penyewa atau kode booking..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-600 transition-all"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Menampilkan <strong className="text-slate-900">{filteredDocs.length}</strong> arsip dokumen
          </span>
        </div>

        {/* Tabel Dokumen */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase h-11 border-b border-slate-200 divide-x divide-slate-200">
                <th className="px-4 py-3">ID & Kode Booking</th>
                <th className="px-4 py-3">Penyewa & Unit</th>
                <th className="px-4 py-3">Jenis Dokumen</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi / Unduh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors divide-x divide-slate-200">
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900">{doc.id}</div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">{doc.bookingCode}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 text-sm">{doc.renter}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{doc.unit}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">{doc.type}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => alert(`Melihat pratinjau dokumen ${doc.id}`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer">
                          Pratinjau
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Mengunduh berkas ${doc.id}`)}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs">
                          Unduh
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    Tidak ada dokumen yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
