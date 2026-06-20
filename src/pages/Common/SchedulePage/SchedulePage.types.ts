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
}