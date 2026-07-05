import type { ShiftDetails } from "../ScheduleWeekCalendar/ScheduleWeekCalendar.types";

export interface ShiftCardProps {
  shift: ShiftDetails;
  isPast?: boolean;
  onClick?: (shiftId: string) => void;
}