export interface DonutSegment {
  value: number;
  color: string;
}
export interface DonutChartProps {
  data?: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  className?: string
}