// Imports
import { useState, useMemo, useCallback, useEffect } from "react";

// Styles
import styles from "./SchedulePage.module.scss";

// Components
import ScheduleHeader from "@/components/Common/SchedulePage/ScheduleHeader/ScheduleHeader";
import ScheduleCalendar from "@/components/Common/SchedulePage/ScheduleCalendar/ScheduleCalendar";
import CardLoader from "@/components/Common/Loader/Loader";

// Types
import type {
  ViewMode,
  ProfessionOption,
  ShiftDay,
  Employee,
  BookingSettings,
} from "./SchedulePage.types";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_MANAGER_TEMPLATE: Record<number, Record<string, number>> = {
  1: { barista: 1, waiter: 2, cook: 4, total: 7 },
  2: { barista: 2, waiter: 4, cook: 6, total: 12 },
  3: { barista: 2, waiter: 3, cook: 4, total: 9 },
  4: { barista: 2, waiter: 3, cook: 4, total: 9 },
  5: { barista: 3, waiter: 5, cook: 8, total: 16 },
  6: { barista: 4, waiter: 6, cook: 8, total: 18 },
  0: { barista: 2, waiter: 4, cook: 4, total: 10 },
};

const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getRelativeDateStr = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatDateLocal(d);
};

const MOCK_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
];

const getMockDatabase = (): Record<string, Employee[]> => {
  return {
    [getRelativeDateStr(-2)]: [
      {
        id: "alex",
        name: "Alex Mercer",
        profession: "cook",
        shiftStart: "08:00",
        shiftEnd: "16:00",
        avatarUrl: MOCK_AVATARS[1],
      },
      {
        id: "maria",
        name: "Maria Hill",
        profession: "waiter",
        shiftStart: "10:00",
        shiftEnd: "18:00",
        avatarUrl: MOCK_AVATARS[2],
      },
    ],
    [getRelativeDateStr(-1)]: [
      {
        id: "john",
        name: "John Doe",
        profession: "barista",
        shiftStart: "07:00",
        shiftEnd: "15:00",
        avatarUrl: MOCK_AVATARS[0],
      },
      {
        id: "sam",
        name: "Sam Wilson",
        profession: "barista",
        shiftStart: "15:00",
        shiftEnd: "23:00",
        avatarUrl: MOCK_AVATARS[3],
      },
      {
        id: "emma",
        name: "Emma Watson",
        profession: "waiter",
        shiftStart: "12:00",
        shiftEnd: "20:00",
        avatarUrl: MOCK_AVATARS[4],
      },
      {
        id: "alex",
        name: "Alex Mercer",
        profession: "cook",
        shiftStart: "08:00",
        shiftEnd: "16:00",
        avatarUrl: MOCK_AVATARS[1],
      },
    ],
    [getRelativeDateStr(0)]: [
      {
        id: "john",
        name: "John Doe",
        profession: "barista",
        shiftStart: "07:00",
        shiftEnd: "15:00",
        avatarUrl: MOCK_AVATARS[0],
      },
      {
        id: "emma",
        name: "Emma Watson",
        profession: "waiter",
        shiftStart: "12:00",
        shiftEnd: "20:00",
        avatarUrl: MOCK_AVATARS[4],
      },
      {
        id: "alex",
        name: "Alex Mercer",
        profession: "cook",
        shiftStart: "08:00",
        shiftEnd: "16:00",
        avatarUrl: MOCK_AVATARS[1],
      },
    ],
    [getRelativeDateStr(1)]: [
      {
        id: "sam",
        name: "Sam Wilson",
        profession: "barista",
        shiftStart: "07:00",
        shiftEnd: "15:00",
        avatarUrl: MOCK_AVATARS[3],
      },
      {
        id: "maria",
        name: "Maria Hill",
        profession: "waiter",
        shiftStart: "10:00",
        shiftEnd: "18:00",
        avatarUrl: MOCK_AVATARS[2],
      },
    ],
    [getRelativeDateStr(2)]: [
      {
        id: "john",
        name: "John Doe",
        profession: "barista",
        shiftStart: "07:00",
        shiftEnd: "15:00",
        avatarUrl: MOCK_AVATARS[0],
      },
      {
        id: "sam",
        name: "Sam Wilson",
        profession: "barista",
        shiftStart: "15:00",
        shiftEnd: "23:00",
        avatarUrl: MOCK_AVATARS[3],
      },
      {
        id: "maria",
        name: "Maria Hill",
        profession: "waiter",
        shiftStart: "08:00",
        shiftEnd: "16:00",
        avatarUrl: MOCK_AVATARS[2],
      },
      {
        id: "emma",
        name: "Emma Watson",
        profession: "waiter",
        shiftStart: "16:00",
        shiftEnd: "00:00",
        avatarUrl: MOCK_AVATARS[4],
      },
      {
        id: "alex",
        name: "Alex Mercer",
        profession: "cook",
        shiftStart: "08:00",
        shiftEnd: "16:00",
        avatarUrl: MOCK_AVATARS[1],
      },
    ],
    [getRelativeDateStr(3)]: [
      {
        id: "john",
        name: "John Doe",
        profession: "barista",
        shiftStart: "07:00",
        shiftEnd: "15:00",
        avatarUrl: MOCK_AVATARS[0],
      },
    ],
  };
};

