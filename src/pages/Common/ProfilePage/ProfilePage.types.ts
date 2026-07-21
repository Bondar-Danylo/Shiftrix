export interface RecentHoursItem {
  id: string;
  date: string;
  hours: number;
  role: string;
  title?: string;
}

export interface UpcomingShiftItem {
  id: string;
  shift_id: number;
  date: string;
  time: string;
  role: string;
  title?: string;
}

export interface UserProfileData {
  id: number;
  name: string;
  role: string;
  department?: string;
  avatarUrl: string | null;
  status: string;
  isActive: boolean;
  points: number;
  pointsThisMonth: number;
  completedShifts: number;
  totalShifts: number;
  workedHours: number;
  bookedHours: number;
  currentHours: number;
  maxHours: number;
  email: string;
  phone: string | null;
  joinedDate: string;
  whatsappConnected: boolean;
  whatsappPhone: string | null;
  recentHoursList: RecentHoursItem[];
  upcomingShiftsList: UpcomingShiftItem[];
}

export interface NotificationSettings {
  shiftReminders: boolean;
  scheduleUpdates: boolean;
  shiftRequests: boolean;
  pointsUpdates: boolean;
}

export interface ProfileResponse {
  success: boolean;
  profile: UserProfileData;
  notifications: NotificationSettings;
  points_history: PointsTransaction[];
  error?: string;
}

export interface PointsTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "added" | "removed";
  transaction_type?: string;
}

export interface ScheduleDeliverySettings {
  day: string;
  time: string;
}

export interface ScheduleDeliveryResponse {
  success: boolean;
  delivery: ScheduleDeliverySettings;
  error?: string;
}