// ScheduleWeekCalendar.tsx
import React, { useMemo, useState, useEffect } from "react";
import styles from "./ScheduleWeekCalendar.module.scss";

// Components
import CardLoader from "@/components/Common/Loader/Loader";
import Button from "@/components/Common/Button/Button";
import ShiftCard from "../ShiftCard/ShiftCard";

// Types
import type {
  ScheduleWeekCalendarProps,
  WeeklyShiftsData,
  ShiftDetails,
} from "./ScheduleWeekCalendar.types";
import type { ShiftDay } from "@/pages/Common/SchedulePage/SchedulePage.types";

// Icons
import PaglockIcon from "@/assets/icons/padlock_icon.svg?react";

interface ExtendedScheduleWeekCalendarProps extends ScheduleWeekCalendarProps {
  onShiftClick?: (shiftId: string, dateStr: string) => void;
}

const fetchWeeklyShifts = (
  dateStrings: string[],
): Promise<WeeklyShiftsData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData: WeeklyShiftsData = {};

      dateStrings.forEach((dateStr, index) => {
        if (index % 2 === 0) {
          mockData[dateStr] = [
            {
              id: `shift-1-${dateStr}`,
              name: "Morning Shift",
              timeWindow: "09:00 - 17:00",
              assignedCount: 0,
              maxCount: 7,
              profession: "Barista",
            },
            {
              id: `shift-2-${dateStr}`,
              name: "Evening Shift",
              timeWindow: "15:00 - 23:00",
              assignedCount: 0,
              maxCount: 5,
              points: 15,
              profession: "Waiter",
            },
          ];
        } else {
          mockData[dateStr] = [
            {
              id: `shift-3-${dateStr}`,
              name: "Full Day Shift",
              timeWindow: "10:00 - 22:00",
              assignedCount: 0,
              maxCount: 4,
              points: 25,
              profession: "Cook",
            },
          ];
        }
      });

      resolve(mockData);
    }, 500);
  });
};

const ScheduleWeekCalendar: React.FC<ExtendedScheduleWeekCalendarProps> = ({
  calendarDays,
  DAYS_OF_WEEK,
  currentDate,
  onShiftClick,
}) => {
  const [shiftsData, setShiftsData] = useState<WeeklyShiftsData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  useEffect((): void => {
    if (weeklyDays.length === 0) return;

    setIsLoading(true);
    const dateStrings = weeklyDays.map((d) => d.dateStr);

    fetchWeeklyShifts(dateStrings)
      .then((data) => setShiftsData(data))
      .catch((err) => console.error("Failed to load weekly shifts", err))
      .finally(() => setIsLoading(false));
  }, [weeklyDays]);

  // ИСПРАВЛЕНО: Безопасное сравнение временных окон с нормализацией любых тире/дефисов
  const dynamicShiftsByDate = useMemo(() => {
    const updatedData: Record<string, ShiftDetails[]> = {};

    Object.entries(shiftsData).forEach(([dateStr, shifts]) => {
      const currentDayData = calendarDays.find((d) => d.dateStr === dateStr);

      updatedData[dateStr] = shifts.map((shift) => {
        const [targetStart, targetEnd] = shift.timeWindow
          .replace(/–/g, "-")
          .split("-")
          .map((s) => s.trim());

        const realAssignedCount = currentDayData
          ? currentDayData.employees.filter(
              (emp) =>
                emp.shiftStart === targetStart && emp.shiftEnd === targetEnd,
            ).length
          : 0;

        return {
          ...shift,
          assignedCount: realAssignedCount,
        };
      });
    });

    return updatedData;
  }, [shiftsData, calendarDays]);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <CardLoader text="Loading weekly shifts..." />
      </div>
    );
  }

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.weekGrid}>
        {weeklyDays.map((day) => {
          const dayJsIdx: number = day.date.getDay();
          const dayName: string =
            DAYS_OF_WEEK[dayJsIdx === 0 ? 6 : dayJsIdx - 1];

          const dayShifts: ShiftDetails[] =
            dynamicShiftsByDate[day.dateStr] || [];
          const isDayDisabled: boolean = day.isPast || day.isFutureLocked;

          return (
            <div
              key={day.dateStr}
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
                    {dayShifts.map((shift) => (
                      <ShiftCard
                        key={shift.id}
                        shift={shift}
                        isPast={day.isPast}
                        onClick={(shiftId) =>
                          onShiftClick?.(shiftId, day.dateStr)
                        }
                      />
                    ))}

                    {!isDayDisabled && (
                      <Button
                        className={styles.addShiftBtn}
                        type="button"
                        isLink={false}
                        size="normal"
                      >
                        + Add Shift
                      </Button>
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
