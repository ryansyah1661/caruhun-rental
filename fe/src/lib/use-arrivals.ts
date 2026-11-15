"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type ArrivalStatus = "Dalam Perjalanan" | "Tiba di Pool" | "Inspeksi Selesai" | "Terlambat";

export interface ArrivalItem {
  id: string;
  bookingCode: string;
  unitName: string;
  nopol: string;
  renterName: string;
  renterPhone: string;
  originOrDestination: string;
  estimatedArrival: string;
  driverName: string;
  status: ArrivalStatus;
}

export interface ArrivalStats {
  onTheWay: number;
  needCheck: number;
  inspectedDone: number;
}

export interface ArrivalResponse {
  arrivals: ArrivalItem[];
  stats: ArrivalStats;
}

export function useArrivals() {
  return useQuery<ArrivalResponse>({
    queryKey: ["admin", "arrivals"],
    queryFn: async () => {
      const response = await api.get<ArrivalResponse>("/admin/arrivals");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
