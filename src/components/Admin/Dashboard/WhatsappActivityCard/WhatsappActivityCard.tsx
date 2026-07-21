// Styles
import styles from "./WhatsappActivityCard.module.scss";

// Components
import CardLayout from "../CardLayout/CardLayout";

// Interfaces
interface WhatsappActivityCardData {
  title: string;
  data: string | number;
}

const WhatsappActivityCard = () => {
  const data: WhatsappActivityCardData[] = [
    {
      title: "Requests today",
      data: 12,
    },
    {
      title: "Shifts via WhatsApp",
      data: 5,
    },
    { title: "Notifications sent", data: 3 },
  ];

  return (
    <CardLayout
      title="WhatsApp Activity"
      subtitle=""
      className={styles.wrapper}
    >
      <ul className={styles.list}>
        {data.map((item) => (
          <li key={item.title} className={styles.item}>
            <p className={styles.title}>{item.title}</p>
            <span className={styles.data}>{item.data}</span>
          </li>
        ))}
      </ul>
    </CardLayout>
  );
};

export default WhatsappActivityCard;
