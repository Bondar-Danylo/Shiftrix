// Imports
import type {
  DbScheduledShift,
  DbTemplate,
  SchedulingRules,
} from "./SchedulePage.types";

const API_URL = import.meta.env.VITE_API_URL;


// End Points API
const ENDPOINTS = {
  shifts: `${API_URL}/shifts.php`,
  templates: `${API_URL}/shift_templates.php`,
  generateShifts: `${API_URL}/generate_shifts.php`,
  dictionaries: `${API_URL}/get_dictionaries.php`,
  rules: `${API_URL}/get_rules.php`,
  employees: `${API_URL}/get_employees.php`,
  assignments: `${API_URL}/shift_assignments.php`,
  pointsHistory: `${API_URL}/points_history.php`,
  weeklyHours: `${API_URL}/weekly_hours.php`,
};

// Interfaces
interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export interface AssignmentResponse {
  success: boolean;
  message?: string;
  error?: string;
  assignment_id?: number;
  charged_points?: number;
  refunded_points?: number;
  new_balance?: number;
  next_points_cost?: number;
}

export interface PointsHistoryItem {
  id: number;
  user_id: number;
  shift_id: number | null;
  assignment_id: number | null;
  amount: number;
  balance_after: number;
  action_type: "added" | "removed";
  transaction_type: "early_access_charge" | "shift_reward" | "booking_refund" | "manual_adjustment";
  reason: string;
  created_at: string;
  shift_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
}

export interface PointsHistoryResponse {
  success: boolean;
  history: PointsHistoryItem[];
  error?: string;
}

export interface WeeklyHoursShift {
  assignment_id: number;
  shift_id: number;
  template_id: number | null;
  title: string;
  role: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  assignment_status: "assigned" | "completed";
  time_status: "worked" | "booked";
}

export interface WeeklyHoursResponse {
  success: boolean;
  user: {
    id: number;
    name: string;
    max_hours: number;
  };
  week: {
    start: string;
    end: string;
  };
  worked_hours: number;
  booked_hours: number;
  total_hours: number;
  remaining_hours: number;
  overtime_hours: number;
  worked_shifts: number;
  booked_shifts: number;
  shifts: WeeklyHoursShift[];
  error?: string;
}

// Main Func
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const text = await response.text();

  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned an invalid response.");
    }
  }

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null;

    throw new Error(
      errorData?.message ||
        errorData?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return data as T;
}

function createJsonOptions(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body:
      body !== undefined
        ? JSON.stringify(body)
        : undefined,
  };
}

export interface ProfessionDto {
  id: string;
  name: string;
}

export interface EmployeesResponse {
  employees?: unknown[];
}

export interface SaveTemplateResponse {
  success: boolean;
  error?: string;
}

export interface AssignmentResponse {
  message?: string;
  new_balance?: number;
}

export const scheduleApi = {
  getRules(): Promise<SchedulingRules> {
    return apiRequest<SchedulingRules>(ENDPOINTS.rules);
  },

  async getProfessions(): Promise<ProfessionDto[]> {
    const response = await apiRequest<{
      roles?: ProfessionDto[];
    }>(ENDPOINTS.dictionaries);

    return Array.isArray(response.roles) ? response.roles : [];
  },

  getTemplates(): Promise<DbTemplate[]> {
    return apiRequest<DbTemplate[]>(ENDPOINTS.templates);
  },

  getEmployees(): Promise<EmployeesResponse> {
    return apiRequest<EmployeesResponse>(ENDPOINTS.employees);
  },

  async generateShifts(startDate: string, endDate: string): Promise<void> {
    await apiRequest<unknown>(
      ENDPOINTS.generateShifts,
      createJsonOptions("POST", {
        start_date: startDate,
        end_date: endDate,
      }),
    );
  },

  getShifts(startDate: string, endDate: string): Promise<DbScheduledShift[]> {
    const params = new URLSearchParams({
      start: startDate,
      end: endDate,
    });

    return apiRequest<DbScheduledShift[]>(
      `${ENDPOINTS.shifts}?${params.toString()}`,
    );
  },

  deleteShift(shiftId: number): Promise<unknown> {
    const params = new URLSearchParams({
      id: String(shiftId),
    });

    return apiRequest<unknown>(
      `${ENDPOINTS.shifts}?${params.toString()}`,
      {
        method: "DELETE",
      },
    );
  },

  createShiftFromTemplate(payload: unknown): Promise<unknown> {
    return apiRequest<unknown>(
      ENDPOINTS.shifts,
      createJsonOptions("POST", payload),
    );
  },

  saveTemplate(payload: unknown): Promise<SaveTemplateResponse> {
    return apiRequest<SaveTemplateResponse>(
      ENDPOINTS.templates,
      createJsonOptions("POST", payload),
    );
  },

  assignEmployee(
    shiftId: string | number,
    employeeId: string | number,
  ): Promise<AssignmentResponse> {
    return apiRequest<AssignmentResponse>(
      ENDPOINTS.assignments,
      createJsonOptions("POST", {
        action: "assign",
        shift_id: Number(shiftId),
        employee_id: Number(employeeId),
      }),
    );
  },

  assignEmployeeWithEarlyAccess(
    shiftId: string | number,
    employeeId: string | number,
  ): Promise<AssignmentResponse> {
    return apiRequest<AssignmentResponse>(
      ENDPOINTS.assignments,
      createJsonOptions("POST", {
        action: "assign_early",
        shift_id: Number(shiftId),
        employee_id: Number(employeeId),
      }),
    );
  },

  unassignEmployee(
    shiftId: string | number,
    employeeId: string | number,
  ): Promise<AssignmentResponse> {
    return apiRequest<AssignmentResponse>(
      ENDPOINTS.assignments,
      createJsonOptions("POST", {
        action: "unassign",
        shift_id: Number(shiftId),
        employee_id: Number(employeeId),
      }),
    );
  },

  completeAssignment(
    assignmentId: string | number,
  ): Promise<AssignmentResponse> {
    return apiRequest<AssignmentResponse>(
      ENDPOINTS.assignments,
      createJsonOptions("POST", {
        action: "complete",
        assignment_id: Number(assignmentId),
      }),
    );
  },

  getPointsHistory(
    userId?: string | number,
    months = 3,
  ): Promise<PointsHistoryResponse> {
    const params = new URLSearchParams({
      months: String(months),
    });

    if (userId !== undefined) {
      params.set("user_id", String(userId));
    }

    return apiRequest<PointsHistoryResponse>(
      `${ENDPOINTS.pointsHistory}?${params.toString()}`,
    );
  },
  
  getWeeklyHours(
    userId: string | number,
    date?: string,
  ): Promise<WeeklyHoursResponse> {
    const params = new URLSearchParams({
      user_id: String(userId),
    });

    if (date) {
      params.set("date", date);
    }

    return apiRequest<WeeklyHoursResponse>(
      `${ENDPOINTS.weeklyHours}?${params.toString()}`,
    );
  },
};