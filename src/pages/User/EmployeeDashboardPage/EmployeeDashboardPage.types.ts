export interface EmployeeDashboardStats {
  points: number;
  worked_hours: number;
  booked_hours: number;
  total_hours: number;
  max_hours: number;
  worked_shifts: number;
  booked_shifts: number;
  total_shifts: number;
  max_shifts: number;
  pending_requests: number;
}

export interface EmployeeUpcomingShift {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  title: string;
  position_name: string;
  points: number;
}

export interface EmployeeDashboardResponse {
  success: boolean;
  stats: EmployeeDashboardStats;
  upcoming_shifts: EmployeeUpcomingShift[];
  error?: string;
}

export interface StoredUser {
  id: number;
  name: string;
  role: string;
  position_id?: string;
}