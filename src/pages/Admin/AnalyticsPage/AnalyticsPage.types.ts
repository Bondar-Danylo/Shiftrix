export interface FilterOption {
  value: string;
  label: string;
}

export interface VelocityPoint {
  label: string;
  spent: number;
  earned: number;
}

export interface MotivationPoint {
  points: number; 
  hours: number; 
}

export interface Performer {
  id: string | number;
  name: string;
  role: string;
  avatarUrl?: string;
  reliabilityRate: number; 
}

export interface TeamOverviewData {
  totalEmployees: number;
  avgShiftFill: number;
  shiftSwaps: number;
  autoFilled: number;
  sickLeaves: number;
  totalHours: number;
  overtimeHours: number;
}

export interface ShiftPopularityData {
  chartData: Array<{ name: string; value: number; color: string }>;
  mostPopularDay: string;
  avgFillRate: number;
}

export interface RiskEmployee {
  id: string | number;
  name: string;
  role: string;
  avatarUrl?: string;
  hoursDeviation: number; 
}

export interface StaffHealthData {
  underworked: RiskEmployee[];
  overworked: RiskEmployee[];
}

export interface AnalyticsSummary {
  systemSpeed: {
    averageFillTimeHours: number;
    selfServiceRate: number;
    whatsappResponseRate: number;
  };
  pointsVelocity: VelocityPoint[];
  motivationCorrelation: MotivationPoint[];
  topPerformers: Performer[];
  teamOverview: TeamOverviewData;
  shiftPopularity: ShiftPopularityData;
  staffHealth: StaffHealthData;
}