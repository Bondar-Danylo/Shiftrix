// Styles
import styles from "./RequestsList.module.scss";

// Components
import RequestCard from "../RequestsCard/RequestsCard";

// Imports
import type { RequestsListProps } from "./RequestsList.types";

const RequestsList = ({
  totalCount,
  filteredRequests,
  currentUserId,
  isAdmin,
  onRequestUpdated,
}: RequestsListProps) => {
  if (totalCount === 0) {
    return <div className={styles.noData}>No requests</div>;
  }

  if (filteredRequests.length === 0) {
    return (
      <div className={styles.noData}>No requests found for this filter</div>
    );
  }

  return (
    <div className={styles.list}>
      {filteredRequests.map((item) => (
        <RequestCard
          key={item.id}
          item={item}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
          onRequestUpdated={onRequestUpdated}
        />
      ))}
    </div>
  );
};

export default RequestsList;
