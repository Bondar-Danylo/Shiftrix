// SchedulePage.tsx
import { useState, useMemo, useCallback, useEffect } from "react";
import styles from "./SchedulePage.module.scss";

// Components
import ScheduleHeader from "@/components/Common/SchedulePage/ScheduleHeader/ScheduleHeader";
import ScheduleCalendar from "@/components/Common/SchedulePage/ScheduleCalendar/ScheduleCalendar";
import ScheduleWeekCalendar from "@/components/Common/SchedulePage/ScheduleWeekCalendar/ScheduleWeekCalendar";
import CardLoader from "@/components/Common/Loader/Loader";
import DayShiftsModal from "@/components/Common/SchedulePage/DayShiftsModal/DayShiftsModal";
import ManageShiftModal from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";
import CreateTemplateModal from "@/components/Admin/Settings/Templates/CreateTemplateModal/CreateTemplateModal";

// Types
import type {
  ViewMode,
  ProfessionOption,
  ShiftDay,
  Employee,
  BookingSettings,
  TemplateShiftData,
  AssignedShiftRecord,
} from "./SchedulePage.types";
import type { ModalShiftItem } from "@/components/Common/SchedulePage/DayShiftsModal/DayShiftsModal.types";
import type { ShiftEmployee } from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal.types";

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

const parseShiftTimes = (
  dateStr: string,
  timeWindow: string,
): { start: Date; end: Date } => {
  const normalizedWindow = timeWindow.replace(/–/g, "-");
  const [startStr, endStr] = normalizedWindow.split("-").map((s) => s.trim());

  const start = new Date(`${dateStr}T${startStr}:00`);
  let end = new Date(`${dateStr}T${endStr}:00`);

  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  return { start, end };
};

const fetchBookingSettings = (): Promise<
  BookingSettings & { minRestHoursBetweenShifts: number }
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bookingWindowWeeks: 2, // Х недель вперед из БД
        openDayOfWeek: 1,
        minRestHoursBetweenShifts: 11,
      });
    }, 400);
  });
};

const fetchProfessionsApi = (): Promise<{ id: string; name: string }[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: "barista", name: "Barista" },
        { id: "waiter", name: "Waiter" },
        { id: "cook", name: "Cook" },
      ]);
    }, 300);
  });
};

