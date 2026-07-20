import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  DbScheduledShift,
  DbTemplate,
  SchedulingRules,
} from "../SchedulePage.types";

import type { ShiftEmployee } from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal.types";

import { scheduleApi } from "../SchedulePage.api";
import { formatDateLocal } from "../SchedulePage.utils";

interface Profession {
  id: string;
  name: string;
}

interface EmployeeDto {
  id: string | number;
  name: string;
  position_id?: string | number;
  position?: string | number;
  avatar_url?: string | null;
  avatarUrl?: string | null;
}

interface UseScheduleDataParams {
  currentDate: Date;
}

interface UseScheduleDataResult {
  rules: SchedulingRules | null;
  rawProfessions: Profession[];
  templates: DbTemplate[];
  companyEmployees: ShiftEmployee[];
  scheduledShifts: DbScheduledShift[];
  isLoading: boolean;

  setTemplates: Dispatch<SetStateAction<DbTemplate[]>>;

  setScheduledShifts: Dispatch<
    SetStateAction<DbScheduledShift[]>
  >;

  loadTemplates: () => Promise<void>;
  loadShifts: () => Promise<void>;
}

const DEFAULT_RULES: SchedulingRules = {
  advance_period: "2_weeks",
  early_access: "2_months",
  max_shifts: 6,
  min_hours: 11,
  allow_overtime: 1,
  auto_balance: 0,
};

function getScheduleRange(currentDate: Date): {
  start: string;
  end: string;
} {
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  const startOfWeekOffset =
    firstDayOfMonth.getDay() === 0
      ? 6
      : firstDayOfMonth.getDay() - 1;

  const gridStartDate = new Date(firstDayOfMonth);

  gridStartDate.setDate(
    firstDayOfMonth.getDate() - startOfWeekOffset,
  );

  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const futureLimit = new Date(lastDayOfMonth);

  futureLimit.setMonth(
    futureLimit.getMonth() + 2,
  );

  const endOfWeekOffset =
    futureLimit.getDay() === 0
      ? 0
      : 7 - futureLimit.getDay();

  futureLimit.setDate(
    futureLimit.getDate() + endOfWeekOffset,
  );

  return {
    start: formatDateLocal(gridStartDate),
    end: formatDateLocal(futureLimit),
  };
}

function mapScheduledShifts(
  shifts: DbScheduledShift[],
): DbScheduledShift[] {
  return shifts.map((shift) => ({
    ...shift,

    points_cost:
      shift.points_cost ??
      Number(shift.points) ??
      30,

    assigned_employees:
      shift.assigned_employees ?? [],
  }));
}

function mapEmployees(
  employees: EmployeeDto[],
  professions: Profession[],
): ShiftEmployee[] {
  return employees.map((employee) => {
    const employeePositionId =
      employee.position_id ?? employee.position;

    const matchedPosition = professions.find(
      (profession) =>
        String(profession.id) ===
        String(employeePositionId),
    );

    return {
      id: String(employee.id),
      name: employee.name,

      role:
        matchedPosition?.name ??
        "Employee",

      avatarUrl:
        employee.avatar_url ??
        employee.avatarUrl ??
        `https://api.dicebear.com/10.x/avataaars/png?seed=${employee.id}`,
    };
  });
}

export function useScheduleData({
  currentDate,
}: UseScheduleDataParams): UseScheduleDataResult {
  const [rules, setRules] =
    useState<SchedulingRules | null>(null);

  const [rawProfessions, setRawProfessions] =
    useState<Profession[]>([]);

  const [templates, setTemplates] =
    useState<DbTemplate[]>([]);

  const [companyEmployees, setCompanyEmployees] =
    useState<ShiftEmployee[]>([]);

  const [scheduledShifts, setScheduledShifts] =
    useState<DbScheduledShift[]>([]);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const loadTemplates = useCallback(
    async (): Promise<void> => {
      try {
        const data =
          await scheduleApi.getTemplates();

        setTemplates(
          Array.isArray(data) ? data : [],
        );
      } catch (error: unknown) {
        console.error(
          "Error loading templates:",
          error,
        );
      }
    },
    [],
  );

  const loadShifts = useCallback(
    async (): Promise<void> => {
      const { start, end } =
        getScheduleRange(currentDate);

      setIsLoading(true);

      try {
        await scheduleApi.generateShifts(
          start,
          end,
        );

        const data =
          await scheduleApi.getShifts(
            start,
            end,
          );

        if (!Array.isArray(data)) {
          setScheduledShifts([]);
          return;
        }

        setScheduledShifts(
          mapScheduledShifts(data),
        );
      } catch (error: unknown) {
        console.error(
          "Error loading shifts:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [currentDate],
  );

  useEffect(() => {
    const loadInitialData =
      async (): Promise<void> => {
        setIsLoading(true);

        try {
          const [
            rulesData,
            professionsData,
            templatesData,
            employeesResponse,
          ] = await Promise.all([
            scheduleApi
              .getRules()
              .catch(() => DEFAULT_RULES),

            scheduleApi
              .getProfessions()
              .catch(() => []),

            scheduleApi
              .getTemplates()
              .catch(() => []),

            scheduleApi
              .getEmployees()
              .catch(() => ({
                employees: [],
              })),
          ]);

          const safeProfessions =
            Array.isArray(professionsData)
              ? professionsData
              : [];

          setRules(rulesData);
          setRawProfessions(safeProfessions);

          setTemplates(
            Array.isArray(templatesData)
              ? templatesData
              : [],
          );

          const employees =
            Array.isArray(employeesResponse?.employees)
              ? (employeesResponse.employees as EmployeeDto[])
              : [];

          setCompanyEmployees(
            mapEmployees(
              employees,
              safeProfessions,
            ),
          );

          await loadShifts();
        } catch (error: unknown) {
          console.error(
            "Failed to fetch initial schedule data:",
            error,
          );

          setIsLoading(false);
        }
      };

    void loadInitialData();
  }, [loadShifts]);

  return {
    rules,
    rawProfessions,
    templates,
    companyEmployees,
    scheduledShifts,
    isLoading,
    setTemplates,
    setScheduledShifts,
    loadTemplates,
    loadShifts,
  };
}