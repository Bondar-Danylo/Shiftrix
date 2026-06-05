// Styles
import styles from "./Loader.module.scss";

// Types
import type { CardLoaderProps } from "./Loader.types";

const CardLoader = ({ text = "Loading data..." }: CardLoaderProps) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default CardLoader;
