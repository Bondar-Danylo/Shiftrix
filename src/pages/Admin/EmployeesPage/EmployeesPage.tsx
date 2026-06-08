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
import type { PointsTransaction } from "@/components/Admin/Employees/EmployeeModal/EmployeeModal.types";
import type { NewEmployeeData } from "@/components/Admin/Employees/AddEmployeeModal/AddEmployeeModal.types";
import type { DictionaryItem } from "@/pages/Admin/EmployeesPage/EmployeesPage.types";

// Imports
import { useCallback, useState, useEffect } from "react";

const INITIAL_BACKEND_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Server",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    status: "Working",
    whatsappConnected: true,
    points: 245,
    currentHours: 38,
    maxHours: 40,
    reliabilityRate: 98,
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Head Chef",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    status: "Working",
    whatsappConnected: true,
    points: 320,
    currentHours: 42,
    maxHours: 40,
    reliabilityRate: 95,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Bartender",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    status: "Vacation",
    whatsappConnected: true,
    points: 180,
    currentHours: 35,
    maxHours: 35,
    reliabilityRate: 92,
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Kitchen Assistant",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    status: "Sick Leave",
    whatsappConnected: false,
    points: 95,
    currentHours: 28,
    maxHours: 30,
    reliabilityRate: 88,
  },
  {
    id: 5,
    name: "Olivia Martinez",
    role: "Server",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    status: "Available",
    whatsappConnected: true,
    points: 150,
    currentHours: 22,
    maxHours: 25,
    reliabilityRate: 90,
  },
  {
    id: 6,
    name: "David Lee",
    role: "Host",
    avatarUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    status: "Day Off",
    whatsappConnected: false,
    points: 110,
    currentHours: 30,
    maxHours: 30,
    reliabilityRate: 85,
  },
];

const MOCK_POINTS_HISTORY: Record<number | string, PointsTransaction[]> = {
  1: [
    {
      id: "t1",
      title: "Completed shift",
      date: "April 16, 2026",
      amount: 15,
      type: "earned",
    },
    {
      id: "t2",
      title: "Bonus Points (Reliability)",
      date: "April 10, 2026",
      amount: 10,
      type: "earned",
    },
  ],
  2: [
    {
      id: "t3",
      title: "Completed shift",
      date: "April 15, 2026",
      amount: 20,
      type: "earned",
    },
    {
      id: "t4",
      title: "Redeemed Extra Day Off",
      date: "April 05, 2026",
      amount: 100,
      type: "spent",
    },
  ],
  3: [
    {
      id: "t5",
      title: "Completed shift",
      date: "April 16, 2026",
      amount: 15,
      type: "earned",
    },
  ],
};

const EmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<DictionaryItem[]>([]);
  const [statuses, setStatuses] = useState<DictionaryItem[]>([]);

  const [rawEmployees, setRawEmployees] = useState<Employee[]>(
    INITIAL_BACKEND_EMPLOYEES,
  );
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

  useEffect(() => {
    const loadFiltersData = async () => {
      try {
        const fetchedRoles: DictionaryItem[] = [
          { id: 1, name: "Server" },
          { id: 2, name: "Head Chef" },
          { id: 3, name: "Bartender" },
          { id: 4, name: "Kitchen Assistant" },
          { id: 5, name: "Host" },
        ];

        const fetchedStatuses: DictionaryItem[] = [
          { id: 1, name: "Working" },
          { id: 2, name: "Vacation" },
          { id: 3, name: "Sick Leave" },
          { id: 4, name: "Available" },
          { id: 5, name: "Day Off" },
        ];

        setRoles([{ id: "all", name: "All Roles" }, ...fetchedRoles]);
        setStatuses([{ id: "all", name: "Status" }, ...fetchedStatuses]);
      } catch (error) {
        console.error("Failed to load filters:", error);
      }
    };

    loadFiltersData();
  }, []);

  useEffect(() => {
    const filterEmployees = async () => {
      setIsLoading(true);
      try {
        const filtered = rawEmployees.filter((emp) => {
          const matchesSearch =
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesRole =
            selectedRole.id === "all" ||
            emp.role.toLowerCase().includes(selectedRole.name.toLowerCase());

          const matchesStatus =
            selectedStatus.id === "all" ||
            emp.status.toLowerCase() === selectedStatus.name.toLowerCase();

          const matchesWhatsapp =
            selectedWhatsapp.value === "all" ||
            (selectedWhatsapp.value === "connected" && emp.whatsappConnected) ||
            (selectedWhatsapp.value === "disconnected" &&
              !emp.whatsappConnected);

          return (
            matchesSearch && matchesRole && matchesStatus && matchesWhatsapp
          );
        });

        setFilteredEmployees(filtered);
      } catch (error) {
        console.error("Failed to filter employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    filterEmployees();
  }, [
    searchQuery,
    selectedRole.id,
    selectedRole.name,
    selectedStatus.id,
    selectedStatus.name,
    selectedWhatsapp.value,
    rawEmployees, // Обновление этого массива автоматически пересчитает фильтрацию
  ]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEmployeeToEdit(null);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEmployeeToEdit(emp);
    setIsAddModalOpen(true);
  };

  const handleDeleteEmployee = (id: string | number) => {
    setRawEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const handleAddEmployeeSubmit = (
    data: NewEmployeeData & { id?: Employee["id"] },
  ) => {
    if (data.id) {
      setRawEmployees((prev) =>
        prev.map((emp) =>
          emp.id === data.id
            ? {
                ...emp,
                name: data.name,
                role: data.role,
                status: data.status,
                maxHours: data.maxHours,
                points: data.points,
                whatsappConnected: data.whatsappConnected,
                avatarUrl: data.avatarUrl,
                email: data.email,
                phone: data.phone,
              }
            : emp,
        ),
      );
    } else {
      const newEmployee: Employee = {
        name: data.name,
        role: data.role,
        status: data.status,
        maxHours: data.maxHours,
        points: data.points,
        whatsappConnected: data.whatsappConnected,
        avatarUrl: data.avatarUrl,
        id: Date.now(),
        currentHours: 0,
        reliabilityRate: 100,
      };
      setRawEmployees((prev) => [newEmployee, ...prev]);
    }
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
        pointsHistory={MOCK_POINTS_HISTORY}
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
