import type { RequestItem } from "@/pages/Common/RequestsPage/RequestsPage.types";

export interface RequestsListProps {
  totalCount: number;
  filteredRequests: RequestItem[];
  currentUserId: number;
  isAdmin: boolean;
  onRequestUpdated: () => Promise<void>;
}