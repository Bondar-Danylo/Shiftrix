// Imports
import React, { useMemo } from "react";

// Styles
import styles from "./ScheduleWeekCalendar.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import ShiftCard from "../ShiftCard/ShiftCard";

// Types
import type { ScheduleWeekCalendarProps } from "./ScheduleWeekCalendar.types";
import type { ShiftDay } from "@/pages/Common/SchedulePage/SchedulePage.types";

// Icons
import PaglockIcon from "@/assets/icons/padlock_icon.svg?react";

// Interfaces
interface ExtendedScheduleWeekCalendarProps extends ScheduleWeekCalendarProps {
  onShiftClick?: (shiftId: string | number) => void;
  onDayClick?: (dateStr: string) => void;
  onAddShiftClick?: (dateStr: string) => void;
}

const ScheduleWeekCalendar: React.FC<ExtendedScheduleWeekCalendarProps> = ({
  calendarDays,
  DAYS_OF_WEEK,
  currentDate,
  onShiftClick,
  onDayClick,
  onAddShiftClick,
}) => {
  const weeklyDays = useMemo((): ShiftDay[] => {
    const currentJsDay: number = currentDate.getDay();
    const currentIsoDay: number = currentJsDay === 0 ? 7 : currentJsDay;
    const startOfWeek: Date = new Date(currentDate);

    startOfWeek.setDate(currentDate.getDate() - (currentIsoDay - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek: Date = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return calendarDays.filter(
      (day) => day.date >= startOfWeek && day.date <= endOfWeek,
    );
  }, [calendarDays, currentDate]);

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.weekGrid}>
        {weeklyDays.map((day) => {
          const dayJsIdx: number = day.date.getDay();
          const dayName: string =
            DAYS_OF_WEEK[dayJsIdx === 0 ? 6 : dayJsIdx - 1];

          const isDayDisabled: boolean = day.isPast || day.isFutureLocked;

          return (
            <div
              key={day.dateStr}
              onClick={() => onDayClick?.(day.dateStr)}
              className={`${styles.weekColumn} ${day.isToday ? styles.weekColumn_today : ""} ${
                day.isPast ? styles.weekColumn_past : ""
              } ${day.isFutureLocked ? styles.weekColumn_locked : ""}`}
            >
              <div className={styles.weekColumn__header}>
                <span className={styles.dayName}>{dayName}</span>
                <span className={styles.dayNumber}>{day.date.getDate()}</span>

                {day.isFutureLocked && (
                  <PaglockIcon className={styles.lockIcon} />
                )}

                {!day.isFutureLocked && (
                  <div className={styles.staffIndicator}>
                    <span className={styles.staffLabel}>Staff</span>
                    <span className={styles.staffCount}>
                      {day.employees.length}/{day.maxCount}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.weekColumn__body}>
                {day.isFutureLocked ? (
                  <div className={styles.lockedState}>Locked</div>
                ) : (
                  <>
                    {day.shifts?.map((shift: any) => (
                      <div
                        key={shift.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onShiftClick?.(shift.id);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <ShiftCard
                          shift={{
                            id: String(shift.id),
                            name: shift.template_title || "Shift",
                            timeWindow: `${shift.start_time.substring(0, 5)} - ${shift.end_time.substring(0, 5)}`,
                            assignedCount: shift.assigned_employees.length,
                            maxCount: shift.max_employees,
                            profession: shift.role_name || shift.position_id,
                            points: shift.points,
                          }}
                          isPast={day.isPast}
                        />
                      </div>
                    ))}

                    {!isDayDisabled && (
                      <div
                        style={{ marginTop: "auto" }}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        {onAddShiftClick && (
                          <Button
                            className={styles.addShiftBtn}
                            type="button"
                            isLink={false}
                            size="normal"
                            onClick={() => {
                              // @ts-ignore
                              onAddShiftClick(day.dateStr);
                            }}
                          >
                            Add shift
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScheduleWeekCalendar;
