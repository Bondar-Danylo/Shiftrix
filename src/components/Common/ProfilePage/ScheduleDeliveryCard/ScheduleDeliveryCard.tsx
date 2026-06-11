// Imports
import { useState, useEffect } from "react";

// Styles
import styles from "./ScheduleDeliveryCard.module.scss";

// Icons
import ScheduleIcon from "@/assets/icons/schedule_icon.svg?react";

// Components
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import CardLoader from "@/components/Common/Loader/Loader";

// Types
import type { ScheduleDeliverySettings } from "@/pages/Common/ProfilePage/ProfilePage.types";

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

const MOCK_DB_DELIVERY: ScheduleDeliverySettings = {
  day: "Monday",
  time: "18:00",
};

const ScheduleDeliveryCard = () => {
  const [delivery, setDelivery] = useState<ScheduleDeliverySettings | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setDelivery(MOCK_DB_DELIVERY);
      } catch (error) {
        console.error("Failed to fetch schedule delivery settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliverySettings();
  }, []);

  const saveChangesToDb = async (updatedData: ScheduleDeliverySettings) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Данные успешно сохранены в БД:", updatedData);
    } catch (error) {
      console.error("Failed to update schedule delivery settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDaySelect = (day: string) => {
    if (!delivery) return;
    const updated = { ...delivery, day };
    setDelivery(updated);
    saveChangesToDb(updated);
  };

  const handleTimeSelect = (time: string) => {
    if (!delivery) return;
    const updated = { ...delivery, time };
    setDelivery(updated);
    saveChangesToDb(updated);
  };

  if (isLoading) {
    return (
      <div className={`${styles.card} ${styles.card_loading}`}>
        <CardLoader text="Loading delivery settings..." />
      </div>
    );
  }

  if (!delivery) return null;

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
        ) : (
          `Schedule will be sent every ${delivery.day} at ${delivery.time} via WhatsApp`
        )}
      </div>
    </div>
  );
};

export default ScheduleDeliveryCard;
