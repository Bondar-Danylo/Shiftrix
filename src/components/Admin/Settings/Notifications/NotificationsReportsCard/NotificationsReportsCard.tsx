// Imports
import React from "react";

// Styles
import styles from "./NotificationsReportsCard.module.scss";

// Icons
import DocumentIcon from "@/assets/icons/document_icon.svg?react";

// Types
import type { ReportsProps } from "./NotificationsReportsCard.types";

const NotificationsReportsCard: React.FC<ReportsProps> = ({
  dailySummary,
  setDailySummary,
  sendTime,
  setSendTime,
  numShifts,
  setNumShifts,
  uncoveredShifts,
  setUncoveredShifts,
  recommendations,
  setRecommendations,
  weeklySummary,
  setWeeklySummary,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <span className={styles.card__icon_gray}>
          <DocumentIcon />
        </span>
        <h3 className={styles.card__title}>Reports</h3>
      </div>
      <span className={styles.card__subtitleText}>
        Automated summary reports via WhatsApp
      </span>

      <div className={styles.reportsContainer}>
        <div className={styles.toggleRow}>
          <div>
            <strong className={styles.toggleRow__title}>Daily Summary</strong>
            <p className={styles.toggleRow__desc}>
              Get a daily overview of tomorrow's schedule
            </p>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={dailySummary}
              onChange={(e) => setDailySummary(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        {dailySummary && (
          <div className={styles.subFields}>
            <div className={`${styles.field} ${styles.field_row}`}>
              <label>Send time</label>
              <input
                type="time"
                value={sendTime}
                onChange={(e) => setSendTime(e.target.value)}
                className={styles.timeInputCompact}
              />
            </div>

            <div className={styles.checkboxGroup}>
              <span className={styles.checkboxGroup__label}>
                Include in summary
              </span>

              <label className={styles.simpleCheckbox}>
                <input
                  type="checkbox"
                  checked={numShifts}
                  onChange={(e) => setNumShifts(e.target.checked)}
                />
                <span>Number of shifts</span>
              </label>

              <label className={styles.simpleCheckbox}>
                <input
                  type="checkbox"
                  checked={uncoveredShifts}
                  onChange={(e) => setUncoveredShifts(e.target.checked)}
                />
                <span>Uncovered shifts</span>
              </label>

              <label className={styles.simpleCheckbox}>
                <input
                  type="checkbox"
                  checked={recommendations}
                  onChange={(e) => setRecommendations(e.target.checked)}
                />
                <span>Recommendations</span>
              </label>
            </div>
          </div>
        )}

        <div className={styles.divider} />

        <div className={styles.toggleRow}>
          <div>
            <strong className={styles.toggleRow__title}>Weekly Summary</strong>
            <p className={styles.toggleRow__desc}>
              Weekly overview sent every Monday
            </p>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={weeklySummary}
              onChange={(e) => setWeeklySummary(e.target.checked)}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationsReportsCard;
