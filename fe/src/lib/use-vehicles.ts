"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface VehicleItem {
  id: string;
  name: string;
  nopol: string;
  category: string;
  transmission: string;
  year: number;
  status: "Tersedia" | "Disewa" | "Dipesan" | "Servis";
  odometer: string;
}

export interface VehicleResponse {
  vehicles: VehicleItem[];
  total: number;
}

export function useVehicles() {
  return useQuery<VehicleResponse>({
    queryKey: ["admin", "vehicles"],
    queryFn: async () => {
      const response = await api.get<VehicleResponse>("/admin/vehicles");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
