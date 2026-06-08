export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean; 
  variant?: "danger" | "primary"; 
  onClose: () => void;
  onConfirm: () => void;
}