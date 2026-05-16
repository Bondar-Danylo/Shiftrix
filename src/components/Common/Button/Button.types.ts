import type { ReactNode } from "react";

export interface IButton {
    type: 'button' | 'submit',
    isLink: boolean,
    size: 'small' | 'normal' | 'large',
    children: ReactNode,
    to?: string,
    disabled?: boolean,
    className?: string;
}