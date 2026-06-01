// Styles
import styles from "./MainLayout.module.scss";

// Components
import Sidebar from "@/components/Common/Sidebar/Sidebar";
import Header from "@/components/Common/Header/Header";

// Imports
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <main className={styles.main}>
        <Header />
        <section className={styles.section}>
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default MainLayout;
