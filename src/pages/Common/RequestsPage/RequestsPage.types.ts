export interface RequestItem {
  from: RequestUser;
  date: string;
  reason: string;
  with?: RequestUser;
  type: "swap" | "dayoff" | "holiday";
  createdAt: Date;
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