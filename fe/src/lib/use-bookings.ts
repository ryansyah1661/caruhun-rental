"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type UnitStatus = "Tersedia" | "Dipesan" | "Disewa" | "Servis" | "Selesai";

export interface CalendarBooking {
  id: string;
  bookingCode: string;
  renterName: string;
  renterPhone: string;
  isKtpVerified?: boolean;
  isSimActive?: boolean;
  unitName: string;
  unitInitial?: string;
  unitCode?: string;
  shortNopol: string;
  unitSpecs?: string;
  date: number;
  month: number; // 0 = Januari, ..., 9 = Oktober, 10 = November
  year: number;
  startDateFull: string;
  endDateFull: string;
  duration: string;
  status: UnitStatus;
  poolLocation?: string;
  adminName?: string;
  category?: string;
}

export interface BookingResponse {
  bookings: CalendarBooking[];
  counts: {
    total: number;
    mpv: number;
  };
}

export function useBookings() {
  return useQuery<BookingResponse>({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const response = await api.get<BookingResponse>("/admin/bookings");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
