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
  days: string;
  isHighPriority?: boolean;
  location?: string;
}
