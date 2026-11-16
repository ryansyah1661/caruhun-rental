"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { roleLabel } from "@/lib/auth";
import { useMe } from "@/lib/use-me";
import { api, TOKEN_KEY } from "@/lib/api";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: me, isLoading } = useMe();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form State untuk Edit Profil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle lihat sandi
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Tanggal Hari Ini Format Indonesia
  const currentDate = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenEdit = () => {
    setName(me?.name || "");
    setEmail(me?.email || "");
    setPassword("");
    setShowPassword(false);
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsDropdownOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.put("/profile", {
        name,
        email,
        password: password ? password : undefined,
      });

      qc.invalidateQueries({ queryKey: ["me"] });
      setSuccessMsg("Profil berhasil diperbarui!");
      setTimeout(() => {
        setIsEditModalOpen(false);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0;`;
    qc.clear();
    router.replace("/login");
  };

  return (
    <>
      <header className="sticky top-0 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 z-40 px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Toggle Mobile Sidebar */}
        <div className="flex items-center gap-2">
          <button
            aria-label="Menu Operasional"
            className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            type="button"
            onClick={onToggleSidebar}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Info Tanggal & Dropdown Profil Kanan Atas */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            <span className="material-symbols-outlined text-[16px] text-amber-600">calendar_today</span>
            <span>{currentDate}</span>
          </div>

          {/* User Profile Dropdown Button */}
          {isLoading || !me ? (
            <div className="flex items-center gap-2 pl-2 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-slate-200" />
              <div className="hidden sm:flex flex-col gap-1 text-left">
                <div className="w-20 h-3 rounded bg-slate-200" />
                <div className="w-14 h-2 rounded bg-slate-100" />
              </div>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer select-none">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-amber-500/20 shadow-xs">
                  {me.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">{me.name}</span>
                  <span className="text-[10px] font-semibold text-slate-500 leading-none mt-0.5">
                    {roleLabel[me.role] || "Staff"}
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  {isDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {/* Popover Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* Info Ringkas Akun */}
                  <div className="p-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      {me.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-extrabold text-xs text-slate-900 truncate">{me.name}</div>
                      <div className="text-[11px] text-slate-500 truncate font-mono">{me.email}</div>
                      <span className="inline-block px-2 py-0.5 mt-1 rounded-md bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-200/60">
                        {roleLabel[me.role]}
                      </span>
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleOpenEdit}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition-colors flex items-center gap-2.5 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px] text-slate-400">manage_accounts</span>
                      <span>Ganti Profil & Akun</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-3 py-2.5 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Modal Edit Profil */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Pengaturan Akun & Profil</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ubah nama pengguna, alamat email, atau kata sandi</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap / Username</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Budi Santoso"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@caruhun.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Baru{" "}
                  <span className="font-normal text-slate-400">(Opsional / kosongkan jika tidak ingin ganti)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-11 px-3.5 pr-11 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
