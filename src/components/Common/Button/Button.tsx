import styles from "./Button.module.scss";
import type { IButton } from "./Button.types";

const Button = ({
  type,
  isLink = false,
  size = "normal",
  children,
  to = "#",
  className,
  onClick,
}: IButton) => {
  const buttonClasses: string = `${styles.btn} ${styles[size]} ${className}`;

  return isLink ? (
    <a href={to} className={buttonClasses} onClick={onClick}>
      {children}
    </a>
  ) : (
    <button type={type} className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
