// Styles
import styles from "./RequestsCard.module.scss";

// Components
import Button from "@/components/Common/Button/Button";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";

// Icons
import HolidayIcon from "@/assets/icons/holiday_icon.svg?react";
import SwapIcon from "@/assets/icons/swap_icon.svg?react";
import ClockIcon from "@/assets/icons/clock_icon.svg?react";
import ScheduleIcon from "@/assets/icons/schedule_icon.svg?react";
import CheckIcon from "@/assets/icons/check_icon.svg?react";
import RejectIcon from "@/assets/icons/reject_icon.svg?react";

// Imports
import { Link } from "react-router-dom";
import { useState } from "react";

// Types
import type { RequestCardProps } from "./RequestsCard.types";
type RequestAction = "approved" | "rejected" | "cancelled";

const getRelativeTimeString = (createdAtString: Date): string => {
  const createdDate: Date = new Date(createdAtString);
  const now: Date = new Date();
  const diffInMs: number = now.getTime() - createdDate.getTime();
  const diffInMinutes: number = Math.floor(diffInMs / (1000 * 60));
  const diffInHours: number = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays: number = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "Requested just now";
  }

  if (diffInMinutes < 60) {
    return `Requested ${diffInMinutes}m ago`;
  }

  if (diffInHours < 24) {
    return `Requested ${diffInHours}h ago`;
  }

  return `Requested ${diffInDays}d ago`;
};

const RequestCard = ({
  item,
  currentUserId,
  isAdmin,
  onRequestUpdated,
}: RequestCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<RequestAction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isOwnRequest: boolean = Number(item.from.id) === Number(currentUserId);
  const canAdminRespond: boolean = isAdmin && item.status === "pending";
  const canEmployeeCancel: boolean =
    !isAdmin && isOwnRequest && item.status === "pending";

  const openModal = (action: RequestAction): void => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setModalAction(null);
  };

  const handleConfirmStatus = async (): Promise<void> => {
    if (!modalAction) {
      return;
    }

    if (!isAdmin && modalAction !== "cancelled") {
      return;
    }

    if (modalAction === "cancelled" && !isOwnRequest) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/update_request_status.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            status: modalAction,
            user_id: currentUserId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setIsModalOpen(false);
      setModalAction(null);

      await onRequestUpdated();
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : "Updating status error";

      alert(message);

      console.error("Updating status error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal Helpers
  const modalTitle: string =
    modalAction === "approved"
      ? "Approve Request?"
      : modalAction === "rejected"
        ? "Reject Request?"
        : "Cancel Request?";

  const modalDescription: string =
    modalAction === "approved"
      ? "Are you sure you want to approve this request?"
      : modalAction === "rejected"
        ? "Are you sure you want to reject this request?"
        : "Are you sure you want to cancel your request?";

  const modalConfirmText: string =
    modalAction === "approved"
      ? "Approve"
      : modalAction === "rejected"
        ? "Reject"
        : "Cancel Request";

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.profile}>
          <Link className={styles.profileInfo} to={`/users/${item.from.id}`}>
            <h4 className={styles.name}>{item.from.name}</h4>
            <p className={styles.position}>{item.from.position}</p>
          </Link>
        </div>

        <span className={`${styles.badge} ${styles[`badge_${item.type}`]}`}>
          {item.type === "swap" && (
            <>
              <SwapIcon />
              Shift Swap
            </>
          )}

          {item.type === "dayoff" && (
            <>
              <HolidayIcon />
              Day Off Request
            </>
          )}

          {item.type === "holiday" && (
            <>
              <HolidayIcon />
              Vacation Request
            </>
          )}
        </span>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.metaItem}>
          <ClockIcon />
          <span className={styles.metaText}>
            {getRelativeTimeString(item.createdAt)}
          </span>
        </div>

        <div className={styles.metaItem}>
          <ScheduleIcon />
          <span className={styles.metaText}>{item.date}</span>
        </div>

        <p className={styles.reason}>
          <span className={styles.reasonLabel}>Reason:</span> {item.reason}
        </p>

        {item.with && (
          <div className={styles.swapWith}>
            <span className={styles.reasonLabel}>Swap with:</span>
            {isAdmin ? (
              <Link to={`/employees`} className={styles.swapName}>
                {item.with.name}
              </Link>
            ) : (
              item.with.name
            )}
          </div>
        )}
      </div>

      {canAdminRespond && (
        <div className={styles.cardActions}>
          <Button
            type="button"
            isLink={false}
            size="normal"
            className={styles.btnApprove}
            onClick={() => openModal("approved")}
          >
            <CheckIcon />
            Approve
          </Button>

          <Button
            type="button"
            isLink={false}
            size="normal"
            className={styles.btnReject}
            onClick={() => openModal("rejected")}
          >
            <RejectIcon />
            Reject
          </Button>
        </div>
      )}

      {canEmployeeCancel && (
        <div className={styles.cardActions}>
          <Button
            type="button"
            isLink={false}
            size="normal"
            className={styles.btnCancel}
            onClick={() => openModal("cancelled")}
          >
            <RejectIcon />
            Cancel Request
          </Button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        title={modalTitle}
        description={modalDescription}
        confirmText={modalConfirmText}
        cancelText="Back"
        variant={modalAction === "approved" ? "primary" : "danger"}
        isLoading={isSubmitting}
        onClose={closeModal}
        onConfirm={handleConfirmStatus}
      />
    </div>
  );
};

export default RequestCard;
