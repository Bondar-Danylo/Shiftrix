// Styles
import styles from "./ContactCard.module.scss";

// Icons
import MailIcon from "@/assets/icons/envelope_icon.svg?react";
import PhoneIcon from "@/assets/icons/phone_icon.svg?react";
import CalendarIcon from "@/assets/icons/schedule_icon.svg?react";

// Types
import type { ContactCardProps } from "./ContactCard.types";

const ContactCard = ({ profile }: ContactCardProps) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Contact Information</h2>
      <ul className={styles.list}>
        <li className={styles.item}>
          <MailIcon className={styles.icon} />
          <div className={styles.info}>
            <span className={styles.label}>Email:</span>
            <a href={`mailto:${profile.email}`} className={styles.value}>
              {profile.email}
            </a>
          </div>
        </li>

        <li className={styles.item}>
          <PhoneIcon className={styles.icon} />
          <div className={styles.info}>
            <span className={styles.label}>Phone:</span>
            <a href={`tel:${profile.phone}`} className={styles.value}>
              {profile.phone}
            </a>
          </div>
        </li>

        <li className={styles.item}>
          <CalendarIcon className={styles.icon} />
          <div className={styles.info}>
            <span className={styles.label}>Joined:</span>
            <span className={styles.value}>{profile.joinedDate}</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContactCard;
