"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface PageSection {
  id?: number;
  page_slug: string;
  section_key: string;
  badge?: string;
  title?: string;
  title_highlight?: string;
  description?: string;
  image_path?: string;
  extra_items?: any;
}

export interface PageContentResponse {
  page_slug: string;
  sections: Record<string, PageSection>;
  stats?: {
    total_vehicles: string;
    support_hours: string;
    satisfaction_rate: string;
  };
}

export function usePageContent(slug: string) {
  return useQuery<PageContentResponse>({
    queryKey: ["public", "page", slug],
    queryFn: async () => {
      const response = await api.get<PageContentResponse>(`/public/pages/${slug}`);
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}
