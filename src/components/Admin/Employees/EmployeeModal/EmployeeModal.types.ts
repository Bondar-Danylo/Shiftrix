import type { EmployeeWeeklyHours } from "@/pages/Admin/EmployeesPage/EmployeesPage.types";
import type { Employee } from "../EmployeesTable/EmployeeTable.types";

export interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id?: string | number) => void;
  weeklyHours: EmployeeWeeklyHours | null;
}

export interface PointsTransaction {
  id: string | number;
  title: string; 
  date: string; 
  amount: number; 
  type: "added" | "removed";
}

export interface ExtendedEmployeeModalProps extends EmployeeModalProps {
  pointsHistory?: PointsTransaction[];
}