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

const DRAFT_KEY = "notifications_form_state";
const SERVER_KEY = "notifications_server_state";

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

const getInitialState = (): FormState => {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) return JSON.parse(draft);

    const server = localStorage.getItem(SERVER_KEY);
    return server ? JSON.parse(server) : DEFAULT_STATE;
  } catch (error) {
    console.error("Error reading initial state:", error);
    return DEFAULT_STATE;
  }
};

const NotificationsTemplate = () => {
  const [formData, setFormData] = useState<FormState>(getInitialState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitClick = (e: FormEvent): void => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmSave = async (): Promise<void> => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const notificationsConfig = {
      level: formData.notificationLevel,
      quietHours: {
        start: formData.quietHoursStart,
        end: formData.quietHoursEnd,
      },
      reports: {
        daily: {
          enabled: formData.dailySummary,
          time: formData.sendTime,
          include: {
            numShifts: formData.numShifts,
            uncoveredShifts: formData.uncoveredShifts,
            recommendations: formData.recommendations,
          },
        },
        weekly: { enabled: formData.weeklySummary },
      },
      events: {
        published: formData.schedulePublished,
        updated: formData.scheduleUpdated,
        reminder: {
          enabled: formData.shiftReminder,
          before: formData.remindBefore.id,
        },
      },
    };

    console.log("Successfully saved to server:", notificationsConfig);

    localStorage.setItem(SERVER_KEY, JSON.stringify(formData));

    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleCancel = (): void => {
    try {
      const serverState = localStorage.getItem(SERVER_KEY);
      const rollbackState = serverState
        ? JSON.parse(serverState)
        : DEFAULT_STATE;

      setFormData(rollbackState);
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rollbackState));
    } catch (error) {
      console.error("Error during rollback:", error);
    }
    setIsModalOpen(false);
  };

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
