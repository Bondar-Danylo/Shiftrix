export type RequestType = | "dayoff" | "holiday" | "swap";

export interface CreateRequestData {
  type: RequestType;
  start_date: string;
  end_date: string;
  reason: string;
  shift_id?: number | null;
  target_employee_id?: number | null;
}

export interface BookedShiftOption {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  title: string;
  position_id: number | string;
  position_name: string;
}

export interface SwapEmployeeOption {
  id: number;
  name: string;
  position_id: number | string;
  position_name: string;
  photo_url: string | null;
}

export interface BookedShiftsResponse {
  success: boolean;
  shifts: BookedShiftOption[];
  error?: string;
}

export interface SwapEmployeesResponse {
  success: boolean;
  employees: SwapEmployeeOption[];
  error?: string;
}

export interface CreateRequestModalProps {
  isOpen: boolean;
  userId: number;
  onClose: () => void;
  onSubmit: (data: CreateRequestData) => Promise<void>;
}