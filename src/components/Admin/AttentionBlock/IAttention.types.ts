export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface ShiftAlert {
  id: string | number;
  title: string;
  when: string,
  type: 'uncovered' | 'understaffed' | 'cancellation';
  severity: AlertSeverity;
  createdAt: string;   
}