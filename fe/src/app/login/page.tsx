"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { api, TOKEN_KEY } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setError(null);
    try {
      const { data } = await api.post<{ token: string }>("/login", values);
      localStorage.setItem(TOKEN_KEY, data.token);
      qc.clear();
      router.replace("/admin");
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 422) {
        setError(e.response.data?.errors?.email?.[0] ?? "Email atau kata sandi salah.");
      } else {
        setError("Tidak bisa terhubung ke server.");
      }
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-900 font-sans antialiased text-slate-800">
      {/* ================= PANEL KIRI: FORM LOGIN ================= */}
      <div className="flex w-full lg:w-5/12 xl:w-4/12 flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white shadow-2xl z-10">
        {/* Header Logo (Mengambil dari /image/logo.png & sedikit diperbesar) */}
        <div className="flex items-center gap-3.5">
          <img src="/images/logo.png" alt="Caruhun Trans Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">CARUHUN TRANS</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rental Armada</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto py-6 space-y-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">Masuk Dashboard</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Kelola operasional armada, jadwal sewa, dan laporan harian dengan mudah.
            </p>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-rose-500">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Input Email tanpa ikon */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Alamat Email</label>
              <input
                type="email"
                autoComplete="username"
                placeholder="admin@caruhun.com"
                className="w-full h-11 rounded-xl bg-slate-50 border border-slate-200 px-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                {...register("email")}
              />
              {errors.email && <p className="text-[11px] font-semibold text-rose-600 mt-1">{errors.email.message}</p>}
            </div>

            {/* Input Password tanpa ikon kiri, dengan ikon mata di kanan */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
                <a href="#" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-11 rounded-xl bg-slate-50 border border-slate-200 px-4 pr-11 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer flex items-center">
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer mt-2">
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} Caruhun Rental Armada. All rights reserved.
        </div>
      </div>

      {/* ================= PANEL KANAN ================= */}
      <div className="hidden lg:flex w-7/12 xl:w-8/12 bg-slate-950 relative overflow-hidden flex-col justify-between p-16 text-white border-l border-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 flex justify-end">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistem Operasional Aktif
          </div>
        </div>

        {/* Central Hero Content */}
        <div className="relative z-10 max-w-2xl my-auto space-y-6">
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">Caruhun Management System</h2>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
            Pusat kendali operasional rental kendaraan profesional. Pantau ketersediaan unit real-time, kelola jadwal
            serah terima, dan pastikan efisiensi pool terjaga optimal.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 max-w-xl">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <span className="material-symbols-outlined text-amber-500 text-xl">directions_car</span>
              <h3 className="text-xs font-bold text-white">Monitoring Armada</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Kontrol status unit keluar-masuk pool dengan pencatatan digital akurat.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
              <span className="material-symbols-outlined text-amber-500 text-xl">fact_check</span>
              <h3 className="text-xs font-bold text-white">Ceklis & Serah Terima</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Inspeksi kondisi fisik kendaraan dan tanda tangan digital terintegrasi.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-medium border-t border-slate-900 pt-6">
          <span>Akses Khusus Admin & Staf Operasional</span>
          <span>Caruhun Fleet Enterprise v2.4</span>
        </div>
      </div>
    </div>
  );
}
