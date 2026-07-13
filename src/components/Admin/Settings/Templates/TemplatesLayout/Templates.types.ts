export interface ShiftTemplate {
  id: string;
  title: string;
  role: string;
  location: string;
  startTime: string;
  endTime: string;
  requiredEmployees: number;
  minEmployees: number;
  maxEmployees: number;
  points: number;
  days: string | string[];
  description: string;
  instructions?: string;
  isHighPriority?: boolean;
  isRecurring?: boolean;
}
