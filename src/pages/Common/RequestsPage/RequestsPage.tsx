// Styles
import styles from "./RequestsPage.module.scss";

// Components
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import Search from "@/components/Common/Search/Search";
import Button from "@/components/Common/Button/Button";
import RequestsList from "@/components/Common/RequestsList/RequestsList";
import ConfirmationModal from "@/components/Common/ConfirmationModal/ConfirmationModal";

// Icons
import FilterIcon from "@/assets/icons/filter_icon.svg?react";

// Imports
import { useCallback, useState, useEffect, useMemo } from "react";

// Types
import type { FilterOption, RequestItem } from "./RequestsPage.types";
import CreateRequestModal from "@/components/Common/CreateRequestModal/CreateRequestModal";
import type { CreateRequestData } from "@/components/Common/CreateRequestModal/CreateRequestModal.types";

// Interfaces
interface StoredUser {
  id: number;
  name: string;
  role: string;
}

const filterOptions: FilterOption[] = [
  { value: "all", label: "All Requests" },
  { value: "swap", label: "Shift Swap" },
  { value: "dayoff", label: "Day Off" },
  { value: "holiday", label: "Holiday" },
];

const RequestsPage = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isApprovingAll, setIsApprovingAll] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(
    filterOptions[0],
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const currentUser = useMemo<StoredUser | null>(() => {
    const storedUser: string | null = localStorage.getItem("user");

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as StoredUser;
    } catch {
      return null;
    }
  }, []);

  const userId: number = Number(
    currentUser?.id || localStorage.getItem("user_id"),
  );

  const userRole: string =
    currentUser?.role || localStorage.getItem("userRole") || "employee";

  const isAdmin: boolean = userRole === "admin" || userRole === "manager";

  const fetchRequests = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const query: string = isAdmin ? "" : `?user_id=${userId}`;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_requests.php${query}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server Error: ${response.status}`);
      }

      const sourceData = Array.isArray(data) ? data : data.requests || [];

      const formattedData = sourceData.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
      }));

      setRequests(formattedData);
    } catch (error: unknown) {
      const message: string =
        error instanceof Error ? error.message : "Loading Request Error";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, userId]);

  useEffect((): void => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredData: RequestItem[] = requests.filter((item) => {
    const matchesType =
      selectedFilter.value === "all" || item.type === selectedFilter.value;
    const matchesSearch = item.from.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const openApproveAllModal = (): void => {
    if (filteredData.length === 0) return;
    setIsModalOpen(true);
  };

  const closeApproveAllModal = (): void => {
    setIsModalOpen(false);
  };

  // Handlers
  const handleConfirmApproveAll = async (): Promise<void> => {
    const idsToApprove = filteredData.map((item) => item.id);

    try {
      setIsApprovingAll(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/update_request_status.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: idsToApprove,
            status: "approved",
          }),
        },
      );

      if (!response.ok) throw new Error("Aprove all error");

      closeApproveAllModal();
      await fetchRequests();
    } catch (err) {
      alert("Aprove All Error");
      console.error(err);
    } finally {
      setIsApprovingAll(false);
    }
  };

  const handleCreateRequest = async (
    requestData: CreateRequestData,
  ): Promise<void> => {
    if (!userId || isAdmin) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/create_request.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestData,
          user_id: userId,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create request");
    }

    setIsCreateModalOpen(false);

    await fetchRequests();
  };

  const handleSearch = useCallback((value: string): void => {
    setSearchQuery(value);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <div className={styles.filter}>
          <label className={styles.label}>
            <FilterIcon />
            <span>Filter by Type</span>
          </label>

          <Dropdown<FilterOption>
            options={filterOptions}
            value={selectedFilter}
            onSelect={(option) => setSelectedFilter(option)}
            getOptionLabel={(option) => option.label}
            renderOption={(option) => <span>{option.label}</span>}
            placeholder="Select type..."
            className={styles.dropdown}
          />
        </div>
        <Search
          onChangeDebounced={handleSearch}
          placeholder="Type name..."
          className={styles.search}
        />
        {isAdmin ? (
          <Button
            type="button"
            isLink={false}
            size="normal"
            className={styles.aprove}
            onClick={openApproveAllModal}
            disabled={filteredData.length === 0 || isLoading}
          >
            Approve All
          </Button>
        ) : (
          <Button
            type="button"
            isLink={false}
            size="normal"
            className={styles.aprove}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Request
          </Button>
        )}
      </div>

      {isLoading && <div className={styles.loading}>Loading ...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

      {!isLoading && !error && (
        <RequestsList
          totalCount={filteredData.length}
          filteredRequests={filteredData}
          currentUserId={userId}
          isAdmin={isAdmin}
          onRequestUpdated={fetchRequests}
        />
      )}

      {isAdmin && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Approve All Requests?"
          description={`Are you sure you want to approve all ${filteredData.length} currently filtered requests?`}
          confirmText="Approve All"
          cancelText="Cancel"
          variant="primary"
          isLoading={isApprovingAll}
          onClose={closeApproveAllModal}
          onConfirm={handleConfirmApproveAll}
        />
      )}

      {!isAdmin && (
        <CreateRequestModal
          isOpen={isCreateModalOpen}
          userId={userId}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateRequest}
        />
      )}
    </div>
  );
};

export default RequestsPage;
