import type { ShiftEmployee } from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal.types";

export type ViewMode = "month" | "week";

export interface ProfessionOption {
  id: string;
  label: string;
}

export interface Employee {
  id: string;
  name: string;
  avatarUrl?: string;
  profession: string;
  shiftStart: string;
  shiftEnd: string;
  role?: string;
}

export interface ShiftDay {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isFutureLocked: boolean;
  isAccessible: boolean;
  isSelected: boolean;
  employees: Employee[];
  maxCount: number;
  points_cost?: number;
  shifts?: DbScheduledShift[];
}

export interface BookingSettings {
  bookingWindowWeeks: number;
  openDayOfWeek: number; 
  minRestHoursBetweenShifts: number;
}

export interface ShiftDetails {
  id: string;
  name: string;
  timeWindow: string; 
  assignedCount: number;
  maxCount: number;
  points?: number;   
}

export interface AssignedShiftRecord {
  shiftId: string;
  dateStr: string;
  timeWindow: string;
  employee: ShiftEmployee;
}

export interface TemplateShiftData {
  id: string;
  title: string;
  role: string;
  description?: string;
  startTime: string;
  endTime: string;
  requiredEmployees: number;
  minEmployees: number;
  maxEmployees: number;
  points: number;
  days: string | string[];
  isHighPriority?: boolean;
  location?: string;
}


export interface DbEmployee {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: string;
}

export interface DbScheduledShift {
  id: number;
  template_id: number | null;
  date: string;
  start_time: string;
  end_time: string;
  points: number;
  position_id: string;
  department_id: string;
  max_employees: number;
  template_title: string | null;
  assigned_employees: DbEmployee[];
  points_cost?: number;
}

export interface DbTemplate {
  id: number | string;
  title: string;
  role: string;
  startTime: string;
  endTime: string;
  requiredEmployees: number;
  points: number;
  days: string | string[];
}

export interface SchedulingRules {
  id?: number;
  advance_period: "1_week" | "2_weeks" | "1_month";
  early_access: "1_month" | "2_months" | "3_months";
  max_shifts: number;
  min_hours: number;
  allow_overtime: boolean | number;
  auto_balance: boolean | number;
}