// Styles
import styles from "./RequestsCard.module.scss";

// Components
import Button from "@/components/Common/Button/Button";

// Icons
import HolidayIcon from "@/assets/icons/holiday_icon.svg?react";
import SwapIcon from "@/assets/icons/swap_icon.svg?react";
import ClockIcon from "@/assets/icons/clock_icon.svg?react";
import ScheduleIcon from "@/assets/icons/schedule_icon.svg?react";
import CheckIcon from "@/assets/icons/check_icon.svg?react";
import RejectIcon from "@/assets/icons/reject_icon.svg?react";

// Imports
import { Link } from "react-router-dom";
import type { RequestCardProps } from "./RequestsCard.types";

const getRelativeTimeString = (createdAtString: Date): string => {
  const createdDate: Date = new Date(createdAtString);
  const now: Date = new Date();

  const diffInMs: number = now.getTime() - createdDate.getTime();
  const diffInMinutes: number = Math.floor(diffInMs / (1000 * 60));
  const diffInHours: number = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays: number = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Requested just now";
  if (diffInMinutes < 60) return `Requested ${diffInMinutes}m ago`;
  if (diffInHours < 24) return `Requested ${diffInHours}h ago`;
  return `Requested ${diffInDays}d ago`;
};

const RequestCard = ({ item }: RequestCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.profile}>
          <Link className={styles.profileInfo} to={`/users/${item.from.id}`}>
            <h4 className={styles.name}>{item.from.name}</h4>
            <p className={styles.position}>{item.from.position}</p>
          </Link>
        </div>

        <span className={`${styles.badge} ${styles[`badge_${item.type}`]}`}>
          {item.type === "swap" && (
            <>
              <SwapIcon />
              Shift Swap
            </>
          )}
          {item.type === "dayoff" && (
            <>
              <HolidayIcon />
              Day Off Request
            </>
          )}
          {item.type === "holiday" && (
            <>
              <HolidayIcon />
              Vacation Request
            </>
          )}
        </span>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.metaItem}>
          <ClockIcon />
          <span className={styles.metaText}>
            {getRelativeTimeString(item.createdAt)}
          </span>
        </div>

        <div className={styles.metaItem}>
          <ScheduleIcon />
          <span className={styles.metaText}>{item.date}</span>
        </div>

        <p className={styles.reason}>
          <span className={styles.reasonLabel}>Reason:</span> {item.reason}
        </p>

        {item.with && (
          <div className={styles.swapWith}>
            <span className={styles.reasonLabel}>Swap with:</span>
            <Link to={`/users/${item.with.id}`} className={styles.swapName}>
              {item.with.name}
            </Link>
          </div>
        )}
      </div>

      <div className={styles.cardActions}>
        <Button
          type="button"
          isLink={false}
          size="normal"
          className={styles.btnApprove}
        >
          <CheckIcon />
          Approve
        </Button>
        <Button
          type="button"
          isLink={false}
          size="normal"
          className={styles.btnReject}
        >
          <RejectIcon />
          Reject
        </Button>
      </div>
    </div>
  );
};

export default RequestCard;
