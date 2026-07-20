// Imports
import React, { useState, useMemo } from "react";

// Styles
import styles from "./DayShiftsModal.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Icons
import ClockIcon from "@/assets/icons/clock_icon.svg?react";
import EmployeesIcon from "@/assets/icons/employees_icon.svg?react";
import CloseIcon from "@/assets/icons/reject_icon.svg?react";

// Types
import type {
  DayShiftsModalProps,
  ModalShiftItem,
  ProfessionFilterOption,
} from "./DayShiftsModal.types";

const DayShiftsModal: React.FC<DayShiftsModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  shifts,
  professions = [],
  onAddShift,
  onEditShift,
  onSelectShift,
  isReadOnly = false,
}) => {
  const [selectedFilterId, setSelectedFilterId] = useState<string>("all");
  const [prevDateStr, setPrevDateStr] = useState<string>(dateStr);

  const filterOptions = useMemo<
    ProfessionFilterOption[]
  >((): ProfessionFilterOption[] => {
    return [{ id: "all", label: "All" }, ...professions];
  }, [professions]);

  if (dateStr !== prevDateStr) {
    setPrevDateStr(dateStr);
    setSelectedFilterId("all");
  }

  const currentSelectedOption = useMemo((): ProfessionFilterOption => {
    return (
      filterOptions.find((opt) => opt.id === selectedFilterId) ||
      filterOptions[0]
    );
  }, [filterOptions, selectedFilterId]);

  const groupedShifts = useMemo((): Record<string, ModalShiftItem[]> => {
    return shifts.reduce<Record<string, ModalShiftItem[]>>((acc, shift) => {
      const shiftProf = shift.profession.toLowerCase();
      const currentFilter = selectedFilterId.toLowerCase();

      if (currentFilter !== "all" && shiftProf !== currentFilter) {
        return acc;
      }

      const displayProfName = shift.profession.toUpperCase();
      if (!acc[displayProfName]) acc[displayProfName] = [];

      acc[displayProfName].push(shift);
      return acc;
    }, {});
  }, [shifts, selectedFilterId]);

  if (!isOpen) return null;

  const formattedDate: string = new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{formattedDate}</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.filterWrapper}>
          <Dropdown<ProfessionFilterOption>
            options={filterOptions}
            value={currentSelectedOption}
            onSelect={(option) => setSelectedFilterId(option.id)}
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <span>{option.label}</span>}
            className={styles.profDropdown}
            placeholder="Filter by Profession"
          />
        </div>

        <div className={styles.modalBody}>
          {Object.keys(groupedShifts).length === 0 ? (
            <div className={styles.emptyState}>
              No shifts scheduled for this criteria.
            </div>
          ) : (
            Object.entries(groupedShifts).map(([profession, items]) => (
              <div key={profession} className={styles.profSection}>
                <h4 className={styles.profTitle}>{profession}</h4>
                <div className={styles.shiftsList}>
                  {items.map((shift) => (
                    <div
                      key={shift.id}
                      className={`${styles.shiftRow} ${styles.shiftRow_clickable}`}
                      onClick={() => onSelectShift(shift.id)}
                    >
                      <div className={styles.shiftInfo}>
                        <div className={styles.timeRow}>
                          <ClockIcon className={styles.clockIcon} />
                          <span className={styles.timeWindow}>
                            {shift.timeWindow}
                          </span>
                        </div>
                        <div className={styles.assignedRow}>
                          <EmployeesIcon className={styles.usersIcon} />
                          <span className={styles.assignedCount}>
                            {shift.assignedCount} assigned
                          </span>
                        </div>
                      </div>
                      <div className={styles.shiftActions}>
                        {shift.points && (
                          <span className={styles.pointsBadge}>
                            {shift.points} pts
                          </span>
                        )}

                        {!isReadOnly && (
                          <button
                            className={styles.editBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditShift(shift.id);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {!isReadOnly && (
          <div className={styles.modalFooter}>
            <Button
              className={styles.addShiftModalBtn}
              type="button"
              isLink={false}
              size="normal"
              onClick={onAddShift}
            >
              + Add Shift
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayShiftsModal;
