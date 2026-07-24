// Imports
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Styles
import styles from "./Sidebar.module.scss";

// Components
import Logo from "@/components/Common/Logo/Logo";
import Menu from "@/components/Common/Menu/Menu";

// Icons
import BurgerMenuIcon from "@/assets/icons/burger-menu_icon.svg?react";

// Types
import type { StoredUser } from "./Sidebar.types";
import type { UserRole } from "@/types/User.types";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const currentUser = useMemo<StoredUser | null>(() => {
    const storedUser: string | null = localStorage.getItem("user");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as StoredUser;
    } catch {
      return null;
    }
  }, []);

  const userRole: UserRole =
    currentUser?.role ||
    (localStorage.getItem("userRole") as UserRole) ||
    "user";

  const userName: string = currentUser?.name || "User";

  const userPosition: string =
    currentUser?.position_name || currentUser?.position_id || "Employee";

  const userAvatar: string =
    currentUser?.avatarUrl ||
    `https://api.dicebear.com/10.x/avataaars/png?seed=${currentUser?.id || 0}`;

  const homePath: string =
    userRole === "admin" ? "/dashboard" : "/employee-dashboard";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__top}>
        <Link to={homePath} className={styles.logo}>
          <Logo size={40} />
          <p className={styles.logo__text}>
            Shiftrix <span>v3.0</span>
          </p>
        </Link>
      </div>

      <Menu role={userRole} status={isMenuOpen} onClickEvent={setIsMenuOpen} />

      <div className={styles.sidebar__bottom}>
        <Link to="/profile" className={styles.user}>
          <img
            src={userAvatar}
            alt={userName}
            className={styles.user__img}
            onError={(event) => (event.currentTarget.onerror = null)}
          />

          <p className={styles.user__info}>
            {userName}
            <span>{userPosition}</span>
          </p>
        </Link>
      </div>

      <BurgerMenuIcon
        onClick={() => setIsMenuOpen((previous) => !previous)}
        className={styles.burger}
      />
    </aside>
  );
};

export default Sidebar;
