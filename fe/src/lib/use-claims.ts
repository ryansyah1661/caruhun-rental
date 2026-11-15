"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ClaimItem {
  id: string;
  code: string;
  unit: string;
  nopol: string;
  issue: string;
  reporter: string;
  date: string;
  status: "Pending" | "Dalam Perbaikan" | "Selesai";
}

export interface ClaimResponse {
  claims: ClaimItem[];
  total: number;
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
