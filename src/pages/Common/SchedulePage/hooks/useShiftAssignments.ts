// Imports
import {
  useCallback,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

// Types
import type {
  DbScheduledShift,
  SchedulingRules,
} from "../SchedulePage.types";
import type { ShiftEmployee } from "@/components/Common/SchedulePage/ManageShiftModal/ManageShiftModal.types";
import type { BookingRange } from "./useBookingRange";

// API
import { scheduleApi } from "../SchedulePage.api";

// Utils
import { formatDateLocal } from "../SchedulePage.utils";
import { validateEmployeeAssignment } from "../SchedulePage.validation";

// Interfaces
export interface ConfirmConfig {
  title: string;
  description: string;
  confirmText: string;
  variant: "primary" | "danger";
  action: () => void | Promise<void>;
}

interface UseShiftAssignmentsParams {
  rules: SchedulingRules | null;
  bookingRange: BookingRange;
  activeScheduledShifts: DbScheduledShift[];
  selectedShiftId: number | null;
  setScheduledShifts: Dispatch<
    SetStateAction<DbScheduledShift[]>
  >;
}

interface UseShiftAssignmentsResult {
  isConfirmOpen: boolean;
  isAssignmentProcessing: boolean;
  confirmConfig: ConfirmConfig | null;

  closeConfirmation: () => void;
  addEmployee: (employee: ShiftEmployee) => void;
  removeEmployee: (employeeId: string | number) => void;
}

function getEstimatedEarlyAccessCost(shift: DbScheduledShift): number {
  return (
    shift.points_cost ??
    30 + shift.assigned_employees.length * 5
  );
}

export function useShiftAssignments({
  rules,
  bookingRange,
  activeScheduledShifts,
  selectedShiftId,
  setScheduledShifts,
}: UseShiftAssignmentsParams): UseShiftAssignmentsResult {
  const [isConfirmOpen, setIsConfirmOpen] =
    useState<boolean>(false);

  const [
    isAssignmentProcessing,
    setIsAssignmentProcessing,
  ] = useState<boolean>(false);

  const [confirmConfig, setConfirmConfig] =
    useState<ConfirmConfig | null>(null);

  const closeConfirmation =
    useCallback((): void => {
      if (isAssignmentProcessing) {
        return;
      }

      setIsConfirmOpen(false);
      setConfirmConfig(null);
    }, [isAssignmentProcessing]);

  const addEmployee = useCallback(
    (newEmployee: ShiftEmployee): void => {
      if (
        selectedShiftId === null ||
        !rules ||
        isAssignmentProcessing
      ) {
        return;
      }

      const targetShift: DbScheduledShift | undefined =
        activeScheduledShifts.find(
          (shift) =>
            shift.id === selectedShiftId,
        );

      if (!targetShift) {
        alert("Selected shift was not found.");
        return;
      }

      const validation =
        validateEmployeeAssignment({
          employee: newEmployee,
          targetShift,
          allShifts: activeScheduledShifts,
          minRestHours: Number(rules.min_hours),
          maxShiftsPerWeek: Number(rules.max_shifts),
        });

      if (!validation.isValid) {
        alert(validation.errorMessage || "Employee cannot be assigned.");
        return;
      }

      const targetDate: Date = new Date(targetShift.date);

      targetDate.setHours(0, 0, 0, 0);

      const isEarlyAccess: boolean = targetDate > bookingRange.freeMaxDate;
      const estimatedPointCost: number = isEarlyAccess ? getEstimatedEarlyAccessCost(targetShift) : 0;

      const createAssignedEmployee = (assignmentId?: number) => ({
        id: String(newEmployee.id),
        name: newEmployee.name,
        role: newEmployee.role,
        avatarUrl: newEmployee.avatarUrl ?? null,
        avatar_url: newEmployee.avatarUrl ?? null,
        assignment_id: assignmentId,
        status: "assigned" as const,
      });

      if (isEarlyAccess) {
        setConfirmConfig({
          title: "Confirm Early Access Booking",
          description:
            `This booking is expected to cost ` +
            `${estimatedPointCost} points. ` +
            "The final cost will be calculated by the server.",
          confirmText: "Book",
          variant: "primary",

          action: async (): Promise<void> => {
            if (isAssignmentProcessing) {
              return;
            }

            setIsAssignmentProcessing(true);

            try {
              const data =
                await scheduleApi
                  .assignEmployeeWithEarlyAccess(
                    selectedShiftId,
                    newEmployee.id,
                  );

              const employeeToAdd = createAssignedEmployee(data.assignment_id);

              setScheduledShifts(
                (previousShifts) =>
                  previousShifts.map(
                    (shift) => {
                      if (shift.id !== selectedShiftId) {
                        return shift;
                      }

                      return {
                        ...shift,

                        assigned_employees: [
                          ...shift.assigned_employees,
                          employeeToAdd,
                        ],

                        points_cost:
                          data.next_points_cost ??
                          shift.points_cost,
                      };
                    },
                  ),
              );

              setIsConfirmOpen(false);
              setConfirmConfig(null);

              if (data.charged_points !== undefined) {
                console.info(
                  `${data.charged_points} points deducted. ` +
                    `New balance: ${data.new_balance ?? "unknown"}.`,
                );
              }
            } catch (error: unknown) {
              const message: string =
                error instanceof Error
                  ? error.message
                  : String(error);

              alert(message);
            } finally {
              setIsAssignmentProcessing(
                false,
              );
            }
          },
        });

        setIsConfirmOpen(true);
        return;
      }

      setConfirmConfig({
        title: "Assign Employee",
        description:
          `Assign ${newEmployee.name} ` +
          "to this shift?",
        confirmText: "Assign",
        variant: "primary",

        action: async (): Promise<void> => {
          if (isAssignmentProcessing) {
            return;
          }

          setIsAssignmentProcessing(true);

          try {
            const data =
              await scheduleApi.assignEmployee(
                selectedShiftId,
                newEmployee.id,
              );

            const employeeToAdd = createAssignedEmployee(data.assignment_id);

            setScheduledShifts(
              (previousShifts) =>
                previousShifts.map(
                  (shift) => {
                    if (
                      shift.id !==
                      selectedShiftId
                    ) {
                      return shift;
                    }

                    return {
                      ...shift,

                      assigned_employees: [
                        ...shift.assigned_employees,
                        employeeToAdd,
                      ],

                      points_cost:
                        data.next_points_cost ??
                        shift.points_cost,
                    };
                  },
                ),
            );

            setIsConfirmOpen(false);
            setConfirmConfig(null);
          } catch (error: unknown) {
            const message: string =
              error instanceof Error
                ? error.message
                : String(error);

            alert(message);
          } finally {
            setIsAssignmentProcessing(
              false,
            );
          }
        },
      });

      setIsConfirmOpen(true);
    },
    [
      selectedShiftId,
      rules,
      activeScheduledShifts,
      bookingRange.freeMaxDate,
      setScheduledShifts,
      isAssignmentProcessing,
    ],
  );

  const removeEmployee = useCallback((employeeId: string | number): void => {
      if (selectedShiftId === null || isAssignmentProcessing) {
        return;
      }

      const targetShift: DbScheduledShift | undefined =
        activeScheduledShifts.find(
          (shift) =>
            shift.id === selectedShiftId,
        );

      if (!targetShift) {
        alert("Selected shift was not found.");
        return;
      }

      if (targetShift.date < formatDateLocal(new Date())) {
        alert("You cannot modify past shifts.");
        return;
      }

      setConfirmConfig({
        title: "Remove Employee",
        description:
          "Are you sure you want to remove " +
          "this employee from this shift?",
        confirmText: "Remove",
        variant: "danger",

        action: async (): Promise<void> => {
          if (isAssignmentProcessing) {
            return;
          }

          setIsAssignmentProcessing(true);

          try {
            const data =
              await scheduleApi
                .unassignEmployee(
                  selectedShiftId,
                  employeeId,
                );

            setScheduledShifts(
              (previousShifts) =>
                previousShifts.map(
                  (shift) => {
                    if (
                      shift.id !==
                      selectedShiftId
                    ) {
                      return shift;
                    }

                    const updatedEmployees =
                      shift.assigned_employees.filter(
                        (employee) =>
                          String(
                            employee.id,
                          ) !==
                          String(employeeId),
                      );

                    return {
                      ...shift,
                      assigned_employees: updatedEmployees,
                      points_cost:
                        data.next_points_cost ??
                        shift.points_cost,
                    };
                  },
                ),
            );

            setIsConfirmOpen(false);
            setConfirmConfig(null);

            if (data.refunded_points && data.refunded_points > 0) {
              console.info(
                `${data.refunded_points} points refunded. ` +
                  `New balance: ${data.new_balance ?? "unknown"}.`,
              );
            }
          } catch (error: unknown) {
            const message: string =
              error instanceof Error
                ? error.message
                : String(error);

            alert(message);
          } finally {
            setIsAssignmentProcessing(
              false,
            );
          }
        },
      });

      setIsConfirmOpen(true);
    },
    [
      selectedShiftId,
      activeScheduledShifts,
      setScheduledShifts,
      isAssignmentProcessing,
    ],
  );

  return {
    isConfirmOpen,
    isAssignmentProcessing,
    confirmConfig,
    closeConfirmation,
    addEmployee,
    removeEmployee,
  };
}