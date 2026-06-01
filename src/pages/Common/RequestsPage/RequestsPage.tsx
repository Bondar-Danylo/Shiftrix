// Styles
import styles from "./RequestsPage.module.scss";

// Components
import Dropdown from "@/components/Common/Dropdown/Dropdown";
import Search from "@/components/Common/Search/Search";
import Button from "@/components/Common/Button/Button";

// Imports
import { useCallback, useState } from "react";

// Types
import type { FilterOption, RequestItem } from "./RequestsPage.types";

// Icons
import FilterIcon from "@/assets/icons/filter_icon.svg?react";
import RequestsList from "@/components/Common/RequestsList/RequestsList";

const fakeData: RequestItem[] = [
  {
    from: {
      name: "Sarah Johnson",
      position: "Senior Server",
      img: "img_01.png",
      id: 1,
    },
    date: "25.05.2026",
    reason: "Family emergency",
    createdAt: new Date("2026-05-26T14:30:00.000Z"),
    with: {
      name: "Emma Rodriguez",
      position: "Senior Server",
      img: "img_02.png",
      id: 2,
    },
    type: "swap",
  },
  {
    from: {
      name: "Sarah Johnson",
      position: "Senior Server",
      img: "img_01.png",
      id: 1,
    },
    date: "25.05.2026",
    reason: "Family emergency",
    with: undefined,
    type: "dayoff",
    createdAt: new Date("2026-04-26T14:30:00.000Z"),
  },
  {
    from: {
      name: "Sarah Johnson",
      position: "Senior Server",
      img: "img_01.png",
      id: 1,
    },
    createdAt: new Date("2026-03-26T14:30:00.000Z"),
    date: "21.05.2026",
    reason: "Family emergency",
    with: {
      name: "Emma Rodriguez",
      position: "Senior Server",
      img: "img_02.png",
      id: 2,
    },
    type: "swap",
  },
  {
    from: {
      name: "Sarah Johnson",
      position: "Senior Server",
      img: "img_01.png",
      id: 1,
    },
    date: "28.05.2026",
    createdAt: new Date("2026-05-26T14:30:00.000Z"),
    reason: "Family emergency",
    with: undefined,
    type: "holiday",
  },
  {
    from: {
      name: "Sarah Johnson",
      position: "Senior Server",
      img: "img_01.png",
      id: 1,
    },
    date: "25.05.2026",
    createdAt: new Date("2026-05-26T14:30:00.000Z"),
    reason: "Family emergency",
    with: undefined,
    type: "dayoff",
  },
];

const filterOptions: FilterOption[] = [
  { value: "all", label: "All Requests" },
  { value: "swap", label: "Shift Swap" },
  { value: "dayoff", label: "Day Off" },
  { value: "holiday", label: "Holiday" },
];

const RequestsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>(
    filterOptions[0],
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const filteredData: RequestItem[] = fakeData.filter((item) => {
    const matchesType =
      selectedFilter.value === "all" || item.type === selectedFilter.value;
    const matchesSearch = item.from.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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
          disabled={fakeData.length === 0}
        >
          Approve All
        </Button>
      </div>

      <RequestsList
        totalCount={fakeData.length}
        filteredRequests={filteredData}
      />
    </div>
  );
};

export default RequestsPage;
