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
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex min-h-screen w-full bg-surface font-body-md text-on-surface">
      {/* ================= LAYAR KIRI: FORM LOGIN ================= */}
      <div className="flex w-full lg:w-5/12 xl:w-4/12 flex-col justify-between p-8 sm:p-12 lg:p-16 bg-surface-container-lowest shadow-xl z-10">
        {/* Header Logo Mobile / Small */}
        <div className="flex items-center gap-3">
          <img
            alt="Caruhun Logo"
            className="h-9 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WpAKullBBAfxJg1Td_190jnICJzhbhDVZPdER5uz6g3hMdGswPzrovZchY39GIHC-3zj10cgrB4UIyFUQbZF2HlaNj9shYUNaBOW1birh9t1rAMcRbuntsYLRXtT7K9q2vW1yMwqGGsi62t0QoKf89Bruz66YC_77HrkR2jtFEaUEztSer9lJNl_uuhfGFoTqnYwTpH_uTAxfi7yehC_oVOJb_D7dymmRInXkujvGcSFBVipdKGxA6hlDS"
          />
          <div className="flex flex-col">
            <span className="font-title-md text-lg font-bold tracking-tight text-on-surface">Caruhun</span>
            <span className="text-[10px] font-semibold text-secondary uppercase tracking-widest">Rental Armada</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto py-8">
          <div className="mb-8">
            <h1 className="font-display-md text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
              Selamat Datang
            </h1>
            <p className="font-body-md text-secondary mt-2">
              Masuk ke akun administrator Anda untuk mengelola operasional armada.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-error-container/20 border border-error/30 p-4 text-sm text-error flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block font-label-md text-sm font-medium text-on-surface">Alamat Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-secondary">
                  mail
                </span>
                <input
                  type="email"
                  autoComplete="username"
                  placeholder="admin@caruhun.com"
                  className="w-full rounded-lg bg-surface-container-low border border-surface-variant pl-11 pr-4 py-3 text-on-surface font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/40 transition-all"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-label-md text-sm font-medium text-on-surface">Kata Sandi</label>
                <a href="#" className="text-xs font-medium text-primary hover:underline">
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-secondary">
                  lock
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg bg-surface-container-low border border-surface-variant pl-11 pr-4 py-3 text-on-surface font-body-md placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-container/40 transition-all"
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] rounded-lg bg-primary-container hover:bg-primary text-on-primary font-title-md font-semibold text-base shadow-md transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-xs text-secondary text-center lg:text-left">
          &copy; {new Date().getFullYear()} Caruhun Rental Armada System. All rights reserved.
        </div>
      </div>

      {/* ================= LAYAR KANAN: BRANDING & PENJELASAN ================= */}
      <div className="hidden lg:flex w-7/12 xl:w-8/12 bg-inverse-surface relative overflow-hidden flex-col justify-between p-16 text-surface-container-lowest">
        {/* Background Decorative Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary-container/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        {/* Top Tagline Badge */}
        <div className="relative z-10 flex justify-end">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Sistem Operasional Aktif
          </div>
        </div>

        {/* Central Penjelasan & Hero Text */}
        <div className="relative z-10 max-w-2xl my-auto space-y-6">
          <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-2">
            <img
              alt="Caruhun Helmet Logo"
              className="h-12 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WpAKullBBAfxJg1Td_190jnICJzhbhDVZPdER5uz6g3hMdGswPzrovZchY39GIHC-3zj10cgrB4UIyFUQbZF2HlaNj9shYUNaBOW1birh9t1rAMcRbuntsYLRXtT7K9q2vW1yMwqGGsi62t0QoKf89Bruz66YC_77HrkR2jtFEaUEztSer9lJNl_uuhfGFoTqnYwTpH_uTAxfi7yehC_oVOJb_D7dymmRInXkujvGcSFBVipdKGxA6hlDS"
            />
          </div>

          <h2 className="font-display-md text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Caruhun
            <br />
            <span className="text-primary-fixed-dim">Management System</span>
          </h2>

          <p className="font-body-md text-lg text-secondary-fixed-dim leading-relaxed">
            Pusat kendali operasional rental kendaraan untuk mempermudah pemantauan unit, pengelolaan jadwal sewa,
            servis armada, dan pencatatan laporan harian.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
              <span className="material-symbols-outlined text-primary-fixed-dim text-2xl">directions_car</span>
              <h3 className="font-title-md text-sm font-semibold text-white">Monitoring Armada</h3>
              <p className="text-xs text-secondary-fixed-dim">
                Pantau lokasi pool, kondisi bensin, dan status kesiapan unit.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-1">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-2xl">event_available</span>
              <h3 className="font-title-md text-sm font-semibold text-white">Jadwal Operasional</h3>
              <p className="text-xs text-secondary-fixed-dim">
                Atur jadwal serah terima, pengembalian unit, dan rekap sewa.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Subtext */}
        <div className="relative z-10 flex items-center justify-between text-xs text-secondary-fixed-dim border-t border-white/10 pt-6">
          <span>Akses Terproteksi Sistem</span>
          <span>Dukungan Operasional Pool</span>
        </div>
      </div>
    </div>
  );
}
