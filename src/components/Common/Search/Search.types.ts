import type { InputHTMLAttributes } from "react";

export interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  onChangeDebounced: (value: string) => void;
  debounceDelay?: number;
}