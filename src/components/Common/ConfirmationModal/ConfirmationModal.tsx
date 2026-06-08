// Styles
import styles from "./ConfirmationModal.module.scss";

// Components
import Button from "@/components/Common/Button/Button";

// Types
import type { ConfirmationModalProps } from "./ConfirmationModal.types";

// Imports
import { useEffect } from "react";

const ConfirmationModal = ({
  isOpen,
  title,
  description = "This action cannot be undone",
  confirmText = "Yes",
  cancelText = "No",
  isLoading = false,
  variant = "primary",
  onClose,
  onConfirm,
}: ConfirmationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.actions}>
          <Button
            isLink={false}
            size="normal"
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button
            isLink={false}
            size="normal"
            type="button"
            className={`${styles.confirmBtn} ${variant === "danger" ? styles.danger : styles.primary}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
