export interface RemindOption {
  id: string;
  label: string;
}

export type NotificationLevelType = "critical" | "important" | "all";

export interface FormState {
  notificationLevel: NotificationLevelType;
  quietHoursStart: string;
  quietHoursEnd: string;
  dailySummary: boolean;
  sendTime: string;
  numShifts: boolean;
  uncoveredShifts: boolean;
  recommendations: boolean;
  weeklySummary: boolean;
  schedulePublished: boolean;
  scheduleUpdated: boolean;
  shiftReminder: boolean;
  remindBefore: RemindOption;
}