import { NavLink } from "react-router-dom";
import styles from "./Menu.module.scss";

// Icons
import DashboardIcon from "@/assets/icons/dashboard_icon.svg?react";
import ScheduleIcon from "@/assets/icons/schedule_icon.svg?react";
import EmployeesIcon from "@/assets/icons/employees_icon.svg?react";
import RequestIcon from "@/assets/icons/request_icon.svg?react";
import AnalyticsIcon from "@/assets/icons/analytic_icon.svg?react";
import SettingsIcon from "@/assets/icons/settings_icon.svg?react";
import StarIcon from "@/assets/icons/star_icon.svg?react";

// Types
import type { MenuItem, MenuProps } from "./Menu.types";

const menuConfig: MenuItem[] = [
  // Shared Pages
  {
    to: "/dashboard",
    label: "Dashboard",
    Icon: DashboardIcon,
    roles: ["admin", "user"],
  },
  {
    to: "/schedule",
    label: "Schedule",
    Icon: ScheduleIcon,
    roles: ["admin", "user"],
  },
  {
    to: "/settings",
    label: "Settings",
    Icon: SettingsIcon,
    roles: ["admin", "user"],
  },

  // Admin Pages
  {
    to: "/employees",
    label: "Employees",
    Icon: EmployeesIcon,
    roles: ["admin"],
  },
  { to: "/requests", label: "Requests", Icon: RequestIcon, roles: ["admin"] },
  {
    to: "/analytics",
    label: "Analytics",
    Icon: AnalyticsIcon,
    roles: ["admin"],
  },

  // User Pages
  { to: "/Points", label: "My Points", Icon: StarIcon, roles: ["user"] },
];

const Menu = ({ role, status, onClickEvent }: MenuProps) => {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? styles.active__link : styles.menu__link;

  return (
    <nav
      className={`${styles.navigation} ${status ? styles.openNavigation : ""}`}
    >
      <ul className={styles.menu}>
        {menuConfig
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <li key={item.to} className={styles.menu__item}>
              <NavLink
                to={item.to}
                className={getLinkClass}
                onClick={() => onClickEvent(!status)}
              >
                <item.Icon className={styles.menu__icon} />
                <p className={styles.menu__text}>{item.label}</p>
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Menu;
