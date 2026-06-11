import type { NotificationSettings, UserProfileData } from "@/pages/Common/ProfilePage/ProfilePage.types";

export interface WhatsappBotCardProps {
  profile: UserProfileData;
  notifications: NotificationSettings;
  onNotificationChange: (key: keyof NotificationSettings) => void;
}