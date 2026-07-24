// Imports
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Styles
import styles from "./EmployeeDashboardPage.module.scss";

// Components
import CardLoader from "@/components/Common/Loader/Loader";

// Types
import type {
  EmployeeDashboardResponse,
  EmployeeDashboardStats,
  EmployeeUpcomingShift,
  StoredUser,
} from "./EmployeeDashboardPage.types";

const EmployeeDashboardPage = () => {
  const currentUser = useMemo<StoredUser | null>(() => {
    const storedUser: string | null = localStorage.getItem("user");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as StoredUser;
    } catch {
      return null;
    }
  }, []);

  const userId: number = Number(
    currentUser?.id || localStorage.getItem("user_id"),
  );

  const [stats, setStats] = useState<EmployeeDashboardStats | null>(null);

  const [upcomingShifts, setUpcomingShifts] = useState<EmployeeUpcomingShift[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (): Promise<void> => {
    if (!userId) {
      setError("User not found");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_employee_dashboard.php?user_id=${userId}`,
      );

      const data: EmployeeDashboardResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load dashboard");
      }

      setStats(data.stats);
      setUpcomingShifts(data.upcoming_shifts || []);
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : "Failed to load dashboard";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect((): void => {
    void loadDashboard();
  }, [loadDashboard]);

  if (isLoading) {
    return <CardLoader text="Loading dashboard..." />;
  }

  if (error || !stats) {
    return (
      <div className={styles.error}>
        {error || "Dashboard data unavailable"}
      </div>
    );
  }

  const hoursProgress: number =
    stats.max_hours > 0
      ? Math.min(100, Math.round((stats.total_hours / stats.max_hours) * 100))
      : 0;

  const shiftsProgress: number =
    stats.max_shifts > 0
      ? Math.min(100, Math.round((stats.total_shifts / stats.max_shifts) * 100))
      : 0;

  const nextShift: EmployeeUpcomingShift | undefined = upcomingShifts[0];

  return (
    <div className={styles.wrapper}>
      <section className={styles.welcome}>
        <div>
          <p className={styles.welcome__label}>Welcome back</p>
          <h2 className={styles.welcome__title}>
            {currentUser?.name || "Employee"}
          </h2>
          <p className={styles.welcome__text}>
            Here is your current work overview.
          </p>
        </div>

        <div className={styles.quickActions}>
          <Link to="/schedule" className={styles.quickActions__primary}>
            View Schedule
          </Link>
          <Link to="/requests" className={styles.quickActions__secondary}>
            Create Request
          </Link>
        </div>
      </section>

      <section className={styles.statsGrid}>
        <article className={styles.statCard}>
          <span className={styles.statCard__label}>Points</span>
          <strong className={styles.statCard__value}>{stats.points}</strong>
          <span className={styles.statCard__description}>Current balance</span>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statCard__label}>Worked hours</span>
          <strong className={styles.statCard__value}>
            {stats.worked_hours}h
          </strong>
          <span className={styles.statCard__description}>
            Completed this week
          </span>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statCard__label}>Booked hours</span>
          <strong className={styles.statCard__value}>
            {stats.booked_hours}h
          </strong>
          <span className={styles.statCard__description}>
            Upcoming this week
          </span>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statCard__label}>Shifts</span>
          <strong className={styles.statCard__value}>
            {stats.total_shifts} / {stats.max_shifts}
          </strong>
          <span className={styles.statCard__description}>Weekly limit</span>
        </article>

        <article className={styles.statCard}>
          <span className={styles.statCard__label}>Pending requests</span>
          <strong className={styles.statCard__value}>
            {stats.pending_requests}
          </strong>
          <span className={styles.statCard__description}>
            Waiting for review
          </span>
        </article>
      </section>

      <section className={styles.mainGrid}>
        <article className={styles.card}>
          <div className={styles.card__header}>
            <div>
              <h3 className={styles.card__title}>Weekly progress</h3>
              <p className={styles.card__subtitle}>Hours and shifts overview</p>
            </div>
          </div>

          <div className={styles.progressBlock}>
            <div className={styles.progressBlock__top}>
              <span>Hours</span>
              <strong>
                {stats.total_hours}h / {stats.max_hours}h
              </strong>
            </div>

            <div className={styles.progress}>
              <span style={{ width: `${hoursProgress}%` }} />
            </div>
          </div>

          <div className={styles.progressBlock}>
            <div className={styles.progressBlock__top}>
              <span>Shifts</span>
              <strong>
                {stats.total_shifts} / {stats.max_shifts}
              </strong>
            </div>

            <div className={styles.progress}>
              <span style={{ width: `${shiftsProgress}%` }} />
            </div>
          </div>
        </article>

        <article className={styles.card}>
          <div className={styles.card__header}>
            <div>
              <h3 className={styles.card__title}>Next shift</h3>
              <p className={styles.card__subtitle}>
                Your closest upcoming shift
              </p>
            </div>
          </div>

          {nextShift ? (
            <div className={styles.nextShift}>
              <div className={styles.nextShift__date}>{nextShift.date}</div>
              <div className={styles.nextShift__time}>
                {nextShift.start_time.substring(0, 5)}
                {" -  "}
                {nextShift.end_time.substring(0, 5)}
              </div>

              <div className={styles.nextShift__info}>
                <strong>{nextShift.title}</strong>
                <span>{nextShift.position_name}</span>
              </div>

              <span className={styles.nextShift__points}>
                {nextShift.points} pts
              </span>
            </div>
          ) : (
            <div className={styles.empty}>No upcoming shifts</div>
          )}
        </article>
      </section>

      <section className={styles.card}>
        <div className={styles.card__header}>
          <div>
            <h3 className={styles.card__title}>Upcoming shifts</h3>
            <p className={styles.card__subtitle}>Your next scheduled shifts</p>
          </div>

          <Link to="/schedule" className={styles.card__link}>
            View all
          </Link>
        </div>

        {upcomingShifts.length > 0 ? (
          <div className={styles.shiftList}>
            {upcomingShifts.map((shift) => (
              <div key={shift.id} className={styles.shiftItem}>
                <div className={styles.shiftItem__date}>{shift.date}</div>
                <div className={styles.shiftItem__main}>
                  <strong>{shift.title}</strong>
                  <span>
                    {shift.start_time.substring(0, 5)}
                    {" - "}
                    {shift.end_time.substring(0, 5)}
                  </span>
                </div>

                <span className={styles.shiftItem__position}>
                  {shift.position_name}
                </span>
                <span className={styles.shiftItem__points}>
                  {shift.points} pts
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>No upcoming shifts</div>
        )}
      </section>
    </div>
  );
};

export default EmployeeDashboardPage;
