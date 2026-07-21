// Styles
import styles from "./UpcomingShiftCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Types
import type {
  UpcomingShift,
  UpcomingShiftsResponse,
} from "./UpcomingShiftCard.types";

// Imports
import { useEffect, useMemo, useState } from "react";

const UpcomingShiftCard = () => {
  const [shifts, setShifts] = useState<UpcomingShift[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    const loadUpcomingShifts = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/get_upcoming_shifts.php`,
        );

        const data: UpcomingShiftsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load upcoming shifts");
        }

        setShifts(Array.isArray(data.shifts) ? data.shifts : []);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        setError(message);
        setShifts([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUpcomingShifts();
  }, []);

  const positionOptions = useMemo((): string[] => {
    const uniquePositions = Array.from(
      new Set(shifts.map((shift) => shift.position)),
    );

    return ["All positions", ...uniquePositions];
  }, [shifts]);

  const filteredShifts = useMemo((): UpcomingShift[] => {
    if (!selectedPosition || selectedPosition === "All positions") {
      return shifts;
    }

    return shifts.filter((shift) => shift.position === selectedPosition);
  }, [selectedPosition, shifts]);

  const handleSelectPosition = (position: string): void => {
    setSelectedPosition(position === "All positions" ? null : position);
  };

  const formatTimeUntilShift = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours: number = Math.floor(minutes / 60);
    const remainingMinutes: number = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <CardLayout
      title="Upcoming Shifts"
      subtitle="Next 24 hours"
      className={styles.wrapper}
    >
      <Dropdown
        options={positionOptions}
        value={selectedPosition || "All positions"}
        onSelect={handleSelectPosition}
        getOptionLabel={(position) => position}
        renderOption={(position) => <span>{position}</span>}
        placeholder="Select a position"
        className={styles.dropdown}
      />

      {isLoading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Loading shifts...</p>
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>{error}</p>
        </div>
      ) : filteredShifts.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No upcoming shifts</p>
        </div>
      ) : (
        <ul className={styles.shiftsList}>
          {filteredShifts.map((shift) => (
            <li
              key={shift.id}
              className={`${styles.shiftCard} ${
                shift.status === "uncovered" ? styles.uncovered : styles.covered
              }`}
            >
              <div className={styles.shiftLeft}>
                <div className={styles.shiftTime}>
                  {shift.shift_start} - {shift.shift_end}
                </div>

                <span className={styles.position}>{shift.position}</span>
              </div>

              <div className={styles.shiftInfo}>
                <span
                  className={`${styles.workerName} ${
                    shift.status === "covered" ? "" : styles.notAssigned
                  }`}
                >
                  {shift.employee_names ? shift.employee_names : "Not assigned"}
                </span>

                <span className={styles.timeUntil}>
                  in {formatTimeUntilShift(shift.minutes_until)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardLayout>
  );
};

export default UpcomingShiftCard;
