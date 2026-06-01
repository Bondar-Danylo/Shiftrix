export interface FilterOption {
  value: string;
  label: string;
}

export interface VelocityPoint {
  label: string;
  spent: number;
  earned: number;
}

export interface AnalyticsSummary {
  systemSpeed: {
    averageFillTimeHours: number;
    selfServiceRate: number;
    whatsappResponseRate: number;
  };
  pointsVelocity: VelocityPoint[];
}