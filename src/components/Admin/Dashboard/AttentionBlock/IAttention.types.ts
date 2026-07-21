export type AlertSeverity = "critical" | "warning" | "info";

export type AlertType = "uncovered" | "understaffed" | "cancellation";

export interface ShiftAlert {
  id: string;
  shift_id?: number;
  employee_id?: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  type: AlertType;
  severity: AlertSeverity;
  assigned_count?: number;
  max_employees?: number;
  created_at: string;
}

export interface AttentionResponse {
  success: boolean;
  alerts: ShiftAlert[];
  error?: string;
}