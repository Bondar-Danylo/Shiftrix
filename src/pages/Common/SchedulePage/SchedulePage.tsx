// Imports
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Styles
import styles from "./SchedulePage.module.scss";

// Components
import ScheduleHeader from "@/components/Common/SchedulePage/ScheduleHeader/ScheduleHeader";
import ScheduleCalendar from "@/components/Common/SchedulePage/ScheduleCalendar/ScheduleCalendar";
import ScheduleWeekCalendar from "@/components/Common/SchedulePage/ScheduleWeekCalendar/ScheduleWeekCalendar";
import CardLoader from "@/components/Common/Loader/Loader";
import DayShiftsModal from "@/components/Common/SchedulePage/DayShiftsModal/DayShiftsModal";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";
import CreateTemplateModal from "@/components/Admin/Settings/Templates/CreateTemplateModal/CreateTemplateModal";

// Types
import type {
  ProfessionOption,
  TemplateShiftData,
  DbTemplate,
  DbScheduledShift,
  EmployeeScheduleStats,
  EmployeeScheduleStatsResponse,
} from "./SchedulePage.types";
import type { ModalShiftItem } from "@/components/Common/SchedulePage/DayShiftsModal/DayShiftsModal.types";
import type { ShiftEmployee } from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal.types";
type ActiveScheduleModal = "none" | "day" | "manage" | "template";

// Interfaces
interface StoredUser {
  id: number;
  name: string;
  role?: string;
  position_id?: number | string;
  avatarUrl?: string | null;
}

// Utils
import {
  DAYS_OF_WEEK,
  formatDateLocal,
  getRelativeDateStr,
} from "./SchedulePage.utils";

// API
import { scheduleApi } from "./SchedulePage.api";

// Hooks
import { useCalendarDays } from "./hooks/useCalendarDays";
import { useScheduleNavigation } from "./hooks/useScheduleNavigation";
import { useScheduleData } from "./hooks/useScheduleData";
import { useBookingRange } from "./hooks/useBookingRange";
import { useShiftAssignments } from "./hooks/useShiftAssignments";
import ManageShiftModal from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal";

