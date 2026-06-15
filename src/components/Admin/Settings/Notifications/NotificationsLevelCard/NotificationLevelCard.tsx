// Imports
import React from "react";

// Styles
import styles from "./NotificationLevelCard.module.scss";

// Icons
import BellIcon from "@/assets/icons/bell_icon.svg?react";
import AttentionIcon from "@/assets/icons/attention_icon.svg?react";
import AttentionOrangeIcon from "@/assets/icons/attention-orange_icon.svg?react";
import AttentionBlueIcon from "@/assets/icons/attention-blue_icon.svg?react";
import ClockIcon from "@/assets/icons/clock_icon.svg?react";

// Types
import type { NotificationLevelProps } from "./NotificationLevelCard.types";

const NotificationsLevelCard: React.FC<NotificationLevelProps> = ({
  level,
  setLevel,
  quietHoursStart,
  setQuietHoursStart,
  quietHoursEnd,
  setQuietHoursEnd,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <span className={styles.card__icon}>
          <BellIcon />
        </span>
        <h3 className={styles.card__title}>Notifications</h3>
      </div>

      <div className={styles.infoList}>
        <span className={styles.infoList__label}>Notification Types</span>
        <div className={`${styles.infoItem} ${styles.infoItem_critical}`}>
          <span className={styles.infoItem__bullet}>
            <AttentionIcon />
          </span>
          <div>
            <strong>Critical</strong>
            <p>Uncovered shifts, no-shows, cancellations</p>
          </div>
        </div>
        <div className={`${styles.infoItem} ${styles.infoItem_operational}`}>
          <span className={styles.infoItem__bullet}>
            <AttentionOrangeIcon />
          </span>
          <div>
            <strong>Operational</strong>
            <p>Low coverage, understaffing alerts</p>
          </div>
        </div>
        <div className={`${styles.infoItem} ${styles.infoItem_informational}`}>
          <span className={styles.infoItem__bullet}>
            <AttentionBlueIcon />
          </span>
          <div>
            <strong>Informational</strong>
            <p>Schedule changes, new requests</p>
          </div>
        </div>
      </div>

      <div className={styles.selectionSection}>
        <span className={styles.selectionSection__label}>
          Notification Level
        </span>
        <div className={styles.list}>
          <label
            className={`${styles.rowCheckbox} ${level === "critical" ? styles.activeRow : ""}`}
          >
            <input
              type="checkbox"
              checked={level === "critical"}
              onChange={() => setLevel("critical")}
            />
            <span className={styles.rowCheckbox__text}>Critical only</span>
          </label>

          <label
            className={`${styles.rowCheckbox} ${level === "important" ? styles.activeRow : ""}`}
          >
            <input
              type="checkbox"
              checked={level === "important"}
              onChange={() => setLevel("important")}
            />
            <span className={styles.rowCheckbox__text}>
              Important + Critical
            </span>
          </label>

          <label
            className={`${styles.rowCheckbox} ${level === "all" ? styles.activeRow : ""}`}
          >
            <input
              type="checkbox"
              checked={level === "all"}
              onChange={() => setLevel("all")}
            />
            <span className={styles.rowCheckbox__text}>All notifications</span>
          </label>
        </div>
      </div>

      <div className={styles.quietHours}>
        <div className={styles.quietHours__titleRow}>
          <span>
            <ClockIcon />
          </span>
          <span className={styles.quietHours__label}>Quiet Hours</span>
        </div>
        <div className={styles.timeInputs}>
          <input
            type="time"
            value={quietHoursStart}
            onChange={(e) => setQuietHoursStart(e.target.value)}
            className={styles.timeInput}
          />
          <span className={styles.timeInputs__divider}>–</span>
          <input
            type="time"
            value={quietHoursEnd}
            onChange={(e) => setQuietHoursEnd(e.target.value)}
            className={styles.timeInput}
          />
        </div>
        <span className={styles.field__hint}>
          No notifications will be sent during quiet hours
        </span>
      </div>
    </div>
  );
};

export default NotificationsLevelCard;
