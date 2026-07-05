import type { ShiftDay } from "@/pages/Common/SchedulePage/SchedulePage.types";

export interface ScheduleWeekCalendarProps {
  calendarDays: ShiftDay[];
  DAYS_OF_WEEK: string[];
  currentDate: Date;
}

export interface ShiftDetails {
  id: string;
  name: string;
  timeWindow: string;
  assignedCount: number;
  maxCount: number;
  points?: number;    
  profession: string; 
}

export type WeeklyShiftsData = Record<string, ShiftDetails[]>;