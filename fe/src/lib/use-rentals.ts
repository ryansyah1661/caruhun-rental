"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type RentalStatus = "Selesai" | "Aktif" | "Dibatalkan";

export interface RentalHistoryItem {
  id: string;
  bookingCode: string;
  unitName: string;
  nopol: string;
  renterName: string;
  duration: string;
  totalCost: string;
  status: RentalStatus;
}

export interface RentalStats {
  totalSessions: string;
  activeCount: string;
  completedIncome: string;
}

export interface RentalResponse {
  rentals: RentalHistoryItem[];
  stats: RentalStats;
}

export function useRentals() {
  return useQuery<RentalResponse>({
    queryKey: ["admin", "rentals"],
    queryFn: async () => {
      const response = await api.get<RentalResponse>("/admin/rentals");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
