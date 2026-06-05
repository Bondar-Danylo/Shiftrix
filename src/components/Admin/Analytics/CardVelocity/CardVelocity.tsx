// Imports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Styles
import styles from "./CardVelocity.module.scss";

// Components
import CardLayout from "@/components/Admin/Analytics/CardLayout/CardLayout";
import CardLoader from "@/components/Common/Loader/Loader";

// Icons
import VelocityIcon from "@/assets/icons/medal_icon.svg?react";

// Types
import type { CardVelocityProps } from "./CardVelocity.types";

const CardVelocity = ({ data, isLoading }: CardVelocityProps) => {
  if (isLoading || !data) {
    return (
      <CardLayout title="Points Velocity" image={VelocityIcon}>
        <CardLoader text="Loading Chart..." />
      </CardLayout>
    );
  }

  return (
    <CardLayout title="Points Velocity" image={VelocityIcon}>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--ligh-grey_color)"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "var(--graphite_color)" }}
              tick={{ fill: "var(--dark-grey_color)", fontSize: 12 }}
              dy={10}
            />

            <YAxis
              tickLine={false}
              axisLine={{ stroke: "var(--graphite_color)" }}
              tick={{ fill: "var(--dark-grey_color)", fontSize: 12 }}
              domain={[0, 800]}
              tickCount={5}
              dx={-10}
            />

            <Line
              type="monotone"
              dataKey="spent"
              stroke="#f44336"
              strokeWidth={3}
              dot={{ r: 6, fill: "#f44336", strokeWidth: 0 }}
              activeDot={{ r: 8 }}
            />

            <Line
              type="monotone"
              dataKey="earned"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className={styles.legend}>
          <div
            className={`${styles.legend__item} ${styles.legend__item_spent}`}
          >
            <span className={styles.legend__line}></span>
            <span className={styles.legend__text}>Spent</span>
          </div>
          <div
            className={`${styles.legend__item} ${styles.legend__item_earned}`}
          >
            <span className={styles.legend__line}></span>
            <span className={styles.legend__text}>Earned</span>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default CardVelocity;
