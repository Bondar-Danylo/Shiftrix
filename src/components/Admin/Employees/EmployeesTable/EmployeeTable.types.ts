import type { PointsTransaction } from "../EmployeeModal/EmployeeModal.types";

export interface Employee {
  id: string | number;
  name: string;
  role: string;
  avatarUrl: string;
  status: "Working" | "Vacation" | "Sick Leave" | "Available" | "Day Off";
  whatsappConnected: boolean;
  points: number;
  currentHours: number;
  maxHours: number;
  reliabilityRate: number;
}

export interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
  pointsHistory?: Record<string | number, PointsTransaction[]>;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string | number) => void;
}
