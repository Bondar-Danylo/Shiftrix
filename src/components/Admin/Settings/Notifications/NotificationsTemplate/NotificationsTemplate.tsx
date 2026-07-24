// Imports
import { useState, useEffect, type FormEvent } from "react";

// Styles
import styles from "./NotificationsTemplate.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import NotificationLevelCard from "../NotificationsLevelCard/NotificationLevelCard";
import NotificationsReportsCard from "../NotificationsReportsCard/NotificationsReportsCard";
import NotificationsScheduleEventsCard from "../NotificationsScheduleEventsCard/NotificationsScheduleEventsCard";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";

// Icons
import SaveIcon from "@/assets/icons/save_icon.svg?react";

// Types
import type { FormState, RemindOption } from "./NotificationsTemplate.types";

const REMIND_OPTIONS: RemindOption[] = [
  { id: "1_hour", label: "1 hour" },
  { id: "2_hours", label: "2 hours" },
  { id: "4_hours", label: "4 hours" },
  { id: "24_hours", label: "24 hours" },
];

const API_URL = `${import.meta.env.VITE_API_URL}/notification_settings.php`;

const DEFAULT_STATE: FormState = {
  notificationLevel: "all",
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  dailySummary: true,
  sendTime: "18:00",
  numShifts: true,
  uncoveredShifts: true,
  recommendations: true,
  weeklySummary: false,
  schedulePublished: true,
  scheduleUpdated: true,
  shiftReminder: true,
  remindBefore: REMIND_OPTIONS[2],
};

const NotificationsTemplate = () => {
  const [formData, setFormData] = useState<FormState>(DEFAULT_STATE);
  const [serverState, setServerState] = useState<FormState>(DEFAULT_STATE);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect((): void => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const matchedRemindBefore: RemindOption =
          REMIND_OPTIONS.find((opt) => opt.id === data.remindBeforeId) ||
          REMIND_OPTIONS[2];

        const fetchedState: FormState = {
          notificationLevel: data.notificationLevel,
          quietHoursStart: data.quietHoursStart,
          quietHoursEnd: data.quietHoursEnd,
          dailySummary: data.dailySummary,
          sendTime: data.sendTime,
          numShifts: data.numShifts,
          uncoveredShifts: data.uncoveredShifts,
          recommendations: data.recommendations,
          weeklySummary: data.weeklySummary,
          schedulePublished: data.schedulePublished,
          scheduleUpdated: data.scheduleUpdated,
          shiftReminder: data.shiftReminder,
          remindBefore: matchedRemindBefore,
        };
        setFormData(fetchedState);
        setServerState(fetchedState);
      } catch (error) {
        console.error("Error fetching notification configuration:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotificationSettings();
  }, []);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Handles
  const handleSubmitClick = (e: FormEvent): void => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmSave = async (): Promise<void> => {
    setIsSaving(true);

    try {
      const payload = {
        notificationLevel: formData.notificationLevel,
        quietHoursStart: formData.quietHoursStart,
        quietHoursEnd: formData.quietHoursEnd,
        dailySummary: formData.dailySummary,
        sendTime: formData.sendTime,
        numShifts: formData.numShifts,
        uncoveredShifts: formData.uncoveredShifts,
        recommendations: formData.recommendations,
        weeklySummary: formData.weeklySummary,
        schedulePublished: formData.schedulePublished,
        scheduleUpdated: formData.scheduleUpdated,
        shiftReminder: formData.shiftReminder,
        remindBeforeId: formData.remindBefore.id,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error("Failed to update notification database fields");

      setServerState(formData);
      console.log("Notification settings updated successfully in MySQL");
    } catch (error) {
      console.error("Error updating configuration workflow:", error);
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  const handleCancel = (): void => {
    setFormData(serverState);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        Loading notification configurations...
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmitClick} className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.header__title}>Notifications</h2>
            <p className={styles.header__subtitle}>
              Configure what types of notifications you receive
            </p>
          </div>
          <Button
            type="submit"
            size="normal"
            isLink={false}
            className={styles.btn}
          >
            <SaveIcon className={styles.btn__icon} />
            <span>Save Changes</span>
          </Button>
        </div>

        <NotificationLevelCard
          level={formData.notificationLevel}
          setLevel={(val) => updateField("notificationLevel", val)}
          quietHoursStart={formData.quietHoursStart}
          setQuietHoursStart={(val) => updateField("quietHoursStart", val)}
          quietHoursEnd={formData.quietHoursEnd}
          setQuietHoursEnd={(val) => updateField("quietHoursEnd", val)}
        />

        <NotificationsReportsCard
          dailySummary={formData.dailySummary}
          setDailySummary={(val) => updateField("dailySummary", val)}
          sendTime={formData.sendTime}
          setSendTime={(val) => updateField("sendTime", val)}
          numShifts={formData.numShifts}
          setNumShifts={(val) => updateField("numShifts", val)}
          uncoveredShifts={formData.uncoveredShifts}
          setUncoveredShifts={(val) => updateField("uncoveredShifts", val)}
          recommendations={formData.recommendations}
          setRecommendations={(val) => updateField("recommendations", val)}
          weeklySummary={formData.weeklySummary}
          setWeeklySummary={(val) => updateField("weeklySummary", val)}
        />

        <NotificationsScheduleEventsCard
          schedulePublished={formData.schedulePublished}
          setSchedulePublished={(val) => updateField("schedulePublished", val)}
          scheduleUpdated={formData.scheduleUpdated}
          setScheduleUpdated={(val) => updateField("scheduleUpdated", val)}
          shiftReminder={formData.shiftReminder}
          setShiftReminder={(val) => updateField("shiftReminder", val)}
          remindBefore={formData.remindBefore}
          setRemindBefore={(val) => updateField("remindBefore", val)}
        />
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Save Changes?"
        description="Are you sure you want to update your notification settings?"
        confirmText="Yes, save"
        cancelText="No, cancel"
        isLoading={isSaving}
        variant="primary"
        onClose={handleCancel}
        onConfirm={handleConfirmSave}
      />
    </>
  );
};

export default NotificationsTemplate;
