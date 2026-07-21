// Imports
import { useState, useEffect } from "react";

// Styles
import styles from "./AnalyticsPage.module.scss";

// Components
import Dropdown from "@/components/Common/Dropdown/Dropdown";

// Constants & Services
import { FILTER_OPTIONS } from "./AnalyticsPage.constants";
import { fetchAnalyticsSummary } from "./AnalyticsPage.services";

// Types
import type { FilterOption, AnalyticsSummary } from "./AnalyticsPage.types";
import AnalyticsList from "@/components/Admin/Analytics/AnalyticsList/AnalyticsList";

const AnalyticsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(
    FILTER_OPTIONS[0],
  );
  const [summaryData, setSummaryData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect((): (() => void) => {
    let isMounted: boolean = true;

    const loadAnalyticsData = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await fetchAnalyticsSummary(selectedFilter.value);
        if (isMounted) {
          setSummaryData(response);
        }
      } catch (error) {
        console.error("Failed to load analytics summary:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAnalyticsData();

    return (): void => {
      isMounted = false;
    };
  }, [selectedFilter.value]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.text}>
          <h2 className={styles.title}>Analytics Dashboard</h2>
          <p className={styles.subtitle}>
            Track performance, efficiency, and team health
          </p>
        </div>
        <div className={styles.control}>
          <Dropdown
            options={FILTER_OPTIONS}
            value={selectedFilter}
            onSelect={(option) => setSelectedFilter(option)}
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <span>{option.label}</span>}
            placeholder="Select timeframe ..."
            className={styles.dropdown}
          />
        </div>
      </div>

      <AnalyticsList data={summaryData} isLoading={isLoading} />
    </div>
  );
};

export default AnalyticsPage;
