export interface UserProfileData {
  id: string | number;
  name: string;
  role: string;
  avatarUrl: string;
  status: "Working" | "Vacation" | "Sick Leave" | "Available" | "Day Off";
  isActive: boolean;
  points: number;
  pointsThisMonth: number;
  completedShifts: number;
  totalShifts: number;
  currentHours: number;
  maxHours: number;
  email: string;
  phone: string;
  joinedDate: string;
  whatsappConnected: boolean;
  whatsappPhone: string;
  recentHoursList: RecentHourItem[];
  upcomingShiftsList: UpcomingShiftItem[];
}

export interface NotificationSettings {
  shiftReminders: boolean;
  scheduleUpdates: boolean;
  shiftRequests: boolean;
  pointsUpdates: boolean;
}


export interface ScheduleDeliverySettings {
  day: string;
  time: string;
}

export interface RecentHourItem {
  id: string | number;
  date: string;
  hours: number;
  role: string;
}

export interface UpcomingShiftItem {
  id: string | number;
  date: string;
  time: string;
  role: string;
  location?: string;
}