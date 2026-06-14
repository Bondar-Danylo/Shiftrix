import type { ShiftTemplate } from "../TemplatesLayout/Templates.types";

export interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ShiftTemplate | null; 
  onSave: (template: Omit<ShiftTemplate, "id">) => void;
}