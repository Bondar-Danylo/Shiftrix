// Imports
import { useCallback, useEffect, useState } from "react";

// Styles
import styles from "./ProfilePage.module.scss";

// Types
import type {
  NotificationSettings,
  PointsTransaction,
  ProfileResponse,
  UserProfileData,
} from "./ProfilePage.types";

// Components
import NumbersCard from "@/components/Common/ProfilePage/NumbersCard/NumbersCard";
import ContactCard from "@/components/Common/ProfilePage/ContactCard/ContactCard";
import WorkStatsCard from "@/components/Common/ProfilePage/WorkStatsCard/WorkStatsCard";
import PointsHistoryCard from "@/components/Common/ProfilePage/PointsHistoryCard/PointsHistoryCard";
import WhatsappBotCard from "@/components/Common/ProfilePage/WhatsappBotCard/WhatsappBotCard";
import ScheduleDeliveryCard from "@/components/Common/ProfilePage/ScheduleDeliveryCard/ScheduleDeliveryCard";
import CardLoader from "@/components/Common/Loader/Loader";

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    shiftReminders: true,
    scheduleUpdates: true,
    shiftRequests: true,
    pointsUpdates: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");

  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const userId = currentUser?.id ?? localStorage.getItem("user_id");

  const loadProfile = useCallback(async (): Promise<void> => {
    if (!userId) {
      setError("User ID not found");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_profile.php?user_id=${userId}`,
      );

      const data: ProfileResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load profile");
      }

      setProfile(data.profile);
      setNotifications(data.notifications);

      setPointsHistory(
        Array.isArray(data.points_history) ? data.points_history : [],
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect((): void => {
    void loadProfile();
  }, [loadProfile]);

  const handleNotificationChange = async (
    key: keyof NotificationSettings,
  ): Promise<void> => {
    if (!profile) {
      return;
    }

    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key],
    };

    setNotifications(updatedNotifications);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/save_notification_settings.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: profile.id,
            ...updatedNotifications,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }
    } catch (error: unknown) {
      setNotifications(notifications);

      const message = error instanceof Error ? error.message : String(error);

      alert(message);
    }
  };

  if (isLoading) {
    return <CardLoader text="Loading profile..." />;
  }

  if (error || !profile) {
    return (
      <div className={styles.wrapper}>
        <p>{error || "Profile not found"}</p>
      </div>
    );
  }

  const avatarUrl =
    profile.avatarUrl && profile.avatarUrl !== "null"
      ? `${import.meta.env.VITE_API_MAIN}/${profile.avatarUrl}`
      : `https://api.dicebear.com/10.x/avataaars/png?seed=${profile.id}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <img src={avatarUrl} alt={profile.name} className={styles.avatar} />

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
