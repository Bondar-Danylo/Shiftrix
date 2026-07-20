// Imports
import { useMemo } from "react";

// Types
import type { SchedulingRules } from "../SchedulePage.types";

export interface BookingRange {
  minDate: Date;
  freeMaxDate: Date;
  earlyAccessMaxDate: Date;
}

interface UseBookingRangeParams {
  rules: SchedulingRules | null;
}

// Utils
import { getMondayOfDate } from "../SchedulePage.utils";


function calculateFreeMaxDate(
  currentMonday: Date,
  rules: SchedulingRules | null,
): Date {
  const freeMaxDate: Date = new Date(currentMonday);

  switch (rules?.advance_period) {
    case "1_week":
      freeMaxDate.setDate(currentMonday.getDate() + 6);
      break;

    case "1_month":
      freeMaxDate.setMonth(currentMonday.getMonth() + 1);
      break;

    case "2_weeks":
    default:
      freeMaxDate.setDate(currentMonday.getDate() + 13);
      break;
  }

  freeMaxDate.setHours(23, 59, 59, 999);

  return freeMaxDate;
}

function calculateEarlyAccessMaxDate(
  currentMonday: Date,
  rules: SchedulingRules | null,
): Date {
  const earlyAccessMaxDate = new Date(currentMonday);

  switch (rules?.early_access) {
    case "1_month":
      earlyAccessMaxDate.setMonth(currentMonday.getMonth() + 1);
      break;

    case "3_months":
      earlyAccessMaxDate.setMonth(currentMonday.getMonth() + 3);
      break;

    case "2_months":
    default:
      earlyAccessMaxDate.setMonth(currentMonday.getMonth() + 2);
      break;
  }

  earlyAccessMaxDate.setHours(23, 59, 59, 999);

  return earlyAccessMaxDate;
}

export function useBookingRange({
  rules,
}: UseBookingRangeParams): BookingRange {
  return useMemo(() => {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    const currentMonday: Date = getMondayOfDate(today);

    return {
      minDate: currentMonday,
      freeMaxDate: calculateFreeMaxDate(
        currentMonday,
        rules,
      ),
      earlyAccessMaxDate:
        calculateEarlyAccessMaxDate(
          currentMonday,
          rules,
        ),
    };
  }, [rules]);
}