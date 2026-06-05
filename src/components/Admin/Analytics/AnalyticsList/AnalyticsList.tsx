// Styles
import styles from "./AnalyticsList.module.scss";

import CardSpeed from "@/components/Admin/Analytics/CardSpeed/CardSpeed";
import CardVelocity from "@/components/Admin/Analytics/CardVelocity/CardVelocity";
import CardMotivation from "@/components/Admin/Analytics/CardMotivation/CardMotivation";
import CardTopPerformers from "@/components/Admin/Analytics/CardTopPerformers/CardTopPerformers";
import CardTeamOverview from "@/components/Admin/Analytics/CardTeamOverview/CardTeamOverview";
import CardShiftPopularity from "@/components/Admin/Analytics/CardShiftPopularity/CardShiftPopularity";
import CardStaffHealth from "@/components/Admin/Analytics/CardStaffHealth/CardStaffHealth";

// Types
import type { AnalyticsGridProps } from "./AnalyticsList.types";

const AnalyticsList = ({ data, isLoading }: AnalyticsGridProps) => {
  return (
    <ul className={styles.list}>
      <li className={`${styles.item} ${styles.full}`}>
        <CardSpeed data={data?.systemSpeed} isLoading={isLoading} />
      </li>
      <li className={`${styles.item} ${styles.half}`}>
        <CardTeamOverview data={data?.teamOverview} isLoading={isLoading} />
      </li>
      <li className={`${styles.item} ${styles.half}`}>
        <CardTopPerformers data={data?.topPerformers} isLoading={isLoading} />
      </li>
      <li className={`${styles.item} ${styles.half}`}>
        <CardVelocity data={data?.pointsVelocity} isLoading={isLoading} />
      </li>
      <li className={`${styles.item} ${styles.half}`}>
        <CardMotivation
          data={data?.motivationCorrelation}
          isLoading={isLoading}
        />
      </li>
      <li className={`${styles.item} ${styles.half}`}>
        <CardShiftPopularity
          data={data?.shiftPopularity}
          isLoading={isLoading}
        />
      </li>
      <li className={`${styles.item} ${styles.full}`}>
        <CardStaffHealth data={data?.staffHealth} isLoading={isLoading} />
      </li>
    </ul>
  );
};

export default AnalyticsList;
