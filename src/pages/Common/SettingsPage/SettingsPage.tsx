// Imports
import { useState } from "react";

// Styles
import styles from "./SettingsPage.module.scss";

// Components
import WhatsappBotCard from "@/components/Common/ProfilePage/WhatsappBotCard/WhatsappBotCard";
import ScheduleDeliveryCard from "@/components/Common/ProfilePage/ScheduleDeliveryCard/ScheduleDeliveryCard";
import Templates from "@/components/Admin/Settings/Templates/TemplatesLayout/Templates";

// Types
import type { UserRole, TabConfig, SettingsTabId } from "./SettingsPage.types";
import type { NotificationSettings } from "@/pages/Common/ProfilePage/ProfilePage.types";
import PointsRulesTemplate from "@/components/Admin/Settings/PointsRules/PointsRulesTemplate/PointsRulesTemplate";

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
    id: "roles-contracts",
    label: "Roles & Contracts",
    allowedRoles: ["Manager"],
  },
  {
    id: "whatsapp-bot",
    label: "WhatsApp Bot",
    allowedRoles: ["Manager", "Employee"],
  },
];

const MOCK_USER_PROFILE = {
  id: 1,
  name: "Sarah Johnson",
  whatsappConnected: true,
  whatsappPhone: "+1 (555) 123-4567",
};

const SettingsPage = () => {
  const [currentRole] = useState<UserRole>("Manager");

  const visibleTabs = TABS_CONFIG.filter((tab) =>
    tab.allowedRoles.includes(currentRole),
  );

  const [activeTab, setActiveTab] = useState<SettingsTabId>(visibleTabs[0]?.id);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    shiftReminders: true,
    scheduleUpdates: true,
    shiftRequests: false,
    pointsUpdates: true,
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

        {activeTab === "whatsapp-bot" && (
          <div className={styles.whatsappGrid}>
            <div className={styles.column}>
              <WhatsappBotCard
                profile={MOCK_USER_PROFILE as any}
                notifications={notifications}
                onNotificationChange={handleNotificationChange}
              />
            </div>
            <div className={styles.column}>
              <ScheduleDeliveryCard />
            </div>
          </div>
        )}

        {activeTab === "points-rules" && <PointsRulesTemplate />}
        {activeTab === "scheduling-rules" && (
          <div>Scheduling Rules Setup View</div>
        )}
        {activeTab === "roles-contracts" && (
          <div>Roles & Contracts Setup View</div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
