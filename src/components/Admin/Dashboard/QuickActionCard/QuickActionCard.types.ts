import type React from "react";

export interface QuickActionButtons {
    icon: React.ComponentType<any>,
    text: string,
    isActive: boolean,
    isLink: boolean,
    to: string,
}
