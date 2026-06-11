// Styles
import styles from "./WorkStatsCard.module.scss";

// Types
import type { WorkStatsCardProps } from "./WorkStatsCard.types";

// Imports
import { useState } from "react";

// Icons
import ArrowIcon from "@/assets/icons/arrow_icon.svg?react";

const WorkStatsCard = ({ profile }: WorkStatsCardProps) => {
  const [isRecentHoursOpen, setIsRecentHoursOpen] = useState(false);
  const [isUpcomingShiftsOpen, setIsUpcomingShiftsOpen] = useState(false);

  const hoursProgressWidth = Math.min(
    (profile.currentHours / profile.maxHours) * 100,
    100,
  );

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Work Statistics</h2>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>Weekly Hours</span>
          <div className={styles.value}>
            <strong>{profile.currentHours}h</strong>
            <span className={styles.maxHoursText}>
              of {profile.maxHours}h contract
            </span>
          </div>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressBar__fill}
            style={{ width: `${hoursProgressWidth}%` }}
          />
        </div>

        <div className={styles.accordion}>
          <button
            type="button"
            className={styles.accordion__header}
            onClick={() => setIsRecentHoursOpen(!isRecentHoursOpen)}
          >
            <span>Recent Hours</span>
            <span
              className={`${styles.arrow} ${isRecentHoursOpen ? styles.arrowExpanded : ""}`}
            >
              <ArrowIcon />
            </span>
          </button>
          <div
            className={`${styles.accordion__body} ${isRecentHoursOpen ? styles.bodyExpanded : ""}`}
          >
            <div className={styles.accordion__inner}>
              {profile.recentHoursList.length === 0 ? (
                <p className={styles.empty}>No recent hours logged.</p>
              ) : (
                profile.recentHoursList.map((item) => (
                  <div key={item.id} className={styles.value}>
                    <div>
                      <p className={styles.value__date}>{item.date}</p>
                      <p className={styles.value__role}>{item.role}</p>
                    </div>
                    <strong className={styles.value__hours}>
                      {item.hours} hrs
                    </strong>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.accordion}>
          <button
            type="button"
            className={styles.accordion__header}
            onClick={() => setIsUpcomingShiftsOpen(!isUpcomingShiftsOpen)}
          >
            <span>Upcoming Shifts This Week</span>
            <span
              className={`${styles.arrow} ${isUpcomingShiftsOpen ? styles.arrowExpanded : ""}`}
            >
              <ArrowIcon />
            </span>
          </button>
          <div
            className={`${styles.accordion__body} ${isUpcomingShiftsOpen ? styles.bodyExpanded : ""}`}
          >
            <div className={styles.accordion__inner}>
              {profile.upcomingShiftsList.length === 0 ? (
                <p className={styles.empty}>No upcoming shifts scheduled.</p>
              ) : (
                profile.upcomingShiftsList.map((shift) => (
                  <div key={shift.id} className={styles.value}>
                    <div>
                      <p className={styles.value__date}>{shift.date}</p>
                      <p className={styles.value__role}>{shift.role}</p>
                    </div>
                    <span className={styles.timeTag}>{shift.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkStatsCard;
