// Styles
import styles from "./AttentionBlock.module.scss";

// Types
import type {
  AlertSeverity,
  AttentionResponse,
  ShiftAlert,
} from "./IAttention.types";
import type { JSX } from "react";

// Components
import Button from "@/components/Common/Button/Button";
import CardLoader from "@/components/Common/Loader/Loader";

// Icons
import AttentionRedIcon from "@/assets/icons/attention_icon.svg?react";
import AttentionOrangeIcon from "@/assets/icons/attention-orange_icon.svg?react";
import AttentionBlueIcon from "@/assets/icons/attention-blue_icon.svg?react";

// Imports
import { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

const iconMap: Record<AlertSeverity, JSX.Element> = {
  critical: <AttentionRedIcon />,
  warning: <AttentionOrangeIcon />,
  info: <AttentionBlueIcon />,
};

const AttentionBlock = () => {
  const navigate: NavigateFunction = useNavigate();
  const [attentionList, setAttentionList] = useState<ShiftAlert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    const loadAlerts = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/get_attention_alerts.php`,
        );

        const data: AttentionResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load alerts");
        }

        setAttentionList(Array.isArray(data.alerts) ? data.alerts : []);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        setError(message);
        setAttentionList([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadAlerts();
  }, []);

  const handleViewDetails = (alert: ShiftAlert): void => {
    navigate("/schedule", {
      state: { shiftId: alert.shift_id, date: alert.date },
    });
  };

  if (isLoading) {
    return <CardLoader text="Loading alerts..." />;
  }

  return (
    <div className={styles.attention}>
      <h2 className={styles.title}>
        <AttentionRedIcon />
        <span>Attention Needed</span>
      </h2>

      {error ? (
        <p className={styles.empty}>{error}</p>
      ) : attentionList.length === 0 ? (
        <p className={styles.empty}>All shifts are covered! Good job 🎉🎉🎉</p>
      ) : (
        <ul className={styles.attention__list}>
          {attentionList.map((alert) => {
            const formattedDate = new Date(
              `${alert.date}T00:00:00`,
            ).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            });

            return (
              <li key={alert.id} className={styles.attention__item}>
                <div className={styles.attention__content}>
                  {iconMap[alert.severity]}

                  <span className={styles.attention__message}>
                    {alert.title}
                  </span>

                  <span className={styles.attention__date}>
                    ({formattedDate}, {alert.start_time})
                  </span>
                </div>
                <Button
                  type="button"
                  size="small"
                  isLink={false}
                  className={styles.attention__button}
                  onClick={() => handleViewDetails(alert)}
                >
                  View details
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AttentionBlock;
