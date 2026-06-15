export interface RemindOption {
  id: string;
  label: string;
}

export interface ScheduleEventsProps {
  schedulePublished: boolean;
  setSchedulePublished: (val: boolean) => void;
  scheduleUpdated: boolean;
  setScheduleUpdated: (val: boolean) => void;
  shiftReminder: boolean;
  setShiftReminder: (val: boolean) => void;
  remindBefore: RemindOption;
  setRemindBefore: (option: RemindOption) => void;
}