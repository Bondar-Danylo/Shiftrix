export interface DictionaryItem {
  id: string | number;
  name: string;
}

export interface DictionaryItem {
  id: string | number;
  name: string;
}

export interface PointTransaction {
  id: string | number;
  user_id: string | number;
  amount: number;
  reason: string;
  created_at: string;
  action_type: "added" | "removed";
}

export interface EmployeeWeeklyHours {
  user_id: number;
  worked_hours: number;
  booked_hours: number;
  total_hours: number;
  max_hours: number;
  worked_shifts: number;
  booked_shifts: number;
  remaining_hours: number;
  overtime_hours: number;
}

export interface WeeklyHoursResponse {
  success: boolean;
  week: {
    start: string;
    end: string;
  };
  hours: EmployeeWeeklyHours[];
  error?: string;
}