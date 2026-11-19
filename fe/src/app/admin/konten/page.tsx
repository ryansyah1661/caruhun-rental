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

const DEFAULT_CORPORATE_PARTNERS = [
  { name: "PT Surya Logistik", icon: "local_shipping" },
  { name: "Mandiri Travel", icon: "flight_takeoff" },
  { name: "Auto2000 Cilandak", icon: "car_repair" },
  { name: "PT Indonesia Maju", icon: "apartment" },
  { name: "Nusantara Event", icon: "celebration" },
  { name: "Klinik Sehat Sentosa", icon: "health_and_safety" },
  { name: "Bank Central Asia", icon: "account_balance" },
  { name: "Telkom Indonesia", icon: "cell_tower" },
];

const DEFAULT_PARTNERSHIP_MODELS = [
  {
    icon: "corporate_fare",
    badge: "B2B & Instansi",
    title: "Kontrak Sewa Korporat",
    description:
      "Penyediaan armada jangka pendek maupun kontrak bulanan/tahunan untuk operasional perusahaan, kunjungan dinas, dan antar-jemput karyawan.",
    benefits: [
      "Skema pembayaran termin & invoice resmi perusahaan",
      "Unit pengganti (backup) siap sedia jika terjadi servis",
      "Prioritas ketersediaan armada saat peak season",
    ],
  },
  {
    icon: "handshake",
    badge: "Bagi Hasil",
    title: "Titip Unit / Kemitraan Armada",
    description:
      "Program pengelolaan kendaraan milik perorangan atau investor ke dalam sistem operasional Caruhun dengan pelaporan jadwal yang transparan.",
    benefits: [
      "Penyewa terverifikasi ketat (KTP, SIM A & BI Checking)",
      "Unit terpantau GPS 24 jam & jadwal terdata rapi",
      "Laporan pendapatan & riwayat perawatan berkala",
    ],
  },
  {
    icon: "flight_takeoff",
    badge: "Hospitality & Travel",
    title: "Mitra Hotel, Tour & EO",
    description:
      "Kolaborasi penyediaan transportasi tamu hotel, peserta seminar, maupun paket wisata rombongan dengan tarif khusus mitra.",
    benefits: [
      "Komisi/rate khusus rekanan biro perjalanan & hotel",
      "Driver berpengalaman, rapi, dan paham rute wisata",
      "Koordinasi jadwal penjemputan bandara tepat waktu",
    ],
  },
];

const DEFAULT_DELIVERY_ZONES = [
  { id: "bogor-tengah", district: "Bogor Tengah", city: "Kota Bogor", normalFee: 50000, nightDropFee: 100000, nightPickupFee: 100000 },
  { id: "bogor-utara", district: "Bogor Utara", city: "Kota Bogor", normalFee: 60000, nightDropFee: 110000, nightPickupFee: 110000 },
  { id: "bogor-barat", district: "Bogor Barat / Dramaga", city: "Kab. Bogor", normalFee: 75000, nightDropFee: 125000, nightPickupFee: 125000 },
  { id: "cibinong", district: "Cibinong", city: "Kab. Bogor", normalFee: 100000, nightDropFee: 150000, nightPickupFee: 150000 },
  { id: "sentul", district: "Babakan Madang / Sentul", city: "Kab. Bogor", normalFee: 110000, nightDropFee: 160000, nightPickupFee: 160000 },
  { id: "ciawi", district: "Ciawi / Puncak Bawah", city: "Kab. Bogor", normalFee: 120000, nightDropFee: 170000, nightPickupFee: 170000 },
  { id: "beji", district: "Beji / Margonda", city: "Kota Depok", normalFee: 150000, nightDropFee: 200000, nightPickupFee: 200000 },
  { id: "cinere", district: "Cinere / Limo", city: "Kota Depok", normalFee: 175000, nightDropFee: 225000, nightPickupFee: 225000 },
  { id: "cilandak", district: "Cilandak / TB Simatupang", city: "Jakarta Selatan", normalFee: 210000, nightDropFee: 260000, nightPickupFee: 260000 },
  { id: "kebayoran", district: "Kebayoran Baru / Sudirman", city: "Jakarta Selatan", normalFee: 230000, nightDropFee: 280000, nightPickupFee: 280000 },
  { id: "bekasi-barat", district: "Bekasi Barat", city: "Kota Bekasi", normalFee: 220000, nightDropFee: 270000, nightPickupFee: 270000 },
  { id: "soetta", district: "Bandara Soekarno-Hatta", city: "Tangerang", normalFee: 320000, nightDropFee: 370000, nightPickupFee: 400000 },
];

