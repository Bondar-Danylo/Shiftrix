// Imports
import React, { useState, useMemo, useCallback } from "react";

// Styles
import styles from "./ManageShiftModal.module.scss";

// Icons
import CloseIcon from "@/assets/icons/reject_icon.svg?react";
import ClockIcon from "@/assets/icons/clock_icon.svg?react";
import TrashIcon from "@/assets/icons/delete_icon.svg?react";

// Components
import Button from "@/components/Common/Button/Button";
import Search from "@/components/Common/Search/Search";

// Types
import type {
  ManageShiftModalProps,
  ShiftEmployee,
} from "./ManageShiftModal.types";

const MOCK_COMPANY_EMPLOYEES: ShiftEmployee[] = [
  {
    id: "sarah",
    name: "Sarah Johnson",
    role: "Senior Server",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  },
  {
    id: "mike",
    name: "Mike Chen",
    role: "Head Chef",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
  {
    id: "james",
    name: "James Wilson",
    role: "Kitchen Assistant",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  },
];

const ManageShiftModal: React.FC<ManageShiftModalProps> = ({
  isOpen,
  onClose,
  shiftDetails,
  assignedEmployees,
  onRemoveEmployee,
  onAddEmployee,
}) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchDebounced = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const availableToSearch = useMemo((): ShiftEmployee[] => {
    return MOCK_COMPANY_EMPLOYEES.filter(
      (emp) =>
        !assignedEmployees.some((assigned) => assigned.id === emp.id) &&
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [assignedEmployees, searchQuery]);

  if (!isOpen || !shiftDetails) return null;

  const formattedDate: string = new Date(
    shiftDetails.dateStr,
  ).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSelectEmployee = (emp: ShiftEmployee): void => {
    onAddEmployee(emp);
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleCancelSearch = (): void => {
    setIsSearching(false);
    setSearchQuery("");
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Manage Shift</h3>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.shiftMeta}>
          <div className={styles.metaRow}>
            <div className={styles.timeInfo}>
              <ClockIcon className={styles.icon} />
              <span className={styles.timeText}>{shiftDetails.timeWindow}</span>
            </div>
            {shiftDetails.points && (
              <span className={styles.pointsBadge}>
                {shiftDetails.points} pts
              </span>
            )}
          </div>
          <p className={styles.dateText}>{formattedDate}</p>
          <p className={styles.roleText}>Role: {shiftDetails.profession}</p>
        </div>

        <div className={styles.modalBody}>
          <h4 className={styles.sectionTitle}>
            Assigned Employees ({assignedEmployees.length})
          </h4>

          <div className={styles.employeeList}>
            {assignedEmployees.map((emp) => (
              <div key={emp.id} className={styles.employeeCard}>
                <div className={styles.empInfo}>
                  <img
                    src={emp.avatarUrl || "https://via.placeholder.com/40"}
                    alt={emp.name}
                    className={styles.avatar}
                  />
                  <div>
                    <p className={styles.empName}>{emp.name}</p>
                    <p className={styles.empRole}>{emp.role}</p>
                  </div>
                </div>
                <button
                  className={styles.deleteBtn}
                  onClick={() => onRemoveEmployee(emp.id)}
                  aria-label="Remove employee"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
          {!isSearching ? (
            <button
              className={styles.addEmployeeTrigger}
              onClick={() => setIsSearching(true)}
            >
              + Add Employee
            </button>
          ) : (
            <div className={styles.searchContainer}>
              <p className={styles.searchLabel}>Search employees</p>

              <Search
                onChangeDebounced={handleSearchDebounced}
                placeholder="Type a name..."
                value={searchQuery}
                debounceDelay={250}
              />

              <div className={styles.searchResults}>
                {availableToSearch.length === 0 ? (
                  <p className={styles.noResults}>No employees found</p>
                ) : (
                  availableToSearch.map((emp) => (
                    <div key={emp.id} className={styles.searchResultRow}>
                      <div className={styles.empInfo}>
                        <img
                          src={emp.avatarUrl}
                          alt={emp.name}
                          className={styles.avatar}
                        />
                        <div>
                          <p className={styles.empName}>{emp.name}</p>
                          <p className={styles.empRole}>{emp.role}</p>
                        </div>
                      </div>
                      <button
                        className={styles.addButton}
                        onClick={() => handleSelectEmployee(emp)}
                      >
                        +
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                className={styles.cancelSearchBtn}
                onClick={handleCancelSearch}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <Button
            className={styles.doneBtn}
            type="button"
            isLink={false}
            size="normal"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageShiftModal;
