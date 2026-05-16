// Styles
import styles from "./MarketplaceCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";
import Button from "@/components/Common/Button/Button";

// Icons
import AttentionIcon from "@/assets/icons/attention-orange_icon.svg?react";
import BellIcon from "@/assets/icons/bell_icon.svg?react";
import RocketIcon from "@/assets/icons/rocket_icon.svg?react";

import React, { useState, useEffect } from "react";
import type { MarketplaceData } from "./MarketplaceCard.types";

// Mock API request
const fetchMarketplaceData = (): Promise<MarketplaceData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        unassigned: 1,
        averageTime: 8,
        openShifts: 3,
      });
    }, 1200);
  });
};

const MarketplaceCard: React.FC = () => {
  const [data, setData] = useState<MarketplaceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted: boolean = true;

    fetchMarketplaceData()
      .then((res): void => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err: Error): void => {
        console.error("Failed to fetch marketplace data:", err);
        if (isMounted) {
          setError("Failed to load data");
          setIsLoading(false);
        }
      });

    return (): void => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <CardLayout
        title="Marketplace"
        subtitle="Open shifts in WhatsApp"
        className={styles.wrapper}
      >
        <p className={styles.loading}>Loading ...</p>
      </CardLayout>
    );
  }

  if (error || !data) {
    return (
      <CardLayout
        title="Marketplace"
        subtitle="Open shifts in WhatsApp"
        className={styles.wrapper}
      >
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>{error || "Something went wrong"}</p>
        </div>
      </CardLayout>
    );
  }

  const { unassigned, averageTime, openShifts }: MarketplaceData = data;
  const hasActionRequired: boolean = unassigned > 0;

  return (
    <CardLayout
      title="Marketplace"
      subtitle="Open shifts in WhatsApp"
      className={styles.wrapper}
    >
      <div className={styles.main}>
        <div className={styles.item}>
          <p className={styles.item__text}>Avg. time to fill</p>
          <span className={styles.item__number}>{averageTime}h</span>
        </div>

        <div className={styles.item}>
          <p className={styles.item__text}>Open Shifts</p>
          <span className={styles.item__number}>{openShifts}</span>
        </div>

        {hasActionRequired ? (
          <div className={styles.action}>
            <div className={styles.action__top}>
              <AttentionIcon />
              <h4 className={styles.action__title}>Action Required</h4>
            </div>

            <p className={styles.action__explanation}>
              {unassigned} {unassigned === 1 ? "shift" : "shifts"} unassigned
              for {">"} 12h
            </p>

            <div className={styles.buttons}>
              <Button
                type="button"
                isLink={false}
                size="normal"
                className={`${styles.action__btn} ${styles.action__notify}`}
              >
                <BellIcon />
                Notify Staff
              </Button>

              <Button
                type="button"
                isLink={false}
                size="normal"
                className={`${styles.action__btn} ${styles.action__boost}`}
              >
                <RocketIcon />
                Boost Shift
              </Button>
            </div>
          </div>
        ) : (
          <div className={`${styles.action} ${styles.action_success}`}>
            <div className={styles.action__top}>
              <h4 className={styles.action__title_success}>
                All Shifts Covered 🎉
              </h4>
            </div>
            <p className={styles.action__explanation}>
              Great job! There are currently no unassigned shifts requiring
              urgent attention.
            </p>
          </div>
        )}
      </div>
    </CardLayout>
  );
};

export default MarketplaceCard;
