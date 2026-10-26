"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { User } from "@/lib/auth";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get<User>("/me")).data,
    retry: false,
  });
}