export type RequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface RequestItem {
  id: number;
  type: string;
  date: string;
  reason: string;
  status: RequestStatus;
  createdAt: Date;

  from: {
    id: number;
    name: string;
    position: string | number;
    img: string;
  };

  with: {
    id: number;
    name: string;
    position: string | number;
    img: string;
  } | null;
}

export interface RequestUser {
  name: string;
  position: string;
  img: string;
  id: number | string,
}

export interface FilterOption {
  value: RequestItem["type"] | "all";
  label: string;
}