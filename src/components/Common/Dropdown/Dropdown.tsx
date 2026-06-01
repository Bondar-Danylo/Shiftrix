// Styles
import styles from "./Dropdown.module.scss";

// Interface
import type { DropdownProps } from "./Dropdown.types";

import { useState, useEffect, useRef } from "react";

const Dropdown = <T,>({
  options,
  onSelect,
  renderOption,
  getOptionLabel,
  value,
  placeholder = "Choose an option...",
  className = "",
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option: T) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdownContainer} ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.triggerButton}
      >
        <span className={styles.label}>
          {value ? getOptionLabel(value) : placeholder}
        </span>
        <svg
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.menuInner}>
            {options.length === 0 ? (
              <div className={styles.emptyState}>No availible options</div>
            ) : (
              options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  className={styles.optionButton}
                >
                  {renderOption(option)}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
