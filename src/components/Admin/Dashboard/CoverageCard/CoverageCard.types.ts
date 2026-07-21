export interface CoverageItem {
  value: number;
  color: string;
  label: string;
}

export interface TodayCoverageResponse {
  success: boolean;
  date: string;
  total_shifts: number;
  required_employees: number;
  confirmed: number;
  not_confirmed: number;
  percent: number;
  error?: string;
}