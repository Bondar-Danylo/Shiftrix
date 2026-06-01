// Styles
import styles from "./UpcomingShiftCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Imports
import { useState, useMemo } from "react";

const UpcomingShiftCard = () => {
  const fakeData = [
    {
      shiftStart: "08:00",
      shiftEnd: "16:00",
      position: "Barista",
      status: "covered",
      name: "Sarah Johnson",
    },
    {
      shiftStart: "09:00",
      shiftEnd: "17:00",
      position: "Waiter",
      status: "covered",
      name: "Mike Chen",
    },
    {
      shiftStart: "17:00",
      shiftEnd: "23:00",
      position: "Chef",
      status: "uncovered",
      name: "",
    },
    {
      shiftStart: "17:00",
      shiftEnd: "01:00",
      position: "Bartender",
      status: "covered",
      name: "Emma Rodriguez",
    },
  ];

  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const positionOptions = useMemo(() => {
    const uniquePositions = Array.from(
      new Set(fakeData.map((shift) => shift.position)),
    );
    return ["All positions", ...uniquePositions];
  }, [fakeData]);

  const filteredShifts = useMemo(() => {
    if (!selectedPosition || selectedPosition === "All positions") {
      return fakeData;
    }
    return fakeData.filter((shift) => shift.position === selectedPosition);
  }, [selectedPosition, fakeData]);

  const handleSelectPosition = (position: string) => {
    setSelectedPosition(position === "All positions" ? null : position);
  };

  const getTimeUntilShift = (shiftStartStr: string): string => {
    const now: Date = new Date();
    const [hours, minutes]: number[] = shiftStartStr.split(":").map(Number);

    const shiftDate: Date = new Date();
    shiftDate.setHours(hours, minutes, 0, 0);

    if (shiftDate < now) {
      shiftDate.setDate(shiftDate.getDate() + 1);
    }

    const diffMs: number = shiftDate.getTime() - now.getTime();
    const diffHours: number = Math.round(diffMs / (1000 * 60 * 60));

    return `${diffHours}h`;
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
        getOptionLabel={(pos) => pos}
        renderOption={(pos) => <span>{pos}</span>}
        placeholder="Select a position"
        className={styles.dropdown}
      />

      {filteredShifts.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No upcoming shifts</p>
        </div>
      ) : (
        <ul className={styles.shiftsList}>
          {filteredShifts.map((shift, index) => (
            <li
              key={index}
              className={`${styles.shiftCard} ${shift.status === "uncovered" ? styles.uncovered : styles.covered}`}
            >
              <div className={styles.shiftLeft}>
                <div className={styles.shiftTime}>
                  {shift.shiftStart} - {shift.shiftEnd}
                </div>
                <span className={styles.position}>{shift.position}</span>
              </div>
              <div className={styles.shiftInfo}>
                <span
                  className={`${styles.workerName} ${
                    shift.status === "covered" ? "" : styles.notAssigned
                  }`}
                >
                  {shift.status === "covered" ? shift.name : "Not assigned"}
                </span>
                <span className={styles.timeUntil}>
                  in {getTimeUntilShift(shift.shiftStart)}
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
