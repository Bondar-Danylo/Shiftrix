// Styles
import styles from "./NumbersCard.module.scss";

// Icons
import PointsIcon from "@/assets/icons/medal_icon.svg?react";
import ClockIcon from "@/assets/icons/clock_icon.svg?react";
import ScheduleIcon from "@/assets/icons/schedule_icon.svg?react";
import ArrowUpIcon from "@/assets/icons/stonks_icon.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down_icon.svg?react";

// Components
import DonutChart from "@/components/Common/DonutChart/DonutChart";

// Types
import type { NumbersCardProps } from "./NumbersCard.types";

const NumbersCard = ({ profile }: NumbersCardProps) => {
  const remainingShifts: number = Math.max(
    profile.totalShifts - profile.completedShifts,
    0,
  );

  const shiftsChartData =
    profile.totalShifts === 0
      ? []
      : [
          { value: profile.completedShifts, color: "#10B981" },
          { value: remainingShifts, color: "#E2E8F0" },
        ];

  const remainingHours: number = Math.max(
    profile.maxHours - profile.currentHours,
    0,
  );

  const hoursChartData =
    profile.maxHours === 0
      ? []
      : [
          { value: profile.currentHours, color: "#F59E0B" },
          { value: remainingHours, color: "#E2E8F0" },
        ];

  const monthlyPoints: number = profile.pointsThisMonth;

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>
            <PointsIcon />
          </span>
          <div className={styles.info}>
            <span className={styles.info__value}>{profile.points}</span>
            <p className={styles.info__text}>Current Points</p>
          </div>
          {monthlyPoints >= 0 ? (
            <div className={`${styles.badge} ${styles.plusPoints}`}>
              <ArrowUpIcon />+ {monthlyPoints}
            </div>
          ) : (
            <div className={`${styles.badge} ${styles.minusPoints}`}>
              <ArrowDownIcon /> {monthlyPoints}
            </div>
          )}
        </div>
        <p className={styles.description}>
          {monthlyPoints >= 0 ? "+" : ""} {monthlyPoints} points this month
        </p>
      </div>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>
            <ClockIcon />
          </span>
          <div className={styles.info}>
            <span className={styles.info__value}>
              {profile.completedShifts}/{profile.totalShifts}
            </span>
            <p className={styles.info__text}>Shifts This Week</p>
          </div>
          <div className={styles.chartContainer}>
            <DonutChart data={shiftsChartData} size={44} strokeWidth={10} />
          </div>
        </div>
        <p className={styles.description}>
          {profile.completedShifts} completed, {remainingShifts} upcoming
        </p>
      </div>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>
            <ScheduleIcon />
          </span>
          <div className={styles.info}>
            <span className={styles.info__value}>{profile.currentHours}h</span>
            <p className={styles.info__text}>Scheduled This Week</p>
          </div>
          <div className={styles.chartContainer}>
            <DonutChart data={hoursChartData} size={44} strokeWidth={10} />
          </div>
        </div>
        <p className={styles.description}>
          {profile.currentHours} hours of {profile.maxHours} contract hours
        </p>
      </div>
    </div>
  );
};

export default NumbersCard;
