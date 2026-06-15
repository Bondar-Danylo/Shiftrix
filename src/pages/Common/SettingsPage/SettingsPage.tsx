// Imports
import { useState } from "react";

// Styles
import styles from "./SettingsPage.module.scss";

// Components
import Templates from "@/components/Admin/Settings/Templates/TemplatesLayout/Templates";
import PointsRulesTemplate from "@/components/Admin/Settings/PointsRules/PointsRulesTemplate/PointsRulesTemplate";
import SchedulingRulesTemplate from "@/components/Admin/Settings/SchedulingRules/SchedulingRulesTemplate/SchedulingRulesTemplate";
import NotificationsTemplate from "@/components/Admin/Settings/Notifications/NotificationsTemplate/NotificationsTemplate";

// Types
import type { UserRole, TabConfig, SettingsTabId } from "./SettingsPage.types";

const TABS_CONFIG: TabConfig[] = [
  {
    id: "shift-templates",
    label: "Shift Templates",
    allowedRoles: ["Manager"],
  },
  { id: "points-rules", label: "Points Rules", allowedRoles: ["Manager"] },
  {
    id: "scheduling-rules",
    label: "Scheduling Rules",
    allowedRoles: ["Manager"],
  },
  {
    id: "whatsapp-bot",
    label: "WhatsApp Bot",
    allowedRoles: ["Manager", "Employee"],
  },
];

const SettingsPage = () => {
  const [currentRole] = useState<UserRole>("Manager");

  const visibleTabs = TABS_CONFIG.filter((tab) =>
    tab.allowedRoles.includes(currentRole),
  );

  const [activeTab, setActiveTab] = useState<SettingsTabId>(visibleTabs[0]?.id);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tabs__button} ${activeTab === tab.id ? styles.tabs__active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === "shift-templates" && <Templates />}

        {activeTab === "whatsapp-bot" && <NotificationsTemplate />}

        {activeTab === "points-rules" && <PointsRulesTemplate />}
        {activeTab === "scheduling-rules" && <SchedulingRulesTemplate />}
        {activeTab === "roles-contracts" && (
          <div>Roles & Contracts Setup View</div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
