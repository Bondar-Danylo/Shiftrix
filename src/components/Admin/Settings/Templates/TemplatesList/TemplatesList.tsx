// Styles
import styles from "./TemplatesList.module.scss";

// Components
import TemplateCard from "../TemplatesCard/TemplatesCard";

// Types
import type { TemplatesListProps } from "./TemplatesList.types";

// Icons
import SearchIcon from "@/assets/icons/search_icon.svg?react";

const TemplatesList = ({
  templates,
  searchQuery,
  onEditClick,
  onDuplicateClick,
  onDeleteClick,
}: TemplatesListProps) => {
  if (templates.length === 0) {
    return (
      <div className={styles.empty}>
        <SearchIcon className={styles.empty__icon} />
        <h3 className={styles.empty__title}>No templates found</h3>
        <p className={styles.empty__subtitle}>
          {searchQuery
            ? `We couldn't find anything matching "${searchQuery}". Try checking for typos.`
            : "There are no shift templates created yet. Click '+ Create Template' to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEditClick={onEditClick}
          onDuplicateClick={onDuplicateClick}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default TemplatesList;
