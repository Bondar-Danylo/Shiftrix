import type { ShiftTemplate } from "../TemplatesLayout/Templates.types";

export interface TemplatesListProps {
  templates: ShiftTemplate[];
  searchQuery: string;
  onEditClick: (template: ShiftTemplate) => void; 
  onDeleteClick: (template: ShiftTemplate) => void;
  onDuplicateClick: (template: ShiftTemplate) => void;
}