// Imports
import { useState } from "react";

// Styles
import styles from "./ScheduleDayCell.module.scss";

// Icons
import PlusIcon from "@/assets/icons/plus_icon.svg?react";
import LockIcon from "@/assets/icons/padlock_icon.svg?react";

// Types
import type { ScheduleDayCellProps } from "./ScheduleDayCell.types";

const MAX_VISIBLE_AVATARS: number = 2;

const ScheduleDayCell = ({ day, index, onDayClick }: ScheduleDayCellProps) => {
  const [hoveredEmployee, setHoveredEmployee] = useState<number | null>(null);
  const [hoveredHint, setHoveredHint] = useState<{
    id: string;
    text: string;
  } | null>(null);
  const dayNumber: number = day.date.getDate();
  const assignedCount: number = day.employees.length;
  const currentPointsCost: number = day.points_cost ?? 30 + assignedCount * 5;
  const isHardLocked: boolean =
    !day.isAccessible && !day.isFutureLocked && !day.isPast;

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
    isHardLocked ? styles.scheduleDay_hardLocked : "",
    day.isAccessible ? styles.scheduleDay_accessible : "",
    day.isToday ? styles.scheduleDay_today : "",
    day.isSelected ? styles.scheduleDay_selected : "",
    !day.isCurrentMonth && (day.isFutureLocked || isHardLocked)
      ? styles.scheduleDay_inactiveFuture
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const visibleEmployees = day.employees.slice(0, MAX_VISIBLE_AVATARS);
  const remainingCount: number = assignedCount - MAX_VISIBLE_AVATARS;

  const handleCellClick = (): void => {
    if (
      !isHardLocked &&
      (day.isAccessible || day.isFutureLocked || day.isPast)
    ) {
      onDayClick(day.dateStr);
    }
  };

  return (
    <div
      className={cellClass}
      onClick={handleCellClick}
      onMouseEnter={() => {
        if (day.isPast) {
          setHoveredHint({
            id: `cell-${index}`,
            text: "This shift is in the past",
          });
        } else if (day.isFutureLocked) {
          setHoveredHint({
            id: `cell-${index}`,
            text: `Unlock early booking for ${currentPointsCost} pts`,
          });
        } else if (isHardLocked) {
          setHoveredHint({
            id: `cell-${index}`,
            text: "This period is not available for booking yet",
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
          <div className={styles.scheduleDay__badgeWrapper}>
            <span className={styles.scheduleDay__pointsBadge}>
              {currentPointsCost} PTS
            </span>
            <LockIcon className={styles.scheduleDay__lockIcon} />
          </div>
        )}

        {isHardLocked && (
          <div className={styles.scheduleDay__hardLockWrapper}>
            <LockIcon className={styles.scheduleDay__hardLockIcon} />
          </div>
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
                src={
                  emp.avatarUrl ||
                  `https://api.dicebear.com/10.x/avataaars/png?seed=${emp.id}`
                }
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

          {(day.isAccessible || day.isFutureLocked) &&
            !isHardLocked &&
            assignedCount < day.maxCount && (
              <button
                type="button"
                className={`${styles.scheduleDay__addShiftBtn} ${
                  day.isFutureLocked ? styles.scheduleDay__addShiftBtn_gold : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCellClick();
                }}
              >
                {day.isFutureLocked ? (
                  <span className={styles.scheduleDay__goldPlus}>★</span>
                ) : (
                  <PlusIcon />
                )}
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
              className={`${styles.scheduleDay__progressBar} ${
                styles[`scheduleDay__progressBar_${statusColor}`]
              }`}
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
