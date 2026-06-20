import type { ShiftDay } from "@/pages/Common/SchedulePage/SchedulePage.types";

export interface ScheduleDayCellProps {
  day: ShiftDay;
  index: number;
  onDayClick: (dateStr: string) => void;
}