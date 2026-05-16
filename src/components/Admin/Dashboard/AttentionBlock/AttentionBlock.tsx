// Styles
import styles from "./AttentionBlock.module.scss";

// Types
import type { AlertSeverity, ShiftAlert } from "./IAttention.types";
import type { JSX } from "react";

// Components
import Button from "@/components/Common/Button/Button";

// Icons
import AttentionRedIcon from "@/assets/icons/attention_icon.svg?react";
import AttentionOrangeIcon from "@/assets/icons/attention-orange_icon.svg?react";
import AttentionBlueIcon from "@/assets/icons/attention-blue_icon.svg?react";

// Mocking Data
const attentionList: Array<ShiftAlert> = [
  {
    id: 1,
    title: "2 shifts uncovered",
    when: new Date("2026-05-20").toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    type: "uncovered",
    severity: "critical",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Evening shift understaffed",
    when: new Date("2026-05-24").toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    type: "understaffed",
    severity: "warning",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Ivan cancelled morning shift",
    when: new Date("2026-05-21").toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    type: "cancellation",
    severity: "info",
    createdAt: new Date().toISOString(),
  },
];

// Mapping Icons
const iconMap: Record<AlertSeverity, JSX.Element> = {
  critical: <AttentionRedIcon />,
  warning: <AttentionOrangeIcon />,
  info: <AttentionBlueIcon />,
};

const AttentionBlock = () => {
  return (
    <div className={styles.attention}>
      <h2 className={styles.title}>
        <AttentionRedIcon />
        <span>Attention Needed</span>
      </h2>
      {attentionList.length === 0 ? (
        <p className={styles.empty}>All shifts are covered! Good job 🎉🎉🎉</p>
      ) : (
        <ul className={styles.attention__list}>
          {attentionList.map((alert) => (
            <li key={alert.id} className={styles.attention__item}>
              <div className={styles.attention__content}>
                {iconMap[alert.severity]}
                <span className={styles.attention__message}>{alert.title}</span>
                <span className={styles.attention__date}>({alert.when})</span>
              </div>
              <Button
                type="button"
                size="small"
                isLink={false}
                className={styles.attention__button}
              >
                View details
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttentionBlock;
