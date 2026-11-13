"use client";

import React, { useState, useRef, useEffect } from "react";

interface CustomTimePickerProps {
  value: string; // Format: "08:00"
  onChange: (timeStr: string) => void;
  label?: string;
  options?: string[];
}

const DEFAULT_TIME_SLOTS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "19:00",
  "21:00",
];

export default function CustomTimePicker({
  value,
  onChange,
  label = "JAM AMBIL",
  options = DEFAULT_TIME_SLOTS,
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTime = (timeSlot: string) => {
    onChange(timeSlot);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Box (Seragam dengan CustomDatePicker) */}
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
          <span className="block text-sm font-bold text-slate-900 mt-0.5">{value} WIB</span>
        </div>
        <span className="material-symbols-outlined text-slate-400 text-[20px]">schedule</span>
      </button>

      {/* Popover Grid Jam */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-64 sm:w-72 bg-white border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] p-4 z-50">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-extrabold text-slate-900">Pilih Jam Pengambilan</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WIB</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {options.map((slot) => {
              const isSelected = slot === value;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleSelectTime(slot)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:bg-amber-50 hover:text-amber-700 border border-slate-100"
                  }`}>
                  {slot}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-400">Terpilih: {value} WIB</span>
            <button
              type="button"
              onClick={() => handleSelectTime("08:00")}
              className="text-xs font-extrabold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer">
              Default (08:00)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
