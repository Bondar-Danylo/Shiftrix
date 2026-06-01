// Styles
import styles from "./CardLayout.module.scss";

// Imports
import type { CardLayoutProps } from "./CardLayout.types";

const CardLayout = ({
  title,
  subtitle,
  children,
  className,
}: CardLayoutProps) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.top}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.main}>{children}</div>
    </div>
  );
};

export default CardLayout;
