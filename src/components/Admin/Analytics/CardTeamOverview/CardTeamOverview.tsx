// Styles
import styles from "./CardTeamOverview.module.scss";

// Components
import CardLayout from "@/components/Admin/Analytics/CardLayout/CardLayout";

// Icons
import TeamIcon from "@/assets/icons/request_icon.svg?react";
import CardLoader from "@/components/Common/Loader/Loader";

// Types
import type { CardTeamOverviewProps } from "./CardTeamOverview.types";

const CardTeamOverview = ({ data, isLoading }: CardTeamOverviewProps) => {
  if (isLoading || !data) {
    return (
      <CardLayout title="Team Overview" image={TeamIcon}>
        <CardLoader text="Loading Team Overview..." />
      </CardLayout>
    );
  }

  return (
    <CardLayout title="Team Overview" image={TeamIcon}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.block}>
            <span className={styles.label}>Total Employees</span>
            <span className={styles.value}>{data.totalEmployees}</span>
          </div>

          <div className={styles.block}>
            <span className={styles.label}>Avg Shift Fill</span>
            <span className={styles.value}>{data.avgShiftFill}%</span>
          </div>

          <div className={styles.block}>
            <span className={styles.label}>Shift Swaps</span>
            <span className={styles.value}>{data.shiftSwaps}</span>
          </div>

          <div className={styles.block}>
            <span className={styles.label}>Auto-Filled</span>
            <span className={styles.value}>{data.autoFilled}</span>
          </div>

          <div className={styles.block}>
            <span className={styles.label}>Sick Leaves</span>
            <span className={styles.value}>{data.sickLeaves}</span>
          </div>

          <div className={styles.block}>
            <span className={styles.label}>Total Hours</span>
            <span className={styles.value}>{data.totalHours}h</span>
          </div>
        </div>

        <div className={styles.overtimeBlock}>
          <span className={styles.label}>Overtime Hours</span>
          <span className={`${styles.value} ${styles.value_danger}`}>
            {data.overtimeHours.toFixed(1)}h
          </span>
        </div>
      </div>
    </CardLayout>
  );
};

export default CardTeamOverview;
