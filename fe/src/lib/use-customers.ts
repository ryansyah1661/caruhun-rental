"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  nik: string;
  totalRental: number;
  status: "Aktif" | "Blacklist";
}

export interface CustomerResponse {
  customers: CustomerItem[];
  total: number;
}

export function useCustomers() {
  return useQuery<CustomerResponse>({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      const response = await api.get<CustomerResponse>("/admin/customers");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
