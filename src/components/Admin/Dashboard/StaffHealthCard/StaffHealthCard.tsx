// Styles
import styles from "./StaffHealthCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";
import Button from "@/components/Common/Button/Button";

// Icons
import ArrowIcon from "@/assets/icons/arrow_icon.svg?react";

interface StaffHealthCardData {
  id: number;
  name: string;
  reason: string;
}

const StaffHealthCard = () => {
  const fakeData: StaffHealthCardData[] = [
    { id: 1, name: "David Lee", reason: "No shifts taken this week" },
    {
      id: 2,
      name: "Olivia Martinez",
      reason: "Overworked (48h this week)",
    },
  ];

  return (
    <CardLayout title="Staff Health" subtitle="" className={styles.wrapper}>
      <ul className={styles.list}>
        {fakeData.map((item) => (
          <li key={item.id} className={styles.item}>
            <p className={styles.name}>{item.name}</p>
            <span className={styles.reason}>{item.reason}</span>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        isLink={false}
        size="large"
        className={styles.button}
      >
        View All
        <ArrowIcon className={styles.arrow} />
      </Button>
    </CardLayout>
  );
};

export default StaffHealthCard;