const SchedulePage = () => {
  const [settings, setSettings] = useState<
    (BookingSettings & { minRestHoursBetweenShifts: number }) | null
  >(null);
  const [rawProfessions, setRawProfessions] = useState<
    { id: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentProfession, setCurrentProfession] = useState<ProfessionOption>({
    id: "all",
    label: "All Professions",
  });
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalDateStr, setModalDateStr] = useState<string>("");
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);

  const [selectedShiftForManage, setSelectedShiftForManage] = useState<{
    id: string;
    timeWindow: string;
    points?: number;
    dateStr: string;
    profession: string;
  } | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    description: string;
    confirmText: string;
    variant: "primary" | "danger";
    action: () => void;
  } | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] =
    useState<boolean>(false);
  const [selectedTemplateData, setSelectedTemplateData] =
    useState<TemplateShiftData | null>(null);

  const [globalAssignedShifts, setGlobalAssignedShifts] = useState<
    AssignedShiftRecord[]
  >([
    {
      shiftId: "shift-1",
      dateStr: getRelativeDateStr(0),
      timeWindow: "09:00 – 17:00",
      employee: {
        id: "sarah",
        name: "Sarah Johnson",
        role: "Senior Server",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      },
    },
  ]);

  const currentYear: number = currentDate.getFullYear();
  const currentMonth: number = currentDate.getMonth();

  const assignedEmployeesForCurrentShift = useMemo<ShiftEmployee[]>(() => {
    if (!selectedShiftForManage) return [];
    return globalAssignedShifts
      .filter((rec) => {
        const matchesDate = rec.dateStr === selectedShiftForManage.dateStr;
        const matchesShift =
          rec.shiftId === selectedShiftForManage.id ||
          selectedShiftForManage.id.includes(rec.shiftId);
        return matchesDate && matchesShift;
      })
      .map((rec) => rec.employee);
  }, [globalAssignedShifts, selectedShiftForManage]);

  const professionOptions = useMemo<ProfessionOption[]>(() => {
    const apiOptions = rawProfessions.map((p) => ({ id: p.id, label: p.name }));
    return [{ id: "all", label: "All Professions" }, ...apiOptions];
  }, [rawProfessions]);

  const modalProfessions = useMemo(() => {
    return rawProfessions.map((p) => ({ id: p.id, label: p.name }));
  }, [rawProfessions]);

  useEffect((): void => {
    setIsLoading(true);
    Promise.all([fetchBookingSettings(), fetchProfessionsApi()])
      .then(([settingsData, professionsData]) => {
        setSettings(settingsData);
        setRawProfessions(professionsData);
      })
      .catch((err) => console.error("Failed to fetch initial data", err))
      .finally(() => setIsLoading(false));
  }, []);

  const mockModalShifts = useMemo<Record<string, ModalShiftItem[]>>(() => {
    const today = getRelativeDateStr(0);
    const tomorrow = getRelativeDateStr(1);
    return {
      [today]: [
        {
          id: "shift-1",
          name: "Morning Shift",
          timeWindow: "09:00 – 17:00",
          assignedCount: 0,
          maxCount: 3,
          profession: "Barista",
          points: 18,
        },
        {
          id: "shift-2",
          name: "Day Shift",
          timeWindow: "15:00 – 23:00",
          assignedCount: 0,
          maxCount: 4,
          profession: "Waiter",
          points: 20,
        },
      ],
      [tomorrow]: [
        {
          id: "shift-3",
          name: "Evening Shift",
          timeWindow: "10:00 – 22:00",
          assignedCount: 0,
          maxCount: 2,
          profession: "Cook",
          points: 15,
        },
      ],
    };
  }, []);

  const shiftsForCurrentModalDate = useMemo(() => {
    const rawShifts = mockModalShifts[modalDateStr] || [];
    return rawShifts.map((shift) => ({
      ...shift,
      assignedCount: globalAssignedShifts.filter(
        (rec) => rec.dateStr === modalDateStr && rec.shiftId === shift.id,
      ).length,
    }));
  }, [modalDateStr, mockModalShifts, globalAssignedShifts]);

  const monthTitle = useMemo((): string => {
    if (viewMode === "month") {
      return currentDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    const currentJsDay: number = currentDate.getDay();
    const currentIsoDay: number = currentJsDay === 0 ? 7 : currentJsDay;

    const startOfWeek: Date = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - (currentIsoDay - 1));

    const endOfWeek: Date = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startFormat: string = startOfWeek.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
    });

    const endFormat: string = endOfWeek.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    if (startOfWeek.getFullYear() !== endOfWeek.getFullYear()) {
      const startFormatWithYear: string = startOfWeek.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return `${startFormatWithYear} – ${endFormat}`;
    }

    return `${startFormat} – ${endFormat}`;
  }, [currentDate, viewMode]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => {
      if (viewMode === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      } else {
        const nextDate = new Date(prev);
        nextDate.setDate(prev.getDate() - 7);
        return nextDate;
      }
    });
  }, [viewMode]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      if (viewMode === "month") {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      } else {
        const nextDate = new Date(prev);
        nextDate.setDate(prev.getDate() + 7);
        return nextDate;
      }
    });
  }, [viewMode]);

  const handleDayClick = useCallback(
    (dateStr: string, isLocked: boolean): void => {
      if (isLocked) return; // ИСПРАВЛЕНО: Клик по заблокированным дням в Month View теперь игнорируется
      setSelectedDateStr(dateStr);
      setModalDateStr(dateStr);
      setIsModalOpen(true);
    },
    [],
  );

  const handleEditTemplateClick = useCallback(
    (shiftId: string) => {
      const currentDayShifts = mockModalShifts[modalDateStr] || [];
      const foundShift = currentDayShifts.find((s) => s.id === shiftId);

      if (foundShift) {
        const [start, end] = foundShift.timeWindow
          .replace(/–/g, "-")
          .split("-")
          .map((s) => s.trim());

        setSelectedTemplateData({
          id: foundShift.id,
          title: foundShift.name,
          role: foundShift.profession,
          startTime: start,
          endTime: end,
          requiredEmployees: foundShift.maxCount,
          minEmployees: 1,
          maxEmployees: foundShift.maxCount + 2,
          points: foundShift.points || 0,
          days: "Everyday",
          description: "",
          isHighPriority: false,
          location: "Downtown",
        });

        setIsModalOpen(false);
        setIsTemplateModalOpen(true);
      }
    },
    [modalDateStr, mockModalShifts],
  );

  const handleManageShiftClick = useCallback(
    (shiftId: string, specificDateStr?: string): void => {
      const targetDateStr = specificDateStr || modalDateStr;
      const currentDayShifts = mockModalShifts[targetDateStr] || [];
      let foundShift = currentDayShifts.find((s) => s.id === shiftId);

      let baseShiftId = shiftId;
      if (shiftId.includes("shift-1")) baseShiftId = "shift-1";
      if (shiftId.includes("shift-2")) baseShiftId = "shift-2";
      if (shiftId.includes("shift-3")) baseShiftId = "shift-3";

      if (!foundShift) {
        foundShift = {
          id: shiftId,
          name: shiftId.includes("shift-1")
            ? "Morning Shift"
            : shiftId.includes("shift-2")
              ? "Evening Shift"
              : "Full Day Shift",
          timeWindow: shiftId.includes("shift-1")
            ? "09:00 – 17:00"
            : shiftId.includes("shift-2")
              ? "15:00 – 23:00"
              : "10:00 – 22:00",
          assignedCount: 0,
          maxCount: 5,
          profession: shiftId.includes("shift-1")
            ? "Barista"
            : shiftId.includes("shift-2")
              ? "Waiter"
              : "Cook",
          points: shiftId.includes("shift-2")
            ? 15
            : shiftId.includes("shift-3")
              ? 25
              : undefined,
        };
      }

      if (foundShift) {
        setSelectedShiftForManage({
          id: baseShiftId,
          timeWindow: foundShift.timeWindow.replace(/-/g, "–"),
          points: foundShift.points,
          dateStr: targetDateStr,
          profession: foundShift.profession,
        });

        setIsModalOpen(false);
        setIsManageModalOpen(true);
      }
    },
    [modalDateStr, mockModalShifts],
  );

  const handleSaveTemplate = () => {
    setIsTemplateModalOpen(false);
    setIsModalOpen(true);
  };

  const handleRemoveEmployee = (id: string) => {
    if (!selectedShiftForManage) return;
    const employeeName =
      assignedEmployeesForCurrentShift.find((e) => e.id === id)?.name ||
      "this employee";

    setConfirmConfig({
      title: "Remove Employee",
      description: `Are you sure you want to remove ${employeeName} from this shift?`,
      confirmText: "Remove",
      variant: "danger",
      action: () => {
        setGlobalAssignedShifts((prev) =>
          prev.filter(
            (rec) =>
              !(
                (rec.shiftId === selectedShiftForManage.id ||
                  selectedShiftForManage.id.includes(rec.shiftId)) &&
                rec.dateStr === selectedShiftForManage.dateStr &&
                rec.employee.id === id
              ),
          ),
        );
        setIsConfirmOpen(false);
      },
    });
    setIsConfirmOpen(true);
  };

  const handleAddEmployee = (newEmp: ShiftEmployee) => {
    if (!selectedShiftForManage || !settings) return;

    const targetDateStr = selectedShiftForManage.dateStr;
    const targetTimeWindow = selectedShiftForManage.timeWindow.replace(
      /-/g,
      "–",
    );
    const targetShiftId = selectedShiftForManage.id;

    const targetTimes = parseShiftTimes(targetDateStr, targetTimeWindow);
    let errorMessage = "";

    const isValid = globalAssignedShifts.every((record) => {
      if (record.employee.id !== newEmp.id) return true;

      if (
        record.shiftId === targetShiftId &&
        record.dateStr === targetDateStr
      ) {
        errorMessage = `${newEmp.name} is already assigned to this shift.`;
        return false;
      }
      if (record.dateStr === targetDateStr) {
        errorMessage = `${newEmp.name} is already scheduled to work on this day. One shift per day maximum.`;
        return false;
      }

      const existingTimes = parseShiftTimes(record.dateStr, record.timeWindow);
      const minRestMs = settings.minRestHoursBetweenShifts * 60 * 60 * 1000;

      if (existingTimes.end <= targetTimes.start) {
        const restDuration =
          targetTimes.start.getTime() - existingTimes.end.getTime();
        if (restDuration < minRestMs) {
          errorMessage = `Rest conflict! ${newEmp.name} finishes a previous shift at ${record.timeWindow.split("–")[1].trim()} on ${record.dateStr}. Required gap is ${settings.minRestHoursBetweenShifts}h.`;
          return false;
        }
      }

      if (targetTimes.end <= existingTimes.start) {
        const restDuration =
          existingTimes.start.getTime() - targetTimes.end.getTime();
        if (restDuration < minRestMs) {
          errorMessage = `Rest conflict! Next shift starts at ${record.timeWindow.split("–")[0].trim()} on ${record.dateStr}. This leaves insufficient rest time.`;
          return false;
        }
      }
      return true;
    });

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    setConfirmConfig({
      title: "Assign Employee",
      description: `Do you want to assign ${newEmp.name} to the ${selectedShiftForManage.profession} shift (${targetTimeWindow})?`,
      confirmText: "Assign",
      variant: "primary",
      action: () => {
        setGlobalAssignedShifts((prev) => [
          ...prev,
          {
            shiftId: targetShiftId,
            dateStr: targetDateStr,
            timeWindow: targetTimeWindow,
            employee: newEmp,
          },
        ]);
        setIsConfirmOpen(false);
      },
    });
    setIsConfirmOpen(true);
  };

  const calendarDays = useMemo<ShiftDay[]>(() => {
    const days: ShiftDay[] = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const startOfWeekOffset =
      firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
    const totalCells =
      startOfWeekOffset +
      lastDayOfMonth.getDate() +
      (lastDayOfMonth.getDay() === 0 ? 0 : 7 - lastDayOfMonth.getDay());
    const startDate = new Date(
      currentYear,
      currentMonth,
      1 - startOfWeekOffset,
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let maxAllowedDate = new Date(today);

    if (settings) {
      const openDay = settings.openDayOfWeek;
      const dayOfWeek = today.getDay();
      const currentDay = dayOfWeek === 0 ? 7 : dayOfWeek;

      let daysToOpenDay = openDay - currentDay;
      if (daysToOpenDay < 0) daysToOpenDay += 7;
      const nextOpenDate = new Date(today);
      nextOpenDate.setDate(today.getDate() + daysToOpenDay);
      maxAllowedDate = new Date(nextOpenDate);
      maxAllowedDate.setDate(
        nextOpenDate.getDate() + settings.bookingWindowWeeks * 7 - 1,
      );
    }

    for (let i = 0; i < totalCells; i++) {
      const targetDate = new Date(startDate);
      targetDate.setDate(startDate.getDate() + i);
      targetDate.setHours(0, 0, 0, 0);
      const dateStr = formatDateLocal(targetDate);
      const isFutureLocked = targetDate > maxAllowedDate;
      const dayEmployees: Employee[] = globalAssignedShifts
        .filter((rec) => rec.dateStr === dateStr)
        .map((rec) => ({
          id: rec.employee.id,
          name: rec.employee.name,
          profession:
            rec.employee.role.toLowerCase().includes("chef") ||
            rec.employee.role.toLowerCase().includes("kitchen")
              ? "cook"
              : rec.employee.role.toLowerCase().includes("server")
                ? "waiter"
                : "barista",
          shiftStart: rec.timeWindow.replace(/–/g, "-").split("-")[0].trim(),
          shiftEnd: rec.timeWindow.replace(/–/g, "-").split("-")[1].trim(),
          avatarUrl: rec.employee.avatarUrl,
        }));

      const dayOfWeek = targetDate.getDay();
      const dayTemplate = MOCK_MANAGER_TEMPLATE[dayOfWeek] || { total: 10 };

      days.push({
        date: targetDate,
        dateStr,
        isCurrentMonth: targetDate.getMonth() === currentMonth,
        isToday: dateStr === getRelativeDateStr(0),
        isPast: dateStr < getRelativeDateStr(0),
        isFutureLocked,
        isAccessible: !isFutureLocked,
        isSelected: dateStr === selectedDateStr,
        employees:
          currentProfession.id === "all"
            ? dayEmployees
            : dayEmployees.filter((e) => e.profession === currentProfession.id),
        maxCount:
          currentProfession.id === "all"
            ? dayTemplate.total
            : dayTemplate[currentProfession.id] || 0,
      });
    }
    return days;
  }, [
    currentYear,
    currentMonth,
    currentProfession,
    selectedDateStr,
    globalAssignedShifts,
    settings,
  ]);

  if (isLoading) return <CardLoader text="Loading schedule..." />;

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

      {viewMode === "month" ? (
        <ScheduleCalendar
          calendarDays={calendarDays}
          DAYS_OF_WEEK={DAYS_OF_WEEK}
          onDayClick={(dateStr) => {
            const day = calendarDays.find((d) => d.dateStr === dateStr);
            if (day && !day.isFutureLocked) {
              handleDayClick(dateStr, false);
            }
          }}
        />
      ) : (
        <ScheduleWeekCalendar
          calendarDays={calendarDays}
          DAYS_OF_WEEK={DAYS_OF_WEEK}
          currentDate={currentDate}
          onShiftClick={handleManageShiftClick}
        />
      )}

      <DayShiftsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dateStr={modalDateStr || getRelativeDateStr(0)}
        shifts={shiftsForCurrentModalDate}
        professions={modalProfessions}
        onAddShift={() => {}}
        onSelectShift={handleManageShiftClick}
        onEditShift={handleEditTemplateClick}
      />

      <ManageShiftModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          if (viewMode === "month") setIsModalOpen(true);
        }}
        shiftDetails={selectedShiftForManage}
        assignedEmployees={assignedEmployeesForCurrentShift}
        onRemoveEmployee={handleRemoveEmployee}
        onAddEmployee={handleAddEmployee}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={confirmConfig?.title || "Are you sure?"}
        description={confirmConfig?.description || ""}
        confirmText={confirmConfig?.confirmText || "Yes"}
        variant={confirmConfig?.variant || "primary"}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmConfig?.action || (() => {})}
      />

      <CreateTemplateModal
        isOpen={isTemplateModalOpen}
        initialData={selectedTemplateData as any}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setIsModalOpen(true);
        }}
        onSave={handleSaveTemplate}
      />
    </div>
  );
};

export default SchedulePage;
