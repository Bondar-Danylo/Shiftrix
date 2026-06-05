import type { Performer } from "@/pages/Admin/AnalyticsPage/AnalyticsPage.types";

export interface CardTopPerformersProps {
  isLoading: boolean;
  data?: Performer[];
}
