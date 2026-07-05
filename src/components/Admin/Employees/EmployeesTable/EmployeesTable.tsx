// Styles
import styles from "./EmployeesTable.module.scss";

// Icons
import EditIcon from "@/assets/icons/edit_icon.svg?react";
import MoreIcon from "@/assets/icons/more_icon.svg?react";
import WhatsappIcon from "@/assets/icons/whatsapp_icon.svg?react";

// Components
import CardLoader from "@/components/Common/Loader/Loader";
import EmployeeModal from "../EmployeeModal/EmployeeModal";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";

// Imports
import { useState } from "react";

// Types
import type { Employee, EmployeesTableProps } from "./EmployeeTable.types";

const EmployeesTable = ({
  employees,
  isLoading,
  pointsHistory = {},
  onEdit,
  onDelete,
}: EmployeesTableProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );

  const handleRowClick = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    setEmployeeToDelete(emp);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      onDelete(employeeToDelete.id);
      setIsDeleteConfirmOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const getStatusClass = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(" ", "_");

    const statusMap: Record<string, string> = {
      working: styles.statusWorking,
      vacation: styles.statusVacation,
      sick_leave: styles.statusSick,
      off: styles.statusDayOff,
      available: styles.statusAvailable,
    };

    return statusMap[normalizedStatus] || "";
  };

  if (isLoading) {
    return <CardLoader text="Loading employees table..." />;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>NAME & ROLE</th>
            <th>STATUS</th>
            <th>WHATSAPP</th>
            <th>POINTS</th>
            <th>WEEKLY HOURS</th>
            <th className={styles.alignRight}>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>
                <div className={styles.emptyStateContainer}>
                  <h3 className={styles.emptyTitle}>No employees found</h3>
                  <p className={styles.emptyText}>
                    We couldn't find any results matching your search or
                    filters.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            employees.map((emp) => {
              const isOverworked = emp.currentHours > emp.max_hours;
              const progressWidth = Math.min(
                (emp.currentHours / emp.max_hours) * 100,
                100,
              );

              const avatarCheck: string | undefined =
                `${import.meta.env.VITE_API_MAIN}/${emp.photo_url}`
                  .split("/")
                  .at(-1);

              return (
                <tr
                  key={emp.id}
                  onClick={() => handleRowClick(emp)}
                  className={styles.clickableRow}
                >
                  <td>
                    <div className={styles.userCell}>
                      <img
                        src={
                          avatarCheck != "null"
                            ? `${import.meta.env.VITE_API_MAIN}/${emp.photo_url}`
                            : `https://api.dicebear.com/10.x/avataaars/png?seed=${emp.id}`
                        }
                        alt={emp.name}
                        className={styles.avatar}
                      />
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{emp.name}</span>
                        <span className={styles.userRole}>
                          {emp.position_id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(emp.status)}`}
                    >
                      {emp.status.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    {emp.is_bot_connected ? (
                      <div className={`${styles.whatsapp} ${styles.connected}`}>
                        <WhatsappIcon />
                        <span>Connected</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.inviteBtn}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <WhatsappIcon />
                        <span>Send Invite</span>
                      </button>
                    )}
                  </td>

                  <td>
                    <span className={styles.points}>
                      <strong>{emp.points_balance}</strong> pts
                    </span>
                  </td>

                  <td>
                    <div className={styles.hoursContainer}>
                      <div className={styles.hoursText}>
                        <span
                          className={
                            isOverworked
                              ? styles.overworkedText
                              : styles.normalHoursText
                          }
                        >
                          {emp.currentHours}h
                        </span>
                        <span className={styles.maxHoursText}>
                          {" "}
                          / {emp.max_hours}h
                        </span>
                      </div>
                      <div className={styles.progressBarBg}>
                        <div
                          className={`${styles.progressBarFill} ${
                            isOverworked
                              ? styles.bgRed
                              : progressWidth === 100
                                ? styles.bgGreen
                                : styles.bgYellow
                          }`}
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className={styles.alignRight}>
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(emp);
                        }}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={(e) => handleDeleteClick(e, emp)}
                      >
                        <MoreIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <EmployeeModal
        isOpen={isModalOpen}
        employee={selectedEmployee}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onEdit={() => {
          if (selectedEmployee) {
            setIsModalOpen(false);
            onEdit(selectedEmployee);
          }
        }}
        pointsHistory={
          selectedEmployee ? pointsHistory[selectedEmployee.id] || [] : []
        }
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title={`Delete employee ${employeeToDelete?.name}?`}
        description="This action can not be undone"
        confirmText="Yes"
        cancelText="No"
        variant="danger"
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default EmployeesTable;
