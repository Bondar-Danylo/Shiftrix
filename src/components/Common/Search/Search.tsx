// Imports
import { type ChangeEvent, useEffect, useState } from "react";

// Hooks
import { useDebounce } from "@/hooks/useDebounce";

// Types
import type { SearchInputProps } from "./Search.types";

// Styles
import styles from "./Search.module.scss";

const Search = ({
  onChangeDebounced,
  debounceDelay = 300,
  className = "",
  placeholder = "Search...",
  value: controlledValue,
  ...rest
}: SearchInputProps) => {
  const [search, setSearch] = useState<string>(
    (controlledValue as string) || "",
  );
  const debouncedSearch = useDebounce(search, debounceDelay);

  useEffect((): void => {
    if (controlledValue !== undefined) {
      setSearch(controlledValue as string);
    }
  }, [controlledValue]);

  useEffect((): void => {
    onChangeDebounced(debouncedSearch);
  }, [debouncedSearch, onChangeDebounced]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClear = (): void => {
    setSearch("");
  };

  return (
    <div className={`${styles.searchWrapper} ${className}`}>
      <svg
        className={styles.searchIcon}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input
        type="text"
        className={styles.input}
        value={search}
        onChange={handleChange}
        placeholder={placeholder}
        {...rest}
      />

      {search && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={handleClear}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Search;
