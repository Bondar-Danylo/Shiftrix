import type { AnalyticsSummary } from "@/pages/Admin/AnalyticsPage/AnalyticsPage.types";

export interface AnalyticsGridProps {
  data: AnalyticsSummary | null;
  isLoading: boolean;
}