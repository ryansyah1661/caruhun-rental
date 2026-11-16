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
    <div className="relative flex min-h-screen w-full items-center justify-center bg-slate-900 font-sans antialiased text-slate-800 p-4 sm:p-6 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= SINGLE UNIFIED CARD ================= */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 flex flex-col justify-between my-auto">
        {/* Header Logo & Branding */}
        <div className="flex flex-col items-center text-center space-y-2.5 pb-6 border-b border-slate-100">
          <img src="/images/logo.png" alt="Caruhun Trans Logo" className="w-14 h-14 object-contain" />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">CARUHUN TRANS</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 block">
              Management System
            </span>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-6 space-y-5">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700 flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-rose-500">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Alamat Email</label>
              <input
                type="email"
                autoComplete="username"
                placeholder="admin@caruhun.com"
                className="w-full h-11 rounded-xl bg-slate-50 border border-slate-200 px-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all"
                {...register("email")}
              />
              {errors.email && <p className="text-[11px] font-semibold text-rose-600 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
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
                  className="w-full h-11 rounded-xl bg-slate-50 border border-slate-200 px-4 pr-11 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white focus:ring-2 focus:ring-amber-500/20 transition-all"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer pt-0.5 mt-2">
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} PT. Caruhun Trans. All rights reserved.
        </div>
      </div>
    </div>
  );
}
