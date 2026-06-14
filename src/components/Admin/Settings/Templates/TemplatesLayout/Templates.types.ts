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
  days: string;
  description: string;
  isHighPriority?: boolean;
}
