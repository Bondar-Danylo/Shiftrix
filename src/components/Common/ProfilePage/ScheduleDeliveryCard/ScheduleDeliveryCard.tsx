// Imports
import { useEffect, useState } from "react";

// Styles
import styles from "./ScheduleDeliveryCard.module.scss";

// Icons
import ScheduleIcon from "@/assets/icons/schedule_icon.svg?react";

// Components
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import CardLoader from "@/components/Common/Loader/Loader";

// Types
import type {
  ScheduleDeliveryResponse,
  ScheduleDeliverySettings,
} from "@/pages/Common/ProfilePage/ProfilePage.types";

const DAYS_OPTIONS: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_OPTIONS: string[] = ["12:00", "15:00", "18:00", "21:00"];

const ScheduleDeliveryCard = () => {
  const [delivery, setDelivery] = useState<ScheduleDeliverySettings | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const storedUser: string | null = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = currentUser?.id ?? localStorage.getItem("user_id");

  useEffect((): void => {
    const fetchDeliverySettings = async (): Promise<void> => {
      if (!userId) {
        setError("User ID not found");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/get_schedule_delivery.php?user_id=${userId}`,
        );
        const data: ScheduleDeliveryResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load delivery settings");
        }

        setDelivery(data.delivery);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDeliverySettings();
  }, [userId]);

  const saveChangesToDb = async (
    updatedData: ScheduleDeliverySettings,
    previousData: ScheduleDeliverySettings,
  ): Promise<void> => {
    if (!userId) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/save_schedule_delivery.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            ...updatedData,
          }),
        },
      );

      const data: ScheduleDeliveryResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save delivery settings");
      }

      setDelivery(data.delivery);
    } catch (error: unknown) {
      setDelivery(previousData);

      const message: string =
        error instanceof Error ? error.message : String(error);

      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDaySelect = (day: string): void => {
    if (!delivery || isSaving) {
      return;
    }

    const previousData: ScheduleDeliverySettings = delivery;

    const updatedData = {
      ...delivery,
      day,
    };

    setDelivery(updatedData);

    void saveChangesToDb(updatedData, previousData);
  };

  const handleTimeSelect = (time: string): void => {
    if (!delivery || isSaving) {
      return;
    }

    const previousData: ScheduleDeliverySettings = delivery;

    const updatedData = {
      ...delivery,
      time,
    };

    setDelivery(updatedData);

    void saveChangesToDb(updatedData, previousData);
  };

  if (isLoading) {
    return (
      <div className={`${styles.card} ${styles.card_loading}`}>
        <CardLoader text="Loading delivery settings..." />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className={styles.card}>
        <p className={styles.error}>{error || "Delivery settings not found"}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${isSaving ? styles.card_saving : ""}`}>
      <h2 className={styles.title}>Schedule Delivery</h2>

      <p className={styles.subtitle}>
        <ScheduleIcon />
        <span>Auto-send schedule</span>
      </p>

      <div className={styles.select}>
        <label className={styles.label}>Day</label>

        <Dropdown<string>
          options={DAYS_OPTIONS}
          value={delivery.day}
          onSelect={handleDaySelect}
          getOptionLabel={(day) => day}
          renderOption={(day) => <span>{day}</span>}
          className={styles.dropdown}
        />
      </div>

      <div className={styles.select}>
        <label className={styles.label}>Time</label>

        <Dropdown<string>
          options={TIME_OPTIONS}
          value={delivery.time}
          onSelect={handleTimeSelect}
          getOptionLabel={(time) => time}
          renderOption={(time) => <span>{time}</span>}
          className={styles.dropdown}
        />
      </div>

      <div className={styles.info}>
        {isSaving ? (
          <div className={styles.saving}>
            <CardLoader text="Saving changes..." />
          </div>
        ) : error ? (
          <span className={styles.error}>{error}</span>
        ) : (
          `Schedule will be sent every ${delivery.day} at ${delivery.time} via WhatsApp`
        )}
      </div>
    </div>
  );
};

export default ScheduleDeliveryCard;
