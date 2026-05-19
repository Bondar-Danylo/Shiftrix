// Styles
import styles from "./QuickActionCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";
import Button from "@/components/Common/Button/Button";

// Icons
import PlusIcon from "@/assets/icons/plus_icon.svg?react";
import LightingIcon from "@/assets/icons/lighting_icon.svg?react";
import TelegramIcon from "@/assets/icons/telegram_icon.svg?react";
import DocumentIcon from "@/assets/icons/document_icon.svg?react";
import StonksIcon from "@/assets/icons/stonks_icon.svg?react";

// Types
import type { QuickActionButtons } from "./QuickActionCard.types";

const QuickActionCard = () => {
  const buttons: QuickActionButtons[] = [
    {
      icon: PlusIcon,
      text: "Create Shift",
      isActive: true,
      isLink: true,
      to: "#",
    },
    {
      icon: LightingIcon,
      text: "Fill Unassigned Shifts",
      isActive: false,
      isLink: false,
      to: "",
    },
    {
      icon: TelegramIcon,
      text: "Notify Staff",
      isActive: false,
      isLink: false,
      to: "",
    },
    {
      icon: DocumentIcon,
      text: "Publish Schedule",
      isActive: false,
      isLink: false,
      to: "",
    },
    {
      icon: StonksIcon,
      text: "Auto-Assign",
      isActive: false,
      isLink: false,
      to: "",
    },
  ];
  return (
    <CardLayout title="Quick Actions" subtitle="" className={styles.wrapper}>
      <ul className={styles.list}>
        {buttons.map((button: QuickActionButtons) => (
          <li key={button.text} className={styles.list__item}>
            <Button
              isLink={button.isLink}
              type="button"
              size="large"
              to={button.to ? button.to : undefined}
              className={
                button.isActive
                  ? `${styles.button} ${styles.active}`
                  : styles.button
              }
            >
              <button.icon className={styles.icon} />
              <span className={styles.text}>{button.text}</span>
            </Button>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
};

export default QuickActionCard;
