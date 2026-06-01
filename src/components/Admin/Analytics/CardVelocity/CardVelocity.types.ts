export interface VelocityPoint {
  label: string; 
  spent: number;
  earned: number;
}

export interface CardVelocityProps {
  isLoading: boolean;
  data?: VelocityPoint[];
}