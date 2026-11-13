"use client";

import React, { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder = "Pilih opsi" }: CustomSelectProps) {
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

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Box (Seragam dengan CustomTimePicker) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between gap-2 cursor-pointer ${
          isOpen
            ? "bg-white border-amber-500 ring-2 ring-amber-500/15 text-slate-900"
            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800"
        }`}>
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <span
          className={`material-symbols-outlined text-slate-400 text-[18px] shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-amber-600" : ""
          }`}>
          expand_more
        </span>
      </button>

      {/* Custom Popover List */}
      {isOpen && (
        <div className="absolute right-0 sm:left-0 top-full mt-2 w-full min-w-[230px] bg-white border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.14)] p-1.5 z-50 space-y-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-amber-600 text-white font-bold shadow-sm"
                    : "text-slate-700 font-semibold hover:bg-amber-50 hover:text-amber-700"
                }`}>
                <div>
                  <span className="block">{opt.label}</span>
                  {opt.description && (
                    <span
                      className={`block text-[10px] mt-0.5 font-normal ${
                        isSelected ? "text-amber-100" : "text-slate-400"
                      }`}>
                      {opt.description}
                    </span>
                  )}
                </div>
                {isSelected && <span className="material-symbols-outlined text-[16px] shrink-0">check</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
