// Styles
import styles from "./CardSpeed.module.scss";

// Components
import CardLayout from "@/components/Admin/Analytics/CardLayout/CardLayout";

// Icons
import LightingIcon from "@/assets/icons/lighting_icon.svg?react";
import ClockIcon from "@/assets/icons/clock_icon.svg?react";
import StonksIcon from "@/assets/icons/stonks_icon.svg?react";
import WhatsappIcon from "@/assets/icons/whatsapp_icon.svg?react";

// Imports
import type { CardSpeedProps } from "./CardSpeed.types";

const CardSpeed = ({ data, isLoading }: CardSpeedProps) => {
  if (isLoading || !data) {
    return (
      <CardLayout title="System Speed & Autonomy" image={LightingIcon}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span>Updating metrics...</span>
        </div>
      </CardLayout>
    );
  }

  return (
    <CardLayout title="System Speed & Autonomy" image={LightingIcon}>
      <ul className={styles.numbers}>
        <li className={styles.numbers__item}>
          <p className={styles.numbers__title}>
            <ClockIcon />
            <span>Average Fill Time</span>
          </p>
          <span className={styles.numbers__number}>
            {data.averageFillTimeHours}h
          </span>
          <p className={styles.numbers__text}>From shift publish to accept</p>
        </li>

        <li className={styles.numbers__item}>
          <p className={styles.numbers__title}>
            <StonksIcon />
            <span>Self-Service Rate</span>
          </p>
          <span className={styles.numbers__number}>
            {data.selfServiceRate}%
          </span>
          <p className={styles.numbers__text}>
            Shifts filled without manager input
          </p>
        </li>

        <li className={styles.numbers__item}>
          <p className={styles.numbers__title}>
            <WhatsappIcon />
            <span>WhatsApp Engagement</span>
          </p>
          <span className={styles.numbers__number}>
            {data.whatsappResponseRate}%
          </span>
          <p className={styles.numbers__text}>Responded within 15 minutes</p>
        </li>
      </ul>
    </CardLayout>
  );
};

export default CardSpeed;
