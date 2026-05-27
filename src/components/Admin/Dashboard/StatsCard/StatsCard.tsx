// Styles
import styles from "./StatsCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";

interface StatsCardData {
  title: string;
  data: string | number;
}

const StatsCard = () => {
  const fakeData: StatsCardData[] = [
    {
      title: "Time saved",
      data: 6,
    },
    {
      title: "Auto-filled",
      data: 2,
    },
    { title: "Prevented no-show", data: 1 },
  ];

  return (
    <CardLayout title="This Month" subtitle="" className={styles.wrapper}>
      <ul className={styles.list}>
        {fakeData.map((item) => (
          <li key={item.title} className={styles.item}>
            <p className={styles.title}>{item.title}</p>
            <span className={styles.data}>{item.data}</span>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
};

export default StatsCard;
