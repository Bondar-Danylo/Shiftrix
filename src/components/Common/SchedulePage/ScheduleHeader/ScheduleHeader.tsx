// Imports
import { useState, useCallback } from "react";

// Styles
import styles from "./ScheduleHeader.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";

// Icons
import ChevronLeftIcon from "@/assets/icons/chevron-left_icon.svg?react";
import ChevronRightIcon from "@/assets/icons/chevron-right_icon.svg?react";

// Types
import type { ScheduleHeaderProps } from "./ScheduleHeader.types";
import type { ProfessionOption } from "@/pages/Common/SchedulePage/SchedulePage.types";

const ScheduleHeader = ({
  monthTitle,
  viewMode,
  setViewMode,
  currentProfession,
  professionOptions,
  onProfessionSelect,
  onPrevMonth,
  onNextMonth,
}: ScheduleHeaderProps) => {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const handleOpenModal = useCallback(
    (): void => setIsPublishModalOpen(true),
    [],
  );

  const handleCloseModal = useCallback((): void => {
    if (isPublishing) return;
    setIsPublishModalOpen(false);
  }, [isPublishing]);

  const handleConfirmPublish = useCallback(async (): Promise<void> => {
    setIsPublishing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsPublishModalOpen(false);
    } catch (error) {
      console.error("Failed to publish schedule:", error);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  const getDropdownLabel = useCallback(
    (option: ProfessionOption) => option.label,
    [],
  );

  const renderDropdownOption = useCallback(
    (option: ProfessionOption) => <span>{option.label}</span>,
    [],
  );

  return (
    <header className={styles.scheduleHeader}>
      <div className={styles.scheduleHeader__left}>
        <div className={styles.scheduleNavigation}>
          <button
            type="button"
            className={`${styles.scheduleNavigation__btn} ${styles.scheduleNavigation__btn_prev}`}
            onClick={onPrevMonth}
          >
            <ChevronLeftIcon className={styles.scheduleNavigation__icon} />
          </button>
          <h2 className={styles.scheduleNavigation__title}>{monthTitle}</h2>
          <button
            type="button"
            className={`${styles.scheduleNavigation__btn} ${styles.scheduleNavigation__btn_next}`}
            onClick={onNextMonth}
          >
            <ChevronRightIcon className={styles.scheduleNavigation__icon} />
          </button>
        </div>

        <div className={styles.viewToggle}>
          <button
            type="button"
            className={`${styles.viewToggle__btn} ${viewMode === "month" ? styles.viewToggle__btn_active : ""}`}
            onClick={() => setViewMode("month")}
          >
            Month
          </button>
          <button
            type="button"
            className={`${styles.viewToggle__btn} ${viewMode === "week" ? styles.viewToggle__btn_active : ""}`}
            onClick={() => setViewMode("week")}
          >
            Week
          </button>
        </div>
      </div>

      <div className={styles.scheduleHeader__right}>
        <Dropdown<ProfessionOption>
          options={professionOptions}
          value={currentProfession}
          onSelect={onProfessionSelect}
          getOptionLabel={getDropdownLabel}
          renderOption={renderDropdownOption}
          className={styles.scheduleHeader__dropdown}
        />
        <Button
          type="button"
          size="normal"
          isLink={false}
          className={`${styles.scheduleHeader__btn} ${styles.scheduleHeader__btn_publish}`}
          onClick={handleOpenModal}
        >
          <span>Publish Schedule</span>
        </Button>
      </div>

      <ConfirmationModal
        isOpen={isPublishModalOpen}
        title="Publish Schedule"
        description="All assigned employees will receive notifications about their shifts."
        confirmText="Yes, publish"
        cancelText="Cancel"
        variant="primary"
        isLoading={isPublishing}
        onClose={handleCloseModal}
        onConfirm={handleConfirmPublish}
      />
    </header>
  );
};

export default ScheduleHeader;