const SchedulePage: React.FC = () => {
  // States
  const currentUser = useMemo<StoredUser | null>(() => {
    const storedUser: string | null = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as StoredUser;
    } catch {
      return null;
    }
  }, []);

  const userId: number = Number(
    currentUser?.id || localStorage.getItem("user_id"),
  );

  const userRole: string =
    currentUser?.role || localStorage.getItem("userRole") || "employee";

  const isAdmin: boolean = userRole === "admin" || userRole === "manager";

  const {
    currentDate,
    viewMode,
    periodTitle,
    setViewMode,
    goToPreviousPeriod,
    goToNextPeriod,
  } = useScheduleNavigation();

  const {
    rules,
    rawProfessions,
    templates,
    companyEmployees,
    scheduledShifts,
    isLoading,
    setScheduledShifts,
    loadTemplates,
    loadShifts,
  } = useScheduleData({
    currentDate,
  });

  const bookingRange = useBookingRange({
    rules,
  });

  const [currentProfession, setCurrentProfession] = useState<ProfessionOption>({
    id: "all",
    label: "All Professions",
  });

  const [employeeStats, setEmployeeStats] =
    useState<EmployeeScheduleStats | null>(null);

  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(false);

  const [statsError, setStatsError] = useState<string | null>(null);

  const [selectedDateStr, setSelectedDateStr] = useState<string>("");

  const [modalDateStr, setModalDateStr] = useState<string>("");

  const [selectedShiftIdForManage, setSelectedShiftIdForManage] = useState<
    number | null
  >(null);

  const [selectedTemplateData, setSelectedTemplateData] =
    useState<TemplateShiftData | null>(null);

  const [activeModal, setActiveModal] = useState<ActiveScheduleModal>("none");

  const isModalDatePast = useMemo((): boolean => {
    if (!modalDateStr) {
      return false;
    }

    const todayStr: string = formatDateLocal(new Date());

    return modalDateStr < todayStr;
  }, [modalDateStr]);

  const selectedShiftData = useMemo<DbScheduledShift | undefined>(() => {
    if (selectedShiftIdForManage === null) {
      return undefined;
    }

    return scheduledShifts.find(
      (shift) => shift.id === selectedShiftIdForManage,
    );
  }, [scheduledShifts, selectedShiftIdForManage]);

  const isShiftReadOnly = useMemo((): boolean => {
    if (!selectedShiftData) {
      return false;
    }

    const todayStr: string = formatDateLocal(new Date());

    return selectedShiftData.date < todayStr;
  }, [selectedShiftData]);

  const selectedShiftForManage = useMemo(() => {
    if (!selectedShiftData) return null;

    const professionName: string =
      rawProfessions.find(
        (profession) =>
          String(profession.id) === String(selectedShiftData.position_id),
      )?.name || String(selectedShiftData.position_id);

    return {
      id: String(selectedShiftData.id),

      timeWindow: `${selectedShiftData.start_time.substring(
        0,
        5,
      )} - ${selectedShiftData.end_time.substring(0, 5)}`,

      points: selectedShiftData.points,

      dateStr: selectedShiftData.date,

      profession: professionName,
    };
  }, [selectedShiftData, rawProfessions]);

  const assignedEmployeesForCurrentShift = useMemo<ShiftEmployee[]>(() => {
    if (!selectedShiftData) {
      return [];
    }

    return selectedShiftData.assigned_employees.map((employee) => ({
      id: employee.id,

      name: employee.name,

      role:
        rawProfessions.find(
          (profession) => String(profession.id) === String(employee.role),
        )?.name || employee.role,

      avatarUrl:
        employee.avatarUrl ||
        `https://api.dicebear.com/10.x/avataaars/png?seed=${employee.id}`,
    }));
  }, [selectedShiftData, rawProfessions]);

  const visibleAssignedEmployees = useMemo<ShiftEmployee[]>(() => {
    if (isAdmin) return assignedEmployeesForCurrentShift;

    return assignedEmployeesForCurrentShift.filter(
      (employee) => String(employee.id) === String(userId),
    );
  }, [isAdmin, assignedEmployeesForCurrentShift, userId]);

  const currentEmployee = useMemo<ShiftEmployee | undefined>(() => {
    if (!userId) {
      return undefined;
    }

    const employee = companyEmployees.find(
      (item) => Number(item.id) === userId,
    );

    if (employee) {
      return employee;
    }

    if (!currentUser) {
      return undefined;
    }

    const professionName: string =
      rawProfessions.find(
        (profession) =>
          String(profession.id) === String(currentUser.position_id),
      )?.name || String(currentUser.position_id || "Employee");

    return {
      id: String(userId),
      name: currentUser.name,
      role: professionName,
      avatarUrl:
        currentUser.avatarUrl ||
        `https://api.dicebear.com/10.x/avataaars/png?seed=${userId}`,
    };
  }, [userId, companyEmployees, currentUser, rawProfessions]);

  const employeesAvailableForModal = useMemo<ShiftEmployee[]>(() => {
    if (isAdmin) {
      return companyEmployees;
    }

    return currentEmployee ? [currentEmployee] : [];
  }, [isAdmin, companyEmployees, currentEmployee]);

  const professionOptions = useMemo<ProfessionOption[]>(() => {
    const apiOptions: ProfessionOption[] = rawProfessions.map((profession) => ({
      id: String(profession.id),
      label: profession.name,
    }));

    if (!isAdmin && currentUser?.position_id) {
      const employeeProfession = apiOptions.find(
        (profession) =>
          String(profession.id) === String(currentUser.position_id),
      );

      return employeeProfession
        ? [employeeProfession]
        : [
            {
              id: "all",
              label: "All Professions",
            },
          ];
    }

    return [
      {
        id: "all",
        label: "All Professions",
      },
      ...apiOptions,
    ];
  }, [rawProfessions, isAdmin, currentUser]);

  const modalProfessions = useMemo(() => {
    return rawProfessions.map((profession) => ({
      id: String(profession.id),
      label: profession.name,
    }));
  }, [rawProfessions]);

  const activeScheduledShifts = useMemo<DbScheduledShift[]>(() => {
    return scheduledShifts.filter((shift) => {
      if (!shift.template_id) {
        return false;
      }

      return templates.some(
        (template) => String(template.id) === String(shift.template_id),
      );
    });
  }, [scheduledShifts, templates]);

  const visibleScheduledShifts = useMemo<DbScheduledShift[]>(() => {
    if (isAdmin) {
      return activeScheduledShifts;
    }

    if (!currentUser?.position_id) {
      return activeScheduledShifts;
    }

    return activeScheduledShifts.filter((shift) => {
      const matchesProfession =
        String(shift.position_id) === String(currentUser.position_id);

      const isAssigned = shift.assigned_employees.some(
        (employee) => Number(employee.id) === userId,
      );

      return matchesProfession || isAssigned;
    });
  }, [activeScheduledShifts, isAdmin, currentUser, userId]);

  const {
    isConfirmOpen,
    confirmConfig,
    closeConfirmation,
    addEmployee,
    removeEmployee,
  } = useShiftAssignments({
    rules,
    bookingRange,
    activeScheduledShifts,
    selectedShiftId: selectedShiftIdForManage,
    setScheduledShifts,
  });

  const calendarDays = useCalendarDays({
    currentDate,
    currentProfession,
    selectedDateStr,
    scheduledShifts: visibleScheduledShifts,
    bookingRange,
  });

  // Memos
  const shiftsForCurrentModalDate = useMemo<ModalShiftItem[]>(() => {
    return visibleScheduledShifts
      .filter((shift) => shift.date === modalDateStr)
      .map((shift) => {
        const professionName: string =
          rawProfessions.find(
            (profession) => String(profession.id) === String(shift.position_id),
          )?.name || String(shift.position_id);

        return {
          id: String(shift.id),

          name: shift.template_title || `${professionName} Shift`,

          timeWindow: `${shift.start_time.substring(
            0,
            5,
          )} - ${shift.end_time.substring(0, 5)}`,

          assignedCount: shift.assigned_employees.length,

          maxCount: shift.max_employees,

          profession: professionName,

          points: shift.points,
        };
      });
  }, [modalDateStr, visibleScheduledShifts, rawProfessions]);

  const isCurrentEmployeeAssigned = useMemo((): boolean => {
    if (!selectedShiftData || !userId) {
      return false;
    }

    return selectedShiftData.assigned_employees.some(
      (employee) => Number(employee.id) === userId,
    );
  }, [selectedShiftData, userId]);

  const loadEmployeeStats = useCallback(async (): Promise<void> => {
    if (isAdmin || !userId) {
      return;
    }

    setIsStatsLoading(true);
    setStatsError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_employee_schedule_stats.php?user_id=${userId}&date=${formatDateLocal(
          currentDate,
        )}`,
      );

      const data: EmployeeScheduleStatsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load employee statistics");
      }

      setEmployeeStats(data.stats);
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : String(error);

      setStatsError(message);
    } finally {
      setIsStatsLoading(false);
    }
  }, [isAdmin, userId, currentDate]);

  // Initials
  useEffect((): void => {
    if (isAdmin || !currentUser?.position_id) return;

    const employeeProfession: ProfessionOption | undefined =
      professionOptions.find(
        (profession) =>
          String(profession.id) === String(currentUser.position_id),
      );

    if (
      !employeeProfession ||
      String(currentProfession.id) === String(employeeProfession.id)
    ) {
      return;
    }

    setCurrentProfession(employeeProfession);
  }, [
    isAdmin,
    currentUser?.position_id,
    currentProfession.id,
    professionOptions,
  ]);

  useEffect((): void => {
    void loadEmployeeStats();
  }, [loadEmployeeStats, scheduledShifts]);

  // Handles
  const handleDayClick = useCallback(
    async (dateStr: string): Promise<void> => {
      setSelectedDateStr(dateStr);
      setModalDateStr(dateStr);

      if (!isAdmin) {
        setActiveModal("day");
        return;
      }

      try {
        const parsedDate: Date = new Date(dateStr);

        const daysShort: string[] = [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ];

        const currentDayName: string = daysShort[parsedDate.getDay()];

        const activeTemplatesForDay: DbTemplate[] = templates.filter(
          (template) => {
            if (Array.isArray(template.days)) {
              return template.days.includes(currentDayName);
            }

            if (typeof template.days === "string") {
              if (template.days === "Everyday") {
                return true;
              }

              return template.days
                .split(",")
                .map((day) => day.trim())
                .includes(currentDayName);
            }

            return false;
          },
        );

        const existingShiftsForDay: DbScheduledShift[] = scheduledShifts.filter(
          (shift) => shift.date === dateStr,
        );

        const shiftsToDelete: DbScheduledShift[] = existingShiftsForDay.filter(
          (shift) =>
            shift.template_id &&
            !activeTemplatesForDay.some(
              (template) => String(template.id) === String(shift.template_id),
            ),
        );

        for (const shift of shiftsToDelete) {
          await scheduleApi.deleteShift(shift.id);
        }

        const templatesToGenerate: DbTemplate[] = activeTemplatesForDay.filter(
          (template) =>
            !existingShiftsForDay.some(
              (shift) => String(shift.template_id) === String(template.id),
            ),
        );

        for (const template of templatesToGenerate) {
          await scheduleApi.createShiftFromTemplate({
            action: "create_from_template",
            template_id: Number(template.id),
            date: dateStr,
            start_time: template.startTime,
            end_time: template.endTime,
            points: template.points,
            position_id: template.role,
            max_employees: template.requiredEmployees,
          });
        }

        await Promise.all([loadTemplates(), loadShifts()]);

        setActiveModal("day");
      } catch (error) {
        console.error("Error during day click synchronization:", error);
      }
    },
    [isAdmin, templates, scheduledShifts, loadTemplates, loadShifts],
  );

  const handleEditTemplateClick = useCallback(
    (shiftId: string): void => {
      if (!isAdmin) {
        return;
      }

      const foundShift: DbScheduledShift | undefined =
        activeScheduledShifts.find((shift) => String(shift.id) === shiftId);

      if (!foundShift) {
        return;
      }

      const matchingTemplate: DbTemplate | undefined = templates.find(
        (template) => String(template.id) === String(foundShift.template_id),
      );

      const rawTemplate = {
        id: String(foundShift.template_id || ""),

        title: foundShift.template_title || "Shift",

        role: String(foundShift.position_id),

        startTime: foundShift.start_time.substring(0, 5),

        endTime: foundShift.end_time.substring(0, 5),

        requiredEmployees: foundShift.max_employees,

        minEmployees: 1,

        maxEmployees: foundShift.max_employees + 2,

        points: Number(foundShift.points),

        days: matchingTemplate
          ? Array.isArray(matchingTemplate.days)
            ? matchingTemplate.days.join(",")
            : matchingTemplate.days
          : "Everyday",

        description: "",

        isHighPriority: false,

        location: "Downtown",
      };

      setSelectedTemplateData(rawTemplate);

      setActiveModal("template");
    },
    [isAdmin, activeScheduledShifts, templates],
  );

  const handleAddShiftClick = useCallback(
    (dateStr?: string): void => {
      if (!isAdmin) {
        return;
      }

      const targetDateStr: string = dateStr || modalDateStr;

      let preselectedDayStr: string = "Mon, Tue, Wed, Thu, Fri, Sat, Sun";

      if (targetDateStr) {
        const parsedDate: Date = new Date(targetDateStr);

        const daysShort: string[] = [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ];

        preselectedDayStr = daysShort[parsedDate.getDay()];
      }

      setSelectedTemplateData({
        id: "",
        title: "",
        role: rawProfessions[0]?.id || "",
        startTime: "09:00",
        endTime: "17:00",
        requiredEmployees: 1,
        minEmployees: 1,
        maxEmployees: 5,
        points: 10,
        days: preselectedDayStr,
        description: "",
        isHighPriority: false,
        location: "Downtown",
      });

      setActiveModal("template");
    },
    [isAdmin, rawProfessions, modalDateStr],
  );

  const handleManageShiftClick = useCallback(
    (shiftId: string | number): void => {
      const numericId: number = Number(shiftId);

      const foundShift = activeScheduledShifts.find(
        (shift) => shift.id === numericId,
      );

      if (!foundShift) {
        return;
      }

      setSelectedShiftIdForManage(foundShift.id);

      setActiveModal("manage");
    },
    [activeScheduledShifts],
  );

  const handleSaveTemplate = async (
    templateData: TemplateShiftData,
  ): Promise<void> => {
    if (!isAdmin) {
      return;
    }

    try {
      const templateId: string | undefined =
        templateData.id || selectedTemplateData?.id;

      const isEditMode: boolean = Boolean(
        templateId && String(templateId).trim() !== "",
      );

      let daysToSend: string[] = [];

      const daysSource: string | string[] | undefined =
        templateData.days || selectedTemplateData?.days;

      if (Array.isArray(daysSource)) {
        daysToSend = daysSource;
      } else if (daysSource === "Everyday") {
        daysToSend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      } else if (typeof daysSource === "string") {
        daysToSend = daysSource
          .split(",")
          .map((day) => day.trim())
          .filter(Boolean);
      }

      const bodyPayload = {
        id: isEditMode ? Number(templateId) : null,

        title: templateData.title,

        role: templateData.role,

        startTime: templateData.startTime,

        endTime: templateData.endTime,

        requiredEmployees: templateData.requiredEmployees,

        minEmployees: templateData.minEmployees,

        maxEmployees: templateData.maxEmployees,

        points: templateData.points,

        description: templateData.description,

        isHighPriority: templateData.isHighPriority ? 1 : 0,

        isRecurring: 1,

        days: daysToSend,
      };

      const result = await scheduleApi.saveTemplate(bodyPayload);

      if (!result.success) {
        throw new Error(result.error || "Unknown server error");
      }

      await Promise.all([loadTemplates(), loadShifts()]);

      setSelectedTemplateData(null);
      setActiveModal("day");
    } catch (error: unknown) {
      console.error("Error saving template:", error);

      const message: string =
        error instanceof Error ? error.message : String(error);

      alert(`Failed to save template: ${message}`);
    }
  };

  const handleEmployeeAdd = useCallback(
    (employee: ShiftEmployee): void => {
      if (isAdmin) {
        addEmployee(employee);
        return;
      }

      if (!currentEmployee) return;

      addEmployee(currentEmployee);
    },
    [isAdmin, currentEmployee, addEmployee],
  );

  const handleEmployeeRemove = useCallback(
    (employeeId: string): void => {
      if (isAdmin) {
        removeEmployee(employeeId);
        return;
      }

      if (!currentEmployee) return;

      removeEmployee(currentEmployee.id);
    },
    [isAdmin, currentEmployee, removeEmployee],
  );

  if (isLoading) {
    return <CardLoader text="Loading schedule..." />;
  }

  return (
    <div className={styles.schedulePage}>
      <ScheduleHeader
        currentDate={currentDate}
        monthTitle={periodTitle}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentProfession={currentProfession}
        professionOptions={professionOptions}
        onProfessionSelect={setCurrentProfession}
        onPrevMonth={goToPreviousPeriod}
        onNextMonth={goToNextPeriod}
        showSendSchedule={isAdmin}
      />

      {!isAdmin && (
        <div className={styles.employeeStats}>
          {isStatsLoading ? (
            <CardLoader text="Loading your statistics..." />
          ) : statsError ? (
            <p className={styles.employeeStats__error}>{statsError}</p>
          ) : employeeStats ? (
            <>
              <div className={styles.employeeStats__item}>
                <span className={styles.employeeStats__label}>Points</span>

                <strong className={styles.employeeStats__value}>
                  {employeeStats.points}
                </strong>
              </div>

              <div className={styles.employeeStats__item}>
                <span className={styles.employeeStats__label}>
                  Weekly hours
                </span>

                <strong className={styles.employeeStats__value}>
                  {employeeStats.total_hours}h / {employeeStats.max_hours}h
                </strong>
              </div>

              <div className={styles.employeeStats__item}>
                <span className={styles.employeeStats__label}>Worked</span>

                <strong className={styles.employeeStats__value}>
                  {employeeStats.worked_hours}h
                </strong>
              </div>

              <div className={styles.employeeStats__item}>
                <span className={styles.employeeStats__label}>Booked</span>

                <strong className={styles.employeeStats__value}>
                  {employeeStats.booked_hours}h
                </strong>
              </div>

              <div className={styles.employeeStats__item}>
                <span className={styles.employeeStats__label}>Shifts</span>

                <strong className={styles.employeeStats__value}>
                  {employeeStats.total_shifts} / {employeeStats.max_shifts}
                </strong>
              </div>

              <div className={styles.employeeStats__item}>
                <span className={styles.employeeStats__label}>
                  Required rest
                </span>

                <strong className={styles.employeeStats__value}>
                  {employeeStats.min_rest_hours}h
                </strong>
              </div>
            </>
          ) : null}
        </div>
      )}

      {viewMode === "month" ? (
        <ScheduleCalendar
          calendarDays={calendarDays}
          DAYS_OF_WEEK={DAYS_OF_WEEK}
          onDayClick={(dateStr) => {
            const day = calendarDays.find((item) => item.dateStr === dateStr);

            if (day && day.isAccessible) {
              void handleDayClick(dateStr);
            }
          }}
        />
      ) : (
        <ScheduleWeekCalendar
          calendarDays={calendarDays}
          DAYS_OF_WEEK={DAYS_OF_WEEK}
          currentDate={currentDate}
          onShiftClick={handleManageShiftClick}
          onDayClick={(dateStr) => {
            void handleDayClick(dateStr);
          }}
          onAddShiftClick={
            isAdmin
              ? (dateStr: string): void => {
                  setModalDateStr(dateStr);
                  handleAddShiftClick(dateStr);
                }
              : undefined
          }
        />
      )}

      <DayShiftsModal
        isOpen={activeModal === "day"}
        onClose={() => setActiveModal("none")}
        dateStr={modalDateStr || getRelativeDateStr(0)}
        shifts={shiftsForCurrentModalDate}
        professions={modalProfessions}
        onAddShift={() => {
          if (isAdmin) handleAddShiftClick();
        }}
        onSelectShift={handleManageShiftClick}
        onEditShift={(shiftId) => {
          if (isAdmin) handleEditTemplateClick(shiftId);
        }}
        isReadOnly={isModalDatePast || !isAdmin}
      />

      <ManageShiftModal
        isOpen={activeModal === "manage"}
        onClose={() => {
          setActiveModal(viewMode === "month" ? "day" : "none");
        }}
        shiftDetails={selectedShiftForManage}
        assignedEmployees={visibleAssignedEmployees}
        allEmployees={employeesAvailableForModal}
        onRemoveEmployee={handleEmployeeRemove}
        onAddEmployee={handleEmployeeAdd}
        isReadOnly={isShiftReadOnly}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title={confirmConfig?.title || "Are you sure?"}
        description={confirmConfig?.description || ""}
        confirmText={confirmConfig?.confirmText || "Yes"}
        variant={confirmConfig?.variant || "primary"}
        onClose={closeConfirmation}
        onConfirm={confirmConfig?.action || (() => {})}
      />

      {isAdmin && (
        <CreateTemplateModal
          isOpen={activeModal === "template"}
          initialData={selectedTemplateData as any}
          onClose={() => {
            setSelectedTemplateData(null);

            setActiveModal("day");
          }}
          onSave={handleSaveTemplate as any}
        />
      )}

      {!isAdmin && activeModal === "manage" && selectedShiftData && (
        <span className={styles.employeeShiftStatus}>
          {isCurrentEmployeeAssigned
            ? "You are booked for this shift"
            : `${selectedShiftData.assigned_employees.length} of ${selectedShiftData.max_employees} places booked`}
        </span>
      )}
    </div>
  );
};

export default SchedulePage;
