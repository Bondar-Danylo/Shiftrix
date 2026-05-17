export interface DropdownProps<T> {
  options: T[];
  onSelect: (option: T) => void;
  renderOption: (option: T) => React.ReactNode;
  getOptionLabel: (option: T) => string;
  value?: T | null;
  placeholder?: string;
  className?: string;
}