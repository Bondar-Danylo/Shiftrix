import type { ShiftDay } from "@/pages/Common/SchedulePage/SchedulePage.types";

export interface ScheduleCalendarProps {
  calendarDays: ShiftDay[];
  DAYS_OF_WEEK: string[];
  onDayClick: (dateStr: string) => void;
}