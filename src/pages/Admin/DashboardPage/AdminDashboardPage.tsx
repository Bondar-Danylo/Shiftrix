// Styles
import CoverageCard from "@/components/Admin/Dashboard/CoverageCard/CoverageCard";
import styles from "./AdminDashboardPage.module.scss";

// Components
import AttentionBlock from "@/components/Admin/Dashboard/AttentionBlock/AttentionBlock";
import MarketplaceCard from "@/components/Admin/Dashboard/MarketplaceCard/MarketplaceCard";
import UpcomingShiftCard from "@/components/Admin/Dashboard/UpcomingShiftCard/UpcomingShiftCard";
import QuickActionCard from "@/components/Admin/Dashboard/QuickActionCard/QuickActionCard";

const AdminDashboardPage = () => {
  return (
    <div className={styles.wrapper}>
      <AttentionBlock />
      <CoverageCard />
      <MarketplaceCard />
      <UpcomingShiftCard />
      <QuickActionCard />
    </div>
  );
};

export default AdminDashboardPage;
