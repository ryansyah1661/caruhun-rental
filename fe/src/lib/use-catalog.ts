"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type CategoryFilter = "semua" | "mpv" | "city" | "suv" | "minibus";

export interface BookedSlot {
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
}

export interface VehicleRateDetails {
  rate12h: number | null;
  rate24h: number;
  rate30d: number;
  deposit: number;
}

export interface VehicleDriverRateDetails {
  rate12h: number;
  rate24h: number;
  overtimePerHour: number;
  deposit: number;
  note: string;
}

export interface VehicleAirportRateDetails {
  cgk: number;
  hlp: number;
  whoosh: number;
}

export interface CatalogVehicle {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  category: CategoryFilter;
  categoryLabel: string;
  transmission: string;
  transmissionType?: "matic" | "manual";
  transmissionLabel?: string;
  color?: string;
  plateNumber?: string;
  plateType?: "Plat ganjil" | "Plat genap";
  seats: number;
  fuelType: string;
  luggage: string;
  pricePerDay: number;
  priceWithDriverPerDay: number;
  image: string;
  isAvailable: boolean;
  bookedDates: BookedSlot[];
  selfDrive: VehicleRateDetails | null;
  withDriver: VehicleDriverRateDetails;
  airport: VehicleAirportRateDetails;
  details: {
    year: number;
    engine: string;
    description: string;
    features: string[];
  };
}

export interface CatalogResponse {
  data: CatalogVehicle[];
}

export function useCatalog() {
  return useQuery<CatalogVehicle[]>({
    queryKey: ["public", "vehicles"],
    queryFn: async () => {
      const response = await api.get<CatalogResponse>("/public/vehicles");
      return response.data?.data || [];
    },
    staleTime: 60 * 1000,
  });
}
