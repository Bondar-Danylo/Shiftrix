// Styles
import CoverageCard from "@/components/Admin/Dashboard/CoverageCard/CoverageCard";
import styles from "./AdminDashboardPage.module.scss";

// Components
import AttentionBlock from "@/components/Admin/Dashboard/AttentionBlock/AttentionBlock";
import MarketplaceCard from "@/components/Admin/Dashboard/MarketplaceCard/MarketplaceCard";
import UpcomingShiftCard from "@/components/Admin/Dashboard/UpcomingShiftCard/UpcomingShiftCard";
import QuickActionCard from "@/components/Admin/Dashboard/QuickActionCard/QuickActionCard";
import StatsCard from "@/components/Admin/Dashboard/StatsCard/StatsCard";
import WhatsappActivityCard from "@/components/Admin/Dashboard/WhatsappActivityCard/WhatsappActivityCard";
import StaffHealthCard from "@/components/Admin/Dashboard/StaffHealthCard/StaffHealthCard";

const AdminDashboardPage = () => {
  return (
    <div className={styles.wrapper}>
      <AttentionBlock />
      <CoverageCard />
      <MarketplaceCard />
      <UpcomingShiftCard />
      <QuickActionCard />
      <StatsCard />
      <WhatsappActivityCard />
      <StaffHealthCard />
    </div>
  );
};

export default AdminDashboardPage;
