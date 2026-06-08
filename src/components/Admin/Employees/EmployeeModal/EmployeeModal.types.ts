import type { Employee } from "../EmployeesTable/EmployeeTable.types";

export interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (id?: string | number) => void;
}

export interface PointsTransaction {
  id: string | number;
  title: string; 
  date: string; 
  amount: number; 
  type: "earned" | "spent";
}

export interface ExtendedEmployeeModalProps extends EmployeeModalProps {
  pointsHistory?: PointsTransaction[];
}