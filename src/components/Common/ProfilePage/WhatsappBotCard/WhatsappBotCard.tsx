// Styles
import styles from "./WhatsappBotCard.module.scss";

// Icons
import WhatsappIcon from "@/assets/icons/whatsapp_icon.svg?react";

// Types
import type { WhatsappBotCardProps } from "./WhatsappBotCard.types";
import type { NotificationSettings } from "@/pages/Common/ProfilePage/ProfilePage.types";

const WhatsappBotCard = ({
  profile,
  notifications,
  onNotificationChange,
}: WhatsappBotCardProps) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>WhatsApp Bot</h2>

      {profile.whatsappConnected && (
        <div className={styles.connection}>
          <WhatsappIcon className={styles.icon} />
          <div>
            <p className={styles.connection__status}>Connected</p>
            <p className={styles.connection__phone}>{profile.whatsappPhone}</p>
          </div>
        </div>
      )}

      <div className={styles.settings}>
        <h3 className={styles.settings__title}>Notification Settings</h3>
        {Object.keys(notifications).map((rawKey) => {
          const key = rawKey as keyof NotificationSettings;

          const withSpaces: string = key.replace(/([A-Z])/g, " $1");
          const finalLabel: string =
            withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);

          return (
            <label key={key} className={styles.label}>
              <span>{finalLabel}</span>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={() => onNotificationChange(key)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default WhatsappBotCard;
