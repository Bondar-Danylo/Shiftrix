// Imports
import { useState } from "react";

// Styles
import styles from "./ProfilePage.module.scss";

// Icons
import EditIcon from "@/assets/icons/edit_icon.svg?react";

// Types
import type {
  UserProfileData,
  NotificationSettings,
} from "./ProfilePage.types";
import type { PointsTransaction } from "@/components/Admin/Employees/EmployeeModal/EmployeeModal.types";

// Components
import Button from "@/components/Common/Button/Button";
import NumbersCard from "@/components/Common/ProfilePage/NumbersCard/NumbersCard";
import ContactCard from "@/components/Common/ProfilePage/ContactCard/ContactCard";
import WorkStatsCard from "@/components/Common/ProfilePage/WorkStatsCard/WorkStatsCard";
import PointsHistoryCard from "@/components/Common/ProfilePage/PointsHistoryCard/PointsHistoryCard";
import WhatsappBotCard from "@/components/Common/ProfilePage/WhatsappBotCard/WhatsappBotCard";
import ScheduleDeliveryCard from "@/components/Common/ProfilePage/ScheduleDeliveryCard/ScheduleDeliveryCard";

const MOCK_PROFILE: UserProfileData = {
  id: 1,
  name: "Sarah Johnson",
  role: "Senior Server",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  status: "Working",
  isActive: true,
  points: 245,
  pointsThisMonth: 95,
  completedShifts: 0,
  totalShifts: 4,
  currentHours: 38,
  maxHours: 40,
  email: "sarah.johnson@restaurant.com",
  phone: "+1 (555) 123-4567",
  joinedDate: "January 15, 2024 (2 years)",
  whatsappConnected: true,
  whatsappPhone: "+1 (555) 123-4567",
  recentHoursList: [
    { id: "rh1", date: "April 18, 2026", hours: 8.5, role: "Senior Server" },
    { id: "rh2", date: "April 17, 2026", hours: 8.0, role: "Senior Server" },
    { id: "rh3", date: "April 15, 2026", hours: 6.5, role: "Bartender" },
  ],
  upcomingShiftsList: [
    {
      id: "us1",
      date: "April 21, 2026",
      time: "16:00 - 00:00",
      role: "Senior Server",
    },
    {
      id: "us2",
      date: "April 23, 2026",
      time: "12:00 - 20:00",
      role: "Bartender",
    },
  ],
};

const MOCK_POINTS_HISTORY: PointsTransaction[] = [
  {
    id: "t1",
    title: "Completed evening shift",
    date: "April 18, 2026",
    amount: 20,
    type: "earned",
  },
  {
    id: "t2",
    title: "Requested day off",
    date: "April 15, 2026",
    amount: 50,
    type: "spent",
  },
  {
    id: "t3",
    title: "Weekend shift bonus",
    date: "April 12, 2026",
    amount: 25,
    type: "earned",
  },
];

const ProfilePage = () => {
  const [profile] = useState<UserProfileData>(MOCK_PROFILE);
  const [pointsHistory] = useState<PointsTransaction[]>(MOCK_POINTS_HISTORY);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    shiftReminders: true,
    scheduleUpdates: true,
    shiftRequests: true,
    pointsUpdates: true,
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className={styles.avatar}
          />
          <div className={styles.profile__info}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.role}</p>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.statusWorking}`}>
                {profile.status}
              </span>
              {profile.isActive && (
                <span className={`${styles.badge} ${styles.statusActive}`}>
                  Active
                </span>
              )}
            </div>
          </div>
        </div>

        <Button
          isLink={false}
          size="normal"
          type="button"
          className={styles.profile__btn}
        >
          <EditIcon />
          <span>Edit Profile</span>
        </Button>
      </div>

      <NumbersCard profile={profile} />

      <div className={styles.mainGrid}>
        <div className={styles.leftColumn}>
          <ContactCard profile={profile} />
          <WorkStatsCard profile={profile} />
          <PointsHistoryCard history={pointsHistory} />
        </div>

        <div className={styles.rightColumn}>
          <WhatsappBotCard
            profile={profile}
            notifications={notifications}
            onNotificationChange={handleNotificationChange}
          />
          <ScheduleDeliveryCard />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
