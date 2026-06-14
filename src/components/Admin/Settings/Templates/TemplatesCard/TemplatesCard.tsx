// Styles
import styles from "./TemplatesCard.module.scss";

// Icons
import EditIcon from "@/assets/icons/edit_icon.svg?react";
import CopyIcon from "@/assets/icons/copy_icon.svg?react";
import DeleteIcon from "@/assets/icons/delete_icon.svg?react";
import ClockIcon from "@/assets/icons/clock_icon.svg?react";
import UsersIcon from "@/assets/icons/employees_icon.svg?react";
import AwardIcon from "@/assets/icons/medal_icon.svg?react";
import CalendarIcon from "@/assets/icons/schedule_icon.svg?react";

// Types
import type { TemplateCardProps } from "./TemplatesCard.types";

const TemplateCard = ({
  template,
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
}: TemplateCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <h3 className={styles.card__title}>{template.title}</h3>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actions__btn}
            title="Edit"
            onClick={() => onEditClick(template)}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className={styles.actions__btn}
            title="Duplicate"
            onClick={() => onDuplicateClick(template)}
          >
            <CopyIcon />
          </button>
          <button
            type="button"
            className={styles.actions__btn}
            title="Delete"
            onClick={() => onDeleteClick(template)}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>

      {template.isHighPriority && (
        <span className={styles.badge}>
          <span className={styles.badge__icon}>⚠️</span> High Priority
        </span>
      )}

      <div className={styles.tags}>
        <span className={`${styles.tags__item} ${styles.tags__role}`}>
          {template.role}
        </span>
        {template.location && (
          <span className={`${styles.tags__item} ${styles.tags__location}`}>
            📍 {template.location}
          </span>
        )}
      </div>

      <div className={styles.metrics}>
        <div className={styles.metrics__item}>
          <ClockIcon />
          <span>
            {template.startTime} – {template.endTime}
          </span>
        </div>
        <div className={styles.metrics__item}>
          <UsersIcon />
          <span>
            {template.requiredEmployees} required ({template.minEmployees}–
            {template.maxEmployees})
          </span>
        </div>
        <div className={`${styles.metrics__item} ${styles.points}`}>
          <AwardIcon className={styles.points__icon} />
          <span className={styles.points__text}>
            {template.points > 0 ? `+${template.points} points` : "0 points"}
          </span>
        </div>
        <div className={styles.metrics__item}>
          <CalendarIcon />
          <span>{template.days}</span>
        </div>
      </div>

      {template.description && (
        <p className={styles.description}>{template.description}</p>
      )}
    </div>
  );
};

export default TemplateCard;
