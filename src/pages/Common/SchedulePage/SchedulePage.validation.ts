// Types
import type { DbScheduledShift } from "./SchedulePage.types";
import type { ShiftEmployee } from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal.types";

// Interfaces
interface ValidateEmployeeAssignmentParams {
  employee: ShiftEmployee;
  targetShift: DbScheduledShift;
  allShifts: DbScheduledShift[];
  minRestHours: number;
  maxShiftsPerWeek: number;
}

export interface AssignmentValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// Utils
import {
  formatDateLocal,
  parseShiftTimes,
} from "./SchedulePage.utils";


function createTimeWindow(shift: DbScheduledShift): string {
  return (
    `${shift.start_time.substring(0, 5)} - ` + `${shift.end_time.substring(0, 5)}`
  );
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  const date: Date = new Date(year, month - 1, day);

  date.setHours(0, 0, 0, 0);

  return date;
}

function getMonday(date: Date): Date {
  const result: Date = new Date(date);
  const currentDay: number = result.getDay();
  const daysFromMonday: number = currentDay === 0 ? 6 : currentDay - 1;

  result.setDate(result.getDate() - daysFromMonday);
  result.setHours(0, 0, 0, 0);

  return result;
}

function getSunday(date: Date): Date {
  const monday: Date = getMonday(date);
  const sunday: Date = new Date(monday);

  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return sunday;
}

function isDateInSameWeek(dateString: string, targetDateString: string,): boolean {
  const targetDate = parseLocalDate(targetDateString);
  const weekStart: Date = getMonday(targetDate);
  const weekEnd: Date = getSunday(targetDate);
  const date: Date = parseLocalDate(dateString);

  return (
    date >= weekStart && date <= weekEnd
  );
}

function isEmployeeAssignedToShift(shift: DbScheduledShift, employeeId: string | number): boolean {
  return shift.assigned_employees.some(
    (assignedEmployee) => String(assignedEmployee.id) === String(employeeId),
  );
}

export function validateEmployeeAssignment({
  employee,
  targetShift,
  allShifts,
  minRestHours,
  maxShiftsPerWeek,
}: ValidateEmployeeAssignmentParams): AssignmentValidationResult {
  const today: string = formatDateLocal(new Date());

  if (targetShift.date < today) {
    return {
      isValid: false,
      errorMessage: "You cannot assign employees to past shifts.",
    };
  }

  const employeeShifts: DbScheduledShift[] = allShifts.filter(
    (shift) => isEmployeeAssignedToShift(shift, employee.id));

  const alreadyAssignedToTarget: boolean = employeeShifts.some((shift) => shift.id === targetShift.id);

  if (alreadyAssignedToTarget) {
    return {
      isValid: false,
      errorMessage: `${employee.name} is already assigned to this shift.`,
    };
  }

  const shiftOnSameDay:  DbScheduledShift | undefined =
    employeeShifts.find((shift) => shift.date === targetShift.date);

  if (shiftOnSameDay) {
    return {
      isValid: false,
      errorMessage: `${employee.name} is already scheduled on this day. ` + "Maximum one shift per day.",
    };
  }

  const shiftsInTargetWeek: DbScheduledShift[] = employeeShifts.filter((shift) => isDateInSameWeek(shift.date, targetShift.date));

  if (maxShiftsPerWeek > 0 && shiftsInTargetWeek.length >= maxShiftsPerWeek) {
    return {
      isValid: false,
      errorMessage:
        `${employee.name} already has ` +
        `${shiftsInTargetWeek.length} shifts this week. ` +
        `The weekly limit is ${maxShiftsPerWeek}.`,
    };
  }

  const targetTimes = parseShiftTimes(targetShift.date, createTimeWindow(targetShift));

  const minRestMs: number = minRestHours * 60 * 60 * 1000;

  for (const existingShift of employeeShifts) {
    const existingTimes = parseShiftTimes(existingShift.date, createTimeWindow(existingShift));

    const shiftsOverlap: boolean =
      targetTimes.start < existingTimes.end &&
      targetTimes.end > existingTimes.start;

    if (shiftsOverlap) {
      return {
        isValid: false,
        errorMessage: `${employee.name} already has an overlapping shift.`,
      };
    }

    if (existingTimes.end <= targetTimes.start) {
      const restTime: number = targetTimes.start.getTime() - existingTimes.end.getTime();

      if (restTime < minRestMs) {
        const actualRestHours = restTime / (60 * 60 * 1000);

        return {
          isValid: false,
          errorMessage:
            `Insufficient rest time. ` +
            `${employee.name} would have ` +
            `${actualRestHours.toFixed(1)} hours of rest, ` +
            `but at least ${minRestHours} hours are required.`,
        };
      }
    }

    if (targetTimes.end <= existingTimes.start) {
      const restTime: number = existingTimes.start.getTime() - targetTimes.end.getTime();

      if (restTime < minRestMs) {
        const actualRestHours = restTime / (60 * 60 * 1000);

        return {
          isValid: false,
          errorMessage:
            `Insufficient rest time. ` +
            `${employee.name} would have ` +
            `${actualRestHours.toFixed(1)} hours of rest, ` +
            `but at least ${minRestHours} hours are required.`,
        };
      }
    }
  }

  return {
    isValid: true,
  };
}