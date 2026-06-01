import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
    type: 'button' | 'submit',
    isLink: boolean,
    size: 'small' | 'normal' | 'large',
    children: ReactNode,
    to?: string,
    disabled?: boolean,
    className?: string;
    onClick?: () => void
}