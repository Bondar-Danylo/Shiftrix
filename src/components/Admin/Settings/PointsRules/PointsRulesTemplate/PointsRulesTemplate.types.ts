export interface ExpirationOption {
  id: string;
  label: string;
}

export interface PointsFormState {
  defaultPoints: string;
  maxPoints: string;
  expiration: ExpirationOption;
  earlySelection: boolean;
  bookDaysOff: boolean;
  reserveAdvance: boolean;
}