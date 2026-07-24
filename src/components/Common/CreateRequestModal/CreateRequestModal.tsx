// Imports
import { useCallback, useEffect, useMemo, useState } from "react";

// Styles
import styles from "./CreateRequestModal.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Icons
import CloseIcon from "@/assets/icons/reject_icon.svg?react";

// Types
import type {
  BookedShiftOption,
  BookedShiftsResponse,
  CreateRequestData,
  CreateRequestModalProps,
  RequestType,
  SwapEmployeeOption,
  SwapEmployeesResponse,
} from "./CreateRequestModal.types";

const initialFormData: CreateRequestData = {
  type: "dayoff",
  start_date: "",
  end_date: "",
  reason: "",
  shift_id: null,
  target_employee_id: null,
};

const CreateRequestModal = ({
  isOpen,
  userId,
  onClose,
  onSubmit,
}: CreateRequestModalProps) => {
  const [formData, setFormData] = useState<CreateRequestData>(initialFormData);
  const [bookedShifts, setBookedShifts] = useState<BookedShiftOption[]>([]);
  const [swapEmployees, setSwapEmployees] = useState<SwapEmployeeOption[]>([]);
  const [selectedShift, setSelectedShift] = useState<BookedShiftOption | null>(
    null,
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<SwapEmployeeOption | null>(null);
  const [isSwapDataLoading, setIsSwapDataLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSwapData = useCallback(async (): Promise<void> => {
    if (!userId) {
      return;
    }

    setIsSwapDataLoading(true);
    setError(null);

    try {
      const [shiftsResponse, employeesResponse] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_API_URL}/get_my_booked_shifts.php?user_id=${userId}`,
        ),

        fetch(
          `${import.meta.env.VITE_API_URL}/get_swap_candidates.php?user_id=${userId}`,
        ),
      ]);

      const shiftsData: BookedShiftsResponse = await shiftsResponse.json();

      const employeesData: SwapEmployeesResponse =
        await employeesResponse.json();

      if (!shiftsResponse.ok) {
        throw new Error(shiftsData.error || "Failed to load booked shifts");
      }

      if (!employeesResponse.ok) {
        throw new Error(employeesData.error || "Failed to load employees");
      }

      setBookedShifts(shiftsData.shifts || []);

      setSwapEmployees(employeesData.employees || []);
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : "Failed to load swap data";

      setError(message);
    } finally {
      setIsSwapDataLoading(false);
    }
  }, [userId]);

  useEffect((): void => {
    if (!isOpen) {
      return;
    }

    setFormData(initialFormData);
    setSelectedShift(null);
    setSelectedEmployee(null);
    setBookedShifts([]);
    setSwapEmployees([]);
    setError(null);
  }, [isOpen]);

  useEffect((): void => {
    if (!isOpen || formData.type !== "swap") {
      return;
    }

    void loadSwapData();
  }, [isOpen, formData.type, loadSwapData]);

  const availableEmployees = useMemo<SwapEmployeeOption[]>(() => {
    if (!selectedShift) {
      return swapEmployees;
    }

    return swapEmployees.filter(
      (employee) =>
        String(employee.position_id) === String(selectedShift.position_id),
    );
  }, [swapEmployees, selectedShift]);

  if (!isOpen) return null;

  // Handlers
  const handleTypeChange = (type: RequestType): void => {
    setFormData((previous) => ({
      ...previous,
      type,
      end_date: type === "dayoff" ? previous.start_date : previous.end_date,
      shift_id: null,
      target_employee_id: null,
    }));

    setSelectedShift(null);
    setSelectedEmployee(null);
    setError(null);
  };

  const handleShiftSelect = (shift: BookedShiftOption): void => {
    setSelectedShift(shift);
    setSelectedEmployee(null);

    setFormData((previous) => ({
      ...previous,
      shift_id: shift.id,
      target_employee_id: null,
      start_date: shift.date,
      end_date: shift.date,
    }));
  };

  const handleEmployeeSelect = (employee: SwapEmployeeOption): void => {
    setSelectedEmployee(employee);

    setFormData((previous) => ({
      ...previous,
      target_employee_id: employee.id,
    }));
  };

  const handleClose = (): void => {
    if (isSubmitting) return;

    onClose();
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!formData.start_date || !formData.reason.trim()) {
      setError("Please complete all required fields");

      return;
    }

    if (formData.type === "holiday" && !formData.end_date) {
      setError("Please select the holiday end date");

      return;
    }

    if (formData.type === "swap" && !formData.shift_id) {
      setError("Please select one of your booked shifts");

      return;
    }

    if (formData.type === "swap" && !formData.target_employee_id) {
      setError("Please select an employee");

      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onSubmit({
        ...formData,

        end_date:
          formData.type === "dayoff" ? formData.start_date : formData.end_date,

        reason: formData.reason.trim(),
      });
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : "Failed to create request";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={handleClose}>
      <div
        className={styles.modal}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Create Request</h2>

            <p className={styles.subtitle}>
              Submit a new request to your manager
            </p>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <CloseIcon />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.typeOptions}>
            <button
              type="button"
              className={`${styles.typeButton} ${
                formData.type === "dayoff" ? styles.typeButton_active : ""
              }`}
              onClick={() => handleTypeChange("dayoff")}
            >
              Day Off
            </button>

            <button
              type="button"
              className={`${styles.typeButton} ${
                formData.type === "holiday" ? styles.typeButton_active : ""
              }`}
              onClick={() => handleTypeChange("holiday")}
            >
              Holiday
            </button>

            <button
              type="button"
              className={`${styles.typeButton} ${
                formData.type === "swap" ? styles.typeButton_active : ""
              }`}
              onClick={() => handleTypeChange("swap")}
            >
              Shift Swap
            </button>
          </div>

          <div className={styles.fields}>
            {formData.type !== "swap" && (
              <label className={styles.field}>
                <span>Date</span>

                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      start_date: event.target.value,
                    }))
                  }
                  required
                />
              </label>
            )}

            {formData.type === "holiday" && (
              <label className={styles.field}>
                <span>End date</span>

                <input
                  type="date"
                  min={formData.start_date}
                  value={formData.end_date}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      end_date: event.target.value,
                    }))
                  }
                  required
                />
              </label>
            )}

            {formData.type === "swap" && (
              <>
                {isSwapDataLoading ? (
                  <div className={styles.swapLoading}>
                    Loading available shifts and employees...
                  </div>
                ) : (
                  <>
                    <div className={styles.field}>
                      <span>Your booked shift</span>

                      <Dropdown<BookedShiftOption>
                        options={bookedShifts}
                        value={selectedShift}
                        onSelect={handleShiftSelect}
                        getOptionLabel={(shift) =>
                          `${shift.date} · ${shift.start_time.substring(0, 5)}-${shift.end_time.substring(0, 5)} · ${shift.position_name}`
                        }
                        renderOption={(shift) => (
                          <div className={styles.shiftOption}>
                            <strong>{shift.title}</strong>

                            <span>
                              {shift.date}
                              {" · "}
                              {shift.start_time.substring(0, 5)}
                              {"-"}
                              {shift.end_time.substring(0, 5)}
                            </span>

                            <small>{shift.position_name}</small>
                          </div>
                        )}
                        placeholder="Select your shift..."
                        className={styles.dropdown}
                      />
                    </div>

                    <div className={styles.field}>
                      <span>Offer swap to</span>

                      <Dropdown<SwapEmployeeOption>
                        options={availableEmployees}
                        value={selectedEmployee}
                        onSelect={handleEmployeeSelect}
                        getOptionLabel={(employee) =>
                          `${employee.name} · ${employee.position_name}`
                        }
                        renderOption={(employee) => (
                          <div className={styles.employeeOption}>
                            <img
                              src={
                                employee.photo_url ||
                                `https://api.dicebear.com/10.x/avataaars/png?seed=${employee.id}`
                              }
                              alt={employee.name}
                            />

                            <div>
                              <strong>{employee.name}</strong>

                              <span>{employee.position_name}</span>
                            </div>
                          </div>
                        )}
                        placeholder={
                          selectedShift
                            ? "Select employee..."
                            : "Select shift first..."
                        }
                        className={styles.dropdown}
                      />

                      {selectedShift && availableEmployees.length === 0 && (
                        <p className={styles.fieldHint}>
                          No employees with the same profession are available.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            <label className={`${styles.field} ${styles.field_full}`}>
              <span>Reason</span>

              <textarea
                value={formData.reason}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    reason: event.target.value,
                  }))
                }
                rows={4}
                placeholder={
                  formData.type === "swap"
                    ? "Explain why you would like to swap this shift..."
                    : "Describe your request..."
                }
                required
              />
            </label>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button
              type="button"
              isLink={false}
              size="normal"
              onClick={handleClose}
              disabled={isSubmitting}
              className={styles.cancelBtn}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLink={false}
              size="normal"
              disabled={isSubmitting || isSwapDataLoading}
              className={styles.confirmBtn}
            >
              {isSubmitting ? "Creating..." : "Create Request"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;
