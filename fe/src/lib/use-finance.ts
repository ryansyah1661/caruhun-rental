"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface TransactionItem {
  id: string;
  trxCode: string;
  date: string;
  desc: string;
  type: "income" | "expense";
  amount: number;
  method: string;
  category: string;
  bookingCode?: string;
  notes?: string;
}

export interface FinanceStats {
  totalIncome: number;
  totalExpense: number;
  netCash: number;
  totalCount: number;
  incomeCount: number;
  expenseCount: number;
}

export interface FinanceResponse {
  transactions: TransactionItem[];
  stats: FinanceStats;
}

export function useFinance() {
  return useQuery<FinanceResponse>({
    queryKey: ["admin", "finance"],
    queryFn: async () => {
      const response = await api.get<FinanceResponse>("/admin/finance");
      return response.data;
    },
    refetchInterval: 30000,
  });
}