const fetchBookingSettings = (): Promise<BookingSettings> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bookingWindowWeeks: 2,
        openDayOfWeek: 1,
      });
    }, 600);
  });
};

const SchedulePage = () => {
  const [professionOptions] = useState<ProfessionOption[]>([
    { id: "all", label: "All Professions" },
    { id: "barista", label: "Barista" },
    { id: "waiter", label: "Waiter" },
    { id: "cook", label: "Cook" },
  ]);

  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentProfession, setCurrentProfession] = useState<ProfessionOption>(
    professionOptions[0],
  );
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect((): void => {
    fetchBookingSettings()
      .then((data) => setSettings(data))
      .catch((err) => console.error("Failed to fetch settings", err))
      .finally(() => setIsLoading(false));
  }, []);

  const monthTitle = useMemo((): string => {
    return currentDate.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const handlePrevMonth = useCallback((): void => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  }, []);

  const handleNextMonth = useCallback((): void => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  }, []);

  const handleDayClick = useCallback((dateStr: string): void => {
    setSelectedDateStr((prev) => (prev === dateStr ? "" : dateStr));
  }, []);

  const bookingBounds = useMemo(() => {
    if (!settings) return null;

    const today: Date = new Date();
    const todayStr: string = formatDateLocal(today);
    const jsDay: number = today.getDay();
    const currentIsoDay: number = jsDay === 0 ? 7 : jsDay;

    const targetOpenDay: number = settings.openDayOfWeek;

    const openDayThisWeek: Date = new Date(today);
    openDayThisWeek.setDate(today.getDate() - (currentIsoDay - targetOpenDay));

    if (today < openDayThisWeek) {
      openDayThisWeek.setDate(openDayThisWeek.getDate() - 7);
    }

    const maxAllowedDate: Date = new Date(openDayThisWeek);
    maxAllowedDate.setDate(
      openDayThisWeek.getDate() + settings.bookingWindowWeeks * 7 - 1,
    );

    return {
      todayStr,
      maxAllowedStr: formatDateLocal(maxAllowedDate),
    };
  }, [settings]);

  const calendarDays = useMemo<ShiftDay[]>(() => {
    const days: ShiftDay[] = [];
    const firstDayOfMonth: Date = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth: Date = new Date(currentYear, currentMonth + 1, 0);
    const firstDayJsIdx: number = firstDayOfMonth.getDay();
    const startOfWeekOffset: number =
      firstDayJsIdx === 0 ? 6 : firstDayJsIdx - 1;
    const lastDayJsIdx: number = lastDayOfMonth.getDay();
    const endOfWeekOffset: number = lastDayJsIdx === 0 ? 0 : 7 - lastDayJsIdx;
    const totalCells: number =
      startOfWeekOffset + lastDayOfMonth.getDate() + endOfWeekOffset;
    const startDate: Date = new Date(
      currentYear,
      currentMonth,
      1 - startOfWeekOffset,
    );

    const mockDatabase = getMockDatabase();

    for (let i = 0; i < totalCells; i++) {
      const targetDate: Date = new Date(startDate);
      targetDate.setDate(startDate.getDate() + i);

      const dateStr: string = formatDateLocal(targetDate);
      const isCurrentMonth: boolean = targetDate.getMonth() === currentMonth;

      let isAccessible: boolean = false;
      let isPast: boolean = false;
      let isToday: boolean = false;

      if (bookingBounds) {
        isToday = dateStr === bookingBounds.todayStr;
        isPast = dateStr < bookingBounds.todayStr;
        isAccessible = !isPast && dateStr <= bookingBounds.maxAllowedStr;
      }

      const isFutureLocked: boolean = !isAccessible && !isPast;

      const dayOfWeek: number = targetDate.getDay();
      const dayTemplate = MOCK_MANAGER_TEMPLATE[dayOfWeek];

      const maxCountForProfession =
        currentProfession.id === "all"
          ? dayTemplate.total
          : dayTemplate[currentProfession.id] || 0;

      const allDayEmployees = mockDatabase[dateStr] || [];
      const filteredEmployees =
        currentProfession.id === "all"
          ? allDayEmployees
          : allDayEmployees.filter(
              (emp) => emp.profession === currentProfession.id,
            );

      days.push({
        date: targetDate,
        dateStr,
        isCurrentMonth,
        isToday,
        isPast,
        isFutureLocked,
        isAccessible,
        isSelected: dateStr === selectedDateStr,
        employees: filteredEmployees,
        maxCount: isFutureLocked ? 0 : maxCountForProfession,
      });
    }

    return days;
  }, [
    currentYear,
    currentMonth,
    currentProfession,
    selectedDateStr,
    bookingBounds,
  ]);

  if (isLoading) {
    return (
      <div className={styles.schedulePage__loader}>
        <CardLoader text="Loading schedule..." />
      </div>
    );
  }

  return (
    <div className={styles.schedulePage}>
      <ScheduleHeader
        currentDate={currentDate}
        monthTitle={monthTitle}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentProfession={currentProfession}
        professionOptions={professionOptions}
        onProfessionSelect={setCurrentProfession}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      <ScheduleCalendar
        calendarDays={calendarDays}
        DAYS_OF_WEEK={DAYS_OF_WEEK}
        onDayClick={handleDayClick}
      />
    </div>
  );
};

export default SchedulePage;
