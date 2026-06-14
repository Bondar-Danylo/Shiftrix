// Imports
import { useState, type FormEvent } from "react";

// Styles
import styles from "./PointsRulesTemplate.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Icons
import SaveIcon from "@/assets/icons/save_icon.svg?react";
import MedalIcon from "@/assets/icons/medal_icon.svg?react";

// Types
import type { ExpirationOption } from "./PointsRulesTemplate.types";

const EXPIRATION_OPTIONS: ExpirationOption[] = [
  { id: "1_month", label: "Expire after 1 month" },
  { id: "3_months", label: "Expire after 3 months" },
  { id: "6_months", label: "Expire after 6 month" },
  { id: "1_year", label: "Expire after 1 year" },
  { id: "never", label: "Never expire" },
];

const PointsRulesTemplate = () => {
  const [defaultPoints, setDefaultPoints] = useState("3");
  const [maxPoints, setMaxPoints] = useState("50");

  const [expiration, setExpiration] = useState<ExpirationOption>(
    EXPIRATION_OPTIONS[2],
  );

  const [earlySelection, setEarlySelection] = useState(true);
  const [bookDaysOff, setBookDaysOff] = useState(true);
  const [reserveAdvance, setReserveAdvance] = useState(true);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();

    const pointsConfig = {
      defaultMonthlyPoints: Number(defaultPoints),
      maximumPointsPerEmployee: Number(maxPoints),
      pointsExpiration: expiration.id,
      allowedUses: {
        earlyShiftSelection: earlySelection,
        bookDaysOff: bookDaysOff,
        reserveShiftsInAdvance: reserveAdvance,
      },
    };

    console.log("Saving points configuration:", pointsConfig);
  };

  return (
    <form onSubmit={handleSave} className={styles.wrapper}>
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
              value={defaultPoints}
              onChange={(e) => setDefaultPoints(e.target.value)}
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
              value={maxPoints}
              onChange={(e) => setMaxPoints(e.target.value)}
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
            value={expiration}
            onSelect={(option) => setExpiration(option)}
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
              checked={earlySelection}
              onChange={(e) => setEarlySelection(e.target.checked)}
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
              checked={bookDaysOff}
              onChange={(e) => setBookDaysOff(e.target.checked)}
            />
            <span className={styles.checkbox__content}>
              <strong className={styles.checkbox__title}>Book Days Off</strong>
              <span className={styles.checkbox__description}>
                Employees can use points to request preferred days off
              </span>
            </span>
          </label>

          <label className={`${styles.checkbox} ${styles.green}`}>
            <input
              type="checkbox"
              checked={reserveAdvance}
              onChange={(e) => setReserveAdvance(e.target.checked)}
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
  );
};

export default PointsRulesTemplate;
