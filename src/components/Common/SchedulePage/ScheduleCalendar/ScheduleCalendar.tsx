// Styles
import styles from "./ScheduleCalendar.module.scss";

// Components
import ScheduleDayCell from "../ScheduleDayCell/ScheduleDayCell";

// Types
import type { ScheduleCalendarProps } from "./ScheduleCalendar.types";

const ScheduleCalendar = ({
  calendarDays,
  DAYS_OF_WEEK,
  onDayClick,
}: ScheduleCalendarProps) => {
  return (
    <div className={styles.scheduleCalendar}>
      <div className={styles.scheduleCalendar__weekHeader}>
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className={styles.scheduleCalendar__weekday}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.scheduleCalendar__grid}>
        {calendarDays.map((day, index) => (
          <ScheduleDayCell
            key={index}
            day={day}
            index={index}
            onDayClick={onDayClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
