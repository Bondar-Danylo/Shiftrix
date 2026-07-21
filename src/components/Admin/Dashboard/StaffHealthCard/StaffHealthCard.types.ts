export type StaffHealthType = "no_shifts" | "overworked" | "sick_leave";

export interface StaffHealthCardData {
  id: number;
  name: string;
  reason: string;
  type: StaffHealthType;
  total_hours: number;
  max_hours: number;
}

export interface StaffHealthResponse {
  success: boolean;
  week: {
    start: string;
    end: string;
  };
  staff: StaffHealthCardData[];
  error?: string;
}