const DEFAULT_PACKAGE_RULES: Record<string, { title: string; description: string }[]> = {
  "lepas-kunci": [
    { title: "Pengembalian Deposit", description: "Deposit jaminan dikembalikan 100% via transfer maksimal 1×24 jam setelah unit kembali tanpa kendala atau pelanggaran ETLE." },
    { title: "Toleransi & Overtime", description: "Toleransi keterlambatan pengembalian 1 jam. Selebihnya dikenakan biaya overtime 10% per jam dari tarif harian unit." },
    { title: "Ketentuan BBM (Bar-to-Bar)", description: "Tarif Lepas Kunci belum termasuk BBM, tol, dan parkir. Posisi indikator BBM saat kembali wajib sama seperti saat serah terima awal." },
  ],
  "dengan-driver": [
    { title: "Ketentuan Deposit Jaminan", description: "Deposit jaminan digunakan untuk mengantisipasi biaya overtime, rute tambahan, atau tol/parkir di akhir perjalanan, dan sisanya dikembalikan penuh maksimal 1×24 jam." },
    { title: "Biaya Operasional Perjalanan", description: "Tarif tertera mencakup unit dan jasa pengemudi. BBM, tol, parkir, dan uang makan driver (Rp 75.000/hari) ditanggung penyewa." },
    { title: "Perjalanan Menginap Luar Kota", description: "Untuk perjalanan luar kota menginap, penyewa menyediakan akomodasi penginapan driver atau biaya penginapan Rp 150.000/malam." },
  ],
  "bandara": [
    { title: "Tarif All-In Sekali Jalan", description: "Harga paket Drop-off Bandara sudah termasuk unit, driver, BBM, dan biaya tol dari titik jemput wilayah Bogor ke terminal tujuan." },
    { title: "Penjemputan Bandara (Pick-up)", description: "Untuk penjemputan dari bandara ke Bogor berlaku tarif yang sama (hanya menambah biaya parkir resmi bandara sesuai struk)." },
    { title: "Garansi Tepat Waktu", description: "Driver standby di lokasi penjemputan minimal 30 menit sebelum jadwal keberangkatan agar Anda tidak terburu-buru mengejar penerbangan." },
  ],
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export default function AdminKontenWebsitePage() {
  const [activeSlug, setActiveSlug] = useState<PageSlug>("partner");
  const [badge, setBadge] = useState("");
  const [title, setTitle] = useState("");
  const [titleHighlight, setTitleHighlight] = useState("");
  const [description, setDescription] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Khusus Tab Partner: Partners List & Models
  const [partnersList, setPartnersList] = useState(DEFAULT_CORPORATE_PARTNERS);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerIcon, setNewPartnerIcon] = useState("business");
  const [partnerSectionTitle, setPartnerSectionTitle] = useState("Partner & Pelanggan Perusahaan");
  const [partnerSectionDesc, setPartnerSectionDesc] = useState("Telah dipercaya oleh berbagai instansi, bengkel resmi, dan perusahaan terkemuka.");

  // Models Kemitraan
  const [modelsList, setModelsList] = useState(DEFAULT_PARTNERSHIP_MODELS);

  // Khusus Tab Tarif: Delivery Zones & Package Rules
  const [deliveryZones, setDeliveryZones] = useState(DEFAULT_DELIVERY_ZONES);
  const [newZoneDistrict, setNewZoneDistrict] = useState("");
  const [newZoneCity, setNewZoneCity] = useState("");
  const [newZoneNormal, setNewZoneNormal] = useState("");
  const [newZoneNightDrop, setNewZoneNightDrop] = useState("");
  const [newZoneNightPickup, setNewZoneNightPickup] = useState("");
  const [packageRules, setPackageRules] = useState<Record<string, { title: string; description: string }[]>>(DEFAULT_PACKAGE_RULES);

  // Save states for tarif sections
  const [isSavingZones, setIsSavingZones] = useState(false);
  const [isSavingRules, setIsSavingRules] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPartners, setIsSavingPartners] = useState(false);
  const [isSavingModels, setIsSavingModels] = useState(false);
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
      const sections = json?.sections || {};
      const hero = sections?.hero;

      setBadge(hero?.badge ?? fallback.badge);
      setTitle(hero?.title ?? fallback.title);
      setTitleHighlight(hero?.title_highlight ?? fallback.title_highlight);
      setDescription(hero?.description ?? fallback.description);
      setCurrentImageUrl(hero?.image_url ?? null);

      if (slug === "partner") {
        if (sections?.partners?.extra_items && Array.isArray(sections.partners.extra_items)) {
          setPartnersList(sections.partners.extra_items);
        } else {
          setPartnersList(DEFAULT_CORPORATE_PARTNERS);
        }
        if (sections?.partners?.title) {
          setPartnerSectionTitle(sections.partners.title);
        }
        if (sections?.partners?.description) {
          setPartnerSectionDesc(sections.partners.description);
        }

        if (sections?.partnership_models?.extra_items && Array.isArray(sections.partnership_models.extra_items)) {
          setModelsList(sections.partnership_models.extra_items);
        } else {
          setModelsList(DEFAULT_PARTNERSHIP_MODELS);
        }
      }

      if (slug === "tarif") {
        if (sections?.delivery_zones?.extra_items && Array.isArray(sections.delivery_zones.extra_items)) {
          setDeliveryZones(sections.delivery_zones.extra_items);
        } else {
          setDeliveryZones(DEFAULT_DELIVERY_ZONES);
        }
        if (sections?.package_rules?.extra_items && typeof sections.package_rules.extra_items === "object") {
          setPackageRules(sections.package_rules.extra_items);
        } else {
          setPackageRules(DEFAULT_PACKAGE_RULES);
        }
      }
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

  const getAuthToken = () => {
    if (typeof window === "undefined") return "";
    return (
      localStorage.getItem("rental_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token") ||
      ""
    );
  };

  // Simpan Hero Banner
  const handleSubmitHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const token = getAuthToken();
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
        throw new Error(data?.message || "Gagal menyimpan perubahan header.");
      }

      if (data?.data?.image_url) {
        setCurrentImageUrl(data.data.image_url);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setFeedback({ type: "success", text: `Header halaman ${activeConfig.label} berhasil disimpan.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Tambah Partner Baru ke List
  const handleAddPartner = () => {
    if (!newPartnerName.trim()) return;
    setPartnersList((prev) => [...prev, { name: newPartnerName.trim(), icon: newPartnerIcon || "business" }]);
    setNewPartnerName("");
    setNewPartnerIcon("business");
  };

  // Hapus Partner dari List
  const handleRemovePartner = (index: number) => {
    setPartnersList((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Simpan Section Partner & Logo Pelanggan Perusahaan
  const handleSavePartnersList = async () => {
    setIsSavingPartners(true);
    setFeedback(null);

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("badge", "MITRA BERPENGALAMAN");
      formData.append("title", partnerSectionTitle);
      formData.append("description", partnerSectionDesc);
      formData.append("extra_items", JSON.stringify(partnersList));

      const res = await fetch(`${API_BASE}/admin/pages/partner/partners`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Gagal menyimpan daftar partner.");
      }

      setFeedback({ type: "success", text: "Daftar Partner & Logo Perusahaan berhasil diperbarui!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan partner.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsSavingPartners(false);
    }
  };

  // Simpan Skema Kemitraan
  const handleSaveModelsList = async () => {
    setIsSavingModels(true);
    setFeedback(null);

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("badge", "PROGRAM KERJA SAMA");
      formData.append("title", "Pilihan Skema Kemitraan");
      formData.append("extra_items", JSON.stringify(modelsList));

      const res = await fetch(`${API_BASE}/admin/pages/partner/partnership_models`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Gagal menyimpan skema kemitraan.");
      }

      setFeedback({ type: "success", text: "3 Kartu Skema Kemitraan berhasil diperbarui!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan skema kemitraan.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsSavingModels(false);
    }
  };

  // ============ TARIF HANDLERS ============

  // Tambah Zona Baru
  const handleAddZone = () => {
    if (!newZoneDistrict.trim() || !newZoneCity.trim()) return;
    const id = newZoneDistrict.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setDeliveryZones((prev) => [
      ...prev,
      {
        id,
        district: newZoneDistrict.trim(),
        city: newZoneCity.trim(),
        normalFee: Number(newZoneNormal) || 0,
        nightDropFee: Number(newZoneNightDrop) || 0,
        nightPickupFee: Number(newZoneNightPickup) || 0,
      },
    ]);
    setNewZoneDistrict("");
    setNewZoneCity("");
    setNewZoneNormal("");
    setNewZoneNightDrop("");
    setNewZoneNightPickup("");
  };

  // Hapus Zona
  const handleRemoveZone = (index: number) => {
    setDeliveryZones((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Update Fee Inline
  const handleUpdateZoneFee = (index: number, field: "normalFee" | "nightDropFee" | "nightPickupFee", value: number) => {
    setDeliveryZones((prev) =>
      prev.map((zone, idx) => (idx === index ? { ...zone, [field]: value } : zone))
    );
  };

  // Simpan Delivery Zones
  const handleSaveDeliveryZones = async () => {
    setIsSavingZones(true);
    setFeedback(null);

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("badge", "ZONA ONGKIR");
      formData.append("title", "Zona & Tarif Ongkir Antar-Jemput");
      formData.append("extra_items", JSON.stringify(deliveryZones));

      const res = await fetch(`${API_BASE}/admin/pages/tarif/delivery_zones`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Gagal menyimpan zona ongkir.");
      }

      setFeedback({ type: "success", text: "Zona & Tarif Ongkir berhasil diperbarui!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan zona ongkir.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsSavingZones(false);
    }
  };

  // Simpan Package Rules
  const handleSavePackageRules = async () => {
    setIsSavingRules(true);
    setFeedback(null);

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("badge", "KETENTUAN SEWA");
      formData.append("title", "Catatan & Ketentuan Sewa per Paket");
      formData.append("extra_items", JSON.stringify(packageRules));

      const res = await fetch(`${API_BASE}/admin/pages/tarif/package_rules`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Gagal menyimpan ketentuan paket.");
      }

      setFeedback({ type: "success", text: "Catatan & Ketentuan Sewa per Paket berhasil diperbarui!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan ketentuan paket.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setIsSavingRules(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-slate-900">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">
              {feedback.type === "success" ? "check_circle" : "error"}
            </span>
            <span>{feedback.text}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Konten Website Publik</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ubah teks judul, deskripsi banner, daftar partner instansi, dan skema kemitraan tanpa menyentuh kode program.
          </p>
        </div>

        <a
          href={activeConfig.publicPath}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-2 self-start sm:self-auto shadow-2xs transition-colors">
          <span>Buka Halaman {activeConfig.label}</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
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

      {/* ================= BAGIAN 1: HEADER & BANNER (HERO) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Teks & Gambar Banner (7 Kolom) */}
        <form
          onSubmit={handleSubmitHero}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                1. Edit Teks Header & Banner — {activeConfig.label}
              </h2>
              <p className="text-[11px] text-slate-400">Bagian paling atas yang tampil pertama kali saat halaman dibuka</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold">
              Header Hero
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">Memuat data konten...</div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Label Badge (Opsional)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Contoh: Kemitraan & Korporasi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Judul Utama (Baris 1)</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Tumbuh Bersama"
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
                    placeholder="Contoh: Jaringan Mitra Caruhun"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi / Subjudul</label>
                <textarea
                  rows={3}
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
                  {isSaving ? "Menyimpan Header..." : "Simpan Header"}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Preview Tampilan Header (5 Kolom) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pratinjau Tampilan Header
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
              Live Preview
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

      {/* ================= KHUSUS TAB PARTNER: FORM LIST PARTNER & MODEL KERJA SAMA ================= */}
      {activeSlug === "partner" && (
        <div className="space-y-6 pt-4">
          {/* Section 2: Daftar Logo & Nama Partner (Running Ticker) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  2. Kelola Partner & Pelanggan Perusahaan (Running Ticker)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar logo instansi dan nama perusahaan yang berjalan otomatis di halaman Partner.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSavePartnersList}
                disabled={isSavingPartners}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto">
                {isSavingPartners ? "Menyimpan Partner..." : "Simpan Daftar Partner"}
              </button>
            </div>

            {/* Input Judul & Deskripsi Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bagian Partner</label>
                <input
                  type="text"
                  value={partnerSectionTitle}
                  onChange={(e) => setPartnerSectionTitle(e.target.value)}
                  placeholder="Partner & Pelanggan Perusahaan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Bagian</label>
                <input
                  type="text"
                  value={partnerSectionDesc}
                  onChange={(e) => setPartnerSectionDesc(e.target.value)}
                  placeholder="Telah dipercaya oleh berbagai instansi..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Tambah Partner Baru */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Tambah Mitra / Perusahaan Baru:</span>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  placeholder="Nama Instansi/Perusahaan (misal: PT Wijaya Karya)"
                  className="flex-1 w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
                <select
                  value={newPartnerIcon}
                  onChange={(e) => setNewPartnerIcon(e.target.value)}
                  className="w-full sm:w-44 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 cursor-pointer">
                  <option value="business">Ikon: Bisnis/Gedung</option>
                  <option value="apartment">Ikon: Apartemen</option>
                  <option value="account_balance">Ikon: Bank / Keuangan</option>
                  <option value="local_shipping">Ikon: Logistik / Truk</option>
                  <option value="flight_takeoff">Ikon: Travel / Bandara</option>
                  <option value="car_repair">Ikon: Bengkel / Otomotif</option>
                  <option value="health_and_safety">Ikon: Medis / RS</option>
                  <option value="celebration">Ikon: Event / EO</option>
                  <option value="cell_tower">Ikon: Telekomunikasi</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddPartner}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer">
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            {/* Daftar Partner Aktif */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Daftar Mitra Aktif ({partnersList.length} Mitra):</span>
                <span className="text-[11px] text-slate-400">Klik tanda silang (x) untuk menghapus</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {partnersList.map((partner, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-amber-400 transition-colors shadow-2xs group">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-lg">{partner.icon || "business"}</span>
                      </div>
                      <span className="font-bold text-xs text-slate-800 truncate">{partner.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePartner(pIdx)}
                      className="text-slate-300 hover:text-rose-600 p-1 cursor-pointer">
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Skema Kemitraan (3 Model Kerja Sama) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  3. Edit 3 Kartu Skema Kemitraan
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ubah judul, deskripsi, dan poin keuntungan dari 3 pilihan program kemitraan Caruhun.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveModelsList}
                disabled={isSavingModels}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto">
                {isSavingModels ? "Menyimpan Skema..." : "Simpan Skema Kemitraan"}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {modelsList.map((model, mIdx) => (
                <div key={mIdx} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Kartu #{mIdx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{model.badge}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Judul Program</label>
                    <input
                      type="text"
                      value={model.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setModelsList((prev) =>
                          prev.map((item, idx) => (idx === mIdx ? { ...item, title: val } : item))
                        );
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi Program</label>
                    <textarea
                      rows={3}
                      value={model.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setModelsList((prev) =>
                          prev.map((item, idx) => (idx === mIdx ? { ...item, description: val } : item))
                        );
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs leading-relaxed focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Poin Keuntungan (Pisahkan baris baru)
                    </label>
                    <textarea
                      rows={3}
                      value={Array.isArray(model.benefits) ? model.benefits.join("\n") : ""}
                      onChange={(e) => {
                        const val = e.target.value.split("\n");
                        setModelsList((prev) =>
                          prev.map((item, idx) => (idx === mIdx ? { ...item, benefits: val } : item))
                        );
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-[11px] font-mono leading-relaxed focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= KHUSUS TAB TARIF: ZONA ONGKIR & KETENTUAN PAKET ================= */}
      {activeSlug === "tarif" && (
        <div className="space-y-6 pt-4">
          {/* Info Card: Tarif Unit Kendaraan */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs">
            <span className="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">
              info
            </span>
            <div className="space-y-0.5 text-slate-700">
              <span className="font-bold text-slate-900 block">
                Pengaturan Tarif Unit Mobil (Lepas Kunci, Driver & Bandara):
              </span>
              <p className="leading-relaxed">
                Tarif sewa mobil per unit (12 Jam, Harian 24 Jam, Bulanan, Driver & Drop-off Bandara) disinkronkan otomatis dari data master armada. Untuk mengubah harga sewa unit tertentu, silakan buka menu{" "}
                <a
                  href="/admin/vehicles"
                  className="font-bold text-amber-700 hover:text-amber-800 underline decoration-amber-400">
                  Armada & Lapangan &gt; Kelola Kendaraan
                </a>.
              </p>
            </div>
          </div>

          {/* Section 2: Zona & Tarif Ongkir Antar-Jemput */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  2. Kelola Zona & Tarif Ongkir Antar-Jemput
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur tarif antar-jemput unit berdasarkan zona wilayah tujuan penyewa.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSaveDeliveryZones}
                disabled={isSavingZones}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto">
                {isSavingZones ? "Menyimpan Zona..." : "Simpan Zona Ongkir"}
              </button>
            </div>

            {/* Tambah Zona Baru */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Tambah Zona Baru:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 items-end">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kecamatan/Wilayah</label>
                  <input
                    type="text"
                    value={newZoneDistrict}
                    onChange={(e) => setNewZoneDistrict(e.target.value)}
                    placeholder="Contoh: Tanah Sareal"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Kota/Kab</label>
                  <input
                    type="text"
                    value={newZoneCity}
                    onChange={(e) => setNewZoneCity(e.target.value)}
                    placeholder="Contoh: Kota Bogor"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tarif Normal</label>
                  <input
                    type="number"
                    value={newZoneNormal}
                    onChange={(e) => setNewZoneNormal(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Antar Malam</label>
                  <input
                    type="number"
                    value={newZoneNightDrop}
                    onChange={(e) => setNewZoneNightDrop(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Jemput Malam</label>
                  <input
                    type="number"
                    value={newZoneNightPickup}
                    onChange={(e) => setNewZoneNightPickup(e.target.value)}
                    placeholder="100000"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddZone}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer">
                  <span className="material-symbols-outlined text-base">add</span>
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            {/* Tabel Daftar Zona */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Daftar Zona Ongkir ({deliveryZones.length} Zona):</span>
                <span className="text-[11px] text-slate-400">Edit tarif langsung di tabel, lalu klik Simpan</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold">
                      <th className="text-left px-3 py-2.5">Kecamatan / Wilayah</th>
                      <th className="text-left px-3 py-2.5">Kota / Kab</th>
                      <th className="text-right px-3 py-2.5">Normal (Rp)</th>
                      <th className="text-right px-3 py-2.5">Antar Malam (Rp)</th>
                      <th className="text-right px-3 py-2.5">Jemput Malam (Rp)</th>
                      <th className="text-center px-3 py-2.5 w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryZones.map((zone, zIdx) => (
                      <tr key={zone.id || zIdx} className="border-t border-slate-100 hover:bg-amber-50/30 transition-colors">
                        <td className="px-3 py-2 font-bold text-slate-800">{zone.district}</td>
                        <td className="px-3 py-2 text-slate-600">{zone.city}</td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={zone.normalFee}
                            onChange={(e) => handleUpdateZoneFee(zIdx, "normalFee", Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded-lg border border-slate-200 text-xs text-right font-mono focus:outline-none focus:border-amber-500 bg-white"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={zone.nightDropFee}
                            onChange={(e) => handleUpdateZoneFee(zIdx, "nightDropFee", Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded-lg border border-slate-200 text-xs text-right font-mono focus:outline-none focus:border-amber-500 bg-white"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            value={zone.nightPickupFee}
                            onChange={(e) => handleUpdateZoneFee(zIdx, "nightPickupFee", Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded-lg border border-slate-200 text-xs text-right font-mono focus:outline-none focus:border-amber-500 bg-white"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveZone(zIdx)}
                            className="text-slate-300 hover:text-rose-600 p-1 cursor-pointer">
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 3: Catatan & Ketentuan Sewa per Paket */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  3. Edit Catatan & Ketentuan Sewa per Paket
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ubah judul dan deskripsi 3 catatan penting pada setiap paket layanan sewa.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSavePackageRules}
                disabled={isSavingRules}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto">
                {isSavingRules ? "Menyimpan Ketentuan..." : "Simpan Ketentuan Paket"}
              </button>
            </div>

            {/* Sub-sections per paket */}
            {([
              { key: "lepas-kunci", label: "Lepas Kunci", icon: "key" },
              { key: "dengan-driver", label: "Dengan Driver", icon: "person" },
              { key: "bandara", label: "Drop-off Bandara", icon: "flight_takeoff" },
            ] as const).map((pkg) => (
              <div key={pkg.key} className="space-y-3">
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">{pkg.icon}</span>
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">{pkg.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-extrabold">
                    {(packageRules[pkg.key] || []).length} Ketentuan
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {(packageRules[pkg.key] || []).map((rule, rIdx) => (
                    <div key={rIdx} className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Ketentuan #{rIdx + 1}
                        </span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Judul Ketentuan</label>
                        <input
                          type="text"
                          value={rule.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPackageRules((prev) => ({
                              ...prev,
                              [pkg.key]: (prev[pkg.key] || []).map((item, idx) =>
                                idx === rIdx ? { ...item, title: val } : item
                              ),
                            }));
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi Ketentuan</label>
                        <textarea
                          rows={3}
                          value={rule.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPackageRules((prev) => ({
                              ...prev,
                              [pkg.key]: (prev[pkg.key] || []).map((item, idx) =>
                                idx === rIdx ? { ...item, description: val } : item
                              ),
                            }));
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs leading-relaxed focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
