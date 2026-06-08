import type { Employee } from "../EmployeesTable/EmployeeTable.types";

export interface NewEmployeeData extends Omit<Employee, "id" | "points" | "currentHours" | "reliabilityRate"> {
  email: string;
  phone: string;
  points: number;
}

export interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (employeeData: NewEmployeeData & { id?: Employee["id"] }) => void;
  employeeToEdit?: (Employee & { email?: string; phone?: string }) | null;
}

export interface StatusOption {
  id: Employee["status"];
  name: string;
}

export interface FormState {
  name: string;
  role: string;
  email: string;
  phone: string;
  selectedStatus: StatusOption;
  maxHours: number;
  initialPoints: number;
  whatsappConnected: boolean;
  avatarUrl: string;
}