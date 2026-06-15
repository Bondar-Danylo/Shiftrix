export interface SelectionOption {
  id: string;
  label: string;
}

export interface SchedulingFormState {
  advancePeriod: SelectionOption;
  earlyAccess: SelectionOption;
  maxShifts: number | string;
  minHours: number | string;
  allowOvertime: boolean;
  autoBalance: boolean;
}