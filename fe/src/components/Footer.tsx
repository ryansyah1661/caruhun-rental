import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white text-sm">Caruhun Rental Armada</span>
          <span>•</span>
          <span>Sistem Manajemen Rental Terpadu</span>
        </div>
        <div>&copy; {new Date().getFullYear()} Caruhun Management System. All rights reserved.</div>
      </div>
    </footer>
  );
}
