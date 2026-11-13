"use client";

import React, { useState, useRef, useEffect } from "react";

interface CustomDatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  label?: string;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const SHORT_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const DAY_HEADERS = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "Pilih tanggal";
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

function toYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CustomDatePicker({ value, onChange, label = "TANGGAL MULAI" }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"days" | "months">("days");
  const containerRef = useRef<HTMLDivElement>(null);

  const initialDate = value ? new Date(value + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Tutup popover saat klik di luar komponen & reset mode ke "days"
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setViewMode("days");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const parsed = new Date(value + "T00:00:00");
      if (!isNaN(parsed.getTime())) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
  }, [value]);

  const today = new Date();
  const todayStr = toYMD(today);

  const calendarDays = React.useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: { dateStr: string; day: number; isCurrentMonth: boolean }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const d = new Date(viewYear, viewMonth - 1, day);
      cells.push({ dateStr: toYMD(d), day, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      cells.push({ dateStr: toYMD(d), day, isCurrentMonth: true });
    }

    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(viewYear, viewMonth + 1, day);
      cells.push({ dateStr: toYMD(d), day, isCurrentMonth: false });
    }

    return cells;
  }, [viewYear, viewMonth]);

  // Navigasi panah kiri-kanan (geser bulan jika mode "days", geser tahun jika mode "months")
  const handlePrev = () => {
    if (viewMode === "months") {
      setViewYear((y) => y - 1);
      return;
    }
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (viewMode === "months") {
      setViewYear((y) => y + 1);
      return;
    }
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
    setViewMode("days");
  };

  const handleSelectMonth = (monthIdx: number) => {
    setViewMonth(monthIdx);
    setViewMode("days");
  };

  const handleSelectToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onChange(toYMD(now));
    setViewMode("days");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Box */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          setViewMode("days");
        }}
        className={`w-full text-left rounded-2xl px-4 py-2.5 border transition-all flex items-center justify-between cursor-pointer ${
          isOpen
            ? "bg-white border-amber-500 ring-2 ring-amber-500/15"
            : "bg-slate-50 border-slate-200 hover:border-slate-300"
        }`}>
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
          <span className="block text-sm font-bold text-slate-900 mt-0.5">{formatDisplayDate(value)}</span>
        </div>
        <span className="material-symbols-outlined text-slate-400 text-[20px]">calendar_today</span>
      </button>

      {/* Popover Kalender */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] p-4 z-50">
          {/* Header Navigasi & Toggle Bulan/Tahun */}
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label={viewMode === "months" ? "Tahun Sebelumnya" : "Bulan Sebelumnya"}>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode((prev) => (prev === "days" ? "months" : "days"))}
              className={`px-3 py-1.5 rounded-xl text-sm font-extrabold tracking-tight flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "months" ? "bg-slate-100 text-slate-900" : "text-slate-900 hover:bg-slate-100"
              }`}>
              <span>{viewMode === "months" ? viewYear : `${MONTH_NAMES[viewMonth]} ${viewYear}`}</span>
              <span className="material-symbols-outlined text-[18px] text-slate-500">
                {viewMode === "months" ? "expand_less" : "expand_more"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label={viewMode === "months" ? "Tahun Berikutnya" : "Bulan Berikutnya"}>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {viewMode === "months" ? (
            /* ================= TAMPILAN PILIH BULAN (JAN - DES) ================= */
            <div className="grid grid-cols-3 gap-2 py-2">
              {SHORT_MONTH_NAMES.map((shortMonth, idx) => {
                const isActiveMonth = idx === viewMonth;
                const isCurrentMonth = idx === today.getMonth() && viewYear === today.getFullYear();

                return (
                  <button
                    key={shortMonth}
                    type="button"
                    onClick={() => handleSelectMonth(idx)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActiveMonth
                        ? "bg-amber-600 text-white shadow-sm"
                        : isCurrentMonth
                          ? "border border-amber-500 text-amber-700 hover:bg-amber-50"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}>
                    {shortMonth}
                  </button>
                );
              })}
            </div>
          ) : (
            /* ================= TAMPILAN GRID TANGGAL ================= */
            <>
              <div className="grid grid-cols-7 text-center mb-2">
                {DAY_HEADERS.map((dayName) => (
                  <span key={dayName} className="text-[10px] font-bold text-slate-400 tracking-wider py-1">
                    {dayName}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1 text-center">
                {calendarDays.map((cell, idx) => {
                  const isSelected = cell.dateStr === value;
                  const isToday = cell.dateStr === todayStr;

                  return (
                    <div key={idx} className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleSelectDate(cell.dateStr)}
                        className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-600 text-white font-bold shadow-sm"
                            : isToday
                              ? "border border-amber-500 text-amber-700 font-bold hover:bg-amber-50"
                              : cell.isCurrentMonth
                                ? "text-slate-800 hover:bg-slate-100"
                                : "text-slate-300 hover:bg-slate-50"
                        }`}>
                        {cell.day}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Footer Tombol Hari Ini */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between px-1">
            <span className="text-[11px] text-slate-400">{formatDisplayDate(value)}</span>
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-xs font-extrabold text-amber-600 hover:text-amber-700 transition-colors cursor-pointer">
              Hari ini
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
