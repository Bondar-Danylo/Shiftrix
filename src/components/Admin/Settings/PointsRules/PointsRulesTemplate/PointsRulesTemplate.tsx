// Imports
import { useState, useEffect, type FormEvent } from "react";

// Styles
import styles from "./PointsRulesTemplate.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";

// Icons
import SaveIcon from "@/assets/icons/save_icon.svg?react";
import MedalIcon from "@/assets/icons/medal_icon.svg?react";

// Types
import type {
  ExpirationOption,
  PointsFormState,
} from "./PointsRulesTemplate.types";

const EXPIRATION_OPTIONS: ExpirationOption[] = [
  { id: "1_month", label: "Expire after 1 month" },
  { id: "3_months", label: "Expire after 3 months" },
  { id: "6_months", label: "Expire after 6 month" },
  { id: "1_year", label: "Expire after 1 year" },
  { id: "never", label: "Never expire" },
];

const DRAFT_KEY = "points_rules_form_state";
const SERVER_KEY = "points_rules_server_state";

const DEFAULT_STATE: PointsFormState = {
  defaultPoints: "3",
  maxPoints: "50",
  expiration: EXPIRATION_OPTIONS[2],
  earlySelection: true,
  bookDaysOff: true,
  reserveAdvance: true,
};

const getInitialState = (): PointsFormState => {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) return JSON.parse(draft);

    const server = localStorage.getItem(SERVER_KEY);
    return server ? JSON.parse(server) : DEFAULT_STATE;
  } catch (error) {
    console.error("Error reading initial points state:", error);
    return DEFAULT_STATE;
  }
};

const PointsRulesTemplate = () => {
  const [formData, setFormData] = useState<PointsFormState>(getInitialState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect((): void => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = <K extends keyof PointsFormState>(
    key: K,
    value: PointsFormState[K],
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

    const pointsConfig = {
      defaultMonthlyPoints: Number(formData.defaultPoints),
      maximumPointsPerEmployee: Number(formData.maxPoints),
      pointsExpiration: formData.expiration.id,
      allowedUses: {
        earlyShiftSelection: formData.earlySelection,
        bookDaysOff: formData.bookDaysOff,
        reserveShiftsInAdvance: formData.reserveAdvance,
      },
    };

    console.log(
      "Successfully saved points configuration to server:",
      pointsConfig,
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
      console.error("Error during points rollback:", error);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmitClick} className={styles.wrapper}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.header__title}>Points Rules</h2>
            <p className={styles.header__subtitle}>
              Configure how the points system works
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
              <MedalIcon />
            </span>
            <h3 className={styles.card__title}>Points Allocation</h3>
          </div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Default Monthly Points</label>
              <input
                type="number"
                value={formData.defaultPoints}
                onChange={(e) => updateField("defaultPoints", e.target.value)}
                min={0}
              />
              <span className={styles.field__hint}>
                Points given to each employee at the start of the month
              </span>
            </div>

            <div className={styles.field}>
              <label>Maximum Points Per Employee</label>
              <input
                type="number"
                value={formData.maxPoints}
                onChange={(e) => updateField("maxPoints", e.target.value)}
                min={0}
              />
              <span className={styles.field__hint}>
                Maximum points an employee can accumulate
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <label>Points Expiration</label>

            <Dropdown<ExpirationOption>
              options={EXPIRATION_OPTIONS}
              value={formData.expiration}
              onSelect={(option) => updateField("expiration", option)}
              getOptionLabel={(option) => option.label}
              renderOption={(option) => <span>{option.label}</span>}
              className={styles.dropdown}
            />

            <span className={styles.field__hint}>
              How long until unused points expire
            </span>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.card__title}>What Points Can Be Used For</h3>

          <div className={styles.list}>
            <label className={`${styles.checkbox} ${styles.blue}`}>
              <input
                type="checkbox"
                checked={formData.earlySelection}
                onChange={(e) =>
                  updateField("earlySelection", e.target.checked)
                }
              />
              <span className={styles.checkbox__content}>
                <strong className={styles.checkbox__title}>
                  Early Shift Selection
                </strong>
                <span className={styles.checkbox__description}>
                  Employees can spend points to select shifts before others
                </span>
              </span>
            </label>

            <label className={`${styles.checkbox} ${styles.purple}`}>
              <input
                type="checkbox"
                checked={formData.bookDaysOff}
                onChange={(e) => updateField("bookDaysOff", e.target.checked)}
              />
              <span className={styles.checkbox__content}>
                <strong className={styles.checkbox__title}>
                  Book Days Off
                </strong>
                <span className={styles.checkbox__description}>
                  Employees can use points to request preferred days off
                </span>
              </span>
            </label>

            <label className={`${styles.checkbox} ${styles.green}`}>
              <input
                type="checkbox"
                checked={formData.reserveAdvance}
                onChange={(e) =>
                  updateField("reserveAdvance", e.target.checked)
                }
              />
              <span className={styles.checkbox__content}>
                <strong className={styles.checkbox__title}>
                  Reserve Shifts in Advance
                </strong>
                <span className={styles.checkbox__description}>
                  Employees can lock in preferred shifts weeks in advance
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.info__header}>
            <span className={styles.info__icon}>💡</span>
            <h4 className={styles.info__title}>How Points Work</h4>
          </div>
          <div className={styles.info__text}>
            <p className={styles.info__description}>
              Points incentivize employees to take less desirable shifts.
              High-demand shifts cost points, while unpopular shifts reward
              points. This creates a fair, self-balancing system where everyone
              gets a mix of preferred and challenging shifts.
            </p>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Save Changes?"
        description="Are you sure you want to update the points configurations?"
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

export default PointsRulesTemplate;
