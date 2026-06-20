// Imports
import { useState } from "react";

// Styles
import styles from "./ScheduleDayCell.module.scss";

// Icons
import PlusIcon from "@/assets/icons/plus_icon.svg?react";
import LockIcon from "@/assets/icons/padlock_icon.svg?react";

// Types
import type { ScheduleDayCellProps } from "./ScheduleDayCell.types";

const MAX_VISIBLE_AVATARS = 2;

const ScheduleDayCell = ({ day, index, onDayClick }: ScheduleDayCellProps) => {
  const [hoveredEmployee, setHoveredEmployee] = useState<number | null>(null);
  const [hoveredHint, setHoveredHint] = useState<{
    id: string;
    text: string;
  } | null>(null);

  const dayNumber = day.date.getDate();
  const assignedCount = day.employees.length;

  const getStatusColor = (
    assigned: number,
    max: number,
  ): "gray" | "green" | "blue" | "red" => {
    if (max === 0 || assigned === 0) return "gray";
    const ratio = assigned / max;
    if (ratio === 1) return "green";
    if (ratio >= 0.5) return "blue";
    return "red";
  };

  const statusColor = getStatusColor(assignedCount, day.maxCount);

  const cellClass: string = [
    styles.scheduleDay,
    day.isPast ? styles.scheduleDay_past : "",
    day.isFutureLocked ? styles.scheduleDay_futureLocked : "",
    day.isAccessible ? styles.scheduleDay_accessible : "",
    day.isToday ? styles.scheduleDay_today : "",
    day.isSelected ? styles.scheduleDay_selected : "",
    !day.isCurrentMonth && day.isFutureLocked
      ? styles.scheduleDay_inactiveFuture
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const visibleEmployees = day.employees.slice(0, MAX_VISIBLE_AVATARS);
  const remainingCount = assignedCount - MAX_VISIBLE_AVATARS;

  return (
    <div
      className={cellClass}
      onClick={() => day.isAccessible && onDayClick(day.dateStr)}
      onMouseEnter={() => {
        if (day.isPast) {
          setHoveredHint({
            id: `cell-${index}`,
            text: "This shift is in the past",
          });
        } else if (day.isFutureLocked) {
          setHoveredHint({
            id: `cell-${index}`,
            text: "Available for selection with points",
          });
        }
      }}
      onMouseLeave={() => setHoveredHint(null)}
    >
      {hoveredHint?.id === `cell-${index}` && (
        <div className={styles.scheduleDay__hintTooltip}>
          {hoveredHint.text}
        </div>
      )}

      <div className={styles.scheduleDay__header}>
        <span className={styles.scheduleDay__number}>{dayNumber}</span>
        {day.isFutureLocked && (
          <LockIcon className={styles.scheduleDay__lockIcon} />
        )}
      </div>

      <div className={styles.scheduleDay__content}>
        <div className={styles.scheduleDay__avatarList}>
          {visibleEmployees.map((emp, empIdx) => (
            <div
              key={emp.id || empIdx}
              className={styles.scheduleDay__avatarWrapper}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setHoveredEmployee(empIdx);
              }}
              onMouseLeave={() => setHoveredEmployee(null)}
            >
              <img
                src={emp.avatarUrl || "https://i.pravatar.cc/50"}
                alt={emp.name}
                className={styles.scheduleDay__avatar}
              />

              {hoveredEmployee === empIdx && (
                <div className={styles.scheduleDay__employeeTooltip}>
                  <strong className={styles.scheduleDay__employeeName}>
                    {emp.name}
                  </strong>
                  <span className={styles.scheduleDay__employeeInfo}>
                    {emp.profession} {emp.shiftStart} - {emp.shiftEnd}
                  </span>
                </div>
              )}
            </div>
          ))}

          {remainingCount > 0 && (
            <div
              className={styles.scheduleDay__remainingCount}
              title={`And ${remainingCount} more employees`}
            >
              +{remainingCount}
            </div>
          )}

          {day.isAccessible && assignedCount < day.maxCount && (
            <button
              type="button"
              className={styles.scheduleDay__addShiftBtn}
              onClick={(e) => e.stopPropagation()}
            >
              <PlusIcon />
            </button>
          )}
        </div>
      </div>

      {day.maxCount > 0 && (
        <div
          className={styles.scheduleDay__footer}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHoveredHint({
              id: `footer-${index}`,
              text: `Total slots: ${day.maxCount} | Occupied: ${assignedCount}`,
            });
          }}
          onMouseLeave={() => setHoveredHint(null)}
        >
          {hoveredHint?.id === `footer-${index}` && (
            <div className={styles.scheduleDay__hintTooltip}>
              {hoveredHint.text}
            </div>
          )}

          <div className={styles.scheduleDay__progressTrack}>
            <div
              className={`${styles.scheduleDay__progressBar} ${styles[`scheduleDay__progressBar_${statusColor}`]}`}
              style={{
                width: `${Math.min((assignedCount / day.maxCount) * 100, 100)}%`,
              }}
            />
          </div>
          <span className={styles.scheduleDay__counter}>
            {assignedCount}/{day.maxCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default ScheduleDayCell;
