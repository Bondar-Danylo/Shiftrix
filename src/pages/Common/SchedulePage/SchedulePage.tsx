// Imports
import React, { useState, useMemo, useCallback } from "react";

// Styles
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
  ProfessionOption,
  TemplateShiftData,
  DbTemplate,
  DbScheduledShift,
} from "./SchedulePage.types";
import type { ModalShiftItem } from "@/components/Common/SchedulePage/DayShiftsModal/DayShiftsModal.types";
import type { ShiftEmployee } from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal.types";
type ActiveScheduleModal = "none" | "day" | "manage" | "template";

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

const SchedulePage: React.FC = () => {
  // States
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

  // Modals management
  const [selectedDateStr, setSelectedDateStr] = useState<string>("");
  const [modalDateStr, setModalDateStr] = useState<string>("");

  const [selectedShiftIdForManage, setSelectedShiftIdForManage] = useState<
    number | null
  >(null);

  const [selectedTemplateData, setSelectedTemplateData] =
    useState<TemplateShiftData | null>(null);

  const [activeModal, setActiveModal] = useState<ActiveScheduleModal>("none");

  // Memos
  const isModalDatePast = useMemo((): boolean => {
    if (!modalDateStr) return false;
    const todayStr = formatDateLocal(new Date());
    return modalDateStr < todayStr;
  }, [modalDateStr]);

  const isShiftReadOnly = useMemo((): boolean => {
    if (selectedShiftIdForManage === null) return false;
    const shift = scheduledShifts.find(
      (s) => s.id === selectedShiftIdForManage,
    );
    if (!shift) return false;
    const todayStr = formatDateLocal(new Date());
    return shift.date < todayStr;
  }, [selectedShiftIdForManage, scheduledShifts]);

  const selectedShiftForManage = useMemo(() => {
    if (selectedShiftIdForManage === null) return null;
    const shift = scheduledShifts.find(
      (s) => s.id === selectedShiftIdForManage,
    );
    if (!shift) return null;

    const professionName =
      rawProfessions.find((p) => String(p.id) === String(shift.position_id))
        ?.name || shift.position_id;

    return {
      id: String(shift.id),
      timeWindow: `${shift.start_time.substring(0, 5)} - ${shift.end_time.substring(0, 5)}`,
      points: shift.points,
      dateStr: shift.date,
      profession: professionName,
    };
  }, [selectedShiftIdForManage, scheduledShifts, rawProfessions]);

  const assignedEmployeesForCurrentShift = useMemo<ShiftEmployee[]>(() => {
    if (selectedShiftIdForManage === null) return [];
    const shift = scheduledShifts.find(
      (s) => s.id === selectedShiftIdForManage,
    );
    if (!shift) return [];

    return shift.assigned_employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      role:
        rawProfessions.find((p) => String(p.id) === String(emp.role))?.name ||
        emp.role,
      avatarUrl:
        emp.avatarUrl ||
        `https://api.dicebear.com/10.x/avataaars/png?seed=${emp.id}`,
    }));
  }, [scheduledShifts, selectedShiftIdForManage, rawProfessions]);

  const professionOptions = useMemo<ProfessionOption[]>(() => {
    const apiOptions = rawProfessions.map((p) => ({
      id: String(p.id),
      label: p.name,
    }));
    return [{ id: "all", label: "All Professions" }, ...apiOptions];
  }, [rawProfessions]);

  const modalProfessions = useMemo(() => {
    return rawProfessions.map((p) => ({ id: String(p.id), label: p.name }));
  }, [rawProfessions]);

  const activeScheduledShifts = useMemo((): DbScheduledShift[] => {
    return scheduledShifts.filter((shift) => {
      if (!shift.template_id) return false;
      return templates.some((t) => String(t.id) === String(shift.template_id));
    });
  }, [scheduledShifts, templates]);

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
    scheduledShifts: activeScheduledShifts,
    bookingRange,
  });

  const shiftsForCurrentModalDate = useMemo<ModalShiftItem[]>(() => {
    return activeScheduledShifts
      .filter((shift) => shift.date === modalDateStr)
      .map((shift) => {
        const professionName =
          rawProfessions.find((p) => String(p.id) === String(shift.position_id))
            ?.name || shift.position_id;
        return {
          id: String(shift.id),
          name: shift.template_title || `${professionName} Shift`,
          timeWindow: `${shift.start_time.substring(0, 5)} - ${shift.end_time.substring(0, 5)}`,
          assignedCount: shift.assigned_employees.length,
          maxCount: shift.max_employees,
          profession: professionName,
          points: shift.points,
        };
      });
  }, [modalDateStr, activeScheduledShifts, rawProfessions]);

  // Handlers

  const handleDayClick = useCallback(
    async (dateStr: string) => {
      setSelectedDateStr(dateStr);
      setModalDateStr(dateStr);

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
    [templates, scheduledShifts, loadTemplates, loadShifts],
  );

  const handleEditTemplateClick = useCallback(
    (shiftId: string): void => {
      const foundShift: DbScheduledShift | undefined =
        activeScheduledShifts.find((s) => String(s.id) === shiftId);
      if (foundShift) {
        const matchingTemplate: DbTemplate | undefined = templates.find(
          (t) => String(t.id) === String(foundShift.template_id),
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
      }
    },
    [activeScheduledShifts, templates],
  );

  const handleAddShiftClick = useCallback(
    (dateStr?: string): void => {
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
    [rawProfessions, modalDateStr],
  );

  const handleManageShiftClick = useCallback(
    (shiftId: string | number): void => {
      const numericId = Number(shiftId);
      const foundShift = activeScheduledShifts.find((s) => s.id === numericId);
      if (foundShift) {
        setSelectedShiftIdForManage(foundShift.id);
        setActiveModal("manage");
      }
    },
    [activeScheduledShifts],
  );

  const handleSaveTemplate = async (
    templateData: TemplateShiftData,
  ): Promise<void> => {
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

  if (isLoading) return <CardLoader text="Loading schedule..." />;

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
      />

      {viewMode === "month" ? (
        <ScheduleCalendar
          calendarDays={calendarDays}
          DAYS_OF_WEEK={DAYS_OF_WEEK}
          onDayClick={(dateStr) => {
            const day = calendarDays.find((d) => d.dateStr === dateStr);
            if (day && day.isAccessible) handleDayClick(dateStr);
          }}
        />
      ) : (
        <ScheduleWeekCalendar
          calendarDays={calendarDays}
          DAYS_OF_WEEK={DAYS_OF_WEEK}
          currentDate={currentDate}
          onShiftClick={handleManageShiftClick}
          onDayClick={(dateStr) => handleDayClick(dateStr)}
          onAddShiftClick={(dateStr) => {
            setModalDateStr(dateStr);
            handleAddShiftClick(dateStr);
          }}
        />
      )}

      <DayShiftsModal
        isOpen={activeModal === "day"}
        onClose={() => setActiveModal("none")}
        dateStr={modalDateStr || getRelativeDateStr(0)}
        shifts={shiftsForCurrentModalDate}
        professions={modalProfessions}
        onAddShift={() => handleAddShiftClick()}
        onSelectShift={handleManageShiftClick}
        onEditShift={handleEditTemplateClick}
        isReadOnly={isModalDatePast}
      />

      <ManageShiftModal
        isOpen={activeModal === "manage"}
        onClose={() => {
          setActiveModal(viewMode === "month" ? "day" : "none");
        }}
        shiftDetails={selectedShiftForManage}
        assignedEmployees={assignedEmployeesForCurrentShift}
        allEmployees={companyEmployees}
        onRemoveEmployee={removeEmployee}
        onAddEmployee={addEmployee}
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

      <CreateTemplateModal
        isOpen={activeModal === "template"}
        initialData={selectedTemplateData as any}
        onClose={() => {
          setSelectedTemplateData(null);
          setActiveModal("day");
        }}
        onSave={handleSaveTemplate as any}
      />
    </div>
  );
};

export default SchedulePage;
