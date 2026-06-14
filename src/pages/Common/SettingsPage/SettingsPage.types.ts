export type UserRole = "Manager" | "Employee";

export type SettingsTabId =
  | "shift-templates"
  | "points-rules"
  | "scheduling-rules"
  | "roles-contracts"
  | "whatsapp-bot";

export interface TabConfig {
  id: SettingsTabId;
  label: string;
  allowedRoles: UserRole[];
}