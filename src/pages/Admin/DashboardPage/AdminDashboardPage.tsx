// Styles
import styles from "./AdminDashboardPage.module.scss";

// Components
import AttentionBlock from "@/components/Admin/AttentionBlock/AttentionBlock";

const AdminDashboardPage = () => {
  return (
    <div className={styles.wrapper}>
      <AttentionBlock />
    </div>
  );
};

export default AdminDashboardPage;
