// Imports
import React from "react";

// Styles
import styles from "./NotificationsScheduleEventsCard.module.scss";

// Components
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Icons
import CalendarIcon from "@/assets/icons/schedule_icon.svg?react";

// Types
import type {
  RemindOption,
  ScheduleEventsProps,
} from "./NotificationsScheduleEventsCard.types";

const REMIND_OPTIONS: RemindOption[] = [
  { id: "1_hour", label: "1 hour" },
  { id: "2_hours", label: "2 hours" },
  { id: "4_hours", label: "4 hours" },
  { id: "24_hours", label: "24 hours" },
];

const NotificationsScheduleEventsCard: React.FC<ScheduleEventsProps> = ({
  schedulePublished,
  setSchedulePublished,
  scheduleUpdated,
  setScheduleUpdated,
  shiftReminder,
  setShiftReminder,
  remindBefore,
  setRemindBefore,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <span className={styles.card__icon_gray}>
          <CalendarIcon />
        </span>
        <h3 className={styles.card__title}>Schedule Events</h3>
      </div>
      <span className={styles.card__subtitleText}>
        Get notified about schedule changes and shifts
      </span>

      <div className={styles.eventsList}>
        <div className={styles.eventItem}>
          <div className={styles.eventItem__left}>
            <span className={`${styles.eventIcon} ${styles.eventIcon_blue}`}>
              🚀
            </span>
            <div>
              <strong>Schedule Published</strong>
              <p>When a new schedule is published</p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={schedulePublished}
              onChange={(e) => setSchedulePublished(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.eventItem}>
          <div className={styles.eventItem__left}>
            <span className={`${styles.eventIcon} ${styles.eventIcon_purple}`}>
              🔄
            </span>
            <div>
              <strong>Schedule Updated</strong>
              <p>When the schedule changes</p>
            </div>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={scheduleUpdated}
              onChange={(e) => setScheduleUpdated(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.eventItem_block}>
          <div
            className={styles.eventItem}
            style={{ padding: 0, border: "none" }}
          >
            <div className={styles.eventItem__left}>
              <span
                className={`${styles.eventIcon} ${styles.eventIcon_orange}`}
              >
                ⏰
              </span>
              <div>
                <strong>Shift Reminder</strong>
                <p>Remind before shift starts</p>
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={shiftReminder}
                onChange={(e) => setShiftReminder(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {shiftReminder && (
            <div className={styles.reminderDropdownSection}>
              <label>Remind before</label>
              <Dropdown<RemindOption>
                options={REMIND_OPTIONS}
                value={remindBefore}
                onSelect={(option) => setRemindBefore(option)}
                getOptionLabel={(option) => option.label}
                renderOption={(option) => <span>{option.label}</span>}
                className={styles.dropdownCompact}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsScheduleEventsCard;
