// Imports
import React from "react";

// Styles
import styles from "./ShiftCard.module.scss";

// Types
import type { ShiftCardProps } from "./ShiftCard.types";

const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  isPast = false,
  onClick,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(shift.id);
    }
  };

  return (
    <div
      className={`${styles.shiftCard} ${isPast ? styles.shiftCard_past : ""} ${
        onClick ? styles.shiftCard_clickable : ""
      }`}
      onClick={handleCardClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.shiftCard__header}>
        <span className={styles.time}>{shift.timeWindow}</span>
        {shift.points && (
          <span className={styles.pointsBadge}>{shift.points} pts</span>
        )}
      </div>
      <h4 className={styles.shiftCard__title}>{shift.name}</h4>
      <span className={styles.shiftCard__sub}>
        {shift.assignedCount} staff assigned
      </span>
    </div>
  );
};

export default ShiftCard;
