import type { ShiftTemplate } from "../TemplatesLayout/Templates.types";

export interface TemplateCardProps {
  template: ShiftTemplate;
  onDeleteClick: (template: ShiftTemplate) => void;
  onDuplicateClick: (template: ShiftTemplate) => void; 
  onEditClick: (template: ShiftTemplate) => void;
}