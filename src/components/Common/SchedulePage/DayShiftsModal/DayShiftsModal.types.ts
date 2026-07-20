import type { ShiftDetails } from "../ScheduleWeekCalendar/ScheduleWeekCalendar.types";

export interface ModalShiftItem extends ShiftDetails {
  profession: string;
}

export interface ProfessionFilterOption {
  id: string;
  label: string;
}


export interface DayShiftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  shifts: ModalShiftItem[];
  professions: ProfessionFilterOption[];
  onAddShift: () => void;
  onEditShift: (shiftId: string) => void;   
  onSelectShift: (shiftId: string) => void;
  isReadOnly?: boolean
}