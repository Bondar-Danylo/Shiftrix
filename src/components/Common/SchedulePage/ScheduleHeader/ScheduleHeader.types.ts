import type { ProfessionOption, ViewMode } from "@/pages/Common/SchedulePage/SchedulePage.types";

export interface ScheduleHeaderProps {
  currentDate: Date;
  monthTitle: string;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentProfession: ProfessionOption;
  professionOptions: ProfessionOption[];
  onProfessionSelect: (option: ProfessionOption) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}