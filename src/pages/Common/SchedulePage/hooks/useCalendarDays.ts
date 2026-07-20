// Imports
import { useMemo } from "react";

// Types
import type {
  DbScheduledShift,
  Employee,
  ProfessionOption,
  ShiftDay,
} from "../SchedulePage.types";

interface BookingRange {
  minDate: Date;
  freeMaxDate: Date;
  earlyAccessMaxDate: Date;
}
interface UseCalendarDaysParams {
  currentDate: Date;
  currentProfession: ProfessionOption;
  selectedDateStr: string;
  scheduledShifts: DbScheduledShift[];
  bookingRange: BookingRange;
}

// Utils
import {
  formatDateLocal,
  getRelativeDateStr,
} from "../SchedulePage.utils";


export function useCalendarDays({
  currentDate,
  currentProfession,
  selectedDateStr,
  scheduledShifts,
  bookingRange,
}: UseCalendarDaysParams): ShiftDay[] {
  return useMemo(() => {
    const currentYear: number = currentDate.getFullYear();
    const currentMonth: number = currentDate.getMonth();

    const firstDayOfMonth: Date = new Date(
      currentYear,
      currentMonth,
      1,
    );

    const lastDayOfMonth: Date = new Date(
      currentYear,
      currentMonth + 1,
      0,
    );

    const startOfWeekOffset: number =
      firstDayOfMonth.getDay() === 0
        ? 6
        : firstDayOfMonth.getDay() - 1;

    const endOfWeekOffset: number =
      lastDayOfMonth.getDay() === 0
        ? 0
        : 7 - lastDayOfMonth.getDay();

    const totalCells: number =
      startOfWeekOffset +
      lastDayOfMonth.getDate() +
      endOfWeekOffset;

    const startDate: Date = new Date(
      currentYear,
      currentMonth,
      1,
    );

    startDate.setDate(
      startDate.getDate() - startOfWeekOffset,
    );

    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    const days: ShiftDay[] = [];

    for (let index = 0; index < totalCells; index++) {
      const targetDate = new Date(startDate);

      targetDate.setDate(
        startDate.getDate() + index,
      );

      targetDate.setHours(0, 0, 0, 0);

      const dateStr: string = formatDateLocal(targetDate);
      const isPastDay: boolean= targetDate < today;

      const isAccessible: boolean =
        targetDate <= bookingRange.earlyAccessMaxDate;

      const dayShifts: DbScheduledShift[] = scheduledShifts.filter(
        (shift) => shift.date === dateStr,
      );

      const dayEmployees: Employee[] = [];

      let totalMaxEmployees: number = 0;
      let calculatedPointsCost: number = 30;

      dayShifts.forEach((shift): void => {
        totalMaxEmployees += shift.max_employees;

        calculatedPointsCost =
          shift.points_cost ??
          30 + shift.assigned_employees.length * 5;

        shift.assigned_employees.forEach((employee) => {
          dayEmployees.push({
            id: employee.id,
            name: employee.name,
            profession: employee.role,
            shiftStart: shift.start_time.substring(0, 5),
            shiftEnd: shift.end_time.substring(0, 5),
            avatarUrl:
              employee.avatarUrl ||
              `https://api.dicebear.com/10.x/avataaars/png?seed=${employee.id}`,
          });
        });
      });

      const visibleEmployees: Employee[] =
        currentProfession.id === "all"
          ? dayEmployees
          : dayEmployees.filter(
              (employee) =>
                String(employee.profession) ===
                String(currentProfession.id),
            );

      days.push({
        date: targetDate,
        dateStr,
        isCurrentMonth:
          targetDate.getMonth() === currentMonth,
        isToday: dateStr === getRelativeDateStr(0),
        isPast: isPastDay,
        isFutureLocked:
          targetDate > bookingRange.freeMaxDate &&
          targetDate <= bookingRange.earlyAccessMaxDate,
        isAccessible,
        isSelected: dateStr === selectedDateStr,
        employees: visibleEmployees,
        maxCount: totalMaxEmployees,
        points_cost: calculatedPointsCost,
        shifts: dayShifts,
      });
    }

    return days;
  }, [
    currentDate,
    currentProfession,
    selectedDateStr,
    scheduledShifts,
    bookingRange,
  ]);
}