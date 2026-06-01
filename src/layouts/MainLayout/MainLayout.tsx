import Sidebar from "@/components/Common/Sidebar/Sidebar";
import styles from "./MainLayout.module.scss";
import { Outlet } from "react-router-dom";
import Header from "@/components/Common/Header/Header";

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
