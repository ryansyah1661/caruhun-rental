"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type DepartureStatus = "Siap Berangkat" | "Dalam Perjalanan" | "Selesai" | "Tertunda";

export interface DepartureItem {
  id: string;
  bookingCode: string;
  unitName: string;
  nopol: string;
  renterName: string;
  renterPhone: string;
  destination: string;
  departureTime: string;
  driverName: string;
  serviceType?: "Lepas Kunci" | "Dengan Driver" | "Drop-off Bandara" | string;
  status: DepartureStatus;
}

export interface DepartureStats {
  ready: number;
  ongoing: number;
  completed: number;
}

export interface DepartureResponse {
  departures: DepartureItem[];
  stats: DepartureStats;
}

export function useDepartures() {
  return useQuery<DepartureResponse>({
    queryKey: ["admin", "departures"],
    queryFn: async () => {
      const response = await api.get<DepartureResponse>("/admin/departures");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
