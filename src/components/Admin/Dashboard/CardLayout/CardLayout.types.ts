import type { ReactNode } from "react";

export interface CardLayoutProps {
    title: string,
    subtitle: string,
    children: ReactNode,
    className?: string
}