"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type ArrivalStatus = "Dalam Perjalanan" | "Tiba di Pool" | "Inspeksi Selesai" | "Terlambat";
export type ArrivalServiceType = "Lepas Kunci" | "Dengan Driver" | "Drop-off Bandara";

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
  serviceType: ArrivalServiceType;
  status: ArrivalStatus;
}

export interface ArrivalStats {
  onTheWay: number;
  needCheck: number;
  inspectedDone: number;
  lepasKunci?: number;
  denganDriver?: number;
  bandara?: number;
}

export interface ArrivalResponse {
  arrivals: ArrivalItem[];
  stats: ArrivalStats;
}

export interface ArrivalDetailData {
  id: string;
  bookingCode: string;
  status: string;
  statusLabel: string;
  serviceType: ArrivalServiceType;
  arrivalTimeFormatted: string;
  startDate: string;
  endDate: string;
  duration: string;
  withDriver: boolean;
  destination: string;
  notes?: string;

  customer: {
    id: string | null;
    name: string;
    phone: string;
    nik: string;
    sim: string;
  };

  vehicle: {
    id: string | null;
    name: string;
    plateNumber: string;
    transmission: string;
    fuelType: string;
    poolLocation: string;
  };

  departure: {
    odometer: number;
    fuelLevel: number;
    handedAt: string | null;
    conditionNotes: string;
    guarantee: {
      type: "motor" | "deposit";
      motor_info?: string | null;
      deposit_amount?: number;
      photo?: string | null;
    } | null;
  };

  arrival: {
    id: string;
    odometer: number;
    fuelLevel: number;
    handedAt: string | null;
    conditionStatus: "ok" | "damaged";
    damageDescription: string;
    estimatedCost: number;
    checklist: Record<string, boolean>;
    guaranteeAction: "returned" | "held" | "none";
    guaranteeNotes?: string;
    photos: {
      front?: string | null;
      rear?: string | null;
      left?: string | null;
      right?: string | null;
      odometer?: string | null;
      damage?: string | null;
    } | null;
  } | null;
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

export function useArrivalDetail(id: string) {
  return useQuery<ArrivalDetailData>({
    queryKey: ["admin", "arrival-detail", id],
    queryFn: async () => {
      const response = await api.get<ArrivalDetailData>(`/admin/arrivals/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}
