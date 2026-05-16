// Styles
import styles from "./CoverageCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";
import DonutChart from "@/components/Common/DonutChart/DonutChart";
import Button from "@/components/Common/Button/Button";

import React from "react";
import type { CoverageItem } from "./CoverageCard.types";

interface CoverageCardProps {
  // На будущее: когда подключишь бэк, просто закомментируй дефолтный массив ниже
  // и принимай данные сверху: data: CoverageItem[]
}

const CoverageCard: React.FC<CoverageCardProps> = () => {
  const coverage: CoverageItem[] = [
    { value: 4, color: "#00C950", label: "Confirmed" },
    { value: 1, color: "#FB2C36", label: "Not confirmed" },
  ];

  const totalShifts: number = coverage.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const confirmedValue: number =
    coverage.find((item) => item.label === "Confirmed")?.value || 0;

  const percent: number =
    totalShifts > 0 ? Math.round((confirmedValue / totalShifts) * 100) : 0;

  return (
    <CardLayout
      title="Today's Status"
      subtitle="Current shift coverage"
      className={styles.coverage}
    >
      <div className={styles.chart}>
        <DonutChart
          className={styles.donut}
          data={coverage}
          size={100}
          strokeWidth={10}
        />

        <div className={styles.legend}>
          {coverage.map((item, index) => (
            <div key={index} className={styles.legend__item}>
              <span
                className={styles.legend__color}
                style={{ backgroundColor: item.color }}
              ></span>
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
          ></span>
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
      >
        View Unconfirmed
      </Button>
    </CardLayout>
  );
};

export default CoverageCard;
