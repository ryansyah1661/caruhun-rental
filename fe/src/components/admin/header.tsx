"use client";

import { roleLabel } from "@/lib/auth";
import { useMe } from "@/lib/use-me";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { data: me } = useMe();

  return (
    <header className="sticky top-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 px-space-md lg:px-space-lg flex items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-sm">
        <button
          aria-label="Menu Operasional"
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          type="button"
          onClick={onToggleSidebar}>
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      <div className="flex items-center gap-space-sm">
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span className="font-label-md text-label-md">Senin, 24 Okt 2024</span>
        </div>
        <button
          aria-label="Notifikasi"
          className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          type="button">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary-container ring-2 ring-surface-container-lowest"></span>
        </button>
        {me && (
          <div className="flex items-center gap-space-sm pl-space-xs">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-variant"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvkCl7lzGEmb2FxV_joWnIyswcr0kc4m8aASK2k2BfbNCjvOEuYn6TmPLhug1TLZeg4gejqLzUgbfn2rxfqmsPqmIhZ7befiF3vQ3IyxuAL-vtedfFH4GszfHueWNf0xqfNAa2uZSz0vbecGBzsAHtdlN_9RvcqPIXNVaaZveef2JvAuft18D3MqDxyT2OudhhMMvSom61KQHOtswX10yfoYSqzdXraqi7P_7AIHCtOhTIUFHM0wJFoA"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-tight font-medium">{me.name}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                {roleLabel[me.role]}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
