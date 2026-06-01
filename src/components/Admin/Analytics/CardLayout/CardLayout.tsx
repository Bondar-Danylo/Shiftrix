// Styles
import styles from "./CardLayout.module.scss";

// Imports
import type { CardLayoutProps } from "./CardLayout.types";

const CardLayout = ({
  children,
  title,
  image: ImageComponent,
}: CardLayoutProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.card__title}>
        <ImageComponent />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
};

export default CardLayout;
