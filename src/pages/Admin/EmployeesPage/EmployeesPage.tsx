// Styles
import styles from "./EmployeesPage.module.scss";

// Components
import Search from "@/components/Common/Search/Search";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import Button from "@/components/Common/Button/Button";
import EmployeesTable from "@/components/Admin/Employees/EmployeesTable/EmployeesTable";
import AddEmployeeModal from "@/components/Admin/Employees/AddEmployeeModal/AddEmployeeModal";

// Types
import type { Employee } from "@/components/Admin/Employees/EmployeesTable/EmployeeTable.types";
import type { NewEmployeeData } from "@/components/Admin/Employees/AddEmployeeModal/AddEmployeeModal.types";
import type {
  DictionaryItem,
  PointTransaction,
} from "@/pages/Admin/EmployeesPage/EmployeesPage.types";

// Imports
import { useCallback, useState, useEffect } from "react";

const EmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statuses, setStatuses] = useState<DictionaryItem[]>([]);
  const [roles, setRoles] = useState<DictionaryItem[]>([]);
  const [rawEmployees, setRawEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [selectedRole, setSelectedRole] = useState<DictionaryItem>({
    id: "all",
    name: "All Roles",
  });
  const [selectedStatus, setSelectedStatus] = useState<DictionaryItem>({
    id: "all",
    name: "Status",
  });
  const [selectedWhatsapp, setSelectedWhatsapp] = useState({
    value: "all",
    label: "WhatsApp",
  });
  const [pointsHistory, setPointsHistory] = useState<
    Record<string | number, any[]>
  >({});

  useEffect((): void => {
    const loadFiltersData = async (): Promise<void> => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/get_dictionaries.php`,
        );
        const data = await response.json();
        setRoles([{ id: "all", name: "All Roles" }, ...data.roles]);
        setStatuses([{ id: "all", name: "Status" }, ...data.statuses]);
      } catch (error) {
        console.error("Failed to load filters:", error);
      }
    };
    loadFiltersData();
  }, []);

  const fetchEmployees = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [empResponse, pointsResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/get_employees.php`),
        fetch(`${import.meta.env.VITE_API_URL}/get_points_history.php`),
      ]);

      const empData = await empResponse.json();
      const pointsData = await pointsResponse.json();

      if (empData && Array.isArray(empData.employees)) {
        setRawEmployees(empData.employees);
      } else {
        console.error("Employees not found:", empData);
        setRawEmployees([]);
      }

      if (pointsData && Array.isArray(pointsData.history)) {
        const grouped = pointsData.history.reduce(
          (
            acc: Record<string | number, any[]>,
            transaction: PointTransaction,
          ) => {
            const userId = transaction.user_id;
            if (!acc[userId]) {
              acc[userId] = [];
            }

            acc[userId].push({
              id: transaction.id,
              user_id: transaction.user_id,
              amount: transaction.amount,
              title: transaction.reason,
              date: transaction.created_at,
              type: transaction.action_type,
            });

            return acc;
          },
          {},
        );
        setPointsHistory(grouped);
      } else {
        setPointsHistory({});
      }
    } catch (err) {
      console.error("Error loading employees or points history", err);
      setRawEmployees([]);
      setPointsHistory({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect((): void => {
    fetchEmployees();
  }, []);

  useEffect((): void => {
    const filtered = rawEmployees.filter((emp): boolean => {
      const matchesSearch: boolean =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole: boolean =
        selectedRole.id === "all" || emp.position_id == selectedRole.id;

      const matchesStatus: boolean =
        selectedStatus.id === "all" || emp.status === selectedStatus.id;

      const matchesWhatsapp: boolean =
        selectedWhatsapp.value === "all" ||
        (selectedWhatsapp.value === "connected" && emp.is_bot_connected) ||
        (selectedWhatsapp.value === "disconnected" && !emp.is_bot_connected);

      return matchesSearch && matchesRole && matchesStatus && matchesWhatsapp;
    });
    setFilteredEmployees(filtered);
  }, [
    searchQuery,
    selectedRole,
    selectedStatus,
    selectedWhatsapp,
    rawEmployees,
  ]);

  const handleSearch = useCallback((value: string): void => {
    setSearchQuery(value);
  }, []);

  const handleModalClose = (): void => {
    setIsAddModalOpen(false);
    setEmployeeToEdit(null);
  };

  const handleOpenEditModal = (emp: Employee): void => {
    setEmployeeToEdit(emp);
    setIsAddModalOpen(true);
  };

  const handleDeleteEmployee = async (id: string | number): Promise<void> => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/delete_employee.php?id=${id}`,
        { method: "DELETE" },
      );
      fetchEmployees();
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  const handleAddEmployeeSubmit = async (
    data: NewEmployeeData & { id?: Employee["id"] },
  ): Promise<void> => {
    await fetch(`${import.meta.env.VITE_API_URL}/save_employee.php`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    handleModalClose();
    fetchEmployees();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.filterControls}>
        <Search
          onChangeDebounced={handleSearch}
          placeholder="Search by name or role..."
          className={styles.search}
        />
        <div className={styles.filters}>
          <Dropdown
            options={roles}
            value={selectedRole}
            onSelect={(opt) => setSelectedRole(opt)}
            getOptionLabel={(opt) => opt.name}
            renderOption={(opt) => <span>{opt.name}</span>}
            className={styles.dropdown}
          />
          <Dropdown
            options={statuses}
            value={selectedStatus}
            onSelect={(opt) => setSelectedStatus(opt)}
            getOptionLabel={(opt) => opt.name}
            renderOption={(opt) => <span>{opt.name}</span>}
            className={styles.dropdown}
          />
          <Dropdown
            options={[
              { value: "all", label: "WhatsApp" },
              { value: "connected", label: "Connected" },
              { value: "disconnected", label: "Disconnected" },
            ]}
            value={selectedWhatsapp}
            onSelect={(opt) => setSelectedWhatsapp(opt)}
            getOptionLabel={(opt) => opt.label}
            renderOption={(opt) => <span>{opt.label}</span>}
            className={styles.dropdown}
          />
          <Button
            isLink={false}
            size="normal"
            type="button"
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Employee
          </Button>
        </div>
      </div>

      <EmployeesTable
        employees={filteredEmployees}
        isLoading={isLoading}
        pointsHistory={pointsHistory}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteEmployee}
      />

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        onAdd={handleAddEmployeeSubmit}
        employeeToEdit={employeeToEdit}
      />
    </div>
  );
};

export default EmployeesPage;
