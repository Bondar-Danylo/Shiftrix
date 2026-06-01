// Styles
import styles from "./Header.module.scss";

// Components
import Button from "@/components/Common/Button/Button";

// Icons
import LogoutIcon from "@/assets/icons/log-out_icon.svg?react";

// Imports
import {
  useLocation,
  useNavigate,
  type Location,
  type NavigateFunction,
} from "react-router-dom";

const Header = () => {
  const location: Location = useLocation();
  const pathName: string =
    location.pathname.split("/").filter(Boolean).pop() || "";

  const formattedTitle: string =
    pathName.charAt(0).toUpperCase() + pathName.slice(1);

  const navigate: NavigateFunction = useNavigate();

  const logoutHandler = (): void => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{formattedTitle}</h1>
      <Button
        className={styles.logout}
        isLink={false}
        type="button"
        size="small"
        onClick={logoutHandler}
      >
        <LogoutIcon className={styles.logout__icon} />
        Log out
      </Button>
    </header>
  );
};

export default Header;
