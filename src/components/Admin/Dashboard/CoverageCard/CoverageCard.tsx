// Styles
import styles from "./CoverageCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";
import DonutChart from "@/components/Common/DonutChart/DonutChart";
import Button from "@/components/Common/Button/Button";
import CardLoader from "@/components/Common/Loader/Loader";

// Imports
import { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";

// Types
import type { CoverageItem, TodayCoverageResponse } from "./CoverageCard.types";

const CoverageCard = () => {
  const navigate: NavigateFunction = useNavigate();
  const [coverage, setCoverage] = useState<CoverageItem[]>([
    {
      value: 0,
      color: "#00C950",
      label: "Assigned",
    },
    {
      value: 0,
      color: "#FB2C36",
      label: "Open slots",
    },
  ]);
  const [percent, setPercent] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): void => {
    const loadCoverage = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/get_today_coverage.php`,
        );

        const data: TodayCoverageResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load coverage");
        }

        setCoverage([
          {
            value: data.confirmed,
            color: "#00C950",
            label: "Assigned",
          },
          {
            value: data.not_confirmed,
            color: "#FB2C36",
            label: "Open slots",
          },
        ]);

        setPercent(data.percent);
        setDate(data.date);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadCoverage();
  }, []);

  const handleViewUnconfirmed = (): void => {
    navigate("/schedule", {
      state: {
        date,
      },
    });
  };

  if (isLoading) {
    return <CardLoader text="Loading coverage..." />;
  }

  return (
    <CardLayout
      title="Today's Status"
      subtitle="Current shift coverage"
      className={styles.coverage}
    >
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          <div className={styles.chart}>
            <DonutChart
              className={styles.donut}
              data={coverage}
              size={100}
              strokeWidth={10}
            />

            <div className={styles.legend}>
              {coverage.map((item) => (
                <div key={item.label} className={styles.legend__item}>
                  <span
                    className={styles.legend__color}
                    style={{ backgroundColor: item.color }}
                  />

                  <p className={styles.legend__text}>{item.label}</p>

                  <span className={styles.legend__number}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.percentage}>
            <div className={styles.line}>
              <span
                className={styles.line__percent}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className={styles.percentage__text}>
              <p className={styles.percentage__title}>Coverage</p>

              <span className={styles.percentage__number}>{percent}%</span>
            </div>
          </div>

          <Button
            type="button"
            isLink={false}
            size="large"
            className={styles.button}
            onClick={handleViewUnconfirmed}
          >
            View Schedule
          </Button>
        </>
      )}
    </CardLayout>
  );
};

export default CoverageCard;
