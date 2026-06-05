// Styles
import styles from "./CardTopPerformers.module.scss";

// Components
import CardLayout from "@/components/Admin/Analytics/CardLayout/CardLayout";
import CardLoader from "@/components/Common/Loader/Loader";

// Icons
import UsersIcon from "@/assets/icons/employees_icon.svg?react";

// Types
import type { CardTopPerformersProps } from "./CardTopPerformers.types";

const CardTopPerformers = ({ data, isLoading }: CardTopPerformersProps) => {
  if (isLoading || !data) {
    return (
      <CardLayout title="Top Performers (Reliability)" image={UsersIcon}>
        <CardLoader text="Loading Leaderboard..." />
      </CardLayout>
    );
  }

  return (
    <CardLayout title="Top Performers (Reliability)" image={UsersIcon}>
      <ul className={styles.performersList}>
        {data.map((performer, index) => {
          const rank = index + 1;

          return (
            <li key={performer.id} className={styles.performerItem}>
              <div className={styles.rankBadge}>{rank}</div>

              <div className={styles.avatarWrapper}>
                {performer.avatarUrl ? (
                  <img
                    src={performer.avatarUrl}
                    alt={performer.name}
                    className={styles.avatar}
                  />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {performer.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className={styles.info}>
                <span className={styles.name}>{performer.name}</span>
                <span className={styles.role}>{performer.role}</span>
              </div>

              <div className={styles.rate}>{performer.reliabilityRate}%</div>
            </li>
          );
        })}
      </ul>
    </CardLayout>
  );
};

export default CardTopPerformers;
