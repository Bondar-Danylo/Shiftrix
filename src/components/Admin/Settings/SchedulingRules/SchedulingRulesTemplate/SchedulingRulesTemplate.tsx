// Imports
import { useState, useEffect, type FormEvent } from "react";

// Styles
import styles from "./SchedulingRulesTemplate.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";

// Icons
import SaveIcon from "@/assets/icons/save_icon.svg?react";
import CalendarIcon from "@/assets/icons/schedule_icon.svg?react";

// Types
import type {
  SchedulingFormState,
  SelectionOption,
} from "./SchedulingRulesTemplate.types";

const ADVANCE_OPTIONS: SelectionOption[] = [
  { id: "1_week", label: "1 week" },
  { id: "2_weeks", label: "2 weeks" },
  { id: "1_month", label: "1 month" },
];

const EARLY_ACCESS_OPTIONS: SelectionOption[] = [
  { id: "1_month", label: "1 month ahead" },
  { id: "2_months", label: "2 month ahead" },
  { id: "3_months", label: "3 months ahead" },
];

const DRAFT_KEY = "scheduling_rules_form_state";
const SERVER_KEY = "scheduling_rules_server_state";

const DEFAULT_STATE: SchedulingFormState = {
  advancePeriod: ADVANCE_OPTIONS[0],
  earlyAccess: EARLY_ACCESS_OPTIONS[1],
  maxShifts: "6",
  minHours: "11",
  allowOvertime: true,
  autoBalance: true,
};

const getInitialState = (): SchedulingFormState => {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) return JSON.parse(draft);

    const server = localStorage.getItem(SERVER_KEY);
    return server ? JSON.parse(server) : DEFAULT_STATE;
  } catch (error) {
    console.error("Error reading initial scheduling state:", error);
    return DEFAULT_STATE;
  }
};

const SchedulingRulesTemplate = () => {
  const [formData, setFormData] =
    useState<SchedulingFormState>(getInitialState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect((): void => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = <K extends keyof SchedulingFormState>(
    key: K,
    value: SchedulingFormState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitClick = (e: FormEvent): void => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmSave = async (): Promise<void> => {
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const schedulingConfig = {
      advanceSelectionPeriod: formData.advancePeriod.id,
      pointsEarlyAccess: formData.earlyAccess.id,
      limits: {
        maximumShiftsPerWeek: Number(formData.maxShifts),
        minimumHoursBetweenShifts: Number(formData.minHours),
      },
      automation: {
        allowOvertime: formData.allowOvertime,
        autoBalanceHours: formData.autoBalance,
      },
    };

    console.log(
      "Successfully saved scheduling configuration to server:",
      schedulingConfig,
    );

    localStorage.setItem(SERVER_KEY, JSON.stringify(formData));

    setIsSaving(false);
    setIsModalOpen(false);
  };

  const handleCancel = (): void => {
    try {
      const serverState = localStorage.getItem(SERVER_KEY);
      const rollbackState = serverState
        ? JSON.parse(serverState)
        : DEFAULT_STATE;

      setFormData(rollbackState);
      localStorage.setItem(DRAFT_KEY, JSON.stringify(rollbackState));
    } catch (error) {
      console.error("Error during scheduling rollback:", error);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmitClick} className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.header__title}>Scheduling Rules</h2>
            <p className={styles.header__subtitle}>
              Control how shifts are assigned and selected
            </p>
          </div>
          <Button
            type="submit"
            size="normal"
            isLink={false}
            className={styles.btn}
          >
            <SaveIcon className={styles.btn__icon} />
            <span>Save Changes</span>
          </Button>
        </div>

        <div className={styles.card}>
          <div className={styles.card__header}>
            <span className={styles.card__icon}>
              <CalendarIcon />
            </span>
            <h3 className={styles.card__title}>Selection Rules</h3>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Advance Selection Period</label>
              <Dropdown<SelectionOption>
                options={ADVANCE_OPTIONS}
                value={formData.advancePeriod}
                onSelect={(option) => updateField("advancePeriod", option)}
                getOptionLabel={(option) => option.label}
                renderOption={(option) => <span>{option.label}</span>}
                className={styles.dropdown}
              />
              <span className={styles.field__hint}>
                How far in advance employees can select shifts
              </span>
            </div>

            <div className={styles.field}>
              <label>Points Early Access</label>
              <Dropdown<SelectionOption>
                options={EARLY_ACCESS_OPTIONS}
                value={formData.earlyAccess}
                onSelect={(option) => updateField("earlyAccess", option)}
                getOptionLabel={(option) => option.label}
                renderOption={(option) => <span>{option.label}</span>}
                className={styles.dropdown}
              />
              <span className={styles.field__hint}>
                How far ahead points allow early selection
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.card__header_noIcon}>
            <h3 className={styles.card__title}>Shift Limits</h3>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Maximum Shifts Per Week</label>
              <input
                type="number"
                value={formData.maxShifts}
                onChange={(e) => updateField("maxShifts", e.target.value)}
                min={0}
              />
              <span className={styles.field__hint}>
                Maximum number of shifts an employee can work per week
              </span>
            </div>

            <div className={styles.field}>
              <label>Minimum Hours Between Shifts</label>
              <input
                type="number"
                value={formData.minHours}
                onChange={(e) => updateField("minHours", e.target.value)}
                min={0}
              />
              <span className={styles.field__hint}>
                Minimum rest time required between shifts
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.card__title}>Automation</h3>
          <div className={styles.list}>
            <label className={`${styles.checkbox} ${styles.blue}`}>
              <input
                type="checkbox"
                checked={formData.allowOvertime}
                onChange={(e) => updateField("allowOvertime", e.target.checked)}
              />
              <span className={styles.checkbox__content}>
                <strong className={styles.checkbox__title}>
                  Allow Overtime
                </strong>
                <span className={styles.checkbox__description}>
                  Employees can be scheduled beyond their contract hours
                </span>
              </span>
            </label>

            <label className={`${styles.checkbox} ${styles.purple}`}>
              <input
                type="checkbox"
                checked={formData.autoBalance}
                onChange={(e) => updateField("autoBalance", e.target.checked)}
              />
              <span className={styles.checkbox__content}>
                <strong className={styles.checkbox__title}>
                  Auto-Balance Hours
                </strong>
                <span className={styles.checkbox__description}>
                  System will suggest shifts to balance employee workload
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.info__header}>
            <span className={styles.info__icon}>⚡</span>
            <h4 className={styles.info__title}>Automation Benefits</h4>
          </div>
          <div className={styles.info__text}>
            <p className={styles.info__description}>
              Auto-balancing prevents overworking some employees while others
              are underutilized. The system analyzes contract hours and
              scheduled hours to suggest optimal assignments.
            </p>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Save Changes?"
        description="Are you sure you want to update the scheduling rules?"
        confirmText="Yes, save"
        cancelText="No, cancel"
        isLoading={isSaving}
        variant="primary"
        onClose={handleCancel}
        onConfirm={handleConfirmSave}
      />
    </>
  );
};

export default SchedulingRulesTemplate;
