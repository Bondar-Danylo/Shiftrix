export interface CardSpeedProps {
  isLoading: boolean;
  data?: {
    averageFillTimeHours: number;
    selfServiceRate: number;
    whatsappResponseRate: number;
  };
}