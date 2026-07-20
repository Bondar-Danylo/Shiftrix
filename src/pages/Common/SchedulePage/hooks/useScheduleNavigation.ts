// Imports
import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

// Types
import type { ViewMode } from "../SchedulePage.types";
interface UseScheduleNavigationResult {
  currentDate: Date;
  viewMode: ViewMode;
  periodTitle: string;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
  goToPreviousPeriod: () => void;
  goToNextPeriod: () => void;
}

export function useScheduleNavigation(): UseScheduleNavigationResult {
  const [currentDate, setCurrentDate] = useState<Date>(
    new Date(),
  );

  const [viewMode, setViewMode] =
    useState<ViewMode>("month");

  const periodTitle = useMemo((): string => {
    if (viewMode === "month") {
      return currentDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    const currentJsDay: number = currentDate.getDay();

    const currentIsoDay: number =
      currentJsDay === 0 ? 7 : currentJsDay;

    const startOfWeek: Date = new Date(currentDate);

    startOfWeek.setDate(
      currentDate.getDate() - (currentIsoDay - 1),
    );

    const endOfWeek: Date = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startFormat: string = startOfWeek.toLocaleString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
      },
    );

    const endFormat: string = endOfWeek.toLocaleString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );

    if (
      startOfWeek.getFullYear() !== endOfWeek.getFullYear()
    ) {
      const startFormatWithYear: string =
        startOfWeek.toLocaleString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

      return `${startFormatWithYear} - ${endFormat}`;
    }

    return `${startFormat} - ${endFormat}`;
  }, [currentDate, viewMode]);

  const goToPreviousPeriod = useCallback((): void => {
    setCurrentDate((previousDate) => {
      if (viewMode === "month") {
        return new Date(
          previousDate.getFullYear(),
          previousDate.getMonth() - 1,
          1,
        );
      }

      const newDate: Date = new Date(previousDate);

      newDate.setDate(previousDate.getDate() - 7);

      return newDate;
    });
  }, [viewMode]);

  const goToNextPeriod = useCallback((): void => {
    setCurrentDate((previousDate) => {
      if (viewMode === "month") {
        return new Date(
          previousDate.getFullYear(),
          previousDate.getMonth() + 1,
          1,
        );
      }

      const newDate: Date = new Date(previousDate);

      newDate.setDate(previousDate.getDate() + 7);

      return newDate;
    });
  }, [viewMode]);

  return {
    currentDate,
    viewMode,
    periodTitle,
    setViewMode,
    goToPreviousPeriod,
    goToNextPeriod,
  };
}