// Styles
import styles from "./StaffHealthCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";
import Button from "@/components/Common/Button/Button";

// Icons
import ArrowIcon from "@/assets/icons/arrow_icon.svg?react";

// Types
import type {
  StaffHealthCardData,
  StaffHealthResponse,
} from "./StaffHealthCard.types";

// Imports
import { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

const StaffHealthCard = () => {
  const navigate: NavigateFunction = useNavigate();
  const [staff, setStaff] = useState<StaffHealthCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    const loadStaffHealth = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/get_staff_health.php`,
        );

        const data: StaffHealthResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load staff health");
        }

        setStaff(Array.isArray(data.staff) ? data.staff : []);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        setError(message);
        setStaff([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadStaffHealth();
  }, []);

  const handleViewAll = (): void => {
    navigate("/employees");
  };

  return (
    <CardLayout title="Staff Health" subtitle="" className={styles.wrapper}>
      {isLoading ? (
        <p className={styles.empty}>Loading staff health...</p>
      ) : error ? (
        <p className={styles.empty}>{error}</p>
      ) : staff.length === 0 ? (
        <p className={styles.empty}>No staff issues found</p>
      ) : (
        <ul className={styles.list}>
          {staff.map((item) => (
            <li key={item.id} className={styles.item}>
              <p className={styles.name}>{item.name}</p>

              <span className={styles.reason}>{item.reason}</span>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        isLink={false}
        size="large"
        className={styles.button}
        onClick={handleViewAll}
      >
        View All
        <ArrowIcon className={styles.arrow} />
      </Button>
    </CardLayout>
  );
};

export default StaffHealthCard;
