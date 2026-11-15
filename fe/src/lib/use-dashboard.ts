"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface DashboardKPI {
  total: number;
  available: number;
  booked: number;
  rented: number;
  maintenance: number;
}

export interface DashboardVehicle {
  id: string;
  name: string;
  nopol: string;
  transmission: string;
  year: number;
  category: string;
  status: "Tersedia" | "Dipesan" | "Disewa" | "Servis";
  odometer: string;
  fuel: string;
  fuelPercentage: number;
  actionText: string;
  actionHref: string;
}

export interface DashboardDeparture {
  id: string;
  code: string;
  time: string;
  unitName: string;
  nopol: string;
  renterName: string;
  type: string;
  status: string;
}

export interface DashboardArrival {
  id: string;
  code: string;
  time: string;
  unitName: string;
  nopol: string;
  renterName: string;
  isOverdue: boolean;
  status: string;
}

export interface DashboardOverdueAlert {
  id: string;
  code: string;
  unitName: string;
  nopol: string;
  renterName: string;
  renterPhone: string | null;
  hoursLate: number;
}

export interface DashboardActiveRental {
  id: string;
  unitName: string;
  nopol: string;
  renterName: string;
  renterPhone: string;
  departureTime: string;
  returnTime: string;
  totalFee: string;
  paymentStatus: "Sewa Lunas" | "Sewa Belum Bayar";
  remainingFee: string;
  extraNote?: string | null;
  adminName: string;
  isOverdue?: boolean;
}

export interface DashboardData {
  kpi: DashboardKPI;
  vehicles: DashboardVehicle[];
  departures: DashboardDeparture[];
  arrivals: DashboardArrival[];
  overdueAlerts: DashboardOverdueAlert[];
  activeRentals?: DashboardActiveRental[];
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await api.get<DashboardData>("/admin/dashboard");
      return response.data;
    },
    // Refresh otomatis setiap 30 detik untuk real-time update
    refetchInterval: 30000,
  });
}
