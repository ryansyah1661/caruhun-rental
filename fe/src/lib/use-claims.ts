"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ClaimItem {
  id: string;
  code: string;
  bookingCode?: string | null;
  vehicleId?: string | null;
  unit: string;
  nopol: string;
  issue: string;
  reporter: string;
  reporterPhone?: string;
  estimatedCost?: number;
  photo?: string | null;
  date: string;
  status: "Pending" | "Dalam Perbaikan" | "Selesai";
  source?: string;
}

export interface ClaimStats {
  total: number;
  pending: number;
  inRepair: number;
  resolved: number;
}

export interface ClaimResponse {
  claims: ClaimItem[];
  total: number;
  stats?: ClaimStats;
}

export function useClaims() {
  return useQuery<ClaimResponse>({
    queryKey: ["admin", "claims"],
    queryFn: async () => {
      const response = await api.get<ClaimResponse>("/admin/claims");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
