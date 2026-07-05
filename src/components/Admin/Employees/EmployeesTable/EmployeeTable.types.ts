import type { PointsTransaction } from "../EmployeeModal/EmployeeModal.types";

export interface Employee {
  id: string | number;
  name: string;
  role: string;
  photo_url: string;
  status: "Working" | "Vacation" | "Sick Leave" | "Available" | "Day Off";
  is_bot_connected: boolean;
  points_balance: number;
  currentHours: number;
  max_hours: number;
  reliabilityRate: number;
  position_id: string | number;
  department_id?: string | number;
  email?:string;
  phone_number?: string | number;
  created_at?:  string;
}

export interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
  pointsHistory?: Record<string | number, PointsTransaction[]>;
  onEdit: (emp: Employee) => void;
  onDelete: (id: string | number) => void;
}
