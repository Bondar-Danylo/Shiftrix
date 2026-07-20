export interface ShiftEmployee {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface ShiftDetails {
  id: string;
  timeWindow: string;
  points?: number;
  dateStr: string;  
  profession: string;
}

export interface ManageShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftDetails: ShiftDetails | null;
  assignedEmployees: ShiftEmployee[]; 
  onRemoveEmployee: (id: string) => void;
  onAddEmployee: (emp: ShiftEmployee) => void;
  isReadOnly?: boolean;
  allEmployees?: ShiftEmployee[];
}