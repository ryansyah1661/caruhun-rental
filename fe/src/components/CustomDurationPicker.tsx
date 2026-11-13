"use client";

import React, { useState, useRef, useEffect } from "react";

interface CustomDurationPickerProps {
  value: number; // Jumlah hari (minimal 1)
  onChange: (days: number) => void;
  label?: string;
}

const PRESET_DAYS = [1, 2, 3, 4, 5, 6, 7, 10, 14];

export default function CustomDurationPicker({ value, onChange, label = "LAMA SEWA" }: CustomDurationPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(String(value));
  const containerRef = useRef<HTMLDivElement>(null);

  // Sinkronkan teks input jika value berubah dari luar atau dari tombol preset/-/+
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectDays = (days: number) => {
    const validDays = Math.max(1, days);
    onChange(validDays);
    setInputValue(String(validDays));
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya izinkan karakter angka
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(raw);

    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      onChange(parsed);
    }
  };

  const handleInputBlur = () => {
    const parsed = parseInt(inputValue, 10);
    const validDays = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    onChange(validDays);
    setInputValue(String(validDays));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputBlur();
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Box (Seragam dengan CustomDatePicker & CustomTimePicker) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full text-left rounded-2xl px-4 py-2.5 border transition-all flex items-center justify-between cursor-pointer ${
          isOpen
            ? "bg-white border-amber-500 ring-2 ring-amber-500/15"
            : "bg-slate-50 border-slate-200 hover:border-slate-300"
        }`}>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
          <span className="block text-sm font-bold text-slate-900 mt-0.5">{value} Hari</span>
        </div>
        <span className="material-symbols-outlined text-slate-400 text-[20px]">timelapse</span>
      </button>

      {/* Popover Pilihan Durasi */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 lg:left-0 top-full mt-2 w-64 sm:w-72 bg-white border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] p-4 z-50">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-extrabold text-slate-900">Pilih Durasi Sewa</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">24 Jam / Hari</span>
          </div>

          {/* Grid Pilihan Cepat 1 - 14 Hari */}
          <div className="grid grid-cols-3 gap-2">
            {PRESET_DAYS.map((day) => {
              const isSelected = day === value;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDays(day)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-amber-50 hover:text-amber-700 border border-slate-100"
                  }`}>
                  {day} Hari
                </button>
              );
            })}
          </div>

          {/* Input Manual + Stepper -/+ di Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between px-1">
            <span className="text-[11px] font-medium text-slate-500">Custom hari:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onChange(Math.max(1, value - 1))}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Kurangi Hari">
                -
              </button>

              <div className="flex items-center bg-slate-50 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white rounded-lg px-2 h-7 transition-all">
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  aria-label="Jumlah hari sewa"
                  className="w-8 text-center text-xs font-extrabold text-slate-900 bg-transparent focus:outline-none"
                />
                <span className="text-[11px] font-semibold text-slate-400">Hr</span>
              </div>

              <button
                type="button"
                onClick={() => onChange(value + 1)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tambah Hari">
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
