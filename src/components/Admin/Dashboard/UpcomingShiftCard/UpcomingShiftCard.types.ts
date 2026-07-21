export type UpcomingShiftStatus = "covered" | "uncovered";

export interface UpcomingShift {
  id: number;
  date: string;
  shift_start: string;
  shift_end: string;
  title: string;
  position: string;
  required_employees: number;
  assigned_count: number;
  employee_names: string;
  status: UpcomingShiftStatus;
  minutes_until: number;
}

export interface UpcomingShiftsResponse {
  success: boolean;
  shifts: UpcomingShift[];
  error?: string;
}