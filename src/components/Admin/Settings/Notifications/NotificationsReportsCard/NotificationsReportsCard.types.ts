export interface ReportsProps {
  dailySummary: boolean;
  setDailySummary: (val: boolean) => void;
  sendTime: string;
  setSendTime: (time: string) => void;
  numShifts: boolean;
  setNumShifts: (val: boolean) => void;
  uncoveredShifts: boolean;
  setUncoveredShifts: (val: boolean) => void;
  recommendations: boolean;
  setRecommendations: (val: boolean) => void;
  weeklySummary: boolean;
  setWeeklySummary: (val: boolean) => void;
}