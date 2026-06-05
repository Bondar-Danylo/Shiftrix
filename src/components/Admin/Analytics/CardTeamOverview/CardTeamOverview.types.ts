import type { TeamOverviewData } from "@/pages/Admin/AnalyticsPage/AnalyticsPage.types";

export interface CardTeamOverviewProps {
  isLoading: boolean;
  data?: TeamOverviewData;
}