// Styles
import styles from "./RequestsList.module.scss";

// Components
import RequestCard from "../RequestsCard/RequestsCard";

// Imports
import type { RequestsListProps } from "./RequestsList.types";

const RequestsList = ({ totalCount, filteredRequests }: RequestsListProps) => {
  if (totalCount === 0) {
    return <div className={styles.noData}>No pending requests</div>;
  }

  if (filteredRequests.length === 0) {
    return (
      <div className={styles.noData}>No requests found for this filter</div>
    );
  }

  return (
    <div className={styles.list}>
      {filteredRequests.map((item, index) => (
        <RequestCard key={index} item={item} />
      ))}
    </div>
  );
};

export default RequestsList;
