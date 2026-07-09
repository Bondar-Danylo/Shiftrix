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
import { useCallback, useState, useEffect } from "react";

// Types
import type { FilterOption, RequestItem } from "./RequestsPage.types";

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

  const fetchRequests = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_requests.php`,
      );

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();

      const formattedData = data.map((item: any) => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
      }));

      setRequests(formattedData);
    } catch (err: any) {
      setError(err.message || "Loading Request Error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect((): void => {
    fetchRequests();
  }, []);

  const handleSearch = useCallback((value: string): void => {
    setSearchQuery(value);
  }, []);

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
      </div>

      {isLoading && <div className={styles.loading}>Loading ...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

      {!isLoading && !error && (
        <RequestsList
          totalCount={filteredData.length}
          filteredRequests={filteredData}
        />
      )}

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
    </div>
  );
};

export default RequestsPage;
