// Styles
import styles from "./EmployeeModal.module.scss";

// Types
import type { ExtendedEmployeeModalProps } from "./EmployeeModal.types";

// Imports
import { useEffect } from "react";

// Icons
import CloseIcon from "@/assets/icons/reject_icon.svg?react";
import MailIcon from "@/assets/icons/envelope_icon.svg?react";
import PhoneIcon from "@/assets/icons/phone_icon.svg?react";
import ScheduleIcon from "@/assets/icons/schedule_icon.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down_icon.svg?react";
import ArrowUpIcon from "@/assets/icons/stonks_icon.svg?react";
import Button from "@/components/Common/Button/Button";

const EmployeeModal = ({
  employee,
  isOpen,
  onClose,
  onEdit,
  pointsHistory = [],
}: ExtendedEmployeeModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !employee) return null;

  const progressWidth = Math.min(
    (employee.currentHours / employee.max_hours) * 100,
    100,
  );

  const avatarCheck: string | undefined =
    `${import.meta.env.VITE_API_MAIN}/${employee.photo_url}`.split("/").at(-1);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <CloseIcon />
        </button>

        <div className={styles.header}>
          <img
            src={
              avatarCheck != "null"
                ? `${import.meta.env.VITE_API_MAIN}/${employee.photo_url}`
                : `https://api.dicebear.com/10.x/avataaars/png?seed=${employee.id}`
            }
            alt={employee.name}
            className={styles.avatar}
          />
          <div className={styles.headerInfo}>
            <h2 className={styles.name}>{employee.name}</h2>
            <p className={styles.role}>
              {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
            </p>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.statusVacation}`}>
                {employee.status.charAt(0).toUpperCase() +
                  employee.status.slice(1)}
              </span>
              {employee.is_bot_connected ? (
                <span className={`${styles.badge} ${styles.statusWhatsapp}`}>
                  WhatsApp Connected
                </span>
              ) : (
                <span className={`${styles.badge} ${styles.statusNotWhatsapp}`}>
                  WhatsApp NOT Connected
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <MailIcon className={styles.infoIcon} />
                <span className={styles.label}>Email:</span>
                <a href={`mailto:${employee.email}`} className={styles.link}>
                  {employee.email}
                </a>
              </div>
              <div className={styles.infoRow}>
                <PhoneIcon className={styles.infoIcon} />
                <span className={styles.label}>Phone:</span>
                <span className={styles.value}>
                  {employee.phone_number ? employee.phone_number : "HIDEN"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <ScheduleIcon className={styles.infoIcon} />
                <span className={styles.label}>Joined:</span>
                <span className={styles.value}>
                  {employee.created_at
                    ? new Date(employee.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Work Statistics</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.cardLabel}>Weekly Hours</span>
                <div className={styles.cardValueContainer}>
                  <span className={styles.cardValue}>
                    {employee.currentHours}h
                  </span>
                </div>
                <span className={styles.cardSubtext}>
                  of {employee.max_hours}h contract
                </span>
                <div className={styles.progressBg}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>

              <div className={styles.statCard}>
                <span className={styles.cardLabel}>Reliability</span>
                <span className={styles.cardValue}>89%</span>
                <span
                  className={`${styles.tag} ${employee.reliabilityRate >= 95 ? styles.excellent : styles.good}`}
                >
                  {employee.reliabilityRate >= 95 ? "Excellent" : "Good"}
                </span>
              </div>

              <div className={`${styles.statCard} ${styles.blueCard}`}>
                <span className={styles.cardLabelBlue}>Current Points</span>
                <span className={styles.cardValueBlue}>
                  {employee.points_balance}
                </span>
                <span className={styles.cardSubtextBlue}>
                  Available balance
                </span>
              </div>

              <div className={styles.statCard}>
                <span className={styles.cardLabel}>Scheduled Hours</span>
                <span className={styles.cardValue}>{employee.max_hours}h</span>
                <span className={styles.cardSubtext}>This period</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Points History</h3>
            <div className={styles.historyList}>
              {pointsHistory.length === 0 ? (
                <div className={styles.emptyHistory}>
                  No points history available
                </div>
              ) : (
                pointsHistory.map((item) => {
                  const isEarned = item.type === "added";

                  return (
                    <div key={item.id} className={styles.historyRow}>
                      <div className={styles.historyLeft}>
                        <div
                          className={`${styles.trendIconContainer} ${isEarned ? styles.earnedBg : styles.spentBg}`}
                        >
                          {isEarned ? (
                            <ArrowUpIcon className={styles.trendIconEarned} />
                          ) : (
                            <ArrowDownIcon className={styles.trendIconSpent} />
                          )}
                        </div>
                        <div>
                          <p className={styles.historyTitle}>{item.title}</p>
                          <p className={styles.historyDate}>{item.date}</p>
                        </div>
                      </div>
                      <span
                        className={`${styles.pointsValue} ${isEarned ? styles.pointsAdd : styles.pointsRemove}`}
                      >
                        {isEarned ? `+${item.amount}` : `-${item.amount}`} pts
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            isLink={false}
            type="button"
            size="normal"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            isLink={false}
            type="button"
            size="normal"
            className={styles.submitBtn}
            onClick={() => onEdit?.(employee.id)}
          >
            Edit Employee
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
