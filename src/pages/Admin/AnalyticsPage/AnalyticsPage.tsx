import { useState, useEffect } from "react";

// Styles
import styles from "./AnalyticsPage.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import CardSpeed from "@/components/Admin/Analytics/CardSpeed/CardSpeed";
import CardVelocity from "@/components/Admin/Analytics/CardVelocity/CardVelocity";

// Icons
import DownloadIcon from "@/assets/icons/download_icon.svg?react";

// Types
import type { FilterOption, AnalyticsSummary } from "./AnalyticsPage.types";

// Имитация API-сервиса, который возвращает агрегированные данные под каждый таймфрейм
const fetchAnalyticsSummary = async (
  timeframe: string,
): Promise<AnalyticsSummary> => {
  // Имитируем сетевую задержку бэкенда в 1 секунду
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // База данных моков для карточек и графиков
  const mockDatabase: Record<string, AnalyticsSummary> = {
    "1 week": {
      systemSpeed: {
        averageFillTimeHours: 2.4,
        selfServiceRate: 78,
        whatsappResponseRate: 85,
      },
      pointsVelocity: [
        { label: "Week 1", spent: 460, earned: 320 },
        { label: "Week 2", spent: 520, earned: 380 },
        { label: "Week 3", spent: 590, earned: 450 },
        { label: "Week 4", spent: 630, earned: 490 },
      ],
    },
    "2 weeks": {
      systemSpeed: {
        averageFillTimeHours: 2.8,
        selfServiceRate: 74,
        whatsappResponseRate: 82,
      },
      pointsVelocity: [
        { label: "Week 1", spent: 410, earned: 290 },
        { label: "Week 2", spent: 480, earned: 340 },
        { label: "Week 3", spent: 530, earned: 410 },
        { label: "Week 4", spent: 580, earned: 460 },
      ],
    },
    "1 month": {
      systemSpeed: {
        averageFillTimeHours: 3.1,
        selfServiceRate: 80,
        whatsappResponseRate: 79,
      },
      pointsVelocity: [
        { label: "W1-W2", spent: 380, earned: 310 },
        { label: "W3-W4", spent: 490, earned: 420 },
        { label: "W5-W6", spent: 510, earned: 470 },
        { label: "W7-W8", spent: 600, earned: 550 },
      ],
    },
    "3 month": {
      systemSpeed: {
        averageFillTimeHours: 3.5,
        selfServiceRate: 81,
        whatsappResponseRate: 83,
      },
      pointsVelocity: [
        { label: "March", spent: 300, earned: 250 },
        { label: "April", spent: 450, earned: 400 },
        { label: "May", spent: 610, earned: 520 },
        { label: "June", spent: 680, earned: 590 },
      ],
    },
    "6 month": {
      systemSpeed: {
        averageFillTimeHours: 4.0,
        selfServiceRate: 85,
        whatsappResponseRate: 88,
      },
      pointsVelocity: [
        { label: "Jan", spent: 210, earned: 190 },
        { label: "Feb", spent: 340, earned: 280 },
        { label: "Mar", spent: 430, earned: 390 },
        { label: "Apr", spent: 520, earned: 460 },
        { label: "May", spent: 590, earned: 510 },
        { label: "Jun", spent: 630, earned: 580 },
      ],
    },
    "1 year": {
      systemSpeed: {
        averageFillTimeHours: 4.2,
        selfServiceRate: 87,
        whatsappResponseRate: 91,
      },
      pointsVelocity: [
        { label: "Q1", spent: 200, earned: 180 },
        { label: "Q2", spent: 400, earned: 350 },
        { label: "Q3", spent: 550, earned: 480 },
        { label: "Q4", spent: 710, earned: 640 },
      ],
    },
  };

  return mockDatabase[timeframe] || mockDatabase["1 week"];
};

const AnalyticsPage = () => {
  const filterOptions: FilterOption[] = [
    { value: "1 week", label: "1 Week" },
    { value: "2 weeks", label: "2 Weeks" },
    { value: "1 month", label: "1 Month" },
    { value: "3 month", label: "3 Month" },
    { value: "6 month", label: "6 Month" },
    { value: "1 year", label: "1 Year" },
  ];

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(
    filterOptions[0],
  );
  const [summaryData, setSummaryData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAnalyticsSummary(selectedFilter.value);
        setSummaryData(response);
      } catch (error) {
        console.error("Failed to load analytics summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [selectedFilter]); // Запрос триггерится заново при смене фильтра

  return (
    <div className={styles.wrapper}>
      {/* Верхняя панель управления */}
      <div className={styles.top}>
        <div className={styles.text}>
          <h2 className={styles.title}>Analytics Dashboard</h2>
          <p className={styles.subtitle}>
            Track performance, efficiency, and team health
          </p>
        </div>
        <div className={styles.control}>
          <Dropdown
            options={filterOptions}
            value={selectedFilter}
            onSelect={(option) => setSelectedFilter(option)}
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <span>{option.label}</span>}
            placeholder="Select timeframe ..."
            className={styles.dropdown}
          />
          <Button
            isLink={false}
            size="normal"
            type="button"
            className={styles.button}
            disabled={isLoading}
          >
            <DownloadIcon /> Export
          </Button>
        </div>
      </div>

      {/* Сетка компонентов аналитики */}
      <ul className={styles.list}>
        {/* Карточка 1: System Speed & Autonomy */}
        <li className={`${styles.item} ${styles.full}`}>
          <CardSpeed data={summaryData?.systemSpeed} isLoading={isLoading} />
        </li>

        {/* Карточка 2: Points Velocity (График) */}
        <li className={`${styles.item} ${styles.full}`}>
          <CardVelocity
            data={summaryData?.pointsVelocity}
            isLoading={isLoading}
          />
        </li>
      </ul>
    </div>
  );
};

export default AnalyticsPage;
