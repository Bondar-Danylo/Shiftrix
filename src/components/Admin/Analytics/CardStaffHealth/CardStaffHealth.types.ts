import type { StaffHealthData } from "@/pages/Admin/AnalyticsPage/AnalyticsPage.types";

export interface CardStaffHealthProps {
  isLoading: boolean;
  data?: StaffHealthData;
}