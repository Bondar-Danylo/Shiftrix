// Styles
import styles from "./PointsHistoryCard.module.scss";

// Types
import type { PointsHistoryCardProps } from "./PointsHistoryCard.types";

// Icons
import ArrowDown from "@/assets/icons/arrow-down_icon.svg?react";
import ArrowUp from "@/assets/icons/stonks_icon.svg?react";

const PointsHistoryCard = ({ history }: PointsHistoryCardProps) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Points History</h2>
      <ul className={styles.list}>
        {history.map((tx) => (
          <li key={tx.id} className={styles.item}>
            <div className={styles.info}>
              <div
                className={`${styles.icon} ${
                  tx.type === "earned" ? styles.earned : styles.spent
                }`}
              >
                {tx.type === "earned" ? <ArrowUp /> : <ArrowDown />}
              </div>
              <div className={styles.text}>
                <h4 className={styles.item__title}>{tx.title}</h4>
                <p className={styles.item__subtitle}>{tx.date}</p>
              </div>
            </div>
            <span
              className={`${styles.amount} ${
                tx.type === "earned" ? styles.plus : styles.minus
              }`}
            >
              {tx.type === "earned" ? `+${tx.amount}` : `-${tx.amount}`} pts
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PointsHistoryCard;
