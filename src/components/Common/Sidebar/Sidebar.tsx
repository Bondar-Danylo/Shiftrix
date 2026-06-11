// Styles
import styles from "./Sidebar.module.scss";

// Components
import Logo from "@/components/Common/Logo/Logo";
import Menu from "@/components/Common/Menu/Menu";

// Icons
import userIcon from "@/assets/user_img.png";
import BurgerMenuIcon from "@/assets/icons/burger-menu_icon.svg?react";

// Imports
import { Link } from "react-router-dom";
import type { UserRole } from "@/types/User.types";
import { useState } from "react";

const Sidebar = () => {
  const userRole = (localStorage.getItem("userRole") as UserRole) || "user";
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__top}>
        <Link to={"/dashboard"} className={styles.logo}>
          <Logo size={40} />
          <p className={styles.logo__text}>
            Shiftrix <span>v3.0</span>
          </p>
        </Link>
      </div>
      <Menu role={userRole} status={isMenuOpen} onClickEvent={setIsMenuOpen} />
      <div className={styles.sidebar__bottom}>
        <Link to="/profile" className={styles.user}>
          <img src={userIcon} alt="User Image" className={styles.user__img} />
          <p className={styles.user__info}>
            Danylo Bondar
            <span>Manager</span>
          </p>
        </Link>
      </div>
      <BurgerMenuIcon
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={styles.burger}
      />
    </aside>
  );
};

export default Sidebar;
