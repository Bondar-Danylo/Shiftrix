export type NotificationLevelType = "critical" | "important" | "all";

export interface NotificationLevelProps {
  level: NotificationLevelType;
  setLevel: (level: NotificationLevelType) => void;
  quietHoursStart: string;
  setQuietHoursStart: (time: string) => void;
  quietHoursEnd: string;
  setQuietHoursEnd: (time: string) => void;
}