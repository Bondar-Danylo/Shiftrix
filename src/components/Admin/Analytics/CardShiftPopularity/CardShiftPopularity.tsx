// Imports
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Styles
import styles from "./CardShiftPopularity.module.scss";

// Components
import CardLayout from "@/components/Admin/Analytics/CardLayout/CardLayout";
import CardLoader from "@/components/Common/Loader/Loader";

// Icons
import CalendarIcon from "@/assets/icons/schedule_icon.svg?react";

// Types
import type { CardShiftPopularityProps } from "./CardShiftPopularity.types";

const CardShiftPopularity = ({ data, isLoading }: CardShiftPopularityProps) => {
  if (isLoading || !data) {
    return (
      <CardLayout title="Shift Popularity" image={CalendarIcon}>
        <CardLoader text="Loading Shift Statistic..." />
      </CardLayout>
    );
  }

  return (
    <CardLayout title="Shift Popularity" image={CalendarIcon}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <div className={styles.chartSection}>
            <ResponsiveContainer
              width="100%"
              height={160}
              className={styles.response}
            >
              <PieChart>
                <Pie
                  data={data.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.infoSection}>
            <div className={`${styles.infoCard} ${styles.infoCard_purple}`}>
              <span className={styles.infoLabel}>Most Popular Day</span>
              <span className={styles.infoValue}>{data.mostPopularDay}</span>
            </div>
            <div className={`${styles.infoCard} ${styles.infoCard_blue}`}>
              <span className={styles.infoLabel}>Avg Fill Rate</span>
              <span className={styles.infoValue}>{data.avgFillRate}%</span>
            </div>
          </div>
        </div>

        <div className={styles.legend}>
          {data.chartData.map((item, index) => (
            <div key={index} className={styles.legendItem}>
              <span
                className={styles.legendColorDot}
                style={{ backgroundColor: item.color }}
              />
              <span className={styles.legendName}>{item.name}</span>
              <span className={styles.legendPercent}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </CardLayout>
  );
};

export default CardShiftPopularity;
