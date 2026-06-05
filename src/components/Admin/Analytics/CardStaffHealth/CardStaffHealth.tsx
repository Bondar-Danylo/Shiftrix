// Styles
import styles from "./CardStaffHealth.module.scss";

// Components
import CardLayout from "@/components/Admin/Analytics/CardLayout/CardLayout";
import CardLoader from "@/components/Common/Loader/Loader";

// Icons
import WarningIcon from "@/assets/icons/attention_icon.svg?react";

// Types
import type { RiskEmployee } from "@/pages/Admin/AnalyticsPage/AnalyticsPage.types";
import type { CardStaffHealthProps } from "./CardStaffHealth.types";

const CardStaffHealth = ({ data, isLoading }: CardStaffHealthProps) => {
  if (isLoading || !data) {
    return (
      <CardLayout title="Staff Health & Risk Analysis" image={WarningIcon}>
        <CardLoader text="Analysing Staff Workload..." />
      </CardLayout>
    );
  }

  const renderColumn = (
    title: "Underworked" | "Overworked",
    list: RiskEmployee[],
    dotClass: string,
    emptyText: string,
    hoursLabel: string,
  ) => {
    const hasEmployees = list.length > 0;

    return (
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <span className={`${styles.dot} ${dotClass}`} />
          <h4 className={styles.columnTitle}>
            {title} <span className={styles.count}>({list.length})</span>
          </h4>
        </div>

        <div className={styles.columnContent}>
          {hasEmployees ? (
            <ul className={styles.employeeList}>
              {list.map((emp) => (
                <li key={emp.id} className={styles.employeeItem}>
                  <div className={styles.leftInfo}>
                    {emp.avatarUrl ? (
                      <img
                        src={emp.avatarUrl}
                        alt={emp.name}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {emp.name[0]}
                      </div>
                    )}
                    <div className={styles.meta}>
                      <span className={styles.name}>{emp.name}</span>
                      <span className={styles.role}>{emp.role}</span>
                    </div>
                  </div>
                  <div className={styles.rightHours}>
                    <span className={styles.hoursValue}>
                      {emp.hoursDeviation}h
                    </span>
                    <span className={styles.hoursLabel}>{hoursLabel}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyText}>{emptyText}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <CardLayout title="Staff Health & Risk Analysis" image={WarningIcon}>
      <div className={styles.container}>
        {renderColumn(
          "Underworked",
          data.underworked,
          styles.dot_yellow,
          "No underworked employees",
          "short",
        )}
        <div className={styles.divider} />
        {renderColumn(
          "Overworked",
          data.overworked,
          styles.dot_red,
          "No overworked employees",
          "over",
        )}
      </div>
    </CardLayout>
  );
};

export default CardStaffHealth;
