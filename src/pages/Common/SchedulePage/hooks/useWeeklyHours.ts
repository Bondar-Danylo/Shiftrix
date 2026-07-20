// Imports
import {
  useCallback,
  useEffect,
  useState,
} from "react";

// Types
import type { WeeklyHoursResponse} from "../SchedulePage.api";

// API
import { scheduleApi } from "../SchedulePage.api";

// Interfaces
interface UseWeeklyHoursParams {
  userId: string | number | null;
  date?: string;
}

interface UseWeeklyHoursResult {
  weeklyHours: WeeklyHoursResponse | null;
  isLoading: boolean;
  error: string | null;
  loadWeeklyHours: () => Promise<void>;
}

// Main Func
export function useWeeklyHours({userId, date}: UseWeeklyHoursParams): UseWeeklyHoursResult {
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHoursResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeeklyHours =
    useCallback(async (): Promise<void> => {
      if (userId === null) {
        setWeeklyHours(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await scheduleApi.getWeeklyHours(userId, date);
        setWeeklyHours(data);

      } catch (error: unknown) {
        const message: string =
          error instanceof Error
            ? error.message
            : String(error);

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }, [userId, date]);

  useEffect((): void => {
    loadWeeklyHours();
  }, [loadWeeklyHours]);

  return {
    weeklyHours,
    isLoading,
    error,
    loadWeeklyHours,
  };
}