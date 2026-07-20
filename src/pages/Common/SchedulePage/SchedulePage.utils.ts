export const DAYS_OF_WEEK: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const formatDateLocal = (date: Date): string => {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const day: string = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getRelativeDateStr = (offsetDays: number): string => {
  const d: Date = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatDateLocal(d);
};

export const getMondayOfDate = (date: Date): Date => {
  const result: Date = new Date(date);
  const day: number = result.getDay();
  const diff: number = result.getDate() - day + (day === 0 ? -6 : 1);
  result.setDate(diff);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const parseShiftTimes = (
  dateStr: string,
  timeWindow: string
): { start: Date; end: Date } => {
  const normalizedWindow: string = timeWindow.replace(/-/g, "-");
  const [startStr, endStr] = normalizedWindow.split("-").map((s) => s.trim());
  const start: Date = new Date(`${dateStr}T${startStr}:00`);
  let end: Date = new Date(`${dateStr}T${endStr}:00`);
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  return { start, end };
};