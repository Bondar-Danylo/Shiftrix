// Styles
import CoverageCard from "@/components/Admin/Dashboard/CoverageCard/CoverageCard";
import styles from "./AdminDashboardPage.module.scss";

// Components
import AttentionBlock from "@/components/Admin/Dashboard/AttentionBlock/AttentionBlock";
import MarketplaceCard from "@/components/Admin/Dashboard/MarketplaceCard/MarketplaceCard";

const AdminDashboardPage = () => {
  return (
    <div className={styles.wrapper}>
      <AttentionBlock />
      <CoverageCard />
      <MarketplaceCard />
    </div>
  );
};

export default AdminDashboardPage;
