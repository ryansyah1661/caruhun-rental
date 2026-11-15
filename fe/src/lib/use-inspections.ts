"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type InspectionType = "Semua" | "Keluar (Check-Out)" | "Masuk (Check-In)";

export interface InspectionItem {
  id: string;
  code: string;
  unit: string;
  nopol: string;
  type: "Keluar (Check-Out)" | "Masuk (Check-In)";
  pic: string;
  date: string;
  status: string;
}

export interface InspectionResponse {
  inspections: InspectionItem[];
  total: number;
}

export function useInspections() {
  return useQuery<InspectionResponse>({
    queryKey: ["admin", "inspections"],
    queryFn: async () => {
      const response = await api.get<InspectionResponse>("/admin/inspections");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
