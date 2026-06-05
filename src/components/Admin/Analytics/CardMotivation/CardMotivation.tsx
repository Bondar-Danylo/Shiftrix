// Imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Styles
import styles from "./CardMotivation.module.scss";

// Components
import CardLayout from "@/components/Admin/Analytics/CardLayout/CardLayout";
import CardLoader from "@/components/Common/Loader/Loader";

// Icons
import MotivationIcon from "@/assets/icons/analytic_icon.svg?react";

// Types
import type { CardMotivationProps } from "./CardMotivation.types";

const CardMotivation = ({ data, isLoading }: CardMotivationProps) => {
  if (isLoading || !data) {
    return (
      <CardLayout title="Motivation Correlation" image={MotivationIcon}>
        <CardLoader text="Loading Correlation data..." />
      </CardLayout>
    );
  }

  return (
    <CardLayout title="Motivation Correlation" image={MotivationIcon}>
      <div className={styles.wrapper}>
        <p className={styles.subtitle}>
          Higher points = faster shift acceptance. Shows optimal pricing for
          hard-to-fill shifts.
        </p>

        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barSize={55}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--ligh-grey_color)"
              />

              <XAxis
                dataKey="points"
                tickLine={false}
                axisLine={{ stroke: "var(--graphite_color)" }}
                tick={{ fill: "var(--dark-grey_color)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "var(--graphite_color)" }}
                tick={{ fill: "var(--dark-grey_color)", fontSize: 12 }}
                domain={[0, 8]}
                tickCount={5}
                dx={-10}
              />

              <Bar dataKey="hours" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardLayout>
  );
};

export default CardMotivation;
