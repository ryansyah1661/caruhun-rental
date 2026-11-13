"use client";

import React, { useState, useEffect, useCallback } from "react";

type PageSlug = "beranda" | "tentang" | "katalog" | "tarif" | "keunggulan" | "partner";

interface PageConfig {
  slug: PageSlug;
  label: string;
  publicPath: string;
  hasImage: boolean;
  defaults: {
    badge: string;
    title: string;
    title_highlight: string;
    description: string;
  };
}

const PAGE_CONFIGS: PageConfig[] = [
  {
    slug: "beranda",
    label: "Beranda",
    publicPath: "/",
    hasImage: true,
    defaults: {
      badge: "",
      title: "Solusi Armada Berkualitas",
      title_highlight: "Untuk Perjalanan Tanpa Kendala",
      description:
        "Caruhun Rental Armada menyediakan unit kendaraan MPV, SUV, City Car, hingga Minibus dalam kondisi terawat. Melayani sewa Lepas Kunci, Paket Dengan Driver, hingga Drop-off Bandara.",
    },
  },
  {
    slug: "tentang",
    label: "Tentang Kami",
    publicPath: "/tentang",
    hasImage: true,
    defaults: {
      badge: "Tentang Caruhun Rental",
      title: "Mitra Perjalanan Terpercaya",
      title_highlight: "Sejak Hari Pertama",
      description:
        "Kami hadir memberikan standar baru layanan transportasi di Bogor dan Jabodetabek dengan armada prima serta pelayanan transparan.",
    },
  },
  {
    slug: "katalog",
    label: "Katalog",
    publicPath: "/katalog",
    hasImage: false,
    defaults: {
      badge: "Pilihan Armada Terlengkap & Terawat",
      title: "Katalog Armada Sewa",
      title_highlight: "Siap Temani Perjalanan Anda",
      description:
        "Temukan unit kendaraan yang sesuai dengan kebutuhan perjalanan Anda. Tersedia transmisi matic & manual, layanan lepas kunci maupun dengan driver profesional.",
    },
  },
  {
    slug: "tarif",
    label: "Tarif & Ongkir",
    publicPath: "/tarif",
    hasImage: false,
    defaults: {
      badge: "Transparansi Biaya",
      title: "Tarif Sewa & Ongkir",
      title_highlight: "Jelas Sejak Awal",
      description:
        "Pilih paket layanan untuk melihat rincian harga resmi per durasi sewa, nominal deposit, serta simulasi biaya antar-jemput unit ke lokasi Anda.",
    },
  },
  {
    slug: "keunggulan",
    label: "Keunggulan",
    publicPath: "/keunggulan",
    hasImage: false,
    defaults: {
      badge: "Mengapa Memilih Caruhun",
      title: "Standar Layanan Profesional",
      title_highlight: "Untuk Kenyamanan Perjalanan Anda",
      description:
        "Kami menggabungkan kualitas armada yang selalu prima dengan sistem manajemen operasional modern untuk memberikan pengalaman sewa kendaraan tanpa rasa khawatir.",
    },
  },
  {
    slug: "partner",
    label: "Partner",
    publicPath: "/partner",
    hasImage: true,
    defaults: {
      badge: "Kemitraan & Korporasi",
      title: "Tumbuh Bersama",
      title_highlight: "Jaringan Mitra Caruhun",
      description:
        "Bergabunglah sebagai mitra pemilik unit atau rekanan korporasi untuk solusi mobilitas jangka panjang yang menguntungkan.",
    },
  },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function AdminKontenWebsitePage() {
  const [activeSlug, setActiveSlug] = useState<PageSlug>("beranda");
  const [badge, setBadge] = useState("");
  const [title, setTitle] = useState("");
  const [titleHighlight, setTitleHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const activeConfig = PAGE_CONFIGS.find((p) => p.slug === activeSlug) || PAGE_CONFIGS[0];

  const loadSectionData = useCallback(async (slug: PageSlug) => {
    setIsLoading(true);
    setFeedback(null);
    setSelectedFile(null);
    setPreviewUrl(null);

    const fallback = PAGE_CONFIGS.find((p) => p.slug === slug)?.defaults || {
      badge: "",
      title: "",
      title_highlight: "",
      description: "",
    };

    try {
      const res = await fetch(`${API_BASE}/public/pages/${slug}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Gagal mengambil data halaman");

      const json = await res.json();
      const hero = json?.sections?.hero;

      setBadge(hero?.badge ?? fallback.badge);
      setTitle(hero?.title ?? fallback.title);
      setTitleHighlight(hero?.title_highlight ?? fallback.title_highlight);
      setDescription(hero?.description ?? fallback.description);
      setCurrentImageUrl(hero?.image_url ?? null);
    } catch {
      setBadge(fallback.badge);
      setTitle(fallback.title);
      setTitleHighlight(fallback.title_highlight);
      setDescription(fallback.description);
      setCurrentImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSectionData(activeSlug);
  }, [activeSlug, loadSectionData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      // Sesuaikan key token di bawah jika di halaman /login kamu menyimpannya dengan nama lain
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("auth_token") || "" : "";

      const formData = new FormData();
      formData.append("badge", badge);
      formData.append("title", title);
      formData.append("title_highlight", titleHighlight);
      formData.append("description", description);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch(`${API_BASE}/admin/pages/${activeSlug}/hero`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Gagal menyimpan perubahan konten.");
      }

      if (data?.data?.image_url) {
        setCurrentImageUrl(data.data.image_url);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setFeedback({ type: "success", text: `Konten halaman ${activeConfig.label} berhasil disimpan.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-slate-900">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Konten Website Publik</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ubah teks judul, deskripsi, dan gambar banner setiap menu tanpa mengubah tata letak halaman.
          </p>
        </div>

        <a
          href={activeConfig.publicPath}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-2 self-start sm:self-auto shadow-2xs transition-colors">
          <span>Lihat Halaman {activeConfig.label}</span>
          <span>↗</span>
        </a>
      </div>

      {/* Tab Menu Halaman */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5 shadow-2xs">
        {PAGE_CONFIGS.map((page) => (
          <button
            key={page.slug}
            type="button"
            onClick={() => setActiveSlug(page.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSlug === page.slug
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}>
            {page.label}
          </button>
        ))}
      </div>

      {/* Alert Notifikasi */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
          {feedback.text}
        </div>
      )}

      {/* Grid Form Edit + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Input (7 Kolom) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-sm text-slate-900">Edit Teks & Media — {activeConfig.label}</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Kosongkan label badge jika halaman tidak memerlukan pill di atas judul.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-24 bg-slate-100 rounded-xl" />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Label Badge (Opsional)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Contoh: Transparansi Biaya"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama (Baris 1)</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Solusi Armada Berkualitas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Judul Sorotan Oranye (Baris 2)
                  </label>
                  <input
                    type="text"
                    value={titleHighlight}
                    onChange={(e) => setTitleHighlight(e.target.value)}
                    placeholder="Contoh: Untuk Perjalanan Tanpa Kendala"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi / Subjudul</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tulis penjelasan singkat halaman..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>

              {activeConfig.hasImage && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gambar Pendukung Halaman (JPG/PNG/WEBP, Maks. 3MB)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer">
                  {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Preview Tampilan Publik (5 Kolom) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pratinjau Tampilan Header
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
              Layout Terkunci
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3">
            {badge && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold">
                {badge}
              </span>
            )}

            <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
              {title || "Judul Utama"} <br />
              <span className="text-amber-600">{titleHighlight}</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

            {activeConfig.hasImage && (previewUrl || currentImageUrl) && (
              <div className="pt-2">
                <img
                  src={previewUrl || currentImageUrl || ""}
                  alt="Preview Banner"
                  className="w-full h-36 object-cover rounded-xl border border-slate-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
